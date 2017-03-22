irf.models.factory('Account',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/account';
    /*
     * :service can be {change_expired_password,change_password,reset_password}
     * :action can be {init,finish}
     *
     * POST and SAVE are eqvt
     *
     * eg:
     * /api/account/change_expired_password => {service:'change_expired_password'}
     * /api/account/reset_password/init => {service:'reset_password',action:'init'}
     *
     */

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint
        },
        query:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:action'

        },
        save:{
            method:'POST',
            url:endpoint+'/:service/:action'
        }
    });
});
