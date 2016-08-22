frisby = require('frisby');

var environments = {
    'uat': {
        'base_url': 'http://uatperdix.kgfs.co.in:8080/perdix-server',
        'username': 'tempmmmfro',
        'password': 'password@123'
    }
}

module.exports = environments['uat'];
