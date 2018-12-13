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
            return irf.FORM_DOWNLOAD_URL+'?form_name='+opts.formName+'&recored_id='+opts.recordId;
        }
        return res;
    }
])