irf.models.factory('GroupProcess', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q, Queries, SessionStore) {
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

    return resource;
});