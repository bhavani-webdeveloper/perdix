String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

var irf = irf || {};
$.ajax({
	type: "GET",
	url: "app_manifest.json",
	contentType: "application/json",
	dataType: "json",
	success: function(response) {
		irf.appManifest = response;
	},
	async: false
});

$(document).ready(function(){
    angular.bootstrap($("html"), ['MainApp']);
});