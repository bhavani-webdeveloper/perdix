irf.models.factory('MutualFund', ["$resource","PrinterData", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper","$timeout",
    function($resource,PrinterData,$httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper,$timeout) {



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

        resource.getWebReceipt = function(repaymentInfo, opts) {
            var mywindow = window.open('', 'my div', 'height=400,width=600');
            var curTime = moment();
            var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<h3><b>' + "RECEIPT" + '</b></h3>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<h4><b>' + opts.entity_name + '</b></p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<h4><b>' + opts.branch + '</b></h4>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "Date:" + curTimeStr + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p><b>' + "ICICI Mutual Fund Deposit" + '</b></p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em;">' + '<p>' + "Branch Id :" + '<span style= "margin-left : 40px">' + repaymentInfo.branchId+ '</span>'+ '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Customer URN :"  + '<span style= "margin-left : 28px">'+ repaymentInfo.customerURN + '</span>'+'</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Customer Name :" + '<span style= "margin-left : 28px">' + repaymentInfo.customerName + '</span>'+'</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Folio Number:"  + '<span style= "margin-left : 44px">'+ repaymentInfo.folioNo + '</span>'+'</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Transaction Type :"  + '<span style= "margin-left : 27px">'+ repaymentInfo.transactionType + '</span>'+'</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Amount Paid :"  + '<span style= "margin-left : 45px">'+ repaymentInfo.repaymentAmount + '</span>'+'</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "------------------------" + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + opts.company_name + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "CIN :"+ opts.cin + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "Address :"+ opts.address1 + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + opts.address2 + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + opts.address3 + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "Website :"+ opts.website + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "HelpLine No"+ opts.helpline + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>'  + "" + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>'  + "" + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>'  + "Signature not required as this is an" + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>'  + "electronically generated receipt." + '</p>' + '</div>' + '</html>');
            mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>'  + "------------------------------------" + '</p>' + '</div>' + '</html>');
            $timeout(function() {
                mywindow.print();
            }, 0);
            $timeout(function() {
                mywindow.close();
            }, 0);
            return true;
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