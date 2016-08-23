var config = require('./staging_config.js');

frisby.create('Check Login Returns 400 for Wrong Password')
    .post(config['base_url'] + "/oauth/token", {
        username: config['username'],
        password: config['password'] + 'asdfasdf',
        grant_type: 'password',
        scope: 'read write',
        client_secret: 'mySecretOAuthSecret',
        client_id: 'application'
    })
    .expectStatus(400)
    .toss();

frisby.create('Check Login Returns Token for Correct')
    .post(config['base_url'] + "/oauth/token", {
        username: config['username'],
        password: config['password'],
        grant_type: 'password',
        scope: 'read write',
        client_secret: 'mySecretOAuthSecret',
        client_id: 'application'
    })
    .expectStatus(200)
    .expectJSONTypes({
        access_token: String
    })
    .afterJSON(function(response){
        frisby.globalSetup({
            request: {
                headers: {
                    'Authorization': "Bearer " + response.access_token
                }
            }
        })
        /**
         * ------------------------------------------------------------
         * FURTHER TESTS HERE, OAUTH information will automatically go
         * ------------------------------------------------------------
         */

        frisby.create('Check Enrolment Definition exists')
            .get(config['base_url'] + "/api/enrollments/definition")
            .expectStatus(200)
            .expectJSONTypes({
                "stages": Object,
                "schema": Object,
                "schema.properties": Object
            })
            .toss()



    })
    .toss();
