irf.models.factory("Misc",["$resource", "$httpParamSerializer", "BASE_URL","searchResource", "Upload", "$q", "PageHelper",
    function($resource,$httpParamSerializer,BASE_URL,searchResource,Upload,$q,PageHelper){
        
        var endpoint = BASE_URL + '/api/maintenance';
        var res = $resource(endpoint,null,{
            // Please add your api here :)
        })

        res.allFormsDownload = function(opts){
            if(!opts.type)
                return irf.MANAGEMENT_BASE_URL+ '/server-ext/allFormsDownload.php?forms_base_url='+irf.FORM_DOWNLOAD_URL+'&record_id='+opts.recordId;
            else
                return irf.MANAGEMENT_BASE_URL+ '/server-ext/allFormsDownload.php?forms_base_url='+irf.FORM_DOWNLOAD_URL+'&record_id='+opts.recordId+'&type='+opts.type;

        },
        res.formDownload = function(opts){
            return irf.FORM_DOWNLOAD_URL+'?form_name='+opts.formName+'&record_id='+opts.recordId;
        },
        res.formDownloadStatic = function(opts){
            if(opts.siteCode.toLowerCase() == "kgfs"){
                return "http://kgfsuat2.perdix.co.in:8080/perdix7/ims/coiPolicyDownloadReport.htm?idStr=349873&urnNoStr=1711286984417001"
            }
            else{
                return "http://sit.perdix.co.in:8080/sit_kgfs_perdix7/ims/coiPolicyDownloadReport.htm?idStr=349873&urnNoStr=1711286984417001"
            }
        }
        return res;
    }
])