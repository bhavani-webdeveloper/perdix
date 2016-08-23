    irf.models.factory('ACHPDC',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        var endpoint = BASE_URL + '/api/ach';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */
        return $resource(endpoint, null, {

            create:{
                method:'POST',
                url:endpoint+'/create'
            },

            search: searchResource({
                    method: 'GET',
                    url: endpoint + '/search'
            }),
            searchHead:{
                method:'HEAD',
                url: endpoint + '/search',
                 isArray:true
            },
             update:{
                method:'PUT',
                url:endpoint+'/update'           
            }
        });
    });
