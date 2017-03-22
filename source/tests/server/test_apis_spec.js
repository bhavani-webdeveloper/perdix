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
            })
            .expectJSONTypes('schema.properties', {
                "customerHealth": Object
            })
            .toss();

        frisby.create('Check Loan Booking Definition exists')
            .get(config['base_url'] + "/api/individualLoan/definition")
            .expectStatus(200)
            .expectJSONTypes({
                "stages": Object,
                "schema": Object,
            })
            .expectJSONTypes('schema.properties', {
                "customerHealth": Object
            })
            .toss();

        /**
         * LOAN BOOKING PROCESS SAVE API
         */
        frisby.create('Loan Booking Save with minimal input')
            .post(config['base_url'] + '/api/individualLoan', {
                    "loanAccount": {
                        "customerId": 328153,
                        "documentTracking": "Pending",
                        "guarantors": [],
                        "interestRate": 14,
                        "loanAmount": "100000",
                        "loanAmountRequested": "100000",
                        "loanApplicationDate": "2016-08-23",
                        "loanPurpose1": "Agriculture",
                        "loanPurpose2": "agricultural-cultivation",
                        "loanPurpose3": "agricultural-cultivation",
                        "partnerCode": "KGFS",
                        "productCode": "T515",
                        "urnNo": "1608233413702002",
                        "tenure": "12",
                        "isRestructure": false,
                        "numberOfDisbursements": 2,
                        "disbursementFromBankAccountNumber": "234234234",
                        "originalAccountNumber": "2234234",
                        "relation": "Relative",
                        "sanctionDate": "2016-08-25",
                        "husbandOrFatherMiddleName": "Sdfsfs",
                        "husbandOrFatherLastName": "asdfaf",
                        "husbandOrFatherFirstName": "SDFSFSDF",
                        "customerBankAccountNumber": "23423424",
                        "customerBankIfscCode": "SDF2343",
                        "accountUserDefinedFields": {
                            "accountNumber": null,
                            "id": 0,
                            "loanId": 0,
                            "userDefinedDateFieldValues": {},
                            "userDefinedFieldValues": {
                                "udf1": "12",
                                "udf2": "23",
                                "udf3": "234",
                                "udf4": "22",
                                "udf6": "2"
                            },
                            "version": 0
                        }
                    },
                    "loanProcessAction": "SAVE"
                }, {
                json: true
            })
            .expectStatus(200)
            .expectJSON({
                "loanProcessAction": "SAVE",
                "loanAccount": {
                    "currentStage": "LoanInitiation"
                }
            })
            .afterJSON(function(res){
                /** FURTHER PROCESS OF THE SAME LOAN ACCOUNT HERE **/
                var req = res;
                req.loanProcessAction = "PROCEED";
                req.loanAccount.loanAmountRequested = '10000';
                frisby.create('Loan Booking proceed to LoanBooking stage')
                    .put(config['base_url'] + '/api/individualLoan', req, {json: true})
                    .expectStatus(200)
                    .expectJSON({
                        "loanProcessAction": "PROCEED",
                        "loanAccount": {
                            "currentStage": "LoanBooking"
                        }
                    })
                    .afterJSON(function(res){
                        console.log(res);
                    })
                    .toss()
            })
            .toss();
    })
    .toss();
