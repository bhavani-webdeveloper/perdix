define(['perdix/infra/api/AngularResourceService'], function (AngularResourceService) {
    return {
        pageUID: "management.bankadmin.UpdateEod",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfNavigator","Transaction","BranchCreationResource"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfNavigator,Transaction,BranchCreationResource) {

            AngularResourceService.getInstance().setInjector($injector);
            return {
                "type": "schema-form",
                "title": "UPDATE_EOD",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    // var arr=["Udayasuriapuram","Thittakudi","Natuchalai","Ananthagopalapuram","Test Branch1","Puducherry","Alakudi","Pudupatti","Devanancherri","Voragur","Melenamedu","Karambayam","Orathur","SANJAY NAGAR","Koonancheri","Thondarampattu","Veeramangudi","Umayalpuram","Chellampatti","Paruthiyappar kovil","Andipatti","Kavarapattu","Madhukur North","Agaramangudi","Thirumangalakottai","Ariyacheri","Okkanadumelayur","Pulavankadu","Soolamangalam","Kanjanur","Seruvaviduthi","Malayappanallur","Annappanpettai","Kallaperambur","Mathur","Ilangarkudi","Pkgfsho","Anakudi","Arundavapuram","Tiruvaikavur","Marungulam","Vadiyakadu","Koohur","Aaramkattalai Vilangudi","KURUCHIMALAI","Cholagankarai","Ottankadu","Padappanar vayal","Keelamanthur","Tirukkarugavur","KAIKATTI","THALIGAIVIDUTHI","Udayanadu","Thiruneelakudi","Kasangadu","NARTHEVANKUDIKADU","Kandakarayam","VANDAIYARIRUPPU","Thirupazhanam","Ukkarai","Thirucherai","Ayyavadi","Thuravikadu","Mangudi","Ayyanapuram","Thirukanurpatti","Venkarai","PUDHUKUDI","Vilagam","Nagarapatti","Elakkurichi","Maramadakki","Koppanapatti","Eravangudi","Kodukkur","VELLAARUKGFSHO","THENAARUKGFSHO","Neerpalani","Kallakottai","T palur","Sadaiyampatti","Guruvalappar kovil","Soorakadu","Erichi","Irumbuthalai","Irumbilikurichi","SUNDAKUDI","Kallankurichi","Parambur","Karaiyur","Samppattividuthi","Kallathur","Suthamalli","Merpanaikadu","Ottakovil","Kodumbalur","Vayalogam","Perumanadu","Kaikurichi","ponparappi","Thirumazhapadi","Keezhakavattankurichi","Kaladipatti","Poyyur","Azhagapuram","Thiruvappadi","Pattukottai Hub","Kumbakonam Hub","Okkur","Veerachozhapuram","K Pudupatti","T Pottakollai","Kulumur","Pommadi Malai","Pulichankadu Kaikatti","Chozhankudikadu","Marathurai","Innambur","Panankulam","Kuvagam","Vennaval Kudi","Thiruloki","Karai","Sripuranthan","Sembaatur","Manjavayal","Madigai","Ichadi","Rangiyam","Nambampatti","Veppur","Mandhiripatnam","Pilakkurichi","Ammanchi","Elumur","Thirukkalambur","Neikuppai","Nemmeli Thippiyakudi","K Rasiyamangalam","Arasadipatti","Kondraikadu","Kolakkanattham","Aliyavaikal","Kovilur","T cholankurichi","Athivetti","Kannanthangudimelayur","Mavadukurichi","Vattathikollaikadu","Kolakudi","Panaiyur","Pudukkottai Ullur","Senganur","Pavanamangalam","Nemam","Thiruvonam","Nagamangalam","Thiruperunthurai","Kadiyapatti","Vaduvur","K.Pallivasal","Regunathapuram","Adanakottai","Agaram Sigoor","Ullikottai","Krishnapuram","Thiruchitrambalam","Aranthangi","Needamangalam","Lalgudi","Cholapuram","Virudhachalam","Mayiladuthurai","Thirukattupalli","Melaulur","manachanallur","thottiyam"];
                    model.updateEod={};
                    // model.updateEod.branch = arr.toString();

                    /* Setting data for the form */
                    var branchId = SessionStore.getBranchId();
                    if (!model.customer) {

                    }

                    else if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };

                    var configFile = function () {
                        return {
                            "loanProcess.loanAccount.currentStage": {
                            }
                        }
                    }
                    var overridesFields = function (bundlePageObj) {
                        return {
        
                        }
                    }
                    var getIncludes = function (model) {
                        return [
                            "Bank",
                            "Bank.eodDate",
                            "Bank.updatedbranch"
                        ];
                    }

                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                             "Bank":{
                                 "type":"box",
                                 "colClass": "col-sm-12",
                                 "orderNo": 1,
                                 "title":"UPDATE_EOD",
                                 "items":{
                                        "eodDate":{
                                            "key":"updateEod.eodDate",
                                            "type":"date",
                                            "title": "EOD_DATE",
                                            "required": true
                                        },
                                        "updatedbranch":{
                                            "html":'<span style="word-break: break-all;">{{model.updateEod.branch}}</span>',
                                            "type": "section"   
                                        }
                                }
                            }
                        },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "orderNo": 2,
                                    "items":[
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT",
                                        },
                                    ]
                                }
                            ]
                        }
                };

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            console.log(model.pageClass);
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            self.form = form;
                            console.log(form);
                            console.log("_________________Testing form data___________");
                        });

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    return $q.resolve();
                },
                eventListeners: {
                  
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                },
                form: [],
              
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        // $q.all start
                      
                    },
                    proceed: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        
                        Transaction.updateEOD({"eodDate":model.updateEod.eodDate}).$promise.then(function(resp){
                            console.log("resp",resp);
                            model.updateEod.branch = resp.toString();
                            PageHelper.hideLoader();
                        },function(err){
                            console.log("ERR",err);
                            PageHelper.hideLoader();
                            PageHelper.showErrors(err);
                        })
                    }
                }
            };
        }
    }
})

