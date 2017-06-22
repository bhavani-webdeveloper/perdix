irf.models.factory('LoanAccount', function($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/loanaccounts';
    /*var endpintManagement = irf.MANAGEMENT_BASE_URL + '/server-ext/achdemandlist.php?';
    var endpintManagementACHPDC = irf.MANAGEMENT_BASE_URL + '/server-ext/achpdcdemandlist.php?';*/

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
        transactionDetails: {
            method: "GET",
            url: irf.BI_BASE_URL + "/transaction_details.php"
        },
        get: {
            method: 'GET',
            url: endpoint + '/show/:accountId',
            transformResponse: function(data, headersGetter, status) {
                if (status === 200 && data) {
                    data = JSON.parse(data);
                    if (_.hasIn(data, 'accountBalance') && _.isString(data['accountBalance'])) {
                        data.accountBalance = parseFloat(data['accountBalance']);
                    }
                    if (_.hasIn(data, 'totalPrincipalDue') && _.isString(data['totalPrincipalDue'])) {
                        data.totalPrincipalDue = parseFloat(data['totalPrincipalDue']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestDue') && _.isString(data['totalNormalInterestDue'])) {
                        data.totalNormalInterestDue = parseFloat(data['totalNormalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestDue') && _.isString(data['totalPenalInterestDue'])) {
                        data.totalPenalInterestDue = parseFloat(data['totalPenalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])) {
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'totalDemandDue') && _.isString(data['totalDemandDue'])) {
                        data.totalDemandDue = parseFloat(data['totalDemandDue']);
                    }
                    if (_.hasIn(data, 'payOffAndDueAmount') && _.isString(data['payOffAndDueAmount'])) {
                        data.payOffAndDueAmount = parseFloat(data['payOffAndDueAmount']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])) {
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'recoverableInterest') && _.isString(data['recoverableInterest'])) {
                        data.recoverableInterest = parseFloat(data['recoverableInterest']);
                    }
                    if (_.hasIn(data, 'principalNotDue') && _.isString(data['principalNotDue'])) {
                        data.principalNotDue = parseFloat(data['principalNotDue']);
                    }
                    if (_.hasIn(data, 'preclosureFee') && _.isString(data['preclosureFee'])) {
                        data.preclosureFee = parseFloat(data['preclosureFee']);
                    }
                    if (_.hasIn(data, 'payOffAmount') && _.isString(data['payOffAmount'])) {
                        data.payOffAmount = parseFloat(data['payOffAmount']);
                    }
                    if (_.hasIn(data, 'bookedNotDueNormalInterest') && _.isString(data['bookedNotDueNormalInterest'])) {
                        data.bookedNotDueNormalInterest = parseFloat(data['bookedNotDueNormalInterest']);
                    }
                    if (_.hasIn(data, 'bookedNotDuePenalInterest') && _.isString(data['bookedNotDuePenalInterest'])) {
                        data.bookedNotDuePenalInterest = parseFloat(data['bookedNotDuePenalInterest']);
                    }
                    if (_.hasIn(data, 'securityDeposit') && _.isString(data['securityDeposit'])) {
                        data.securityDeposit = parseFloat(data['securityDeposit']);
                    }
                    if (_.hasIn(data, 'equatedInstallment') && _.isString(data['equatedInstallment'])) {
                        data.equatedInstallment = parseFloat(data['equatedInstallment']);
                    }
                    if (_.hasIn(data, 'totalDisbursed') && _.isString(data['totalDisbursed'])) {
                        data.totalDisbursed = parseFloat(data['totalDisbursed']);
                    }
                    if (_.hasIn(data, 'disbursableAmount') && _.isString(data['disbursableAmount'])) {
                        data.disbursableAmount = parseFloat(data['disbursableAmount']);
                    }
                    if (_.hasIn(data, 'totalPrincipalRaised') && _.isString(data['totalPrincipalRaised'])) {
                        data.totalPrincipalRaised = parseFloat(data['totalPrincipalRaised']);
                    }
                    if (_.hasIn(data, 'totalPrincipalRepaid') && _.isString(data['totalPrincipalRepaid'])) {
                        data.totalPrincipalRepaid = parseFloat(data['totalPrincipalRepaid']);
                    }
                    if (_.hasIn(data, 'totalPrincipalDue') && _.isString(data['totalPrincipalDue'])) {
                        data.totalPrincipalDue = parseFloat(data['totalPrincipalDue']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestRaised') && _.isString(data['totalNormalInterestRaised'])) {
                        data.totalNormalInterestRaised = parseFloat(data['totalNormalInterestRaised']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestRepaid') && _.isString(data['totalNormalInterestRepaid'])) {
                        data.totalNormalInterestRepaid = parseFloat(data['totalNormalInterestRepaid']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestDue') && _.isString(data['totalNormalInterestDue'])) {
                        data.totalNormalInterestDue = parseFloat(data['totalNormalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestRaised') && _.isString(data['totalPenalInterestRaised'])) {
                        data.totalPenalInterestRaised = parseFloat(data['totalPenalInterestRaised']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestRepaid') && _.isString(data['totalPenalInterestRepaid'])) {
                        data.totalPenalInterestRepaid = parseFloat(data['totalPenalInterestRepaid']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestDue') && _.isString(data['totalPenalInterestDue'])) {
                        data.totalPenalInterestDue = parseFloat(data['totalPenalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalFeeRepaid') && _.isString(data['totalFeeRepaid'])) {
                        data.totalFeeRepaid = parseFloat(data['totalFeeRepaid']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])) {
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'totalDemandRaised') && _.isString(data['totalDemandRaised'])) {
                        data.totalDemandRaised = parseFloat(data['totalDemandRaised']);
                    }
                    if (_.hasIn(data, 'totalRepaid') && _.isString(data['totalRepaid'])) {
                        data.totalRepaid = parseFloat(data['totalRepaid']);
                    }
                    if (_.hasIn(data, 'totalDemandDue') && _.isString(data['totalDemandDue'])) {
                        data.totalDemandDue = parseFloat(data['totalDemandDue']);
                    }
                    if (_.hasIn(data, 'bookedNormalInterest') && _.isString(data['bookedNormalInterest'])) {
                        data.bookedNormalInterest = parseFloat(data['bookedNormalInterest']);
                    }
                    if (_.hasIn(data, 'bookedNotDueNormalInterest') && _.isString(data['bookedNotDueNormalInterest'])) {
                        data.bookedNotDueNormalInterest = parseFloat(data['bookedNotDueNormalInterest']);
                    }
                    if (_.hasIn(data, 'principalNotDue') && _.isString(data['principalNotDue'])) {
                        data.principalNotDue = parseFloat(data['principalNotDue']);
                    }
                    if (_.hasIn(data, 'preclosureFee') && _.isString(data['preclosureFee'])) {
                        data.preclosureFee = parseFloat(data['preclosureFee']);
                    }
                    if (_.hasIn(data, 'payOffAmount') && _.isString(data['payOffAmount'])) {
                        data.payOffAmount = parseFloat(data['payOffAmount']);
                    }
                    if (_.hasIn(data, 'payOffAndDueAmount') && _.isString(data['payOffAndDueAmount'])) {
                        data.payOffAndDueAmount = parseFloat(data['payOffAndDueAmount']);
                    }
                    if (_.hasIn(data, 'demandAdjustment') && _.isString(data['demandAdjustment'])) {
                        data.demandAdjustment = parseFloat(data['demandAdjustment']);
                    }
                    if (_.hasIn(data, 'securityDeposit') && _.isString(data['securityDeposit'])) {
                        data.securityDeposit = parseFloat(data['securityDeposit']);
                    }
                    if (_.hasIn(data, 'totalSecurityDepositDue') && _.isString(data['totalSecurityDepositDue'])) {
                        data.totalSecurityDepositDue = parseFloat(data['totalSecurityDepositDue']);
                    }

                }

                return data;

            }

        },
        viewLoans: searchResource({
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/viewloans/:urn'
        }),
        repay: {
            method: 'POST',
            url: endpoint + '/repay'
        },
        updateTenure: {
            method: 'POST',
            url: endpoint + '/loanamendment'
        },
        /* downloadNewTenure: searchResource({
                 method: 'GET',
                 url: endpintManagement + "demandDate=:demandDate&branchId=:branchId"
          }),*/
        getGroupRepaymentDetails: {
            method: 'GET',
            url: endpoint + '/grouprepayment/:partnerCode/:groupCode/:isLegacy',
            isArray: true
        },
        groupRepayment: {
            method: 'POST',
            url: endpoint + '/grouprepayment'
        },
        writeOffQueue: searchResource({
            method: 'GET',
            url: endpoint + '/findwriteoffList'
        }),
        writeOff: {
            method: 'POST',
            url: endpoint + '/writeoff'
        },
        reversalSearch: {
            method: 'POST',
            url: endpoint + '/findtransactionforreversal'
        },
        manualReversal: {
            method: 'POST',
            url: endpoint + '/manualreversal'
        },
        getTransactionForReversal: {
            method: 'GET',
            url: endpoint + '/gettransactionforreversal/:accountId'
        },
        manualReversalOfRepayments: {
            method: 'POST',
            url: endpoint + '/manualreversalofRepayments'
        },
        "chargeFee": {
            "method": "POST",
            "url": endpoint + "/chargefee"
        },
        getTransactionForReversalInLoms: {
            method: "GET",
            url: endpoint + "/findTransactionToReverseInLoMS"
        },
        reverseFromLOMS: {
            method: "POST",
            url: endpoint + "/reversalInLoMS"
        },
        freezeAccount: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/freeze/:accountId'
        }
    });
});