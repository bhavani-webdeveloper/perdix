irf.pageCollection.controller(irf.controller("audit.AuditDraftDetails"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils",
    function($log, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils) {
        if (!$stateParams.pageId) {
            irfNavigator.goBack();
            PageHelper.showProgress("audit", "Audit ID is empty", 5000);
            return;
        }
        $stateParams.pageData = $stateParams.pageData || {};
        if (typeof($stateParams.pageData.readonly) == 'undefined') {
            $stateParams.pageData.readonly = true;
        }
        var $this = this;
        $this.auditId = $stateParams.pageId;
        $scope.pageName = $stateParams.pageName;
        $scope.model = {
            "readonly": $stateParams.pageData.readonly,
            "type": $stateParams.pageData.type

        };
        $scope.formHelper = formHelper;
        $scope.siteCode = SessionStore.getGlobalSetting('siteCode');
        var master = Audit.offline.getAuditMaster() || {};


        var init = function() {
            // $scope.model.issuesList = response || [];
            var tableColumnsConfig = [];
            tableColumnsConfig.push({
                "title": "AUDIT_ID",
                "data": "audit_id"
            }, {
                "title": "DATE",
                "data": "audit_report_date",

            }, {
                "title": "STATUS",
                "data": "status"
            }, {
                "title": "Current Stage",
                "data": "current_stage"
            });

            $scope.form = [{
                "type": "box",
                "colClass": "col-sm-12",
                "title": "AUDIT_DRAFT_ISSUES",
                "items": [{
                    "key": "issueList",
                    "type": "tableview",
                    "title": "DRAFT_ISSUE_DETAILS",
                    "selectable": false,
                    "editable": false,
                    "tableConfig": {
                        "searching": true,
                        "paginate": true,
                        "pageLength": 10,
                    },
                    getColumns: function() {
                        return tableColumnsConfig; //its coming from after adding issue
                    },
                    getActions: function() {
                        return [{
                            name: "UPDATE_ISSUE",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.IssueDetails',
                                    'pageId': item.id,
                                    'pageData': {
                                        "readonly": $scope.model.readonly,
                                        "type": $scope.model.type
                                    }
                                });
                            },
                            isApplicable: function(item, index) {
                                return $scope.model.type;
                            }
                        }];
                    }
                   
                }]

            }];

            $scope.schema = schema;
        }

        PageHelper.showLoader();
        Audit.online.findIssues({
            audit_id: $this.auditId
        }).$promise.then(function(data) {
            $scope.model.issueList = data.body;
            init();
        }, function(errRes) {
            PageHelper.showErrors(errRes);
        }).finally(function() {
            PageHelper.hideLoader();
        });



        $scope.formName = irf.form($scope.pageName);

        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "issueList": {
                    "type": "object",
                    "properties": {
                        
                    }
                }
            }
        };

        /* $scope.actions = {
             moveStage: function(model, sendBack) {
                 var nextStage = '';
                 if (sendBack) {
                     switch (model.ai.current_stage) {
                         case 'publish':
                             nextStage = 'start';
                             break;
                         case 'L1-approve':
                             nextStage = 'publish';
                             break;
                         default:
                             return;
                     }
                     if (!model.ai.message) {
                         PageHelper.setError({
                             message: 'Audit reject message is required'
                         });
                         return;
                     }
                 } else {
                     switch (model.ai.current_stage) {
                         case 'start':
                         case 'create':
                             nextStage = 'publish';
                             break;
                         case 'publish':
                             if ($scope.siteCode == 'KGFS')
                                 nextStage = 'approve';
                             else
                                 nextStage = 'L1-approve';
                             break;
                         case 'L1-approve':
                             nextStage = 'approve';
                             break;
                         default:
                             return;
                     }
                     if (!model.ai.message) {
                         PageHelper.setError({
                             message: 'Audit ' + nextStage + ' message is required'
                         });
                         return;
                     }
                 }
                 PageHelper.clearErrors();
                 Utils.confirm("All unsaved data will be lost, Do you want to proceed?").then(function() {
                     var reqData = $scope.model.ai;
                     reqData.next_stage = nextStage;
                     Audit.online.updateAuditInfo(reqData).$promise.then(function(res) {
                         $scope.model.ai = res;
                         PageHelper.showProgress("audit", "Audit Updated Successfully.", 5000);
                         // $scope.$online || Audit.offline.deleteAudit($this.auditId).catch(PageHelper.showErrors);
                         irfNavigator.goBack();
                     }, function(errRes) {
                         PageHelper.showErrors(errRes);
                     }).finally(function() {
                         PageHelper.hideLoader();
                     })
                 });
             },
             uploadAuditData: function(model) {
                 PageHelper.clearErrors();
                 PageHelper.showLoader();
                 var reqData = model.auditData;
                 // $scope.$online || Audit.offline.setAuditInfo($this.auditId, reqData.audit_info);
                 Audit.online.updateAuditData(reqData).$promise.then(function(response) {
                     Audit.online.getAuditData({
                         audit_id: $this.auditId
                     }).$promise.then(function(auditData) {
                         processAuditData(auditData);
                         // $scope.$online || Audit.offline.setAudit($this.auditId, auditData);
                         deferred.resolve();
                     }, function(errorResponse) {
                         PageHelper.showErrors(errorResponse);
                         deferred.reject();
                     }).finally(PageHelper.hideLoader);
                     PageHelper.showProgress("audit", "Audit Updated Successfully.", 3000);
                 }, function(errRes) {
                     PageHelper.showErrors(errRes);
                     PageHelper.hideLoader();
                 });
             },
             resyncAuditData: function(model) {
                 Utils.confirm('All your audit data will be reset with server copy. Do you really want to resync?').then(function() {
                     PageHelper.showLoader();
                     Audit.online.getAuditData({
                         audit_id: $this.auditId
                     }).$promise.then(function(response) {
                         PageHelper.hideLoader();
                         // response.audit_info._offline = true;
                         // response.audit_info._dirty = false;
                         // Audit.offline.setAudit($this.auditId, response);
                         PageHelper.showProgress("audit", "Synchronized successfully", 3000);
                     }).finally(function() {
                         PageHelper.hideLoader();
                     });
                 });
             }
         };*/
    }
]);