/**
 * Created by Sachin.M on 22-07-2016.
 */
irf.pageCollection.factory(irf.page('loans.group.GroupLoanRepaymentQueue'), ["$log", "formHelper", "LoanAccount",
    "$state","searchResource", "irfNavigator", "GroupProcess", "SessionStore",
    function($log, formHelper, LoanAccount,$state, searchResource, irfNavigator, GroupProcess, SessionStore){
        //isLegacy :: single loan prdt (true) or others (false)
        if(SessionStore.getGlobalSetting('siteCode')  == 'KGFS') {
            return {
                "id": "GroupRepaymentQueue",
                "type": "schema-form",
                "name": "GroupRepaymentQueue",
                "title": "GROUP_LOAN_REPAYMENT_QUEUE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    $log.info("GroupRepaymentQueue got initialized");
                },
                form:[
                    {
                        "type":"box",
                        "title":"SEARCH",
                        "items":[
                            {
                                key:"isLegacy",
                                "type":"radios",
                                "titleMap":{
                                    "false":"Single Loan Product",
                                    "true":"Others"
                                }
                            },
                            {
                                key:"partner"
                            },
                            {
                                key:"groupCode",
                                type:"string"
                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SEARCH"
                            }
                        ]
                    }
                ],
                schema:{
                    "type": "object",
                    "title": "SearchOptions",
                    "properties": {
                        "isLegacy":{
                            "title":"PRODUCT_TYPE",
                            "type":"string",
                            "default":"false"

                        },
                        "partner": {
                            "title": "PARTNER",
                            "type": "string",
                            "enumCode":"partner",
                            "x-schema-form":{
                                "type":"select"

                            }
                        },
                        "groupCode":{
                            "title":"GROUP_CODE",
                            "type":"string"
                        }
                    },
                    "required":["partner","groupCode","isLegacy"]
                },
                actions:{
                    submit:function(model, formCtrl, formName){
                        console.log(model);
                        irfNavigator.go({
                            state: "Page.Engine",
                            pageName: 'loans.groups.GroupLoanRepay',
                            pageId:[model.partner,model.groupCode,model.isLegacy].join(".")
                        }, {
                            state: "Page.Engine",
                            pageName: "loans.group.GroupLoanRepaymentQueue",
                        });
                    }
                }
            };
        } else {
            return {
                "id": "GroupRepaymentQueue",
                "type": "search-list",
                "name": "GroupRepaymentQueue",
                "title": "GROUP_LOAN_REPAYMENT_QUEUE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.branchId = SessionStore.getCurrentBranch().branchId;
                    var bankName = SessionStore.getBankName();
                    var banks = formHelper.enum('bank').data;
                    for (var i = 0; i < banks.length; i++){
                        if(banks[i].name == bankName){
                            model.bankId = banks[i].value;
                            model.bankName = banks[i].name;
                        }
                    }
                    var userRole = SessionStore.getUserRole();
                    if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
                        model.fullAccess = true;
                    }
                    model.partner = SessionStore.session.partnerCode;
                    model.isPartnerChangeAllowed = GroupProcess.hasPartnerCodeAccess(model.partner);
                    $log.info("GroupRepaymentQueue got initialized");
                },
                definition: {
                    "title": "GROUP_LOAN_REPAYMENT_QUEUE",
                    searchForm:[
                        {
                            "type":"section",
                            "items":[
                                {
                                    key: "bankId",
                                    readonly: true, 
                                    condition: "!model.fullAccess"
                                },
                                {
                                    key: "bankId",
                                    condition: "model.fullAccess"
                                },
                                {
                                    key: "branchId",
                                    readonly: true, 
                                    condition: "!model.fullAccess"
                                },
                                {
                                    key: "branchId",
                                    condition: "model.fullAccess"
                                },
                                {
                                    key: "partner",
                                    "readonly": true,
                                    "condition": "!model.isPartnerChangeAllowed"
                                }, 
                                {
                                    "key": "partner",
                                    "condition": "model.isPartnerChangeAllowed"
                                },
                                {
                                    "key": "product",
                                    "title": "PRODUCT_CATEGORY",
                                    "type": "select",
                                    "enumCode": "jlg_loan_product",
                                    "parentEnumCode": "partner",
                                    "parentValueExpr": "model.partner"
                                }, 
                                {
                                    "key": "product",
                                    condition: "model.product",
                                    "type": "string",
                                    "title": "PRODUCT",
                                    readonly: true
                                },
                                {
                                    key:"groupCode",
                                    type:"string"
                                },
                                {
                                    key: "groupName"
                                }
                            ]
                        },
                    ],
                    autoSearch: false,
                    searchSchema:{
                        "type": "object",
                        "title": "SearchOptions",
                        "properties": {
                            "bankId": {
                                "title": "BANK_NAME",
                                "type": ["integer", "null"],
                                enumCode: "bank",   
                                "x-schema-form": {
                                    "type": "select",
                                    "screenFilter": true,

                                }
                            },
                            "branchId": {
                                "title": "BRANCH_NAME",
                                "type": ["integer", "null"],
                                "enumCode": "branch_id",
                                "x-schema-form": {
                                    "type": "select",
                                    "screenFilter": true,
                                    "parentEnumCode": "bank",
                                    "parentValueExpr": "model.bankId",
                                }
                            },
                            "partner": {
                                "title": "PARTNER",
                                "type": "string",
                                "enumCode":"partner",
                                "x-schema-form":{
                                    "type":"select"

                                }
                            },
                            "product": {
                                "title": "PRODUCT"
                            },
                            "groupCode":{
                                "title":"GROUP_CODE",
                                "type":"string"
                            },
                             "groupName":{
                                "title":"GROUP_NAME",
                                "type":"string"
                            }

                        },
                        "required":["branchId","partner"]
                    },

                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts) {
                        var centres = SessionStore.getCentres();
                        var currentCentre = null;
                        if(centres && centres.length > 0){
                            currentCentre = centres[0].id;
                        }
                        return GroupProcess.search({
                            'bankId': searchOptions.bankId,
                            'branchId': searchOptions.branchId,
                            'partner': searchOptions.partner,
                            //'centre': currentCentre,
                            "product": searchOptions.product,
                            "groupCode": searchOptions.groupCode,
                            "groupName": searchOptions.groupName,
                            'groupStatus': true,
                            'currentStage': "Completed",
                            // 'currentStage': "Rejected",
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
                            return []
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
                                title: 'GROUP_ID',
                                data: 'id'
                            }, {
                                title: 'PARTNER_CODE',
                                data: 'partnerCode'
                            }, {
                                title: 'GROUP_NAME',
                                data: 'groupName'
                            }, {
                                title: 'GROUP_CODE',
                                data: 'groupCode'
                            },]
                        },
                        getActions: function() {
                            return [{
                                name: "REPAY",
                                desc: "",
                                icon: "fa fa-pencil-square-o",
                                fn: function(item, index) {
                                    irfNavigator.go({
                                        state: "Page.Engine",
                                        pageName: 'loans.groups.GroupLoanRepay',
                                        pageId:[item.partnerCode, item.groupCode, false].join(".")
                                    }, {
                                        state: "Page.Engine",
                                        pageName: "loans.group.GroupLoanRepaymentQueue",
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
    }]);

