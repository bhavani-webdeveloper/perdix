define({
    pageUID: "management.RefreshBranchSetAccess",
    pageType: "Engine",
    dependencies: ["$log","Pages_ManagementHelper","Queries","Lead","Enrollment","BranchCreationResource", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "Masters", "authService"],
    $pageFn: function($log,Pages_ManagementHelper,Queries,Lead,Enrollment,BranchCreationResource, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams, Masters, authService) {

        return {
            "name": "RefreshBranchSetAccess",
            "type": "schema-form",
            "title": "REFRESH_BRANCH_SET_ACCESS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Create Branch Page loaded");
                model.branch= model.branch||{};    
            },

            form: [
            {
                "type": "box",
                "title": "REFRESH_BRANCH_SET_ACCESS",
                "items": [
                {
                    "key": "branch.refreshBranchset",
                    "title": "REFRESH",
                    "notitle":true,
                    "onClick": "actions.refereshButton(model, formCtrl, form, $event)",
                    "type": "button",
                    icon: "fa fa-refresh"   
                }]
            }],
            schema: function() {
                 return Lead.getLeadSchema().$promise;  
            },
            actions: {
                refereshButton: function(model, form, formName) {
                    $log.info("Inside submit()");
                    console.warn(model);
                    PageHelper.showLoader();
                    PageHelper.showProgress("Branch Save", "Working...");

                    BranchCreationResource.refreshBranchset()
                        .$promise
                        .then(function(res) {
                            PageHelper.showProgress("Branch Save", res.message);
                            $log.info(res);
                            model.branch = res;
                            $state.go('Page/Adhoc/management.BranchCreationDashboard', null);
                        }, function(httpRes) {
                            PageHelper.showProgress("Branch Save", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                }
            }
        };
    }
})