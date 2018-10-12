String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

// check latest update from below link
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769
var userAgent = {
	// Opera 8.0+
	isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
	// Firefox 1.0+
	isFirefox: typeof InstallTrigger !== 'undefined',
	// Safari 3.0+ "[object HTMLElementConstructor]" 
	isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
	// Internet Explorer 6-11
	isIE: /*@cc_on!@*/false || !!document.documentMode,
	// Edge 20+
	isEdge: !this.isIE && !!window.StyleMedia,
	// Chrome 1+
	isChrome: !!window.chrome && !!window.chrome.webstore,
	// Blink engine detection
	isBlink: (this.isChrome || this.isOpera) && !!window.CSS
};

var fileSystem = {
	root: null,
	errorHandler: function(e) {
		console.log("Storage failed");
		console.error(e);
	}
};

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
if (navigator.webkitPersistentStorage && window.requestFileSystem) {
	navigator.webkitPersistentStorage.requestQuota(100*1024*1024, function(grantedBytes) {
		window.requestFileSystem(window.PERSISTENT, grantedBytes, function(fs) {
			console.log('Opened file system: ' + fs.name);
			fileSystem.root = fs.root;
			fileSystem.viewDirectory = function() {
				var dirReader = fileSystem.root.createReader();
				var entries = [];
				dirReader.readEntries(function(results) {
					console.log(results);
				}, fileSystem.errorHandler);
			};
		}, fileSystem.errorHandler);
	}, function(e) {
		alert("Storage permission denied, Please approve storage permission for continuous access. " + e);
	});
}

var MSIE = {
	isIE: /MSIE|Trident/.test(window.navigator.userAgent),
	FileSystem: null,
	FileSystemDirectory: "C:\\localStorage\\",
	FileSystemErrorCode: -2146827859,
	FileSystemErrorMessage: 'Unable to access local files due to browser security settings.'
		+' To overcome this, go to Tools->Internet Options->Security->Custom Level.'
		+' Find the setting for "Initialize and script ActiveX controls not marked as safe"'
		+' and change it to "Enable" or "Prompt"'
};
if (MSIE.isIE) {
	try {
		MSIE.FileSystem = new ActiveXObject("Scripting.FileSystemObject");
	} catch (e) {
		alert(">>> " + MSIE.FileSystemErrorMessage);
		console.log(e);
	}
	try {
		MSIE.FileSystem.CreateFolder(MSIE.FileSystemDirectory);
	} catch (e) {}
}

$(document).ready(function(){
	angular.bootstrap($("html"), ['MainApp']);
});

(function($){
	$.event.special.destroyed = {
		remove: function(o) {
			if (o.handler && o.type !== 'destroyed') {
				o.handler()
			}
		}
	}
})(jQuery);
