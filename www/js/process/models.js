irf.models
	.constant('BASE_URL', irf.BASE_URL)
	.constant('Model_ELEM_FC', {
		'fileUploadUrl': irf.BASE_URL + '/api/files/upload',
		'dataUploadUrl': irf.BASE_URL + '/api/files/upload/base64',
		'fileDeleteUrl': irf.BASE_URL + '/api/files/upload',
		'fileStreamUrl': irf.BASE_URL + '/api/stream',
		'responseSelector': 'fileId'
	})
;

irf.models.factory('SchemaResource',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/_refs/referencecodes';
    return $resource(endpoint, null, {
        getLoanAccountSchema: {
            method: 'GET',
            url: 'process/schemas/loanAccount.json'
        },
        getDisbursementSchema:{
            method:'GET',
            url:'process/schemas/disbursement.json'
        }
    });
});

irf.models.factory('Enrollment',function($resource,$httpParamSerializer,BASE_URL, searchResource){
    var endpoint = BASE_URL + '/api/enrollments';
    /*
     * $get : /api/enrollments/{blank/withhistory/...}/{id}
     *  eg: /enrollments/definitions -> $get({service:'definition'})
     *      /enrollments/1           -> $get({id:1})
     * $post will send data as form data, save will send it as request payload
     */
    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint+'/:service/:id'
        },
        query:{
            method:'GET',
            url:endpoint+'/:service/:id',
            isArray:true
        },

        getSchema:{
            method:'GET',
            url:'process/schemas/profileInformation.json'
        },
        search: searchResource({
            method: 'GET',
            url: endpoint + '/'
        }),
        put:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        },
        postWithFile:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'undefined'
            },
            transformRequest: function (data) {
                var fd = new FormData();
                angular.forEach(data, function(value, key) {
                    fd.append(key, value);
                });
                return fd;
            }
        },
        save:{
            method:'POST',
            url:endpoint
        },
        updateEnrollment: {
            method: 'PUT',
            url: endpoint
        },
        getCustomerById: {
            method: 'GET',
            url: endpoint+'/:id'
        },
        getWithHistory: {
            method: 'GET',
            url: endpoint+'/withhistory/:id'
        }
    });
});

irf.models.factory('CreditBureau',function($resource,$httpParamSerializer,BASE_URL,searchResource,$q){
    var endpoint = BASE_URL + '/api/creditbureau';

    var ret = $resource(endpoint, null, {
        creditBureauCheck: {
            method:'GET',
            url: endpoint + '/check/:customerId/:highMarkType/:purpose/:loanAmount'
        },
        listCreditBureauStatus: searchResource({
            method: "GET",
            url: endpoint + '/list'
        }),
        DSCpostCB: {
            method: 'GET',
            url: endpoint + '/postcb/:customerId'
        },
        reinitiateCBCheck: {
            method: 'GET',
            url: endpoint + '/reinitiate/:creditBureauId'
        }
    });

    return ret;
});

irf.models.factory('CustomerBankBranch', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
    var endpoint = BASE_URL + '/api';

    var ret = $resource(endpoint, null, {
        search: searchResource({
            method: 'GET',
            url: endpoint + '/customerbankbranch'
        })
    });

    return ret;
});
irf.models.factory('LoanProcess',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanaccounts';
    /*
    * GET /api/loanaccounts/reverse/{transactionId}/{transactionName} will translate into
    * {action:'reverse',param1:'<tid>',param2:'<tname>'}
    *
    * */

    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+'/:action/:param1/:param2'
        },
        query:{
            method:'GET',
            url:endpoint+'/:action/:param1/:param2',
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:action',
        },
        save:{
            method:'POST',
            url:endpoint+'/:action',
        },
        collectionDemandSearch: searchResource({
            method: "GET",
            url: endpoint + '/collectiondemand'
        }),
        collectionDemandUpdate:{
            method:'PUT',
            url:endpoint+'/collectiondemand/update',
        },
        getPldcSchema:{
            method:'GET',
            url:'process/schemas/pldc.json'
        },
        /*bounceCollectionDemand will show all the loans which has some overdue amount*/
        bounceCollectionDemand: searchResource({
            method:'GET',
            url:BASE_URL + '/api/scheduledemandlist'
        }),/*
        bounceCollectionDemandHead: {
            method:'HEAD',
            url:BASE_URL + '/api/scheduledemandlist'
        },*/
        repaymentList:searchResource({
            method:'GET',
            url:endpoint+'/repaymentlist'
        }),
        postArray:{
            method:'POST',
            url:endpoint+'/:action',
            isArray:true
        },
        p2pKGFSList:searchResource({
            method:'GET',
            url:BASE_URL + '/api/promisetopaykgfslist'
        }),
        repay:{
            method:'POST',
            url:endpoint+'/repay'
        },
        p2pUpdate:{
            method:'POST',
            url:BASE_URL+ "/api/promisetopaykgfs"
        },
        approve:{
            method:'POST',
            url:endpoint+ "/approverepayment"
        },
        partialPayment:{
            method:'PUT',
            url:endpoint+ "/partialpayment"
        },
        waiver:{
            method:'POST',
            url:endpoint+ "/waiver"
        },
        reject:{
            method:'POST',
            url:endpoint+ "/rejectrepayment"
        },
        processCashDeposit:{
            method:'POST',
            url:endpoint+ "/processCashDeposite",
            isArray:true
        },
        generatedefaultschedule:{
            method:'GET',
            url:endpoint+'/generatedefaultschedule',
            isArray:true
        },
        generateScheduleForSpecifiedDate:{
            method:'GET',
            url:endpoint+'/generateScheduleForSpecifiedDate',
            isArray:true
        }
    });
}]);

irf.models.factory('LoanAccount',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanaccounts';
    return $resource(endpoint, null, {
        activateLoan: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/activate/:accountId',
            transformResponse: []
        },
        disburse: {
            method: 'POST',
            url: endpoint + '/disburse'
        },
        getDisbursementDetails: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/groupdisbursement/:partnerCode/:groupCode',
            isArray: true
        },
        get: {
            method: 'GET',
            url: endpoint + '/show/:accountId',
            transformResponse: function(data, headersGetter, status){
                if (status === 200 && data){
                    data = JSON.parse(data);
                    if (_.hasIn(data, 'accountBalance') && _.isString(data['accountBalance'])){
                        data.accountBalance = parseFloat(data['accountBalance']);
                    }
                    if (_.hasIn(data, 'totalPrincipalDue') && _.isString(data['totalPrincipalDue'])){
                        data.totalPrincipalDue = parseFloat(data['totalPrincipalDue']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestDue') && _.isString(data['totalNormalInterestDue'])){
                        data.totalNormalInterestDue = parseFloat(data['totalNormalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestDue') && _.isString(data['totalPenalInterestDue'])){
                        data.totalPenalInterestDue = parseFloat(data['totalPenalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])){
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'totalDemandDue') && _.isString(data['totalDemandDue'])){
                        data.totalDemandDue = parseFloat(data['totalDemandDue']);
                    }
                    if (_.hasIn(data, 'payOffAndDueAmount') && _.isString(data['payOffAndDueAmount'])){
                        data.payOffAndDueAmount = parseFloat(data['payOffAndDueAmount']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])){
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'recoverableInterest') && _.isString(data['recoverableInterest'])){
                        data.recoverableInterest = parseFloat(data['recoverableInterest']);
                    }
                    if (_.hasIn(data, 'principalNotDue') && _.isString(data['principalNotDue'])){
                        data.principalNotDue = parseFloat(data['principalNotDue']);
                    }
                    if (_.hasIn(data, 'preclosureFee') && _.isString(data['preclosureFee'])){
                        data.preclosureFee = parseFloat(data['preclosureFee']);
                    }
                    if (_.hasIn(data, 'payOffAmount') && _.isString(data['payOffAmount'])){
                        data.payOffAmount = parseFloat(data['payOffAmount']);
                    }
                    if (_.hasIn(data, 'bookedNotDueNormalInterest') && _.isString(data['bookedNotDueNormalInterest'])){
                        data.bookedNotDueNormalInterest = parseFloat(data['bookedNotDueNormalInterest']);
                    }
                    if (_.hasIn(data, 'bookedNotDuePenalInterest') && _.isString(data['bookedNotDuePenalInterest'])){
                        data.bookedNotDuePenalInterest = parseFloat(data['bookedNotDuePenalInterest']);
                    }
                }

                return data;

            }

        },
        viewLoans: searchResource({
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/viewloans/:urn'
        }),
        repay:{
            method:'POST',
            url:endpoint +'/repay'
        },
        getGroupRepaymentDetails:{
            method:'GET',
            url:endpoint+'/grouprepayment/:partnerCode/:groupCode/:isLegacy',
            isArray:true
        },
        groupRepayment:{
            method:'POST',
            url:endpoint+'/grouprepayment'
        },
        writeOffQueue:searchResource({
            method:'GET',
            url:endpoint+'/findwriteoffList'
        }),
        writeOff:{
            method:'POST',
            url:endpoint+'/writeoff'
        },
        reversalSearch:{
            method:'POST',
            url:endpoint+'/findtransactionforreversal'
        },
        manualReversal:{
            method:'POST',
            url:endpoint+'/manualreversal'
        },
        "chargeFee": {
            "method": "POST",
            "url": endpoint + "/chargefee"
        }
    });
});

irf.models.factory('Groups',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/groups';
    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+"/:service/:action"
        },
        query:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        getDSCData:{
            method:'GET',
            url:BASE_URL+"/api/dsc/{id}"
        },
        getGroup:{
            method:'GET',
            url:endpoint+'/:groupId'
        },
        searchHeaders:{
            method:'HEAD',  //@TODO : Should be HEAD, waiting for Serverside fix
            url:endpoint+'/search',
            isArray:true
        },
        getSchema:{
            method:'GET',
            url:'process/schemas/groups.json'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/search'
        }),
        getDscOverrideList:searchResource({
            method:'GET',
            url:endpoint+"/dscoverridelist"
        }),
        getDscOverrideListHead:{
            method:'HEAD', //@TODO : Should be HEAD, waiting for Serverside fix
            url:endpoint+"/dscoverridelist",
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:action'

        },
        dscQuery:{
            method:'POST',
            url:endpoint+'/grouploandsc',
            isArray:true
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service/:action'
        },
        save:{
            method:'POST',
            url:endpoint+'/:service/:action'
        },
        getDisbursementDetails: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/groupdisbursement/:partnerCode/:groupCode',
            isArray: true

        }
    });
});

irf.models.factory('ACH', 
["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/ach';
        var endpintManagement = irf.MANAGEMENT_BASE_URL + '/server-ext/achdemandlist.php?';
        var endpintManagementACHPDC = irf.MANAGEMENT_BASE_URL + '/server-ext/achpdcdemandlist.php?';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */
        var resource = $resource(endpoint, null, {
            getSchema: {
                method: 'GET',
                url: 'process/schemas/ach.json'
            },
            create: {
                method: 'POST',
                url: endpoint + '/create'
            },
            search: searchResource({
                method: 'GET',
                url: endpoint + '/search'
                // transformResponse: function(data, headersGetter, status){
                //     var deferred = $q.defer();
                //     data = JSON.parse(data);
                //     if (status === 200){
                //         if (_.hasIn(data, 'maximumAmount') && _.isString(data['maximumAmount'])){
                //             data.maximumAmount = parseInt(data['maximumAmount']);
                //             alert(data.maximumAmount);
                //         }
                //     }
                //     return data;
                // }
            }),
            searchHead: {
                method: 'HEAD',
                url: endpoint + '/search',
                isArray: true
            },
            updateMandateStatus: {
                method: 'PUT',
                isArray:true,
                url: endpoint + '/statusupdate'
            },
            getDemandList: searchResource({
                method: 'GET',
                url: endpoint + '/achdemandList'
            }),
            bulkRepay:  searchResource({
                method: 'POST',
                url: endpoint + '/achbulkrepay'
            }),
            demandDownloadStatus: searchResource({
                method: 'GET',
                url: endpintManagement + "demandDate=:demandDate&branchId=:branchId"
            }),
            achpdcDemandDownload: searchResource({
                method: 'GET',
                url: endpintManagementACHPDC + "demandDate=:demandDate&branchId=:branchId"
            })
        });

        resource.achMandateUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/feed/achmandateupload",
                data: {
                    file: file
                }
            }).then(function(resp){
                // TODO handle success
                PageHelper.showProgress("page-init", "Done.", 2000);
                deferred.resolve(resp);
            }, function(errResp){
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        resource.achDemandListUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/feed/achreversefeedupload",
                data: {
                    file: file
                }
            }).then(function(resp){
                // TODO handle success
                PageHelper.showProgress("page-init", "Done.", 2000);
                deferred.resolve(resp);
            }, function(errResp){
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        return resource;
    }
]);
irf.models.factory('PDC', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/ach';
        var endpintManagement = irf.MANAGEMENT_BASE_URL + '/server-ext/pdcdemandlist.php?';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */

        var resource = $resource(endpoint, null, {
            getSchema: {
                method: 'GET',
                url: 'process/schemas/pdc.json'
            },
            create: {
                method: 'POST',
                url: endpoint + '/createpdcAccount '
            },
            getPDCCheque: searchResource({
                method: 'GET',
                url: endpoint + '/fetchpdcAccount'
            }),
            getSecurityCheque: searchResource({
                method: 'GET',
                url: endpoint + '/securitychequelist'
            }),
            search: searchResource({
                method: 'GET',
                url: endpoint + '/search'
            }),
            update: {
                method: 'PUT',
                url: endpoint + '/editpdcAccount'
            },
            find: {
                method: 'GET',
                url: endpoint + '/findAssignedpdc'
            },
            demandList: {
                method: 'GET',
                url: endpoint + '/pdcdemandList'
            },
            securitycheque: {
                method: 'GET',
                url: endpoint + '/securitychequelist'
            },
            getDemandList: {
                method: 'GET',
                isArray: true,
                url: endpoint + '/pdcdemandList'
            },
            bulkRepay: {
                method: 'POST',
                url: endpoint + '/pdcbulkrepay'
            },
            demandDownloadStatus: searchResource({
                method: 'GET',
                url: endpintManagement + "demandDate=:demandDate&branchId=:branchId"
            }),
            deleteSecurity: {
                method: 'POST',
                url: endpoint + '/deletepdc'
            }
        });

        resource.pdcReverseFeedListUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/feed/pdcreversefeedupload",
                data: {
                    file: file
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "Done.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        return resource;
    }
]);
irf.models.factory('LoanProducts',function($resource,$httpParamSerializer,BASE_URL,searchResource,$q){
    var endpoint = BASE_URL + '/api/loanproducts';


    var ret = $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        getProductData:{
            method:'GET',
            url:endpoint+'/:productCode'
        }

    });

    ret.getLoanPurpose = function(productCode){

        var deferred = $q.defer();
        
        ret.getProductData({productCode:productCode},function(response,headersGetter){
            console.warn(response);
            var result = {
                body:response.purposes,
                headers:headersGetter()
            };
            deferred.resolve(result);
        },function(resp){
            deferred.reject(resp);
        });

        return deferred.promise;

    };

    return ret;
});

irf.models.factory('IndividualLoan',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/individualLoan';
  

    return $resource(endpoint, null, {
        create:{
            method:'POST',
            url:endpoint
        },
        update:{
            method:'PUT',
            url:endpoint
        },
        close:{
            method:'PUT',
            url:endpoint+'/close'
        },
        getDefiniftion: {
            method: "GET",
            url: endpoint + '/definition'
        },
        disburse:{
            method:'PUT',
            url:endpoint+'/disburse'
        },
        batchDisburse:{
            method:'PUT',
            url:endpoint+'/batchDisbursement'
        },
        batchDisbursementConfirmation:{
            method:'POST',
            url:endpoint+'/batchDisbursementConfirmation'
        },
        multiTrancheDisbursement:{
            method:'GET',
            url:endpoint+'/disbursementProcess/:loanId'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/find'
        }),
        searchHead:{
            method:'HEAD',
            url:endpoint+'/find',
            isArray:true
        },
        searchDisbursement:searchResource({
            method:'GET',
            url:endpoint+'/findDisbursement'
        }),
        searchDisbursementHead:{
            method:'HEAD',
            url:endpoint+'/findDisbursement',
            isArray:true
        },
        getDisbursementList:{
            method:'GET',
            url:endpoint+'/getDisbursementList',
            isArray:true
        },
        getDocuments:{
            method:'GET',
            url:endpoint+'/getIndividualLoanDocuments'
        },  
        documentsHead:{
            method:'HEAD',
            url:endpoint+'/getIndividualLoanDocuments',
            isArray:true
        },
        updateDisbursement:{
            method:'PUT',
            url:endpoint+'/updateDisbursement'
        },       
         loadSingleLoanWithHistory:{
            method:'GET',
            url:endpoint+'/withhistory/:id'
        },
        get:{
            method:'GET',
            url:endpoint+'/:id',
            transformResponse: function(data, headersGetter, status){
                if (status === 200 && data){
                    data = JSON.parse(data);
                    if (!_.isUndefined(data.nominees) && !_.isNull(data.nominees) && _.isArray(data.nominees) && data.nominees.length>0){
                        for (var i=0;i<data.nominees.length; i++){
                            var n = data.nominees[i];
                            if (!_.isUndefined(n.nomineePincode)){
                                data.nominees[i].nomineePincode = parseInt(n.nomineePincode);
                            }
                        }
                    }
                }

                return data;

            }
        }
    });
}]);

irf.models.factory('ReferenceCode', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/_refs';

        var res = $resource(endpoint, null, {
            allClassifier: searchResource({
                method: 'GET',
                url: endpoint + '/referencecodes/classifiers'
            }),
            allCodes: searchResource({
                method: 'GET',
                url: BASE_URL + '/api/referencecodes'   
            }),
            
        });

        return res;
    }
]);
irf.models.factory('lead',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/lead';
    return $resource(endpoint, null, {
        getLeadSchema: {
            method: 'GET',
            url: 'process/schemas/LeadGeneration.json'
        },
       
    });
});

irf.models.factory('document',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/document';
    return $resource(endpoint, null, {
        getSchema: {
            method: 'GET',
            url: 'process/schemas/DocumentTracking.json'
        },
       
    });
});

irf.models.factory('BIReports', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.BI_BASE_URL;

    var res = $resource(endpoint, null, {
        reportList: {
            method: 'GET',
            url: endpoint + '/report_list.php',
            isArray: true
        }
    });

    return res;
});
irf.models.factory('Masters',function($resource,$httpParamSerializer, searchResource){
    var endpoint = irf.MANAGEMENT_BASE_URL + '/perdixService/index.php';

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint
        },
        query:searchResource({
            method:'GET',
            url:endpoint
        }),
        post:{
            method:'POST',
            url:endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        }
    });
});

irf.models.factory('RolesPages', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.MANAGEMENT_BASE_URL + "/user-management";

    var res = $resource(endpoint, null, {
        allRoles: searchResource({
            method: 'GET',
            url: endpoint + '/allRoles.php'
        }),
        allPages: searchResource({
            method: 'GET',
            url: endpoint + '/allPages.php'
        }),
        updateRolePageAccess: {
            method: 'PUT',
            url: endpoint + '/updateRolePageAccess.php'
        },
        updateRole: {
            method: 'PUT',
            url: endpoint + '/updateRole.php'
        },
        getPage: {
            method: 'GET',
            url: endpoint + '/getPage.php'
        },
        searchUsers: searchResource({
            method: 'GET',
            url: endpoint + '/findUsers.php'
        }),
        updateUserRole: {
            method: 'PUT',
            url: endpoint + '/updateUserRole.php'
        }
    });

    return res;
});