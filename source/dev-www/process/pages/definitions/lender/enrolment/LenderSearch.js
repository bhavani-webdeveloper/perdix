define([], function() {
                return {
                        pageUID: "lender.enrolment.LenderSearch",
                        pageType: "Engine",
                        dependencies: ["$log", "formHelper", "Enrollment","Queries","$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator"],
                        $pageFn: function($log, formHelper, Enrollment,Queries,$state, SessionStore, Utils, PagesDefinition, irfNavigator) {
                                        var branch = SessionStore.getBranch();
                                        return {
                                                        "type": "search-list",
                                                        "title": "LENDER_SEARCH",
                                                        "subTitle": "",
                                                        initialize: function (model, form, formCtrl) {
                                                                        model.branch = SessionStore.getCurrentBranch().branchId;
                                                                        //"irf-elements": "svn+http://svn.perdix.co/svn/perdix/irf-common-elements#trunk",
                                                                        var bankName = SessionStore.getBankName();
                                                                        var banks = formHelper.enum('bank').data;
                                                                        for (var i = 0; i < banks.length; i++){
                                                                                        if(banks[i].name == bankName){
                                                                                                        model.bankId = banks[i].value;
                                                                                                        model.bankName = banks[i].name;
                                                                                                        break;
                                                                                        }
                                                                        }
                                                                        model.siteCode = SessionStore.getGlobalSetting("siteCode");
                                                                        $log.info("siteCode:" + model.siteCode);
                                                                        var userRole = SessionStore.getUserRole();
                                                                        if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
                                                                                        model.fullAccess = true;
                                                                        }
                                                                        PagesDefinition.getPageConfig('Page/Engine/CustomerSearch').then(function(data){
                                                                                        model.showBankFilter = data.showBankFilter ? data.showBankFilter : false;
                                                                                        setTimeout(function(){formCtrl.submit();}, 0);     
                                                                                        $log.info("search-list sample got initialized");
                                                                        });
                                                        },
                                                        definition: {
                                                                        title: "Search Lender",
                                                                        searchForm: [
                                                                                        {
                                                      "type": "section",
                                                      items: [
                                                                      {
                                                                                      key: "urnNo"
                                                                      }
                                                      ]
                                        }
                                                                        ],
                                                                        searchSchema: {
                                                                                        "type": 'object',
                                                                                        "title": 'SearchOptions',
                                                                                        "properties": {
                                                                                                        "urnNo": {
                                                                                                                        "title": "URN_NO",
                                                                                                                        "type": "number"
                                                                                                        }
                                                                                        },
                                                                                        "required":[]
                                                                        },
                                                                        getSearchFormHelper: function() {
                                                                                        return formHelper;
                                                                        },
                                                                        getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

                                                                                        /* GET BRANCH NAME */
                                                                                        var branches = formHelper.enum('branch').data;
                                                                                        var branchName = null;
                                                                                        for (var i=0;i<branches.length; i++){
                                                                                                        var branch = branches[i];
                                                                                                        if (branch.code == searchOptions.branch){
                                                                                                                       branchName = branch.name;
                                                                                                        }
                                                                                        }

                                                                                        var promise = Enrollment.lenderSearch({
                                                                                                        'bankId': searchOptions.bankId,
                                                                                                        'branchName': branchName,
                                                                                                        'firstName': searchOptions.first_name,
                                                                                                        'centreId': searchOptions.centre,
                                                                                                        'page': pageOpts.pageNo,
                                                                                                        'per_page': pageOpts.itemsPerPage,
                                                                                                        'kycNumber': searchOptions.kyc_no,
                                                                                                        'lastName': searchOptions.lastName,
                                                                                                        'urnNo': searchOptions.urnNo,
                                                                                                        'customerType': 'Lender'
                                                                                        }).$promise;

                                                                                        return promise;
                                                                        },
                                                                        paginationOptions: {
                                                                                        "getItemsPerPage": function(response, headers){
                                                                                                        return 100;
                                                                                        },
                                                                                        "getTotalItemsCount": function(response, headers){
                                                                                                        return headers['x-total-count']
                                                                                        }
                                                                        },
                                                                        listOptions: {
                                                                                        selectable: false,
                                                                                        expandable: true,
                                                                                        listStyle: "table",
                                                                                        itemCallback: function(item, index) {
                                                                                        },
                                                                                        getItems: function(response, headers){
                                                                                                        if (response!=null && response.length && response.length!=0){
                                                                                                                        return response;
                                                                                                        }
                                                                                                        return [];
                                                                                        },
                                                                                        getListItem: function(item){
                                                                                                        return [
                                                                                                                        Utils.getFullName(item.firstName, item.middleName, item.lastName),
                                                                                                                        'Customer ID : ' + item.id,
                                                                                                                        item.urnNo?('URN : ' + item.urnNo):("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage==='Stage02'?'House verification':
                                                                                                                                        (item.currentStage==='Stage01'?'Enrollment':item.currentStage))),
                                                                                                                        "{{'BRANCH'|translate}} : " + item.kgfsName,
                                                                                                                        "{{'CENTRE_CODE'|translate}} : " + item.centreId,
                                                                                                                        "{{'FATHERS_NAME'|translate}} : " + Utils.getFullName(item.fatherFirstName, item.fatherMiddleName, item.fatherLastName)
                                                                                                        ]
                                                                                        },
                                                                                        getTableConfig: function() {
                                                                                                        return {
                                                                                                                        "serverPaginate": true,
                                                                                                                        "paginate": true,
                                                                                                                        "pageLength": 10
                                                                                                        };
                                                                                        },
                                                                                        getColumns: function(){
                                                                                                        return [
                                                                                                                        {
                                                                                                                                        title:'NAME',
                                                                                                                                        data: 'firstName',
                                                                                                                                        render: function(data, type, full, meta) {
                                                                                                                                                        return (full.customerType==='Individual'?'<i class="fa fa-user">&nbsp;</i> ':'<i class="fa fa-industry"></i> ') + data;
                                                                                                                                        }
                                                                                                                        },
                                                                                                                        {
                                                                                                                                        title:'URN_NO',
                                                                                                                                        data: 'urnNo'
                                                                                                                                        // type: 'html',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                        title:'CURRENT_STAGE', 
                                                                                                                                        data: 'currentStage'
                                                                                                                        }
                                                                                                        ]
                                                                                        },
                                                                                        getActions: function(){
                                                                                                        return [
                                                                                                                        {
                                                                                                                                        name: "Lender360",
                                                                                                                                        desc: "",
                                                                                                                                        icon: "fa fa-user-plus",
                                                                                                                                        fn: function(item, model){
                                                                                                                                                        $state.go("Page.Adhoc",{
                                                                                                                                                                        pageName:"lender.enrolment.Lender360",
                                                                                                                                                                        pageId:item.id
                                                                                                                                                        });
                                                                                                                                        },
                                                                                                                                        isApplicable: function(item, model){
                                                                                                                                                        return true;
                                                                                                                                        }
                                                                                                                        }
                                                                                                        ];
                                                                                        }
                                                                        }
                                                        }
                                        };
                        }
        }
})
