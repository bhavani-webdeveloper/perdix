irf.models.factory('GroupProcess', 
    function($log,$resource,$filter, $httpParamSerializer, BASE_URL, searchResource, $q, Queries, SessionStore) {
    var endpoint = BASE_URL + '/api/groupprocess';
    var resource =  $resource(endpoint, null, {
        search:searchResource({
            method:'GET',
            url:endpoint+'/search'
        }),
        getGroup:{
            method:'GET',
            url:endpoint+"/:groupId"
        },
        save: {
            method: 'POST',
            url: endpoint
        },
        updateGroup: {
            method: 'PUT',
            url: endpoint
        },
        DSCCheck: {
            method: 'POST',
            url: endpoint + '/grouploandsc',
            isArray:true
        },
        telecalling: {
            method: 'POST',
            url: endpoint + '/telecalling',
            isArray:true
        },
    });

    function PrinterConstants() {

    }
    
    PrinterConstants.FONT_LARGE_BOLD = 2;
    PrinterConstants.FONT_LARGE_NORMAL = 1;
    PrinterConstants.FONT_SMALL_NORMAL = 3;
    PrinterConstants.FONT_SMALL_BOLD = 4;

    function PrinterData() {
        this.lines = [];
    }

    PrinterData.prototype.getLineLength = function(font) {
        if (font == PrinterConstants.FONT_LARGE_BOLD || font == PrinterConstants.FONT_LARGE_NORMAL) {
            return 24;
        } else {
            return 42;
        }
    }

    PrinterData.prototype.addLine = function(text, opts) {
        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
        opts['center'] = _.has(opts, 'center') && _.isBoolean(opts['center']) ? opts['center'] : false;
        var obj = {
            "bFont": opts['font'],
            "text": text,
            "style": {
                "center": opts['center']
            }
        };
        this.lines.push(obj);
        return this;
    }

    PrinterData.prototype.addKeyValueLine = function(key, value, opts) {
        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
        var keyLength = parseInt(this.getLineLength(opts['font']) / 2) - 1;
        var line = _.padEnd(key, keyLength, ' ') + ': ' + value;
        var obj = {
            "bFont": opts['font'],
            "text": line,
            "style": {
                "center": false
            }
        };
        this.lines.push(obj);
        return this;
    }

    PrinterData.prototype.addStrRepeatingLine = function(str, opts) {
        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
        var lineLength = this.getLineLength(opts['font']);
        var line = _.padEnd("", lineLength, '-')
        var obj = {
            "bFont": opts['font'],
            "text": line,
            "style": {
                "center": false
            }
        };
        this.lines.push(obj);
        return this;
    }

    PrinterData.prototype.addLines = function(lines) {
        this.lines = this.lines.concat(lines);
    }

    PrinterData.prototype.getLines = function() {
        return this.lines;
    }

    resource.hasPartnerCodeAccess = function(partner){
        return (angular.isUndefined(partner) || partner == null) ? true : false;
    }

    resource.isCBCheckValid = function (model) {
        var deferred = $q.defer();
        var customerIdList = [];
        var validUrns = [];
        var urns = [], invalidUrns = [];
        for (var idx = 0; idx < model.group.jlgGroupMembers.length; idx++) {
            customerIdList.push(model.group.jlgGroupMembers[idx].customerId);
            urns.push(model.group.jlgGroupMembers[idx].urnNo);
        }
        if (SessionStore.getGlobalSetting('highmarkMandatory') == 'N') {
            deferred.resolve();
            return deferred.promise;
        }
        Queries.getLatestCBCheckDoneDateByCustomerIds(customerIdList).then(function(resp) {
            if(resp && resp.length > 0){
                for (var i = 0; i < resp.length; i++) {
                    if (moment().diff(moment(resp[i].created_at, SessionStore.getSystemDateFormat()), 'days') <= 
                        Number(SessionStore.getGlobalSetting('cerditBureauValidDays'))) {
                        validUrns.push(urns[customerIdList.indexOf(resp[i].customer_id)]);
                    }
                }

                if(validUrns.length === urns.length) {
                    deferred.resolve();
                } else {
                    invalidUrns = urns.filter(function(urn){  return (validUrns.indexOf(urn) == -1) })
                    deferred.reject({data: {error: "There is no valid CB check for following customers: " + invalidUrns.join(",")+ ". Please do CBCheck and try again." }});
                }
            } else {
                deferred.reject({data: {error: "There is no valid CB check for following customers: " + urns.join(",")+ ". Please do CBCheck and try again." }});
            }
        }, function(res) {
            if(res.data) {
                res.data.error = res.data.errorMsg;
            }
            deferred.reject(res);
        });
        return deferred.promise;
    }

    function formatAmount(amount) {
        if (typeof(amount) == "string") {
            amount = parseFloat(amount);
        }
        return $filter('currency')(amount, "Rs.", 2);
    }


    var getPrintReceipt = function(repaymentInfo, opts) {
        opts['duplicate'] = opts['duplicate'] || false;
        var pData = new PrinterData();
        if (opts['duplicate']) {
            pData.addLine('DUPLICATE', {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            });
        } else {
            pData.addLine('RECEIPT', {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            });
        }

        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        pData.addLine(opts['entity_name'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addLine(opts['branch'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            }).addLine("Date : " + curTimeStr, {
                'center': false,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            //.addLine("Customer ID : " + repaymentInfo['customerId'], {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
            .addLine("DISBURSEMENT", {
                'center': true,
                font: PrinterConstants.FONT_LARGE_BOLD
            })
            .addLine("", {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(repaymentInfo['partnerCode'] + "-" + repaymentInfo["productCode"], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addKeyValueLine("Branch Code", opts['branch_code'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer URN", repaymentInfo['customerId'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer Name", repaymentInfo['customerName'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Loan A/C No", repaymentInfo['accountNumber'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Transaction Type", repaymentInfo['transactionType'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Transaction ID", repaymentInfo['transactionID'], {
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Loan Amount", formatAmount(repaymentInfo['loanAmount']), {
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addKeyValueLine("Disbursed Amount", formatAmount(parseFloat(repaymentInfo['loanAmount']) - parseFloat(repaymentInfo['processingFee'])), {
                font: PrinterConstants.FONT_SMALL_BOLD
            })
            .addStrRepeatingLine("-", {
                font: PrinterConstants.FONT_LARGE_BOLD
            })
            .addLine(opts['company_name'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("CIN :" + opts['cin'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(opts['address1'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(opts['address2'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine(opts['address3'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("Website :" + opts['website'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("Helpline No :" + opts['helpline'], {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("", {})
            .addLine("", {})
            .addLine("Signature not required as this is an", {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            })
            .addLine("electronically generated receipt.", {
                'center': true,
                font: PrinterConstants.FONT_SMALL_NORMAL
            });

        return pData;
    }

    var getWebReceipt = function(repaymentInfo, opts) {
        $log.info(repaymentInfo);
        $log.info(opts);

        var mywindow = window.open('', 'my div', 'height=400,width=600');
        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<h3><b>' + "RECEIPT" + '</b></h3>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<h4><b>' + opts.entity_name + '</b></p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<h4><b>' + opts.branch + '</b></h4>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "Date:" + curTimeStr + '</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p><b>' + "DISBURSEMENT" + '</b></p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="text-align : center">' + '<p>' + repaymentInfo.partnerCode + repaymentInfo.productCode + '</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em;">' + '<p>' + "Branch Code :" + '<span style= "margin-left : 40px">' + opts.branch_code+ '</span>'+ '</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Customer Id :"  + '<span style= "margin-left : 44px">'+ repaymentInfo.customerId + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Customer URN :"  + '<span style= "margin-left : 28px">'+ repaymentInfo.customerURN + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Customer Name :" + '<span style= "margin-left : 28px">' + repaymentInfo.customerName + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Loan A/C No :"  + '<span style= "margin-left : 44px">'+ repaymentInfo.accountNumber + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Transaction Type :"  + '<span style= "margin-left : 27px">'+ repaymentInfo.transactionType + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Transaction ID :"  + '<span style= "margin-left : 37px">'+ repaymentInfo.transactionID + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Loan Amount :"  + '<span style= "margin-left : 45px">'+ repaymentInfo.loanAmount + '</span>'+'</p>' + '</div>' + '</html>');
        mywindow.document.write('</body>' + '<div style="font-size:17px;margin-left:11em">' + '<p>' + "Disbursed Amount :"  + '<span style= "margin-left : 26px">'+ repaymentInfo.disbursedamount + '</span>'+'</p>' + '</div>' + '</html>');
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


        mywindow.print();
        mywindow.close();
        return true;
    }

    resource.getLoanPrint = function(repaymentInfo, opts) {
        var isCordova = false;
        var repaymentInfo=repaymentInfo;
        var opts=opts;
        try {
            if (cordova) {
                var fullPrintData = new PrinterData();
                var pData = getPrintReceipt(repaymentInfo, opts);
                $log.info(pData);
                pData.addLine("", {});
                pData.addLine("", {});
                fullPrintData.addLines(pData.getLines());
                cordova.plugins.irfBluetooth.print(function() {
                    console.log("succc callback");
                }, function(err) {
                    console.error(err);
                    console.log("errr collback");
                }, fullPrintData.getLines());
            }
        } catch (err) {
            var webdata= getWebReceipt(repaymentInfo, opts);  
        }
    }
    
    return resource;
});