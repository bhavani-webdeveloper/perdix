irf.models.factory('GroupProcess', 
    function($log,$filter,$resource, $httpParamSerializer, BASE_URL, searchResource, $q, Queries, SessionStore) {
    var endpoint = BASE_URL + '/api/groupprocess';
    var resource =  $resource(endpoint, null, {
        search:searchResource({
            method:'GET',
            url:endpoint+'/search'
        }),
        getGroup:{
            method:'GET',
            url:endpoint+"/:groupId"
        },
        save: {
            method: 'POST',
            url: endpoint
        },
        updateGroup: {
            method: 'PUT',
            url: endpoint
        },
        DSCCheck: {
            method: 'POST',
            url: endpoint + '/grouploandsc',
            isArray:true
        },
        telecalling: {
            method: 'POST',
            url: endpoint + '/telecalling',
            isArray:true
        },
    });

    function PrinterConstants() {

    }
    
    PrinterConstants.FONT_LARGE_BOLD = 2;
    PrinterConstants.FONT_LARGE_NORMAL = 1;
    PrinterConstants.FONT_SMALL_NORMAL = 3;
    PrinterConstants.FONT_SMALL_BOLD = 4;

    function PrinterData() {
        this.lines = [];
    }

    PrinterData.prototype.getLineLength = function(font) {
        if (font == PrinterConstants.FONT_LARGE_BOLD || font == PrinterConstants.FONT_LARGE_NORMAL) {
            return 24;
        } else {
            return 42;
        }
    }

    PrinterData.prototype.addLine = function(text, opts) {
        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
        opts['center'] = _.has(opts, 'center') && _.isBoolean(opts['center']) ? opts['center'] : false;
        var obj = {
            "bFont": opts['font'],
            "text": text,
            "style": {
                "center": opts['center']
            }
        };
        this.lines.push(obj);
        return this;
    }

    PrinterData.prototype.addKeyValueLine = function(key, value, opts) {
        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
        var keyLength = parseInt(this.getLineLength(opts['font']) / 2) - 1;
        var line = _.padEnd(key, keyLength, ' ') + ': ' + value;
        var obj = {
            "bFont": opts['font'],
            "text": line,
            "style": {
                "center": false
            }
        };
        this.lines.push(obj);
        return this;
    }

    PrinterData.prototype.addStrRepeatingLine = function(str, opts) {
        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
        var lineLength = this.getLineLength(opts['font']);
        var line = _.padEnd("", lineLength, '-')
        var obj = {
            "bFont": opts['font'],
            "text": line,
            "style": {
                "center": false
            }
        };
        this.lines.push(obj);
        return this;
    }

    PrinterData.prototype.addLines = function(lines) {
        this.lines = this.lines.concat(lines);
    }

    PrinterData.prototype.getLines = function() {
        return this.lines;
    }

    resource.hasPartnerCodeAccess = function(partner){
        return (angular.isUndefined(partner) || partner == null) ? true : false;
    }

    resource.isCBCheckValid = function (model) {
        var deferred = $q.defer();
        var customerIdList = [];
        var validUrns = [];
        var urns = [], invalidUrns = [];
        for (var idx = 0; idx < model.group.jlgGroupMembers.length; idx++) {
            customerIdList.push(model.group.jlgGroupMembers[idx].customerId);
            urns.push(model.group.jlgGroupMembers[idx].urnNo);
        }
        Queries.getLatestCBCheckDoneDateByCustomerIds(customerIdList).then(function(resp) {
            if(resp && resp.length > 0){
                for (var i = 0; i < resp.length; i++) {
                    if (moment().diff(moment(resp[i].created_at, SessionStore.getSystemDateFormat()), 'days') <= 
                        Number(SessionStore.getGlobalSetting('cerditBureauValidDays'))) {
                        validUrns.push(urns[customerIdList.indexOf(resp[i].customer_id)]);
                    }
                }

                if(validUrns.length === urns.length) {
                    deferred.resolve();
                } else {
                    invalidUrns = urns.filter(function(urn){  return (validUrns.indexOf(urn) == -1) })
                    deferred.reject({data: {error: "There is no valid CB check for following customers: " + invalidUrns.join(",")+ ". Please do CBCheck and try again." }});
                }
            } else {
                deferred.reject({data: {error: "There is no valid CB check for following customers: " + urns.join(",")+ ". Please do CBCheck and try again." }});
            }
        }, function(res) {
            if(res.data) {
                res.data.error = res.data.errorMsg;
            }
            deferred.reject(res);
        });
        return deferred.promise;
    }

    function formatAmount(amount) {
        if (typeof(amount) == "string") {
            amount = parseFloat(amount);
        }
        return $filter('currency')(amount, "Rs.", 2);
    }


    var getPrintReceipt = function(repaymentInfo, opts) {
        opts['duplicate'] = opts['duplicate'] || false;
        var pData = new PrinterData();
        if (opts['duplicate']) {
            pData.addLine('DUPLICATE', {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            });
        } else {
            pData.addLine('RECEIPT', {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            });
        }

        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        pData.addLine(opts['entity_name'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addLine(opts['branch'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            }).addLine("Date : " + curTimeStr, {
                'center': false,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            //.addLine("Customer ID : " + repaymentInfo['customerId'], {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
            .addLine("LOAN REPAYMENT", {
                'center': true,
                font: PrinterConstants.FONT_LARGE_BOLD
            })
            .addLine("", {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(repaymentInfo['accountName'] + "-" + repaymentInfo["productCode"], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addKeyValueLine("Branch Code", opts['branch_code'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer Name", repaymentInfo['customerName'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Loan A/C No", repaymentInfo['accountNumber'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Transaction Type", repaymentInfo['transactionType'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Transaction ID", repaymentInfo['transactionID'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Demand Amount", parseFloat(repaymentInfo['demandAmount']) == 0 ? "Nil" : formatAmount(repaymentInfo["demandAmount"]), {
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addKeyValueLine("Amount Paid", formatAmount(repaymentInfo['amountPaid']), {
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addKeyValueLine("Total Payoff Amount", formatAmount(parseFloat(repaymentInfo['payOffAmount']) - parseFloat(repaymentInfo['amountPaid'])), {
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            // .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
            .addKeyValueLine("Demands Paid/Pending", repaymentInfo['demandsPaidAndPending'], {
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addStrRepeatingLine("-", {
                font: PrinterConstants.FONT_LARGE_BOLD
            })
            .addLine(opts['company_name'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("CIN :" + opts['cin'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(opts['address1'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(opts['address2'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(opts['address3'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("Website :" + opts['website'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("Helpline No :" + opts['helpline'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("", {})
            .addLine("", {})
            .addLine("Signature not required as this is an", {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("electronically generated receipt.", {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            });

        return pData;
    }

    var getLoanPrint = function(repaymentInfo, opts) {
        var isCordova = false;
        try {
            if (cordova) {
                var fullPrintData = new PrinterData();
                var pData = getPrintReceipt(repaymentInfo, opts);
                $log.info(pData);
                pData.addLine("", {});
                pData.addLine("", {});
                fullPrintData.addLines(pData.getLines());
                cordova.plugins.irfBluetooth.print(function() {
                    console.log("succc callback");
                }, function(err) {
                    console.error(err);
                    console.log("errr collback");
                }, fullPrintData.getLines());
            }
        } catch (err) {
            var fullPrintData = new PrinterData();
            var pData = getPrintReceipt(repaymentInfo, opts);
            $log.info(pData);
            pData.addLine("", {});
            pData.addLine("", {});
            fullPrintData.addLines(pData.getLines());
            $log.info(fullPrintData);
            var mywindow = window.open('', 'my div', 'height=400,width=600');
            var curTime = moment();
            var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
            mywindow.document.write('</body>' + '<div style=""> ' + '<h1>' + "Group Repayment Print :" + repaymentInfo.repaymentDate + '</h1>' + '</div>' + '</html>');
            mywindow.print();
            mywindow.close();
            return true;
        }
    }

    resource.printLoan = function(repay, fullPrintData) {
        var jlgGroupMembers = repay;
        for (i in jlgGroupMembers) {
            $log.info(jlgGroupMembers)
            $log.info("jlgGroupMembers")
            var r = jlgGroupMembers[i];
            var repaymentInfo = {
                'repaymentDate': r.firstRepaymentDate,
                'customerURN': r.urnNo,
                'accountNumber': r.customerAccountNumber,
                'transactionType': r.transactionName,
                'transactionID': 1,
                'demandAmount': r.demandAmount,
                'amountPaid': r.demandAmount,
                'payOffAmount': r.payOffAmount,
                'accountName': r.firstName,
                'demandsPaidAndPending': (1 + r.numSatisifiedDemands) + " / " + parseInt(r.numDemands - r.numSatisifiedDemands)
            };
            var opts = {
                'entity_name': "Pudhuaaru KGFS",
                'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                'cin': 'U74990TN2011PTC081729',
                'address1': 'IITM Research Park, Phase 1, 10th Floor',
                'address2': 'Kanagam Village, Taramani',
                'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                'website': "http://ruralchannels.kgfs.co.in",
                'helpline': '18001029370'
            }
            var pData = getLoanPrint(repaymentInfo, opts);
        }
    }

    return resource;
});