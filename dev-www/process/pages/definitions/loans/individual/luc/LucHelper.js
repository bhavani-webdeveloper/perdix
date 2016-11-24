irf.pageCollection.factory("LucHelper", ["$log", "$q", "LUC", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
    function($log, $q, LUC, PageHelper, irfProgressMessage, Utils, SessionStore) {

        var proceedData = function(res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            $log.info(res);
            if (res.loanMonitoringDetails.id === undefined || res.loanMonitoringDetails.id === null) {
                $log.info("luc id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('luc-update', 'Working...');
                res.loanMonitoringAction = "PROCEED";
                if (res.loanMonitoringDetails.lucDone == 1) {
                    res.stage="Completed";
                } else if(res.loanMonitoringDetails.lucRescheduled==1){
                    res.stage="LUCReschedule";
                }else if(res.loanMonitoringDetails.lucEscalated==1)
                {
                    res.stage="LUCEscalate";
                }
                LUC.update(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-update', 'Done. luc updated with ID: ' + res.loanMonitoringDetails.id, 5000);
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


        return {
            proceedData: proceedData,
        };
    }
]);