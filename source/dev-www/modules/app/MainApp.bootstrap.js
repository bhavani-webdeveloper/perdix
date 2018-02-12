String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

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
