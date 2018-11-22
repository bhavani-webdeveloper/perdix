irf.models.factory('ScoresMaintenance', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/score';
        var endpoint2= BASE_URL + '/api/individualLoan';

        var res = $resource(endpoint, null, {
            allCriteria: searchResource({
                method: 'GET',
                url: endpoint + '/findScoreCriteriaMaster'
            }),
            allParameterMaster : searchResource({
                method : 'GET',
                url : endpoint + '/findScoreParameterMaster'
            }),
            scoreCreate: searchResource({
                method: 'POST',
                url: endpoint + '/createScoreMaster'
            }),
            scoreUpdate: searchResource({
                method: 'PUT',
                url: endpoint + '/updateScoreMaster'
            }),
            scoreSearch: searchResource({
                method: 'GET',
                url: endpoint + '/findScoreMaster'
            }),
            getScoresById: searchResource({
                method: 'GET',
                url: endpoint + '/getScoreMaster/' + '/:id'
            })
        });
        return res;
    }
]);