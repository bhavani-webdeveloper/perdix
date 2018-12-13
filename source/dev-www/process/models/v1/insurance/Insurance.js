irf.models.factory('Insurance',[
"$resource","$httpParamSerializer","BASE_URL","searchResource", "Upload", "$q", "PageHelper","PrinterData","Utils",
function($resource,$httpParamSerializer,BASE_URL,searchResource, Upload, $q, PageHelper,PrinterData,Utils){
    var endpoint = BASE_URL + '/api/';    
   
   

    /*
     * $get : /api/enrollments/{blank/withhistory/...}/{id}
     *  eg: /enrollments/definitions -> $get({service:'definition'})
     *      /enrollments/1           -> $get({id:1})
     * $post will send data as form data, save will send it as request payload
     */
    var res = $resource(endpoint, null, {
        getSchema:{
            method:'GET',
            url:'process/schemas/insuranceInformation.json'
        },
       getById: {
        method: 'GET',
        url: endpoint+'getInsurancePolicyDetails'+'/:id'

       },
       create:{
        method:'POST',
        url: endpoint+'insurancePolicy'
       },
       getPremiumAmount:{
        method : 'GET',
        url:endpoint+'fetchInsurancePremiumDetails',
        isArray : true
       },
       getInsuranceRecommendation:{
        method : 'GET',
        url:endpoint+'getInsuranceRecommendation'
       },
       search: searchResource({
            method: 'GET',
            url: endpoint + 'findInsurancePolicyDetails'
       })
 });

    
        res.getWebHeader = function(opts) {
        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        var printHtml=
        '<div style="border-style: dashed ; padding:27px">' + 
        '<div style="text-align : center">' + '<h4><b>' + "RECEIPT" + '</b></h4>' + '</div>' + 
        '<div style="text-align : center">' + '<h5><b>' + opts.entityName + '</b></h4>' + '</div>' + 
        '<div style="text-align : center">' + '<h6><b>' + opts.branchId + '</b></h6>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "Date:" + curTimeStr + '</p>' + '</div>' + 
        '<div style="text-align : center">' + '<p><b>' + "Insurance Registration" + '</b></p>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="font-size:13px; width:95%; margin:auto">' + '<p>' + "Branch Id :" +'<span style="border-bottom: 1px solid black; width: 100%;">'+  opts.branchId+ '</span>' + '</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Centre Id:"  + '<span style="border-bottom: 1px solid black;">'+opts.centreId + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Customer Urn:"  + '<span style="border-bottom: 1px solid black;">'+opts.urnNo + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Beneficiary Name:"  + '<span style="border-bottom: 1px solid black;">'+opts.benificieryName + '</span>'+'</p>' + '</div>' + 
       
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<br>'+
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Sum Insured:"  + '<span style="border-bottom: 1px solid black;">'+opts.sumInsured + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Total Premium Collected:"  + '<span style="border-bottom: 1px solid black;">'+opts.premiumCollected + '</span>'+'</p>' + '</div>' + 
       
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
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
    };

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

        PrinterData.addLine(opts['entityName'], {
                'center': true,
                font: PrinterData.FONT_SMALL_BOLD
            })
            .addLine(opts['branchId'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            }).addLine("Date : " + curTimeStr, {
                'center': false,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("Insurance Registration", {
                'center': true,
                font: PrinterData.FONT_LARGE_BOLD
            })
            .addLine("", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Branch Id", opts['branchId'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Centre Id", opts['centreId'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer Urn", opts['urnNo'], {
                font: PrinterData.FONT_SMALL_NORMAL
            }).addKeyValueLine("Beneficiary", opts['benificieryName'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Sum Insured:", opts['sumInsured'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Total Premium Collected", opts['premiumCollected'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
           
            .addLine("", {});
            return PrinterData;
    };

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
    };
    return res;



}]);


