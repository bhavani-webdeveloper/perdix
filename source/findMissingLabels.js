const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const exp = /[\t\s'"]title[\t\s'"]?\:[\t\s]?("(.*?)"|'(.*?)')/g;

var connectionUrl = 'mysql://financialForms:financialForms@dev.kinara.perdix.co.in/financialForms';
var skipFilenames = false;
for (i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("mysql://")) {
        connectionUrl = process.argv[i];
    } else if (process.argv[i] == "--skipFilenames") {
        skipFilenames = true;
    }
}

var allLabels = {};
var callback = (relative, items) => {
    items.forEach(item => {
        var absPath = relative+path.sep+item;
        var stat = fs.lstatSync(absPath);
        if (stat.isDirectory()) {
            var i = fs.readdirSync(absPath);
            callback(absPath, i);
        } else if (stat.isFile()) {
            var content = fs.readFileSync(absPath, {encoding: "utf8"});
            while (match = exp.exec(content)) {
                if (match[2]) {
                    allLabels[match[2].trim()] = absPath;
                }
            }
        }
    });
};

var root = 'dev-www/process/pages/definitions/';
var items = fs.readdirSync(root);
callback(root, items);
var labelCodes = [];
for (k in allLabels) {
    if (allLabels.hasOwnProperty(k)) {
        labelCodes.push([k, allLabels[k]]);
    }
}

var connection = mysql.createConnection(connectionUrl);
connection.connect();
try {
    connection.query("CREATE TEMPORARY TABLE IF NOT EXISTS all_labels_for_translations (label_code VARCHAR(100) BINARY PRIMARY KEY, path VARCHAR(1000))", e => {if (e) throw e});
    connection.query("DELETE FROM all_labels_for_translations", e => {if (e) throw e});
    connection.query("INSERT INTO all_labels_for_translations VALUES ?", [labelCodes], e => {if (e) throw e});
    connection.query("SELECT label_code, path FROM all_labels_for_translations where label_code NOT IN (SELECT label_code FROM translations)", (e, results) => {
        if (e) throw e;
        if (skipFilenames) {
            fs.writeFileSync("MissingLabels.txt", results.map(i => i.label_code).join("\n"));
        } else {
            var pageWise = results.reduce((map, i) => {map[i.path] = map[i.path] || []; map[i.path].push(i.label_code); return map}, {});
            var missingLabels = "MISsing LABels\n==============";
            for (i in pageWise) {
                if (pageWise.hasOwnProperty(i)) {
                    missingLabels += "\n\n" + i + "\n\t" + pageWise[i].join("\n\t");
                }
            }
            fs.writeFileSync("MissingLabels.txt", missingLabels);
        }
    });
} finally {
    connection.end();
}