irf.commons.service("entityManager", ["$log", function($log) {
	var self = this;

	var modelHolder = {};

	self.getModel = function(pageName) {
		if (!modelHolder[pageName]) {
			modelHolder[pageName] = {};
		}
		return modelHolder[pageName];
	};

	self.setModel = function(pageName, model) {
		$log.info("setting entitty model for: " + pageName);
		//$log.info(model);
		modelHolder[pageName] = model;
	};

	/* Sample Data */
	modelHolder["CustomerEnrollmentStage1"] = {};
	modelHolder["CustomerEnrollmentStage1"]["Customer"] = {"email":"stalin@gino.mail", "name":"Stalin Gino", "religion":"C", "enrolled_as":"E", "photo":"http://bit.ly/1SEDKqa"};
	modelHolder["CustomerEnrollmentStage1"]["Asset"] = {};
}]);