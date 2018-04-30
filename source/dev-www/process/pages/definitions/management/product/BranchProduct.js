define({
    pageUID: "management.product.BranchProduct",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Product", "PageHelper", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q", "$timeout", "irfProgressMessage"],
    $pageFn: function($log, formHelper, Product, PageHelper, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q, $timeout, irfProgressMessage) {

        var getProductMappingData = function(model, id) {
            if (id != null) {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                Product.getBranchMappings({
                        id: id
                    },
                    function(response) {
                        model.showProductBranchDetails = true;
                        model.prodcutMapping = response;
                        PageHelper.hideLoader();
                        model.productBranchMapping = response.productBranchMappings;
                        var branchDetails = ['branchId', 'bankId', 'agentAccess', 'wmAccess', 'checked', 'branchName'];
                        var branchDet = ['branchId', 'bankId', 'branchName']
                        model.result = model.productBranchMapping.filter(function(productBranch) {
                            return model.branchs.some(function(brnch) {
                                productBranch['branchName'] = brnch.branchName
                                return productBranch.branchId == brnch.branchId; // assumes unique id
                            });
                        }).map(function(res) {
                            return branchDetails.reduce(function(brnchDetail, bd) {
                                brnchDetail[bd] = res[bd],
                                    brnchDetail['checked'] = true
                                return brnchDetail;
                            }, {});
                        });
                        model.result2 = model.branchs.filter(function(productBranch) {
                            return !model.productBranchMapping.some(function(brnch) {
                                //productBranch['branchName']=brnch.name
                                return (productBranch.branchId == brnch.branchId); // assumes unique id
                            });
                        }).map(function(res) {
                            res.bankId = parseInt(res.bankId);
                            res.branchId = parseInt(res.branchId);
                            return branchDet.reduce(function(brnchDetail, bd) {
                                brnchDetail[bd] = res[bd],
                                    brnchDetail['checked'] = false
                                brnchDetail['wmAccess'] = false,
                                    brnchDetail['agentAccess'] = false
                                return brnchDetail;
                            }, {});
                        });
                        model.res1 = _.uniqBy(model.result, 'branchId');
                        model.res2 = _.uniqBy(model.result2, 'branchId');
                        model.res3 = _.union(model.res1, model.res2);
                        model.productBrnchMpng = _.orderBy(model.res3, ['branchName'], ['asc']);
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

        return {
            "type": "schema-form",
            "title": "PRODUCT_MAINTENANCE",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                model.myClick = function(cond, productData) {
                    var ap = productData;
                    model.productBrnchMpng = null;
                    $timeout(function() {
                        for (i in ap) {
                            if (ap[i].checked === undefined || ap[i].checked == false || cond == true) {
                                ap[i].checked = true;
                                ap[i].wmAccess = true;
                            } else {
                                model.selectAll = false
                                ap[i].checked = false;
                                ap[i].agentAccess = false;
                                ap[i].wmAccess = false
                            }
                        }
                        model.productBrnchMpng = ap;
                    });
                };
                model.selectAl = function(value) {
                    if (value == false) {
                        model.selectAll = false;
                    }
                };

                var branchData = formHelper.enum('branch').data;
                model.branchs = [];
                for (i in branchData) {
                    var obj = {};
                    obj.branchName = branchData[i].name;
                    obj.branchId = branchData[i].code;
                    obj.bankId = branchData[i].parentCode;
                    model.branchs.push(obj);
                }
                cond = false;
                PageHelper.hideLoader();
            },
            form: [{
                "type": "box",
                "title": "BRANCH_PRODUCT_DETAILS",
                "items": [{
                    key: "productCode",
                    type: "lov",
                    autolov: true,
                    bindMap: {},
                    required: true,
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        var productCode = formHelper.enum('loan_product').data;
                        var out = [];
                        for (i in productCode) {
                            console.log(productCode)
                            var nam = productCode[i].parentCode + " " + productCode[i].name + " " + "(" + productCode[i].field1 + ")";
                            out.push({
                                name: nam,
                                id: productCode[i].field1
                            })
                        }
                        return $q.resolve({
                            headers: {
                                "x-total-count": out.length
                            },
                            body: out
                        });
                    },
                    onSelect: function(valueObj, model, context) {
                        model.productCode = valueObj.name;
                        model.id = valueObj.id;
                        productCode = model.id;
                        getProductMappingData(model, productCode);
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.name
                        ];
                    }
                }]
            }, {
                "type": "box",
                "title": "BRANCH_PRODUCT_DETAILS",
                "condition": "model.showProductBranchDetails",
                "items": [{
                    type: "section",
                    htmlClass: "col-sm-12",
                    html: '<div class="table-responsive">' +
                        '<div>' + '<input type="checkbox" ng-model="model.selectAll"  ng-change="model.myClick(model.selectAll,model.productBrnchMpng)">' + '<span>SelectAll</span>' + '</div>' +
                        '<table class="table table-bordered">' + '<thead class="thead-default">' +
                        '<tr>' +
                        '<th style="text-align: center">Select</th>' +
                        '<th style="text-align: center">Branch Name</th>' +
                        '<th style="text-align: center">wmAccess </th>' +
                        '<th style="text-align: center">agentAccess</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr ng-repeat="data1 in model.productBrnchMpng">' +
                        '<td class="col-sm-3" style="text-align: center"><input type="checkbox"  ng-checked="data1.checked" ng-model="data1.checked" ng-change="model.selectAl(data1.checked)" /> </td>' +
                        '<td class="col-sm-3" style="text-align: center">{{data1.branchName}}</td>' +
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
                update: function(model, formCtrl, form, productBrnchMpng) {
                    PageHelper.showLoader();
                    model.result = [];
                    model.branchsCode = model.branchs
                    var arr = model.productBrnchMpng;
                    _.filter(arr, function(value) {
                        if (value.checked == true) {
                            model.result.push(value);
                        }
                    });
                    _.filter(model.result, function(val) {
                        _.filter(model.branchsCode, function(bran) {
                            if (val.branchId == bran.name) {
                                val.branchId = bran.code;
                            }
                        })
                    });
                    model.updatedData = {
                        "productCode": model.prodcutMapping.productCode,
                        "productBranchMappings": model.result
                    };
                    Product.createProductCodeConfiList(model.updatedData).$promise.then(function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress("prodcutConfigDetails updated", "updated successfully", 3000);
                        getProductMappingData(model, productCode);
                    }, function(err) {
                        console.log(err);
                    });
                },
            }
        }
    }
})