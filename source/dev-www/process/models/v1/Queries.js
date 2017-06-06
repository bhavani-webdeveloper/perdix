irf.models.factory('Queries', [
    "$resource", "SysQueries", "$httpParamSerializer", "BASE_URL", "$q", "$log",
    function($resource, SysQueries, $httpParamSerializer, BASE_URL, $q, $log) {
        var endpoint = BASE_URL + '/api';

        var resource = $resource(endpoint, null, {
            query: {
                method: 'POST',
                url: endpoint + '/query'
            }
        });

        resource.getResult = function(id, params, limit, offset) {
            return resource.query({
                name: id
            }, {
                identifier: id,
                limit: limit || 0,
                offset: offset || 0,
                parameters: params
            }).$promise;
        };

        resource.getPagesDefinition = function(userId, skip_relogin) {
            var deferred = $q.defer();
            resource.query({
                identifier: 'userpages.list',
                limit: 0,
                offset: 0,
                parameters: {
                    user_id: userId
                },
                skip_relogin: skip_relogin || false
            }).$promise.then(function(records) {
                if (records && records.results) {
                    var def = {};
                    _.each(records.results, function(v, k) {
                        var d = {
                            "uri": v.uri,
                            "offline": v.offline,
                            "directAccess": v.directAccess,
                            "title": v.title,
                            "shortTitle": v.shortTitle,
                            "iconClass": v.iconClass,
                            "state": v.state,
                            "stateParams": {
                                "pageName": v.pageName,
                                "pageId": v.pageId
                            },
                            "config": v.pageConfig
                        };
                        if (v.addlParams) {
                            try {
                                var ap = JSON.parse(v.addlParams);
                                angular.extend(d.stateParams, ap);
                            } catch (e) {}
                        }
                        if (v.pageConfig) {
                            try {
                                var pc = JSON.parse(v.pageConfig);
                                d.config = pc;
                            } catch (e) {}
                        }
                        def[v.uri] = d;
                    });
                    deferred.resolve(def);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.searchPincodes = function(pincode, district, state) {
            var deferred = $q.defer();
            var request = {
                "pincode": pincode || '',
                "district": district || '',
                "state": state || ''
            };
            resource.getResult("pincode.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        var prepareTranslationJSON = function(arr, langCode) {
            var result = {};
            for (var i = arr.length - 1; i >= 0; i--) {
                result[arr[i].code] = arr[i][langCode];
            };
            return result;
        };
        var translationResult = [];
        var translationLangs = {};
        resource.downloadTranslations = function() {
            var deferred = $q.defer();
            resource.getResult("translations.list", {}).then(function(records) {
                if (records && records.results && records.results.length) {
                    translationResult = records.results;
                    deferred.resolve(translationResult);
                }
            }, deferred.reject);
            return deferred.promise;
        };
        resource.getTranslationJSON = function(translationResult, langCode) {
            if (!translationLangs[langCode] && translationResult && translationResult.length) {
                $log.info('all translation array avilable in memory for ' + langCode);
                translationLangs[langCode] = prepareTranslationJSON(translationResult, langCode);
            }
            return translationLangs[langCode];
        };

        resource.getAccountDetails = function(accountNumbers) {
            var deferred = $q.defer();
            var request = {
                "account_numbers": accountNumbers
            };
            resource.getResult("loanAccountIn.list", request, 1).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getLoanAccountByAccountNumber = function(accountNumber) {
            var deferred = $q.defer();
            resource.getResult('loanAccountsByAccountNumber', {
                accountNumber: accountNumber
            }).then(
                function(res) {
                    if (res && res.results && res.results.length && res.results.length > 0) {
                        deferred.resolve(res.results[0]);
                    } else {
                        deferred.reject(res);
                    }
                }, deferred.reject
            )
            return deferred.promise;
        }

        resource.getLoanProductDocuments = function(prodCode, process, stage) {
            var deferred = $q.defer();
            resource.getResult('loan_products.list', {
                product_code: prodCode,
                process: process,
                stage: stage
            }).then(
                function(res) {
                    if (res && res.results && res.results.length) {
                        deferred.resolve(res.results);
                    } else {
                        deferred.reject(res);
                    }
                },
                function(res) {
                    deferred.reject(res.data);
                }
            )
            return deferred.promise;
        }

        resource.getLoanProductDocumentsRejectReasons = function() {
            var deferred = $q.defer();
            resource.getResult('loan_doc_reject_reasons.list', {}).then(
                function(res) {
                    if (res && res.results && res.results.length) {
                        deferred.resolve(res.results);
                    } else {
                        deferred.reject(res);
                    }
                },
                function(res) {
                    deferred.reject(res.data);
                }
            )
            return deferred.promise;
        }

        resource.getGlobalSettings = function(name) {
            var deferred = $q.defer();
            resource.getResult('globalSettings.list', {
                name: name
            }).then(
                function(res) {
                    $log.info("checking checking");
                    $log.info(res);
                    if (res && res.results && res.results.length) {
                        deferred.resolve(res.results[0].value);
                    } else {
                        deferred.reject(res);
                    }
                },
                function(err) {
                    deferred.reject(err);
                }
            )
            return deferred.promise;
        }

        resource.getCustomerBankAccounts = function(customerId) {
            var deferred = $q.defer();
            var request = {
                "customer_id": customerId
            };
            resource.getResult("customerBankAccounts.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getBankAccounts = function() {
            var deferred = $q.defer();
            var request = {};
            resource.getResult("bankAccounts.list", request, 50).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getBankAccountsByPartner = function(partnerCode) {
            var deferred = $q.defer();
            request = {};
            request.partner_code = partnerCode || null;
            // opts = opts || {partner_code: ""};
            resource.getResult("bankAccountsByPartnerCode.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        /* If partner code is passed, the Bank accounts of corresponding Partners alone will returned, else 
           partner code is NOT PASSED then all the accounts eligible for LOAN REPAYMENT is returned.
         */
        resource.getBankAccountsByPartnerForLoanRepay = function(partnerCode) {
            var deferred = $q.defer();
            request = {};
            request.partner_code = (_.isNull(partnerCode) || _.isUndefined(partnerCode)) ? "%" : ("%" + partnerCode + "%");
            resource.getResult("LoanRepayBankAccountsByPartnerCode.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getBankAccountsByProduct = function(productCode, allowDisbursementAccounts, allowCollectionAccounts) {
            var deferred = $q.defer();
            request = {};
            request.product_code = productCode || null;
            request.allow_collection = [0, 1];
            request.allow_disbursement = [0, 1];
            if (allowCollectionAccounts == true) {
                request.allow_collection = [1];
            }
            if (allowDisbursementAccounts == true) {
                request.allow_disbursement = [1];
            }
            // opts = opts || {partner_code: ""};
            resource.getResult("bankAccountsByProductCode.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }


        resource.getLatestLoanRepayment = function(accountNumber) {
            var deferred = $q.defer();
            resource.getResult("latestLoanRepayments.list", {
                account_number: accountNumber
            }, 1).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getDepositList = function(depositUser) {
            var deferred = $q.defer();
            var request = {
                "deposit_user": depositUser
            };
            resource.getResult("depositstage.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getCustomerBasicDetails = function(filter) {
            var deferred = $q.defer();
            var request = {};
            request.urns = (_.hasIn(filter, 'urns') && filter.urns.length > 0) ? filter.urns : [""];
            request.ids = (_.hasIn(filter, 'ids') && filter.ids.length > 0) ? filter.ids : [""];
            resource.getResult("customerBasicDetails.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var buildOutputObj = {
                        urns: {},
                        ids: {}
                    };
                    for (var i = 0; i < records.results.length; i++) {
                        var currResult = records.results[i];
                        var reqUrn = null;
                        /* URN */
                        for (var j = 0; j < request.urns.length; j++) {
                            reqUrn = request.urns[j];
                            if (reqUrn == currResult.urn_no) {
                                buildOutputObj.urns[currResult.urn_no] = currResult;
                                break;
                            }
                        }

                        /* IDS */
                        for (var j = 0; j < request.ids.length; j++) {
                            reqUrn = request.ids[j];
                            if (reqUrn == currResult.id) {
                                buildOutputObj.ids[currResult.id] = currResult;
                                break;
                            }
                        }

                    }

                    deferred.resolve(buildOutputObj);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getCustomerBankDetails = function(filter) {
            var deferred = $q.defer();
            var request = filter;
            request.branchId = _.hasIn(filter, 'branchId') ? filter.branchId : '';
            request.mandate_status = _.hasIn(filter, 'mandate_status') && !_.isUndefined(filter.mandate_status) ? filter.mandate_status : '';
            request.accountNumber = _.hasIn(filter, 'accountNumber') && !_.isUndefined(filter.accountNumber) ? filter.accountNumber : '';
            var limit = _.hasIn(filter, 'per_page') ? filter.per_page : 20;
            var offset = _.hasIn(filter, 'page') ? (filter.page - 1) * limit : 0;
            resource.getResult("achregistrationloanaccount.list", request, limit, offset).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }

        resource.getLoanPurpose1 = function(product) {
            var deferred = $q.defer();
            resource.getResult("loanpurpose1.list", {
                "product": product
            }).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getLoanPurpose2 = function(product, purpose1) {
            var deferred = $q.defer();
            resource.getResult("loanpurpose2.list", {
                "product": product,
                "purpose1": purpose1
            }).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getCustomersBankAccounts = function(filter) {
            var deferred = $q.defer();
            var request = {};
            request.customer_urns = _.hasIn(filter, 'customer_urns') ? filter.customer_urns : [""];
            request.customer_ids = _.hasIn(filter, 'customer_ids') ? filter.customer_ids : [""];
            resource.getResult("customersBankAccounts.list", request, 20)
                .then(function(records) {
                    if (records && records.results) {
                        var result = {
                            headers: {
                                "x-total-count": records.results.length
                            },
                            body: records.results
                        };
                        deferred.resolve(result);
                    }
                }, deferred.reject);

            return deferred.promise;
        };

        resource.getLoanCustomerRelations = function(filter) {
            var deferred = $q.defer();
            var request = {};
            if (_.isUndefined(filter.accountNumber) || _.isNull(filter.accountNumber)) {
                return;
            }
            request.accountNumber = _.hasIn(filter, 'accountNumber') ? filter.accountNumber : null;
            resource.getResult("loanCustomerRelations.list", request, 20)
                .then(function(response) {
                    return deferred.resolve(response.results);
                }, deferred.reject);

            return deferred.promise;
        }

        resource.getLoanAccount = function(account_number, branch_id) {
            var deferred = $q.defer();
            resource.getResult('loanAccount.list', {
                account_number: account_number,
                branch_id: branch_id
            }).then(
                function(res) {
                    $log.info("checking checking");
                    $log.info(res);
                    if (res && res.results && res.results.length) {
                        deferred.resolve(res.results[0]);
                    } else {
                        deferred.reject(res);
                    }
                },
                function(err) {
                    deferred.reject(err);
                }
            )
            return deferred.promise;
        }

        resource.getCollectionBranchSets = function() {
            var deferred = $q.defer();
            var request = {};
            resource.getResult("collectionsBranchSet.list", request)
                .then(function(records) {
                    if (records && records.results) {
                        var result = {
                            headers: {
                                "x-total-count": records.results.length
                            },
                            body: records.results
                        };
                        deferred.resolve(result);
                    }
                }, deferred.reject);

            return deferred.promise;
        }

        resource.getUnApprovedPaymentsForAccount = function(accountNumber) {
            var deferred = $q.defer();
            var request = {
                'account_number': accountNumber
            };
            resource.getResult("unApprovedPaymentForAccount.list", request)
                .then(function(records) {
                    if (records && records.results) {
                        var result = {
                            headers: {
                                "x-total-count": records.results.length
                            },
                            body: records.results
                        };
                        deferred.resolve(result);
                    }
                }, deferred.reject);

            return deferred.promise;
        }

        resource.getAllLoanPurpose1 = function() {
            var deferred = $q.defer();
            var request = {};
            resource.getResult("Allloanpurpose1.list", request).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getAllLoanPurpose2 = function(purpose1) {
            var deferred = $q.defer();
            resource.getResult("Allloanpurpose2.list", {
                "purpose1": purpose1
            }).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getloanParameters = function(loanId, score) {
            var deferred = $q.defer();
            var request = {
                "loanId": loanId,
                "score": score
            };
            resource.getResult("loanParameters.list", request).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getQueryForScore1 = function(loanId) {
            var deferred = $q.defer();
            var request = {
                "loanId": loanId
            };
            resource.getResult("queryForScore1", request).then(function(records) {
                if (records && records.results && records.results.length > 0) {
                    deferred.resolve(records.results[0]);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getEnterpriseRelations = function(customerId) {
            var deferred = $q.defer();
            var request = {
                "customerId": customerId
            };
            resource.getResult("enterpriseRelations.list", request).then(function(records) {
                if (records && records.results && records.results.length > 0) {
                    deferred.resolve(records.results);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getloanMitigants = function(mitigant) {
            var deferred = $q.defer();
            resource.getResult("loanMitigants.list", {
                "mitigant": mitigant
            }).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getFamilyRelations = function(loanId) {
            var deferred = $q.defer();
            resource.getResult("familyMembers.list", {
                "loanId": loanId
            }).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        };

        resource.getCibilHighmarkMandatorySettings = function() {
            var deferred = $q.defer();
            resource.getResult("globalSettingsIn.list", {
                    "names": ["highmarkMandatory", "cibilMandatory"]
                })
                .then(function(records) {
                    if (records && records.results) {
                        var out = {};
                        _.forEach(records.results, function(row) {
                            out[row.name] = row.value;
                        })
                        out.highmarkMandatory = out.highmarkMandatory || 'Y';
                        out.cibilMandatory = out.cibilMandatory || 'Y';
                        deferred.resolve(out);
                    }
                }, deferred.reject)
            return deferred.promise;
        }


        resource.UserList = function(userId) {
            var deferred = $q.defer();
            request = {};
            request.userId = userId || null;
            resource.getResult("UserList.list", request, 10).then(function(records) {
                if (records && records.results) {
                    var result = {
                        headers: {
                            "x-total-count": records.results.length
                        },
                        body: records.results
                    };
                    deferred.resolve(result);
                }
            }, deferred.reject);
            return deferred.promise;
        }
        return resource;
    }
]);