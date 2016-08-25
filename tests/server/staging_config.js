frisby = require('frisby');

var environments = {
    'uat': {
        'base_url': 'http://uatperdix.kgfs.co.in:8080/perdix-server',
        'username': 'tempmmmfro',
        'password': 'password@123'
    },
    'works2': {
        'base_url': 'http://works2.sen-sei.in:8080/perdix-server',
        'username': 'tempkanak',
        'password': 'password@123'
    }
}

module.exports = environments['works2'];
