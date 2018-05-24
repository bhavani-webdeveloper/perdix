define({
    pageUID: "agent.ApproveAgent",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Agent", "irfNavigator", "Lead", "$state", "$q", "SessionStore", "Utils", "entityManager"],
    $pageFn: function($log, formHelper, Agent, irfNavigator, Lead, $state, $q, SessionStore, Utils, entityManager) {
        return {
            "type": "search-list",
            "title": "APPROVE_AGENT_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("search-list sample got initialized");
            },
            definition: {
                title: "SEARCH_AGENT",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "agent": {
                            "title": "AGENT",
                            "type": "string"
                        },
                        "agentName": {
                            "title": "AGENT_NAME",
                            "type": "string"
                        },
                        "agentType": {
                            "title": "AGENT_TYPE",
                            "type": "string"
                        },
                        "agentId": {
                            "title": "AGENT_ID",
                            "type": "number"
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Agent.search({
                        'agentId': searchOptions.agentId,
                        'currentStage': '',
                        'agentName': searchOptions.agentName,
                        'agentType': searchOptions.agentType,
                        'customerType': '',
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
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
                            item.agentName,
                            item.agentId,
                            item.agentType,
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "searching": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'ID',
                            data: 'customer.id'
                        }, {
                            title: 'AGENT_NAME',
                            data: 'customer.firstName'
                        }, {
                            title: 'AGENT_TYPE',
                            data: 'agentType'
                        }, {
                            title: 'CUSTOMER_TYPE',
                            data: 'customer.customerType'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "APPLICATION_REVIEW",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('witfin.loans.individual.screening.ApplicationReview', {
                                    _request: item
                                });
                                if (item.customer.customerType == 'Individual') {
                                    irfNavigator.go({
                                        'state': 'Page.Bundle',
                                        'pageName': 'agent.IndividualAgentEnrollmentScreening',
                                        'pageId': item.customer.id,
                                        // 'pageData': {
                                        //     "readonly": false
                                        // }
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'agent.EnrollAgent',
                                        'pageId': null
                                    });
                                } else if (item.customer.customerType == 'Enterprise') {
                                    irfNavigator.go({
                                        'state': 'Page.Bundle',
                                        'pageName': 'agent.EnterpriseAgentEnrollmentScreening',
                                        'pageId': item.customer.id,
                                        // 'pageData': {
                                        //     "readonly": false
                                        // }
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'agent.EnrollAgent',
                                        'pageId': null
                                    });
                                }

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