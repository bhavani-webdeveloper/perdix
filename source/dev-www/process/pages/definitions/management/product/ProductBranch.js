define({
    pageUID: "management.product.ProductBranch",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Product", "PageHelper", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q", "$timeout", "irfProgressMessage"],
    $pageFn: function($log, formHelper, Product, PageHelper, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q, $timeout, irfProgressMessage) {
        var getProductMappingData = function(model, id) {
            if (branchId != null) {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                Product.findProductConfiguration({
                        id: branchId
                    },
                    function(response) {
                        model.showProductBranchDetails = true;
                        model.prodcutMapping = response;
                        PageHelper.hideLoader();
                        model.branchProductMapping = response.branchProductMappings;
                        model.branchProductMappings = [];
                        for (i = 0; i < model.productTypeMasterData.length; i++) {
                            for (j = 0; j <= model.branchProductMapping.length; j++) {
                                if (model.branchProductMapping.length != 0 && j < model.branchProductMapping.length) {
                                    if (model.branchProductMapping[j].productCode == model.productTypeMasterData[i].productName) {
                                        model.branchProductMappings.push({
                                            "productCode": model.productTypeMasterData[i].productName,
                                            "agentAccess": model.branchProductMapping[j].agentAccess,
                                            "wmAccess": model.branchProductMapping[j].wmAccess,
                                            "checked": true
                                        })
                                        break;
                                    } else {
                                        if (j == model.branchProductMapping.length) {
                                            branchMapping(model, i);
                                        }
                                    }
                                } else {
                                    branchMapping(model, i);
                                }
                            }
                        }
                    },
                    function(err) {
                        console.log("error")
                    });
            } else {
                PageHelper.setError({
                    message: ' Branch name is required'
                })
            }
        }

        var branchMapping = function(model,i){
            model.branchProductMappings.push({
                "productCode": model.productTypeMasterData[i].productName,
                "agentAccess": false,
                "wmAccess": false,
                "checked": false
            })
        }
        return {
            "type": "schema-form",
            "title": "BRANCH_TO_PRODUCT_MAPPING",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                model.myClick = function(cond,productData){
                    var ap = productData;
                        model.branchProductMappings = null;
                        $timeout(function() {
                            for (i in ap){
                                if (ap[i].checked === undefined || ap[i].checked == false || cond == true) {
                                    ap[i].checked = true;
                                    ap[i].wmAccess = true;
                                } else {
                                    model.selectAll = false
                                    ap[i].checked  = false;
                                    ap[i].agentAccess = false;
                                    ap[i].wmAccess = false
                                }
                            }
                            model.branchProductMappings = ap;
                            console.log(model.branchProductMappings);
                        });
                };
                Product.getProductTypeMaster().$promise.then(function(response) {
                    model.productTypeMasterData = response;
                    PageHelper.hideLoader();
                }, function(err) {
                    irfProgressMessage.pop("productTypeMasterData-save", "An Error Occurred. Failed to fetch Data", 5000);
                });
                model.selectAl = function(value){
                    if(value == false){
                        model.selectAll = false
                    }
                }
            },
            form: [{
                "type": "box",
                "title": "BRANCH_DETAILS",
                "items": [{
                    "key": "branch",
                    "type": "select",
                    "enumCode": "branch_id",
                    "required": true,
                    "onChange": function(modelValue, form, model) {
                        branchId = model.branch;
                        getProductMappingData(model, branchId);
                    }
                }]
            }, {
                "type": "box",
                "title": "PRODUCT_DETAILS",
                "condition": "model.showProductBranchDetails",
                "items": [{
                    type: "section",
                    htmlClass: "col-sm-12",
                    html: '<div class="table-responsive">' +
                        '<div>'+'<input type="checkbox" ng-model="model.selectAll"  ng-change="model.myClick(model.selectAll,model.branchProductMappings)">'+'<span>SelectAll</span>'+'</div>'+
                        '<table class="table table-bordered">' + '<thead class="thead-default">' +
                        '<tr>' +
                        '<th style="text-align: center">Select</th>' +
                        '<th style="text-align: center">Product Name</th>' +
                        '<th style="text-align: center">wmAccess </th>' +
                        '<th style="text-align: center">agentAccess</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr ng-repeat="data1 in model.branchProductMappings">' +
                        '<td class="col-sm-3" style="text-align: center"><input type="checkbox"  ng-checked="data1.checked" ng-model="data1.checked" ng-change="model.selectAl(data1.checked)" /> </td>' +
                        '<td class="col-sm-3" style="text-align: center">{{data1.productCode}}</td>' +
                        '<td class="col-sm-3" style="text-align: center"><input type="checkbox" ng-checked="data1.wmAccess" ng-model="data1.wmAccess" ng-change="data1.wmAccess" class="center" /> </td>' +
                        '<td class="col-sm-3" style="text-align: center"><input type="checkbox" ng-checked="data1.agentAccess" ng-model="data1.agentAccess" ng-change="data1.agentAccess" class="center" /></td>' + '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>'
                }, {
                    "type": "button",
                    "title": "UPDATE",
                    "style": "btn-theme",
                    "onClick": "actions.update(model, formCtrl, form,model.branchProductMappings)"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "branch": {
                        "type": "number",
                        "title": "BRANCH_NAME"
                    }
                },
                "required": [
                    "branch"
                ]
            },
            actions: {
                update: function(model, formCtrl, form, branchProductMappings) {
                    PageHelper.showLoader();
                    console.log(branchProductMappings);
                    model.result = [];
                    _.filter(branchProductMappings, function(value) {
                        if (value.checked == true) {
                            model.result.push(value);
                        }
                    });
                    model.updatedData = {
                        "bankId": model.prodcutMapping.bankId,
                        "branchId": model.prodcutMapping.branchId,
                        "branchProductMappings": model.result
                    };
                    Product.createProductConfiguration(model.updatedData).$promise.then(function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress("prodcutConfigDetails updated", "updated successfully", 3000);
                        getProductMappingData(model, branchId);
                    }, function(err) {
                        console.log(err);
                    });
                },
                submit: function(model, form, formName) {
                    branchId = model.branch;
                    getProductMappingData(model, branchId);

                }
            }
        }
    }
})