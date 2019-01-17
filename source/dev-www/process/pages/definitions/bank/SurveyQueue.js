define({
    pageUID: "bank.SurveyQueue",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore","irfNavigator", "$state", "formHelper", "$q", "irfProgressMessage", "PageHelper", "SurveyInformation"],
    $pageFn: function($log, SessionStore,irfNavigator, $state, formHelper, $q, irfProgressMessage, PageHelper, SurveyInformation) {

        return {
            "type": "search-list",
            "title": "SURVEY_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branchId = SessionStore.getCurrentBranch().branchId;
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                $log.info("Survey Queue got initialized");
            },
            definition: {
                title: "SEARCH SURVEY",
                searchForm: [
                {
                    "key":"surveyOfficerName",
                },
                {
                    "key":"surveyVillage",
                },
                {
                    "key":"surveyDate",
                },
                {
                    "key":"branchId",
                    "condition": "model.siteCode != 'sambandh'",
                },
                {
                    "key":"branchId",
                    "enumCode":"userbranches",
                    "condition": "model.siteCode =='sambandh'",
                },

                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "surveyOfficerName": {
                            "title": "SURVEY_OFFICER_NAME",
                            "type": "string"
                        },
                        "surveyVillage": {
                            "title": "SURVEY_VILLAGE",
                            "type": "string"
                        },
                        "surveyDate": {
                            "title": "SURVEY_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "branchId": {
                            "title": "BRANCH_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,
                            }
                        },
                    },
                    "required": ["LoanAccountNumber"]
                },
                
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { 
                    var promise = SurveyInformation.search({
                        'surveyOfficerName': searchOptions.surveyOfficerName,
                        'surveyVillage':searchOptions.surveyVillage,
                        'surveyDate': searchOptions.surveyDate,
                        'branchId': searchOptions.branchId,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                    }).$promise;

                    return promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 100;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: false,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            item.id,
                            item.surveyOfficerName,
                            item.surveyVillage,
                            item.surveyDate
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [
                        {
                            title: 'Id',
                            data: 'id'
                        },
                         {
                            title: 'survey Officer Name',
                            data: 'surveyOfficerName'
                        },
                        {
                            title: 'survey Village',
                            data: 'surveyVillage'
                        }, {
                            title: 'survey Date',
                            data: 'surveyDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Update/Edit Survey",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "bank.Survey",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "bank.SurveyQueue",
                                });
                            },
                            isApplicable: function(item, index) {

                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }
})