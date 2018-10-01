irf.models.factory('MutualFund', ["$resource","PrinterData", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource,PrinterData,$httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {



        var endpoint = BASE_URL + '/api/mutualFund';
        var camsendpoint = irf.CAMS_EKYC_INTEG_URL;
        var resource = $resource(endpoint, null, {

            createApplication: {
                method: 'POST',
                url: endpoint + '/application'
            },
            purchaseOrRedemption: {
                method: 'POST',
                url: endpoint + '/purchaseOrRedemption'
            },
            logRecords: {
                method: 'GET',
                url: endpoint + '/mutualFundFileExchangeLog',
                isArray: true
            },
            /*navFileUpload: {
            	method: 'POST',
            	url: endpoint+ '/navFileUpload'
            },*/
            download: {
                method: 'GET',
                url: endpoint + '/purchaseOrRedemptionForwardFeedDownload'

            },
            /*reverseFeedUpload: {
            	method: 'POST',
            	url: endpoint + '/reverseFeedUpload'
			
            },*/
            schemeDetails: {
                method: 'GET',
                url: endpoint + '/schemeMaster'

            },
            summary: {
                method: 'GET',
                url: endpoint + '/summary/:id',
                isArray: true
            },
            transaction: {
                method: 'GET',
                url: endpoint + '/transaction'
            },
            getFileId: {
                method: 'GET',
                url: endpoint + '/mutualFundFileExchangeLog',
                isArray: true
            },
            getMutualFundFileExchangeLog: searchResource({
                method: 'GET',
                url: endpoint + '/mutualFundFileExchangeLog'
            }),
            camsInteg: {
                method: 'POST',
                url: camsendpoint
            }

        });

        resource.navFileUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/mutualFund/navFileUpload",
                data: {
                    file: file
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        resource.getPrintReceipt = function(repaymentInfo, opts) {
            PrinterData.lines=[];
            opts['duplicate'] = opts['duplicate'] || false;
            if (opts['duplicate']) {
                PrinterData.addLine('DUPLICATE', {
                    'center': true,
                    font: PrinterData.FONT_SMALL_BOLD
                });
            } else {
                PrinterData.addLine('RECEIPT', {
                    'center': true,
                    font: PrinterData.FONT_SMALL_BOLD
                });
            }

           var curTime = moment();
            var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
            PrinterData.addLine(opts['entity_name'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_BOLD
                })
                .addLine(opts['branch'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                }).addLine("Date : " + curTimeStr, {
                    'center': false,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine("ICICI Mutual Fund Deposit", {
                    'center': true,
                    font: PrinterData.FONT_LARGE_BOLD
                })
                .addLine("", {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addKeyValueLine("Branch Id", repaymentInfo['branchId'], {
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addKeyValueLine("Customer Name", repaymentInfo['customerName'], {
                    font: PrinterData.FONT_SMALL_NORMAL
                }).addKeyValueLine("Folio Number", repaymentInfo['folioNo'], {
                    font: PrinterData.FONT_SMALL_NORMAL
                }).addKeyValueLine("Transaction Type", repaymentInfo['transactionType'], {
                    font: PrinterData.FONT_SMALL_NORMAL
                }).addKeyValueLine("Amount Paid", repaymentInfo['repaymentAmount'], {
                    font: PrinterData.FONT_SMALL_NORMAL
                });
            PrinterData
                .addStrRepeatingLine("-", {
                    font: PrinterData.FONT_LARGE_BOLD
                })
                .addLine(opts['company_name'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine("CIN :" + opts['cin'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine(opts['address1'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine(opts['address2'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine(opts['address3'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine("Website :" + opts['website'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine("Helpline No :" + opts['helpline'], {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine("", {})
                .addLine("", {})
                .addLine("Signature not required as this is an", {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                })
                .addLine("electronically generated receipt.", {
                    'center': true,
                    font: PrinterData.FONT_SMALL_NORMAL
                });
            return PrinterData;
        }

        resource.reverseFeedUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: endpoint + "/reverseFeedUpload",
                data: {
                    file: file
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        }

        return resource;
    }


]);