irf.pageCollection.factory(irf.page("psychometric.Category"),
["$log", "SessionStore", "PageHelper", "formHelper", "Utils","Psychometric",
    function($log, SessionStore, PageHelper, formHelper, Utils,Psychometric) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Category",
            initialize: function(model, form, formCtrl) {
            },
            form: [
                {
                    "type": "box",
                    "title": "Category Creation/Updation",
                    "items": [
                        {
                            key: "category.id",
                            title: "Category ID",
                            type: "lov",
                            lovonly: true,
                            fieldType: "number",
                            outputMap: {
                                "id": "category.id",
                                "categoryName": "category.categoryName",
                                "cutoffScore": "category.cutoffScore",
                                "active": "category.active"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return Psychometric.getCategoryAll().$promise;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.categoryName,
                                    item.cutoffScore
                                ];
                            }
                        },
                        {
                            key: "category.categoryName",
                            title: "Category Name",
                            required: true
                        },
                        {
                            key:"category.cutoffScore",
                            type:"number",
                            title:"cutoffScore"
                        },
                        {
                            key:"category.active",
                            title:"Active",
                            type:"checkbox"
                        },
                        
                    ]
                },
                {
                    type: "actionbox",
                    condition: "!model.category.id",
                    items: [
                        {
                            type: "submit",
                            title: "Create Category"
                        }
                    ]
                },
                {
                    type: "actionbox",
                    condition: "model.category.id",
                    items:[
                        {
                            type: "submit",
                            title: "Update Category"
                        },
                        {
                            type: "button",
                            icon: "fa fa-refresh",
                            style: "btn-default",
                            title: "Reset",
                            onClick: function(model) {
                                model.category = {};
                            }
                        },
                        
                    ]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "category": {
                        "type": "object",
                        "title": "Category",
                        "properties": {
                            "cutoffScore": {
                                "type": "number",
                                "title": "cutoffScore"
                            },
                           "active":{
                                "type":"boolean",
                                 default:false,
                                "title":"Active"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        Psychometric.postCategory(model.category).$promise.then(function(resp){
                            model.category= resp;
                            PageHelper.showProgress("category-pages","Category created/updated", 3000);
                        }, function(err){
                            PageHelper.showErrors(err);
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });
                    });
                }
            }
        };
    }
]);



