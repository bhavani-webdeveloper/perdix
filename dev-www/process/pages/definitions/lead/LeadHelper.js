irf.pageCollection.factory("LeadHelper",
["$log", "$q","Lead", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
function($log, $q, Lead, PageHelper, irfProgressMessage, Utils, SessionStore){

    
    /*
    * function saveData:
    *
    * if cust id is not set, data is saved and the promise is resolved with SAVE's response
    * if cust id is set, promise is rejected with true (indicates doProceed)
    * if error occurs during save, promise is rejected with false (indicates don't proceed
    * */
    var saveData = function(reqData){

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
        /* TODO fix for KYC not saving **/
        var action = reqData.lead.id ? 'update' : 'save';
        Lead[action](reqData, function (res, headers) {
            irfProgressMessage.pop('lead-save', 'Data Saved', 2000);
            $log.info(res);
            PageHelper.hideLoader();
            deferred.resolve(res);
        }, function (res) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('lead-save', 'Oops. Some error.', 2000);
            PageHelper.showErrors(res);
            deferred.reject(res);
        });
        return deferred.promise;

    };
    /*
    * fn proceedData:
    *
    * if cust id not set, promise rejected with null
    * if cust id set, promise resolved with PROCEED response
    * if error occurs, promise rejected with null.
    * */
    var proceedData = function(res){

        var deferred = $q.defer();
        $log.info("Attempting Proceed");
        $log.info(res);
        if(res.lead.id===undefined || res.lead.id===null){
            $log.info("lead id null, cannot proceed");
            deferred.reject(null);
        }
        else {
            PageHelper.clearErrors();
            PageHelper.showLoader();
            irfProgressMessage.pop('lead-save', 'Working...');
            res.leadAction = "PROCEED";
            Lead.updateLead(res, function (res, headers) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('lead-save', 'Done. lead created with ID: ' + res.lead.id, 5000);
                deferred.resolve(res);
            }, function (res, headers) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('lead-save', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
                deferred.reject(res);
            });
        }
        return deferred.promise;

    };

   
    return {
        saveData: saveData,
        proceedData: proceedData,
    };
}]);

