define({
    pageUID: "management.DeathMarkingSearch",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "SessionStore", "PageHelper", "Groups", "$state", "irfProgressMessage", "irfNavigator","DeathMarking","$q"],
    $pageFn: function($log, formHelper, SessionStore, PageHelper, Groups, $state, irfProgressMessage, irfNavigator, DeathMarking, $q) {

        return {
            "type": "search-list",
            "title": "DEATH_MARKING_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Death marking search got initialized");
            },
            definition: {
                title: "DEATH_MARKING_SEARCH",

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return DeathMarking.getSchema().$promise;
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
                    selectable: true,
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
                        return [item.name, item.urnNo, item.dateOfIncident];
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'DEATH_MARKING_COLUMN_NAME',
                            data: 'name'
                        }, {
                            title: 'DEATH_MARKING_COLUMN_URN',
                            data: 'urnNo'
                        },{
                            title: 'DATE_OF_INCIDENT',
                            data: 'dateOfIncident'
                        }];
                    },
                    getActions: function() {
                        return [{
                            name: "Approve_Death_Details",
                            desc: "",
                            icon: "fa fa-user",
                            fn: function(item, index){
                                console.log(item);
                                $state.go("Page.Engine", {
                                    pageName: "management.ApproveDeathDetails",
                                    pageId: item.id,
                                    pageData: item
                                });
                            },
                            isApplicable: function(item, index){
                                    return true;
                            }
                        }];
                    }
                }
            }
        };
    }
});