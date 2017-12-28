irf.pageCollection.factory("LucHelper", ["$log", "$q", "LUC", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
    function ($log, $q, LUC, PageHelper, irfProgressMessage, Utils, SessionStore) {

        var proceedData = function (res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("luc id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('luc-update', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.lucDone == 'Yes') {
                    if (res.loanMonitoringDetails.currentStage == "LUCReview" || res.loanMonitoringDetails.currentStage == "LUCEscalate" || res.loanMonitoringDetails.currentStage == "LUCLegalRecovery") {
                        res.stage = "Completed";
                    }

                    if (res.loanMonitoringDetails.currentStage == "LUCSchedule" || res.loanMonitoringDetails.currentStage == "LUCReschedule") {
                        if (res.loanMonitoringDetails.nonIntendedPurposeAmount > 0) {
                            res.stage = "LUCReview";
                        } else {
                            res.stage = "Completed";
                        }
                    }
                }


                LUC.update(res, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-update', 'Done. luc updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('lead-update', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        var goBack = function (res) {
            var deferred = $q.defer();
            $log.info("Sending Back");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("luc id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('Go Back', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.currentStage == "LUCEscalate") {
                    res.stage = "LUCReschedule"
                } else if (res.loanMonitoringDetails.currentStage == "LUCLegalRecovery") {
                    res.stage = "LUCEscalate";
                } else if (res.loanMonitoringDetails.currentStage == "LUCReview") {
                    res.stage = "LUCReschedule";
                }
                LUC.update(res, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-Back', 'Done. luc updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-Back', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        var escalate = function (res) {
            var deferred = $q.defer();
            $log.info("Sending Back");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("luc id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('Go Back', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.currentStage == "LUCSchedule" || res.loanMonitoringDetails.currentStage == "LUCReschedule" || res.loanMonitoringDetails.currentStage == "LUCReview") {
                    res.stage = "LUCEscalate";
                }
                else if (res.loanMonitoringDetails.currentStage == "LUCEscalate") {
                    res.stage = "LUCLegalRecovery";
                }
                LUC.update(res, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-Back', 'Done. luc updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-Back', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        var reschedule = function (res) {
            var deferred = $q.defer();
            $log.info("reschedule working");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("luc id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('Reschedule', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                res.stage = "LUCReschedule";
                LUC.update(res, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-Back', 'Done. luc updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-Back', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        return {
            proceedData: proceedData,
            escalate: escalate,
            reschedule: reschedule,
            goBack: goBack,
        };
    }
]);
