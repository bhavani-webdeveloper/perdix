String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

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
