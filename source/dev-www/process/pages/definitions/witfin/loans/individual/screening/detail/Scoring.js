define({
    pageUID: "witfin.loans.individual.screening.detail.Scoring",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "Scoring", "AuthTokenHelper", "BundleManager", "filterFilter", "irfCurrencyFilter"
    ],
    $pageFn: function($log, $q, Enrollment, SchemaResource, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, Scoring, AuthTokenHelper, BundleManager, filterFilter, irfCurrencyFilter) {
       var branch = SessionStore.getBranch();
        var prepareData = function(res, model) {           
            model.CamDetails = [res[1], res[2], res[3], res[4],res[5]];
           // console.log(model.CamDetails);
            //console.log("data"); 
        };

        var prepareForms = function(model) {
           var form = [];
            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: model.CamDetails[0].title,
                items: [              
                    {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Branch</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Branch}}</strong></td></tr>'+
                        '<tr><td>Loan Application No</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Loan_Application_No}}</strong></td></tr>'+
                        '<tr><td>Lead Source</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Lead_Source}}</strong></td></tr>'+
                        '<tr><td>Applicant</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Applicant}}</strong></td></tr>'+
                        '<tr><td>Aadhar No</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Aadhar_No}}</strong></td></tr>'+
                        '<tr><td>DL No</td><td> </td><td><strong>{{model.CamDetails[0].data[0].DL_No}}</strong></td></tr>'+
                        '<tr><td>Door/Building</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Door_Building}}</strong></td></tr>'+
                        '<tr><td>Postoffice</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Postoffice}}</strong></td></tr>'+
                        '<tr><td>District</td><td> </td><td><strong>{{model.CamDetails[0].data[0].District}}</strong></td></tr>'+
                        '<tr><td>CIBIL score</td><td> </td><td><strong>{{model.CamDetails[0].data[0].CIBIL_score}}</strong></td></tr>'+
                        '<tr><td>No.of vehicles owned</td><td> </td><td><strong>{{model.CamDetails[0].data[0].No_of_vehicles_owned}}</strong></td></tr>'+
                        '</tbody></table>'
                    }, {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Spoke</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Spoke}}</strong></td></tr>'+
                        '<tr><td>Sales Executive</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Sales_Executive}}</strong></td></tr>'+
                        '<tr><td>Referred By</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Referred_By}}</strong></td></tr>'+
                        '<tr><td>DOB</td><td> </td><td><strong>{{model.CamDetails[0].data[0].DOB}}</strong></td></tr>'+
                        '<tr><td>PAN No</td><td> </td><td><strong>{{model.CamDetails[0].data[0].PAN_No}}</strong></td></tr>'+
                        '<tr><td>Mobile</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Mobile}}</strong></td></tr>'+
                        '<tr><td>Street</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Street}}</strong></td></tr>'+
                        '<tr><td>Pincode</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Pincode}}</strong></td></tr>'+
                        '<tr><td>Occupation</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Occupation}}</strong></td></tr>'+
                        '<tr><td>Customer category </td><td> </td><td><strong>{{model.CamDetails[0].data[0].Customer_category}}</strong></td></tr>'+
                        '<tr><td>Ownership of property</td><td> </td><td><strong>{{model.CamDetails[0].data[0].Ownership_of_property}}</strong></td></tr>'+
                        '</tbody></table>'
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
                        htmlClass: "col-sm-8",
                        html: '<table class="table"><colgroup><col width="30%"><col width="15%"><col width="25%"><col width="5%"><col width="25%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td></td><td> </td><td><strong><u>Co-applicant 1</u></strong></td><td> </td><td><strong><u>Co-applicant 2</u></strong></td></tr>'+
                        '<tr><td>Co-applicant</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Co_applicant}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Co_applicant}}</strong></td></tr>'+
                        '<tr><td>Aadhar No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Aadhar_No}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Aadhar_No}}</strong></td></tr>'+
                        '<tr><td>DL No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].DL_No}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].DL_No}}</strong></td></tr>'+
                        '<tr><td>DOB</td><td> </td><td><strong>{{model.CamDetails[1].data[0].DOB}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].DOB}}</strong></td></tr>'+
                        '<tr><td>PAN No</td><td> </td><td><strong>{{model.CamDetails[1].data[0].PAN_No}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].PAN_No}}</strong></td></tr>'+
                        '<tr><td>Mobile</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Mobile}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Mobile}}</strong></td></tr>'+
                        '<tr><td>CIBIL score</td><td> </td><td><strong>{{model.CamDetails[1].data[0].CIBIL_score}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].CIBIL_score}}</strong></td></tr>'+
                        '<tr><td>Occupation</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Occupation}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Occupation}}</strong></td></tr>'+
                        '<tr><td>Door/Building</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Door_Building}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Door_Building}}</strong></td></tr>'+
                        '<tr><td>Street</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Street}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Street}}</strong></td></tr>'+
                        '<tr><td>Postoffice</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Postoffice}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Postoffice}}</strong></td></tr>'+
                        '<tr><td>District</td><td> </td><td><strong>{{model.CamDetails[1].data[0].District}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].District}}</strong></td></tr>'+
                        '<tr><td>Pincode</td><td> </td><td><strong>{{model.CamDetails[1].data[0].Pincode}}</strong></td><td> </td><td><strong>{{model.CamDetails[1].data[1].Pincode}}</strong></td></tr>'+                        
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
                        htmlClass: "col-sm-8",
                        html: '<table class="table"><colgroup><col width="30%"><col width="15%"><col width="25%"><col width="5%"><col width="25%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td></td><td> </td><td><strong><u>Guarantor 1</u></strong></td><td> </td><td><strong><u>Guarantor 2</u></strong></td></tr>'+
                        '<tr><td>Guarantor</td><td> </td><td ng-repeat="data in model.CamDetails[2].data" ng-init="parameterIndex=$index"><strong>{{model.CamDetails[2].data[0].Guarantor}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Guarantor}}</strong></td></tr>'+  
                        '<tr><td>Aadhar No</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Aadhar_No}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Aadhar_No}}</strong></td></tr>'+  
                        '<tr><td>DL No</td><td> </td><td><strong>{{model.CamDetails[2].data[0].DL_No}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].DL_No}}</strong></td></tr>'+  
                        '<tr><td>DOB</td><td> </td><td><strong>{{model.CamDetails[2].data[0].DOB}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].DOB}}</strong></td></tr>'+  
                        '<tr><td>PAN No</td><td> </td><td><strong>{{model.CamDetails[2].data[0].PAN_No}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].PAN_No}}</strong></td></tr>'+  
                        '<tr><td>Mobile</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Mobile}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Mobile}}</strong></td></tr>'+  
                        '<tr><td>CIBIL score</td><td> </td><td><strong>{{model.CamDetails[2].data[0].CIBIL_score}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].CIBIL_score}}</strong></td></tr>'+  
                        '<tr><td>Occupation</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Occupation}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Occupation}}</strong></td></tr>'+  
                        '<tr><td>Door/Building</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Door_Building}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Door_Building}}</strong></td></tr>'+  
                        '<tr><td>Street</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Street}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Street}}</strong></td></tr>'+  
                        '<tr><td>Postoffice</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Postoffice}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Postoffice}}</strong></td></tr>'+  
                        '<tr><td>District</td><td> </td><td><strong>{{model.CamDetails[2].data[0].District}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].District}}</strong></td></tr>'+  
                        '<tr><td>Pincode</td><td> </td><td><strong>{{model.CamDetails[2].data[0].Pincode}}</strong></td><td> </td><td><strong>{{model.CamDetails[2].data[1].Pincode}}</strong></td></tr>'+                                             
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
                        '<tr><td>Loan amount</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Loan_amount}}</strong></td></tr>'+
                        '<tr><td>IRR</td><td> </td><td><strong>{{model.CamDetails[3].data[0].IRR}}</strong></td></tr>'+
                        '<tr><td>Vehicle valuation</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Vehicle_valuation}}</strong></td></tr>'+
                        '<tr><td>Grid value</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Grid_value}}</strong></td></tr>'+
                        '<tr><td>Vehicle Make</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Vehicle_Make}}</strong></td></tr>'+
                        '<tr><td>Model</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Model}}</strong></td></tr>'+
                        '<tr><td>Vehicle category</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Vehicle_category}}</strong></td></tr>'+
                        '<tr><td>Route From</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Route_From}}</strong></td></tr>'+                        
                        '</tbody></table>'
                    }, {
                        type: "section",
                        htmlClass: "col-sm-6",
                        html: '<table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup>'+
                        '<tbody>'+
                        '<tr><td>Loan purpose</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Loan_purpose}}</strong></td></tr>'+
                        '<tr><td>Tenure</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Tenure}}</strong></td></tr>'+
                        '<tr><td>IDV</td><td> </td><td><strong>{{model.CamDetails[3].data[0].IDV}}</strong></td></tr>'+
                        '<tr><td>LTV</td><td> </td><td><strong>{{model.CamDetails[3].data[0].LTV}}</strong></td></tr>'+
                        '<tr><td>Year of Mfg.</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Year_of_Mfg}}</strong></td></tr>'+
                        '<tr><td>Type of Body</td><td> </td><td><strong>{{model.CamDetails[3].data[0].Type_of_Body}}</strong></td></tr>'+
                        '<tr><td>End use of vehicle</td><td> </td><td><strong>{{model.CamDetails[3].data[0].End_use_of_vehicle}}</strong></td></tr>'+
                        '<tr><td>Route To </td><td> </td><td><strong>{{model.CamDetails[3].data[0].Route_To}}</strong></td></tr>'+                        
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
                        '<tr><td>Registration No</td><td> </td><td>Model</td><td> </td><td>Make</td><td> </td><td>Free/Financed</td></tr>'+
                        '<tr ng-repeat="data in model.CamDetails[4].data"><td><strong>{{ data.Registration_No}}</strong></td><td> </td><td><strong>{{ data.Model }}</strong></td><td> </td><td><strong>{{ data.Make }}</strong></td><td> </td><td><strong>{{ data.Free_Financed }}</strong></td></tr>'+                    
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
