    irf.models.factory('PDC',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        var endpoint = BASE_URL + '/api/ach';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */
        return $resource(endpoint, null, {
            getSchema:{
            method:'GET',
            url:'process/schemas/ach.json'
             },
            create:{
                method:'POST',
                url:endpoint+'/createpdcAccount '
            },
            get:{
                method:'GET',
                url:endpoint+'/fetchpdcAccount'
            },
            search: searchResource({
                    method: 'GET',
                    url: endpoint + '/search'
            }),
             update:{
                method:'POST',
                url:endpoint+'/editPDCAccount'           
            },
            find:{
                method:'GET',
                url:endpoint+'/findAssignedpdc'           
            },
            demandList:{
                method:'GET',
                url:endpoint+'/pdcdemandList'           
            },
            securitycheque:{
                method:'GET',
                url:endpoint+'/securitychequelist'           
            }
        });
    });
