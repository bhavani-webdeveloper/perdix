irf.models.factory('FormsMaintenence',
    ["$resource", "$httpParamSerializer", "BASE_URL", "$q", "$filter", "searchResource",
        function ($resource, $httpParamSerializer, BASE_URL, $q, filter, searchResource) {
            var userManagementEndpoint = irf.MANAGEMENT_BASE_URL + '/server-ext';

            var resource = $resource(userManagementEndpoint, null, {
                search: searchResource({
                    method: "GET",
                    url: userManagementEndpoint + '/cruForms.php'
                }),
                update: {
                    method: 'PUT',
                    url: userManagementEndpoint + '/cruForms.php'
                },
                create: {
                    method: 'POST',
                    url: userManagementEndpoint + '/cruForms.php'
                },
            });

            return resource;
        }]);
