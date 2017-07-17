String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

$(document).ready(function(){
    angular.bootstrap($("html"), ['MainApp']);
});

var irf = irf || {};
$.ajax({
	type: "POST",
	url: "app_manifest.json",
	contentType: "application/json",
	dataType: "json",
	success: function(response) {
		irf.appManifest = response;
	},
	async: false
});