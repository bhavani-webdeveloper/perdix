irf.models.factory('ScoresMaintenance', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/score';
        var endpoint2= BASE_URL + '/api/individualLoan';

        var res = $resource(endpoint, null, {
            allCriteria: searchResource({
                method: 'GET',
                url: endpoint + '/findScoreCriteriaMaster'
            }),
            allParameterMaster : {
                method : 'GET',
                url : endpoint + '/findScoreParameterMaster',
                isArray:true
            },
            scoreCreate: searchResource({
                method: 'POST',
                url: endpoint + '/createScoreMaster',
            }),
            scoreUpdate: searchResource({
                method: 'PUT',
                url: endpoint + '/updateScoreMaster'
            }),
            scoreSearch: searchResource({
                method: 'GET',
                url: endpoint + '/findScoreMaster',
                isArray:true
            }),
            getScoresById: searchResource({
                method: 'GET',
                url: endpoint + '/getScoreMaster/' + '/:id'
            }),
            getScore: searchResource({
                method: 'GET',
                url:endpoint+ '/getScoreMaster/:id'
            }),
            getScoreParameter: searchResource({
                method: 'GET',
                url:endpoint+ '/getScoreParameterMaster/:id'
            }),
            getScoreCriteria: searchResource({
                method: 'GET',
                url:endpoint+'/getScoreCriteriaMaster/:id'
            }),
            getConfigurationJson:{
                method:'GET',
                url:'process/schemas/:name'
            }

        });
        return res;
    }
]);