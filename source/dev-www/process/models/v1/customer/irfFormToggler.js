irf.pageCollection.factory("irfFormToggler", ['$log', '$filter', 'Enrollment', "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "jsonPath", "BundleManager", "CustomerBankBranch", "User",
    function ($log, $filter, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, PageHelper, Utils, BiometricService, PagesDefinition, Queries, jsonPath, BundleManager, CustomerBankBranch, User) {
        var prepareToggleForm=function(title, forms, commonForm, model){
            var toggleKey = '__FT__' + Utils.generateUUID();
            model[toggleKey] = false;
            var finalform=[];
            finalform.push({

                "type": "section",
                    //"title": forms[i].title,
                    //"items": forms[i].form,
                "items": [
                            {
                                "title": forms[0].title,
                                "default":forms[0].default,
                                "onClick": function(model, form, formName){
                                    model[toggleKey]=forms[0].title;
                                }
                            },
                            {
                                "title": forms[1].title,
                                "default":forms[1].default,
                                "onClick": function(model, form, formName){
                                    model[toggleKey]=forms[1].title;
                                }
                            }
                        ],
                    //"condition": 'model["' + toggleKey + '"] == "' + forms[i].title + '"',
                "html": '<div class="btn-group btn-group-toggle" style="padding-left: 20px" data-toggle="buttons"><label ng-repeat="tab in form.items" class="btn btn-xs btn-default {{tab.default ? \'active\':\'\'}}" style="margin-bottom:2px; margin-right:2px" ng-click="tab.onClick(model, form, formName)"><input type="radio" autocomplete="off" checked > {{tab.title}}</label></div>'
                
                    // "key": toggleKey,
                    // "type": "radiobutton",
                    // //"title": "Gender",
                    // "notitle": true,
                    // "fieldHtmlClass": "btn-xs",
                    // "titleMap": [{
                    //     "name": "Business",
                    //     "value": "Business",
                    // }, {
                    //     "name": "Financials",
                    //     "value": "Business Financials"
                    // }],
                    // "onChange": function(modelValue, form, model){
                    //     model[toggleKey]=modelValue;
                    // }
                    //"enumCode": "businessTabs",
                    // "schema": {
                    //     "default": "Business"
                    // }
                
                })
            // finalform.push({
            //     "type":"button-tabs",
            //     "tabs": [
            //         {
            //             "title": forms[0].title,
            //             "default":forms[0].default,
            //             "onClick": function(model, form, formName){
            //                 model[toggleKey]=forms[0].title;
            //             }
            //         },
            //         {
            //             "title": forms[1].title,
            //             "default":forms[1].default,
            //             "onClick": function(model, form, formName){
            //                 model[toggleKey]=forms[1].title;
            //             }
            //         }
            //     ]
            // }, {
            //     "key": toggleKey,
            //     "type": "radiobutton",
            //     "title": "Gender",
            //     "notitle": false,
            //     "fieldHtmlClass": "btn-xs",
            //     "titleMap": [{
            //         "name": "Business",
            //         "value": "Business"
            //     }, {
            //         "name": "Financials",
            //         "value": "Financials"
            //     }],
            //     "enumCode": "businessTabs",
            //     "schema": {
            //         "default": "Business"
            //     }
            // })
            
            for(i=0;i<forms.length;i++){
                finalform.push({
                    "type": "section",
                    "title": forms[i].title,
                    "items": forms[i].form,
                    //"condition": 'model["' + toggleKey + '"] == "' + forms[i].title + '"',
                    "html": '<div ng-show="model[\'' + toggleKey + '\'] == \'' + forms[i].title + '\'"><div ng-repeat="item in form.items"><sf-decorator form="item"></sf-decorator></div></div>'
                });
                if (forms[i].default) {
                    model[toggleKey] = forms[i].title;  
                }
            }

            if (!model[toggleKey]) {
                model[toggleKey] = forms[0].title;
            }
            finalform.push.apply(finalform, commonForm);
            return finalform;
        }
        return {
            prepareToggleForm:prepareToggleForm
        }
    }
]);
