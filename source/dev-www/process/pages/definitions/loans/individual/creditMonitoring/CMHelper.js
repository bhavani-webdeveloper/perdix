irf.pageCollection.factory("CMHelper", ["$log", "$q", "LUC", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
    function($log, $q, LUC, PageHelper, irfProgressMessage, Utils, SessionStore) {

        var proceedData = function(res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("cm id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('cm-update', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.lucDone == 'Yes') {
                    res.stage="Completed";
                } 
                LUC.update(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-update', 'Done. cm updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('lead-update', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        var goBack = function(res) {
            var deferred = $q.defer();
            $log.info("Sending Back");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("cm id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('Go Back', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.currentStage == "CMEscalate") {
                    res.stage="CMSchedule";
                }else if(res.loanMonitoringDetails.currentStage == "CMLegalRecovery") 
                {
                    res.stage="CMEscalate";
                }
                LUC.update(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-Back', 'Done. cm updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-Back', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        var escalate = function(res) {
            var deferred = $q.defer();
            $log.info("Sending Back");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("cm id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('Go Back', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.currentStage =="CMSchedule"||res.loanMonitoringDetails.currentStage == "CMReschedule")
                {
                    res.stage="CMEscalate";
                } 
                else if (res.loanMonitoringDetails.currentStage == "CMEscalate") 
                {
                    res.stage="CMLegalRecovery";
                } 
                LUC.update(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-Back', 'Done. cm updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-Back', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

         var reschedule = function(res) {
            var deferred = $q.defer();
            $log.info("reschedule working");
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("cm id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('Reschedule', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                 res.stage="CMReschedule";
                LUC.update(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-Back', 'Done. cm updated with ID: ' + res.loanMonitoringDetails.id, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cm-Back', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        return {
            proceedData: proceedData,
            escalate:escalate,
            reschedule:reschedule,
            goBack:goBack,
        };
    }
]);