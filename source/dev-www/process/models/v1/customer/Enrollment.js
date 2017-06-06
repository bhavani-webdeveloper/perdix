irf.models.factory('Enrollment', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) 
    {
        var endpoint = BASE_URL + '/api/enrollments';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */


        var resource = $resource(endpoint, null, {

            get: { 
                method: 'GET',
                url: endpoint + '/:service/:id'
            },
            query: {
                method: 'GET',
                url: endpoint + '/:service/:id',
                isArray: true
            },

            getSchema: {
                method: 'GET',
                url: 'process/schemas/profileInformation.json'
            },
            search: searchResource({
                method: 'GET',
                url: endpoint + '/'
            }),
            put: {
                method: 'PUT',
                url: endpoint + '/:service'
            },
            update: {
                method: 'PUT',
                url: endpoint + '/:service'
            },
            post: {
                method: 'POST',
                url: endpoint + '/:service/:format',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(data) {
                    return $httpParamSerializer(data);
                }
            },
            postWithFile: {
                method: 'POST',
                url: endpoint + '/:service/:format',
                headers: {
                    'Content-Type': 'undefined'
                },
                transformRequest: function(data) {
                    var fd = new FormData();
                    angular.forEach(data, function(value, key) {
                        fd.append(key, value);
                    });
                    return fd;
                }
            },
            save: {
                method: 'POST',
                url: endpoint
            },
            updateEnrollment: {
                method: 'PUT',
                url: endpoint,
                transformRequest: function(data) {
                    if (_.has(data, 'customer.expenditures') && _.isArray(data.customer.expenditures)){
                        for (var i = 0; i <  data.customer.expenditures.length; i++) {
                            if(data.customer.expenditures[i].expenditureSource == "Others"){
                                var tempExpenditureSource = data.customer.expenditures[i].expenditureSource + ">"+data.customer.expenditures[i].tempName;
                                var tempAnnualExpenses = data.customer.expenditures[i].annualExpenses;
                                var tempFrequency = data.customer.expenditures[i].frequency;
                                data.customer.expenditures[i] ={};
                                data.customer.expenditures[i].annualExpenses = tempAnnualExpenses;
                                data.customer.expenditures[i].expenditureSource = tempExpenditureSource;
                                data.customer.expenditures[i].frequency = tempFrequency;               
                            }
                        }    
                    }

                    return JSON.stringify(data);
                }
            },
            getCustomerById: {
                method: 'GET',
                url: endpoint + '/:id',
                transformResponse: function(data, headersGetter, status){
                    var response = JSON.parse(data);
                    if (status == 200) {
                        var customer = response;
                        if (_.has(customer, "expenditures") && _.isArray(customer.expenditures)){
                            for (var i = 0; i < customer.expenditures.length; i++) {
                                if(/Others/.test( customer.expenditures[i].expenditureSource)){
                                    var expendituresSplitArray = customer.expenditures[i].expenditureSource.split('>');
                                    if(expendituresSplitArray.length > 1 && expendituresSplitArray[0] =="Others"){
                                        customer.expenditures[i].expenditureSource = expendituresSplitArray[0];
                                        customer.expenditures[i].customExpenditureSource = expendituresSplitArray[1];
                                    }              
                                }
                            }
                        }
                    }
                    return response;
                }
            },
            getWithHistory: {
                method: 'GET',
                url: endpoint + '/withhistory/:id'
            }
        });

        resource.insuranceUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/feed/insuranceupload",
                
                data: {
                    file: file,
                    feedCategory:'CustomerIdFeed'
                }   
            }).then(function(resp) {
                PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };
        
        return resource;
    }
]);