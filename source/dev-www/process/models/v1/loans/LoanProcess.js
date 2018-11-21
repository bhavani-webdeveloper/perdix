irf.models.factory('LoanProcess',[
"$resource","$httpParamSerializer","BASE_URL","searchResource", "Upload", "$q", "PageHelper","PrinterData","Utils",
function($resource,$httpParamSerializer,BASE_URL,searchResource, Upload, $q, PageHelper,PrinterData,Utils){
    var endpoint = BASE_URL + '/api/loanaccounts';
    /*
    * GET /api/loanaccounts/reverse/{transactionId}/{transactionName} will translate into
    * {action:'reverse',param1:'<tid>',param2:'<tname>'}
    *
    * */

    var res = $resource(endpoint, null, {
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
        UnmarkNPA:{
            method:'POST',
            url:endpoint+'/unmarkNPA',
        },
        viewLoanaccount: searchResource({ 
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/urn/:urn'
        }),
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
            url:BASE_URL + '/api/scheduledemandlist',
            transformResponse: function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status === 200 && data){
                    var demandLength = data.length;
                    for (var i=0; i<demandLength; i++){
                        var demand = data[i];
                        if (_.hasIn(demand, 'amount1') && _.isString(demand['amount1'])){
                            demand.amount1 = parseFloat(demand['amount1']);
                        }

                        if (_.hasIn(demand, 'amount2') && _.isString(demand['amount2'])){
                            demand.amount2 = parseFloat(demand['amount2']);
                        }
                    }
                }

                var headers = headersGetter();
                var response = {
                    body: data,
                    headers: headers
                }
                return response;
            }
        }),/*
        bounceCollectionDemandHead: {
            method:'HEAD',
            url:BASE_URL + '/api/scheduledemandlist'
        },*/
        repaymentList:searchResource({
            method:'GET',
            url:endpoint+'/repaymentlist'
        }),
        disbursementList:searchResource({
            method:'GET',
            url:endpoint+'/groupdisbursement/:partnerCode/:groupCode'
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
        },
        findPreOpenSummary:{
            method:'GET',
            url:endpoint+'/findPreOpenSummary'
        }
    });

    res.getWebHeader = function(opts) {
        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        var printHtml=
        '<div style="border-style: dashed ; padding:27px">' + 
        '<div style="text-align : center">' + '<h4><b>' + "RECEIPT" + '</b></h4>' + '</div>' + 
        '<div style="text-align : center">' + '<h5><b>' + opts.entity_name + '</b></h4>' + '</div>' + 
        '<div style="text-align : center">' + '<h6><b>' + opts.branch + '</b></h6>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "Date:" + curTimeStr + '</p>' + '</div>' + 
        '<div style="text-align : center">' + '<p><b>' + "Loan Repayment" + '</b></p>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="font-size:13px; width:95%; margin:auto">' + '<p>' + "Branch Id :" +'<span style="border-bottom: 1px solid black; width: 100%;">'+  opts.customerBranchId+ '</span>' + '</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Centre Name:"  + '<span style="border-bottom: 1px solid black;">'+opts.centreName + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Group Name:"  + '<span style="border-bottom: 1px solid black;">'+opts.group_name + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Group Code:"  + '<span style="border-bottom: 1px solid black;">'+opts.group_code + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Demand Date:"  + '<span style="border-bottom: 1px solid black;">'+opts.demand_date + '</span>'+'</p>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<br>'+
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Total Amount To be Collected:"  + '<span style="border-bottom: 1px solid black;">'+opts.totalToBeCollected + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Total Amount Collected:"  + '<span style="border-bottom: 1px solid black;">'+opts.collected + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Total Amount Not Collected:"  + '<span style="border-bottom: 1px solid black;">'+opts.notcollected + '</span>'+'</p>' + '</div>' +
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<br>';
        return printHtml;
    };

    res.getWebReceipt = function(repaymentInfo) {
        var printHtml=  
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="font-size:13px; width:95%; margin:auto">' + '<p>' + "Customer Id :" +'<span style="border-bottom: 1px solid black; width: 100%;">'+  repaymentInfo.customerId+ '</span>' + '</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Customer Name :"  + '<span style="border-bottom: 1px solid black;">'+repaymentInfo.customerName + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Account Number :"  + '<span style="border-bottom: 1px solid black;">'+repaymentInfo.accountNumber + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Demand Amount:"  + '<span style="border-bottom: 1px solid black;">'+repaymentInfo.installmentAmount + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Amount Paid :"  + '<span style="border-bottom: 1px solid black;">'+repaymentInfo.amountPaid + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Total PayOff Amount :"  + '<span style="border-bottom: 1px solid black;">'+repaymentInfo.notcollected + '</span>'+'</p>' + '</div>' + 
        '<br>';
        return printHtml;
    };

    res.getWebFooter = function(opts) {
        var printHtml=
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="font-size:12px;">' + '<p>' + opts.company_name + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "CIN :"+ opts.cin + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "Address :"+ opts.address1 + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + opts.address2 + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + opts.address3 + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "Website :"+ '<a href='+ opts.website +' target="_blank">'+opts.website +'</a>'+ '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "HelpLine No"+ opts.helpline + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>'  + "" + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>'  + "" + '</p>' + '</div>' + 
        '<br>'+
        '<div style="font-size:12px;text-align : center">' + '<p>'  + "Signature not required as this is an" + '</p>' + '</div>' + 
        '<div style="font-size:12px;text-align : center">' + '<p>'  + "electronically generated receipt." + '</p>' + '</div>' + 
        '</div>';
        return printHtml;
    }

    res.getThermalHeader = function(opts) {
        PrinterData.lines=[];
        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
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
            .addLine("Loan Repayment", {
                'center': true,
                font: PrinterData.FONT_LARGE_BOLD
            })
            .addLine("", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Branch Id", opts['customerBranchId'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Centre Name", opts['centreName'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Group Name", opts['group_name'], {
                font: PrinterData.FONT_SMALL_NORMAL
            }).addKeyValueLine("Group Code", opts['group_code'], {
                font: PrinterData.FONT_SMALL_NORMAL
            }).addKeyValueLine("Demand Date", opts['demand_date'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Total Amount To be Collected", opts['totalToBeCollected'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Total Amount Collected", opts['collected'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Total Amount Not Collected", opts['notcollected'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("", {});
            return PrinterData;
    }

    res.getThermalFooter = function(opts,PData) {
        PData
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
            return PData;
    }

    res.getPrintReceipt = function(repaymentInfo,PData) {
        PData
        .addKeyValueLine("Customer Id", repaymentInfo['customerId'], {
                font: PrinterData.FONT_SMALL_NORMAL
            }).addKeyValueLine("Customer Name", repaymentInfo['customerName'], {
                font: PrinterData.FONT_SMALL_NORMAL
            }).addKeyValueLine("Account Number", repaymentInfo['accountNumber'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Demand Amount", repaymentInfo['installmentAmount'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Amount Paid", repaymentInfo['amountPaid'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Total PayOff Amount", repaymentInfo['notcollected'], {
                font: PrinterData.FONT_SMALL_NORMAL
            });
        
        return PData;
    };

    res.PrintReceipt= function(thermalReceipt,paperReceipt){
        if(thermalReceipt){
            thermalReceipt.getLines();
        }
        try {
            if (Utils.isCordova && thermalReceipt) {
                cordova.plugins.irfBluetooth.print(function() {
                    console.log("succc callback");
                }, function(err) {
                    console.error(err);
                    console.log("errr collback");
                }, thermalReceipt.getLines());
            } else if (paperReceipt) {
                var mywindow = window.open('', 'my div', 'height=400,width=600');
                mywindow.document.write(paperReceipt);
                mywindow.print();
                mywindow.close();
            } else {
                PageHelper.clearErrors();
                PageHelper.setError({message: 'No Data To Print'});
            }
        } catch (err) {
            console.log(err);
            $log.info("pringing web data");
        }

    }

    res.collectiondemandOfflineUpload = function(file, progress, opts) {
        var deferred = $q.defer();
        reqData = {
            "file": file
        };
        Upload.upload({
            url: endpoint + '/collectiondemand/offlineUpload',
            data: reqData
        }).then(function(resp){
            // TODO handle success
            console.log(resp);            
            deferred.resolve(resp);

        }, function(errResp){
            // TODO handle error
            PageHelper.showErrors(errResp);
            deferred.reject(errResp);
        }, progress);
        return deferred.promise;
    };



    return res;
}]);
