irf.pageCollection.factory("LeadHelper", ["$log", "$q", "Lead", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
    function($log, $q, Lead, PageHelper, irfProgressMessage, Utils, SessionStore) {

        var saveData = function(reqData) {
            var deferred = $q.defer();
            $log.info("Attempting Save");
            reqData.lead.udf = {};
            reqData.lead.udfDate = {};
            reqData.lead.udf.userDefinedFieldValues = {};
            $log.info(reqData);
            PageHelper.clearErrors();
            PageHelper.showLoader();

            irfProgressMessage.pop('lead-save', 'Working...');
            reqData['leadAction'] = 'SAVE';
            if (reqData.lead.leadStatus == "Screening") {
                reqData['stage'] = 'ReadyForScreening';
            } else if(reqData.lead.leadStatus == "Incomplete") {
                reqData['stage'] = 'Incomplete';
            }else
            {
               reqData['stage'] = 'Inprocess'; 
            }
            /* TODO fix for KYC not saving **/
            var action = reqData.lead.id ? 'update' : 'save';
            Lead[action](reqData, function(res, headers) {
                irfProgressMessage.pop('lead-save', 'Data Saved', 2000);
                $log.info(res);
                PageHelper.hideLoader();
                deferred.resolve(res);
            }, function(res) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('lead-save', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
                deferred.reject(res);
            });
            return deferred.promise;
        };

        var proceedData = function(res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            $log.info(res);
            if (res.lead.id === undefined || res.lead.id === null) {
                $log.info("lead id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('lead-update', 'Working...');
                res.leadAction = "PROCEED";
                if (res.lead.leadStatus == "Screening") {
                    res.stage = 'ReadyForScreening';
                }else if(res.lead.leadStatus == "Reject")
                {
                    res.stage = 'Inprocess';  
                }else if(res.lead.leadStatus == "Incomplete")
                {
                    res.stage = 'Incomplete'; 
                }
                //res.lead.leadInteractions=[{"id":'',"leadId":''}];
                Lead.updateLead(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('lead-update', 'Done. lead updated with ID: ' + res.lead.id, 5000);
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

        var followData = function(res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            $log.info(res);
            if (res.lead.id === undefined || res.lead.id === null) {
                $log.info("lead id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('lead-update', 'Working...');
                res.leadAction = "SAVE";
                Lead.updateLead(res, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('lead-update', 'Done. lead updated with ID: ' + res.lead.id, 5000);
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
            saveData: saveData,
            proceedData: proceedData,
            followData: followData,
        };
    }
]);