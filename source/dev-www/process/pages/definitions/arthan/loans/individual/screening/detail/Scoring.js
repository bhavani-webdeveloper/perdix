define({
    pageUID: "arthan.loans.individual.screening.detail.Scoring",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "Scoring", "AuthTokenHelper", "BundleManager", "filterFilter", "irfCurrencyFilter"
    ],
    $pageFn: function($log, $q, Enrollment, SchemaResource, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, Scoring, AuthTokenHelper, BundleManager, filterFilter, irfCurrencyFilter) {
       var branch = SessionStore.getBranch();
        var prepareData = function(res, model) {

            if (res[0].data[0]['Existing Customer'] == 'No') {
                model.existingCustomerStr = "New Customer";
            } else {
                model.existingCustomerStr = "Existing Customer";
            }

            model.enterpriseDetails = res[0];
            model.secName = res[0].data[0]['Sector'];
            model.subSecName = res[0].data[0]['Sub-Sector'];
            model.scoreDetails = [res[1], res[2], res[3]];
            model.CamDetails =[res[6], res[7], res[8], res[9],res[10],res[11]];
            model.totalScores = res[5];
            model.deviationDetails = res[6];
            model.business = {};
            model.business.kgfsName =  res[0].data[0]['Hub Name'];
            model.business.centreName = res[0].data[0]['Spoke Name'];


            var managementScore = model.scoreDetails[0];
            if (_.isArray(managementScore.sections)) {
                var count = managementScore.sections.length;
                var spacePct = 75 / count;

                managementScore.values = [];
                for (var i = 0; i < managementScore.sections.length; i++) managementScore.values[i] = i;
                managementScore.colorPct = spacePct / 5;
                managementScore.valuePct = spacePct * 4 / 5;
            }

            for (var i=0;i< model.deviationDetails.data.length; i++){
                var d = model.deviationDetails.data[i];
                if (d.Mitigant && d.Mitigant.length!=0){
                    if (d.Mitigant && d.Mitigant!=null){
                        d.ListOfMitigants = d.Mitigant.split("|");
                    }

                    if (d.ChosenMitigant && d.ChosenMitigant!=null){
                        d.ChosenMitigants = d.ChosenMitigant.split("|")
                    }

                }
            }

        };

        var prepareForms = function(model) {
           var form = [];
           form.push({
                "type": "section",
                "html": `
                    <div class="col-sm-6">
                    <i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;
                    </div>
                    <div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.business.kgfsName}}</strong></div>
                    <div class="col-sm-3">{{'CENTRE'|translate}}: <strong>{{model.business.centreName}}</strong></div>
                    `
            });

            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: "SCORES",
                items: [{
                        type: "section",
                        htmlClass: "row",
                        items: [{
                                type: "section",
                                htmlClass: "col-sm-12",
                                title: model.scoreDetails[0].title,
                                html: '<div ng-init="_score=model.scoreDetails[0]">' +
                                    '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{_score.title}} ({{model.totalScores.data[0][_score.title]}})</h3>' +
                                    '<table class="table">' +
                                    '<colgroup>' +
                                    '<col width="25%">' +
                                    '<col width="{{_score.colorPct}}%" ng-repeat-start="i in _score.values">' +
                                    '<col width="{{_score.valuePct}}%" ng-repeat-end>' +
                                    '</colgroup>' +
                                    '<tbody>' +
                                    '<tr>' +
                                    '<th>Parameter Name</th>' +
                                    '<th colspan="2" ng-repeat="j in _score.values">{{_score.sections[j].relation_detail}}</th>' +
                                    '</tr>' +
                                    '<tr ng-repeat="data in _score.sections[0].data" ng-init="parameterIndex=$index">' +
                                    '<td >{{data.Parameter}}</td>' +
                                    '<td ng-repeat-start="k in _score.values"> <span class="square-color-box" style="background:{{_score.sections[k].data[parameterIndex].color_hexadecimal}}"> </span></td>' +
                                    '<td ng-repeat-end>{{_score.sections[k].data[parameterIndex].Applicant}}</td></tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</div>'
                            }
                        ]
                    },
                    {
                        type: "section",
                        htmlClass: "row",
                        items: [
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                title: model.scoreDetails[1].title,
                                html: '<h3>{{ model.scoreDetails[1].title }} ({{ model.totalScores.data[0][model.scoreDetails[1].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[1].data"><td>{{ data.Parameter }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                            },
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                title: model.scoreDetails[2].title,
                                html: '<h3>{{ model.scoreDetails[2].title }} ({{ model.totalScores.data[0][model.scoreDetails[2].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[2].data"><td>{{ data.Parameter }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                            }
                        ]
                    }
                ]
            });

             form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "DEVIATION_AND_MITIGATIONS",
                items: [
                    {
                        type: "section",
                        colClass: "col-sm-12",
                        html: '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"><col width="30%"><col width="30"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th><th>Chosen Mitigant</th></tr></thead><tbody><tr ng-repeat="rowData in model.deviationDetails.data"><td>{{ rowData["Parameter"] }}</td><td> <span class="square-color-box" style="background: {{ rowData.color_hexadecimal }}"> </span></td><td>{{ rowData["Deviation"] }}</td><td><ol><li ng-repeat="m in rowData.ListOfMitigants"> {{ m }}</li></ol></td><td><ol><li ng-repeat="m in rowData.ChosenMitigants"> {{ m }}</li></ol></td></tr></tbody></table>'
                    }
                ]
            });
            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: model.CamDetails[1].title,
                items: [              
                    {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Branch</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Branch}}</strong></td></tr>'+
                        '<tr><td>Loan Application No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Loan_Application_No}}</strong></td></tr>'+
                        '<tr><td>Lead Source</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Lead_Source}}</strong></td></tr>'+
                        '<tr><td>Applicant</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Applicant}}</strong></td></tr>'+
                        '<tr><td>Aadhar No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Aadhar_No}}</strong></td></tr>'+
                        '<tr><td>DL No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].DL_No}}</strong></td></tr>'+
                        '<tr><td>Door/Building</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Door_Building}}</strong></td></tr>'+
                        '<tr><td>Postoffice</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Postoffice}}</strong></td></tr>'+
                        '<tr><td>District</td><td> </td><td><strong>{{model.CamDetails[1].data[0].District}}</strong></td></tr>'+
                        '<tr><td>CIBIL score</td><td> </td><td><strong>{{model.CamDetails[1].data[0].CIBIL_score}}</strong></td></tr>'+
                        '<tr><td>No.of vehicles owned</td><td> </td><td><strong>{{model.CamDetails[1].data[0].No_of_vehicles_owned}}</strong></td></tr>'+
                        '</tbody></table>'
                    }, {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Spoke</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Spoke}}</strong></td></tr>'+
                        '<tr><td>Sales Executive</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Sales_Executive}}</strong></td></tr>'+
                        '<tr><td>Referred By</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Referred_By}}</strong></td></tr>'+
                        '<tr><td>DOB</td><td> </td><td><strong>{{model.CamDetails[1].data[0].DOB}}</strong></td></tr>'+
                        '<tr><td>PAN No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].PAN_No}}</strong></td></tr>'+
                        '<tr><td>Mobile</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Mobile}}</strong></td></tr>'+
                        '<tr><td>Street</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Street}}</strong></td></tr>'+
                        '<tr><td>Pincode</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Pincode}}</strong></td></tr>'+
                        '<tr><td>Occupation</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Occupation}}</strong></td></tr>'+
                        '<tr><td>Customer category </td><td> </td><td><strong>{{model.CamDetails[1].data[0].Customer_category}}</strong></td></tr>'+
                        '<tr><td>Ownership of property</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Ownership_of_property}}</strong></td></tr>'+
                        '</tbody></table>'
                    }
                ]
            });

             form.push({
                type: "box",
                colClass: "col-sm-12",
                title: model.CamDetails[2].title,
                items: [              
                    {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Co-applicant</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Co_applicant}}</strong></td></tr>'+                    
                        '<tr><td>DL No</td><td> </td><td><strong>{{model.CamDetails[2].data[0].DL_No}}</strong></td></tr>'+                    
                        '<tr><td>PAN No</td><td> </td><td><strong>{{model.CamDetails[2].data[0].PAN_No}}</strong></td></tr>'+                    
                        '<tr><td>CIBIL score</td><td> </td><td><strong>{{model.CamDetails[2].data[0].CIBIL_score}}</strong></td></tr>'+                    
                        '<tr><td>Door/Building</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Door_Building}}</strong></td></tr>'+                    
                        '<tr><td>Postoffice</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Postoffice}}</strong></td></tr>'+                    
                        '<tr><td>Pincode</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Pincode}}</strong></td></tr>'+                        
                        '</tbody></table>'
                    },
                    {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+                        
                        '<tr><td>Aadhar No</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Aadhar_No}}</strong></td></tr>'+                        
                        '<tr><td>DOB</td><td> </td><td><strong>{{model.CamDetails[2].data[0].DOB}}</strong></td></tr>'+                        
                        '<tr><td>Mobile</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Mobile}}</strong></td></tr>'+                        
                        '<tr><td>Occupation</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Occupation}}</strong></td></tr>'+                        
                        '<tr><td>Street</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Street}}</strong></td></tr>'+                        
                        '<tr><td>District</td><td> </td><td><strong>{{model.CamDetails[2].data[0].District}}</strong></td></tr>'+                        
                        '</tbody></table>'
                    }
                ]
            });
            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: model.CamDetails[3].title,
                items: [              
                    {
                        type: "section",                        
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Guarantor</td><td> </td><td ng-repeat="data in model.CamDetails[3].data" ng-init="parameterIndex=$index"><strong>{{model.CamDetails[3].data[0].Guarantor}}</strong></td></tr>'+                      
                        '<tr><td>DL No</td><td> </td><td><strong>{{model.CamDetails[3].data[0].DL_No}}</strong></td></tr>'+                      
                        '<tr><td>PAN No</td><td> </td><td><strong>{{model.CamDetails[3].data[0].PAN_No}}</strong></td></tr>'+                      
                        '<tr><td>CIBIL score</td><td> </td><td><strong>{{model.CamDetails[3].data[0].CIBIL_score}}</strong></td></tr>'+                      
                        '<tr><td>Door/Building</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Door_Building}}</strong></td></tr>'+                      
                        '<tr><td>Postoffice</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Postoffice}}</strong></td></tr>'+                      
                        '<tr><td>Pincode</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Pincode}}</strong></td></tr>'+
                        '</tbody></table>'
                    },              
                    {
                        type: "section",                        
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+                        
                        '<tr><td>Aadhar No</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Aadhar_No}}</strong></td></tr>'+                        
                        '<tr><td>DOB</td><td> </td><td><strong>{{model.CamDetails[3].data[0].DOB}}</strong></td></tr>'+                        
                        '<tr><td>Mobile</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Mobile}}</strong></td></tr>'+                        
                        '<tr><td>Occupation</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Occupation}}</strong></td></tr>'+                        
                        '<tr><td>Street</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Street}}</strong></td></tr>'+                        
                        '<tr><td>District</td><td> </td><td><strong>{{model.CamDetails[3].data[0].District}}</strong></td></tr>'+                        
                        '</tbody></table>'
                    }
                ]
            });
            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: model.CamDetails[4].title,
                items: [              
                    {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Loan amount</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Loan_amount}}</strong></td></tr>'+
                        '<tr><td>IRR</td><td> </td><td><strong>{{model.CamDetails[4].data[0].IRR}}</strong></td></tr>'+
                        '<tr><td>Vehicle valuation</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Vehicle_valuation}}</strong></td></tr>'+
                        '<tr><td>Grid value</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Grid_value}}</strong></td></tr>'+
                        '<tr><td>Vehicle Make</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Vehicle_Make}}</strong></td></tr>'+
                        '<tr><td>Model</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Model}}</strong></td></tr>'+
                        '<tr><td>Vehicle category</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Vehicle_category}}</strong></td></tr>'+
                        '<tr><td>Route From</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Route_From}}</strong></td></tr>'+                        
                        '</tbody></table>'
                    }, {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Loan purpose</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Loan_purpose}}</strong></td></tr>'+
                        '<tr><td>Tenure</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Tenure}}</strong></td></tr>'+
                        '<tr><td>IDV</td><td> </td><td><strong>{{model.CamDetails[4].data[0].IDV}}</strong></td></tr>'+
                        '<tr><td>LTV</td><td> </td><td><strong>{{model.CamDetails[4].data[0].LTV}}</strong></td></tr>'+
                        '<tr><td>Year of Mfg.</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Year_of_Mfg}}</strong></td></tr>'+
                        '<tr><td>Type of Body</td><td> </td><td><strong>{{model.CamDetails[4].data[0].Type_of_Body}}</strong></td></tr>'+
                        '<tr><td>End use of vehicle</td><td> </td><td><strong>{{model.CamDetails[4].data[0].End_use_of_vehicle}}</strong></td></tr>'+
                        '<tr><td>Route To </td><td> </td><td><strong>{{model.CamDetails[4].data[0].Route_To}}</strong></td></tr>'+                        
                        '</tbody></table>'
                    }
                ]
            });
            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: model.CamDetails[5].title,
                items: [              
                    {
                        type: "section",
                        htmlClass: "col-sm-12",
                        html: '<table class="table">'+
                        '<tbody>'+
                        '<tr><td>Registration No</td><td> </td><td>Model</td><td> </td><td>Make</td><td> </td><td>Free/Financed</td></tr>'+
                        '<tr ng-repeat="data in model.CamDetails[5].data"><td><strong>{{ data.Registration_No}}</strong></td><td> </td><td><strong>{{ data.Model }}</strong></td><td> </td><td><strong>{{ data.Make }}</strong></td><td> </td><td><strong>{{ data.Free_Financed }}</strong></td></tr>'+                    
                        '</tbody></table>'
                    }
                ]
            });
            return form;
        }

        var prepareDataDeferred;
        var prepareDataPromise;
        return {
            "type": "schema-form",
            "title": "",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                prepareDataDeferred = $q.defer();
                prepareDataPromise = prepareDataDeferred.promise;
                model.bundleModel = bundleModel;
                model.currentStage = bundleModel.currentStage;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.ScoreDetails = [];
                model.customer = {};

                /*Business Summary*/
                model.customer_detail = bundleModel.customer_detail;
                model.loanAccount = bundleModel.loanAccount;
                var $this = this;
                var deferred = $q.defer();

                scoreName = "ConsolidatedScore";

                if (bundlePageObj) {
                    model._bundlePageObj = _.cloneDeep(bundlePageObj);
                }

                if (_.hasIn(model, 'cbModel')) {
                    Scoring.get({
                        auth_token: AuthTokenHelper.getAuthData().access_token,
                        LoanId: model.cbModel.loanId,
                        ScoreName: scoreName
                    }).$promise.then(function(response) {
                        model.ScoreDetails = response.ScoreDetails;
                    }).finally(function() {
                        var onSuccessPromise = Scoring.financialSummary({
                            loan_id: model.cbModel.loanId,
                            score_name: scoreName
                        }).$promise;
                        onSuccessPromise.then(function(res) {
                            /* var financialData = [model.ScoreDetails,res];*/
                            BundleManager.pushEvent('financialSummary', model._bundlePageObj, res);
                            prepareData(res, model);
                            model.$prepared = true;
                            prepareDataDeferred.resolve();
                        });

                        $q.all([onSuccessPromise]).finally(function() {
                            deferred.resolve();
                        });
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            },
            eventListeners: {},
            form: [{
                type: 'section',
                html: '<br><br><br><center>Loading...</center>'
            }],
            initializeUI: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                PageHelper.showLoader();
                var $this = this;
                if (model.$prepared) {
                    $this.form = prepareForms(model);
                    PageHelper.hideLoader();
                } else {
                    prepareDataPromise.then(function() {
                        $this.form = prepareForms(model);
                        formCtrl.redraw();
                        PageHelper.hideLoader();
                    });
                }
                return $q.resolve();
            },
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                 "business-customer": function(bundleModel, model, params) {
                    model.business = params;
                      if (model.business.centreId) {
                        model.business.centreName = filterFilter(formHelper.enum('centre').data, {
                            value: model.business.centreId
                        })[0].name;
                    }
                }
            },
            actions: {
            }
        };
    }
});
