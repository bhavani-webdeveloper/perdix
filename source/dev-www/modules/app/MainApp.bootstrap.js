String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

$(document).ready(function(){
    angular.bootstrap($("html"), ['MainApp']);
});