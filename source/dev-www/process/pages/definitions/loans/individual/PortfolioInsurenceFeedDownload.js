define({
    pageUID: "loans.individual.PortfolioInsurenceFeedDownload",
    pageType: "Engine",
    dependencies: ["$log", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams","IndividualLoan","SchemaResource","Utils"],
    $pageFn: function($log, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams,IndividualLoan,SchemaResource,Utils) {

        return {
            "name": "PORTFOLIO_INSURENCE_FEED_DOWNLOAD",
            "type": "schema-form",
            "title": "PORTFOLIO_INSURENCE_FEED_DOWNLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Create Branch Page loaded");
                model.loanaccount = model.loanaccount  || {};
            },

            form: [
            {
                "type": "box",
                "title": "",
                "items": [
                {
                    "key": "loanaccount.startDate",
                    "required":true,
                    "title": "START_DATE",
                    "type": "date",
                    "schema":{
                        "type":"string"
                    }
                },{
                    "key": "loanaccount.endDate",
                    "required":true,
                    "type": "date",
                    "title": "END_DATE",
                    "schema":{
                        "type":"string"
                    }
                },{
                    "key": "loanaccount.insuranceRateCode",
                    "type": "select",
                    "title": "INSURENCE_TYPE",
                    "titleMap":{
                        "Shriram":"Shriram",
                        "Bajaj":"Bajaj"
                    }
                }]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "DOWNLOAD"
                }]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    console.warn(model);
                    Utils.downloadFile(irf.BASE_URL + '/api/feed/portfolioInsuranceFeedDownload?'+ 'startDate='+model.loanaccount.startDate + '&endDate=' +model.loanaccount.endDate + '&insuranceRateCode='+model.loanaccount.insuranceRateCode );
                }
            }
        };
    }
})