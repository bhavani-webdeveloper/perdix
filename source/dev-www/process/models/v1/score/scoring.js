irf.models.factory('scoring',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource",
    function($resource,$httpParamSerializer,BASE_URL,searchResource){
        var endpoint = BASE_URL + '/api/score';
        return $resource(endpoint, null, {
            create:{
                method: 'POST',
                url:endpoint+ '/createScoreMaster'
            },
            searchScore:{
                method: 'GET',
                url:endpoint+ '/findScoreMaster',
                isArray: true
            },
            searchscoreParameter:{
                method: 'GET',
                url:endpoint+ '/findScoreParameterMaster',
                isArray:true
            },
            searchScoreCriteria:{
                method: 'GET',
                url:endpoint+'/findScoreCriteriaMaster',
                isArray:true
            },
            update:{
                method: 'PUT',
                url:endpoint+'/updateScoreMaster'
            }
        });
    }]);
    