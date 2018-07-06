irf.models.factory('SurveyInformation', function($resource, formHelper, BASE_URL, searchResource) {

    var endpoint = BASE_URL + '/api/survey';

    var surverJson = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "isMinimumFingerPrintRequired": 1,
        "properties": {
            "bank_survey": {
                "type": "object",
                "properties": {
                    "surveyDate": {
                        "type": ["string", "null"],
                        "title": "DATE",
                        "format": "date",
                        "readonly": true,
                        "required": true,
                    },
                    "surveyOfficerName":{
                        "type": ["string", "null"],
                        "title": "FSO_NAME",
                        readonly: true,
                        "required": true,
                    },
                    "branchId": {
                        "type": ["integer", "null"],
                        "title": "BRANCH_NAME",
                        "enumCode": "userbranches",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "surveyVillage": {
                        "type": ["string", "null"],
                        "required": true,
                        "title": "VILLAGE/SLUM"
                    },
                    "surveyBlock": {
                        "type": ["string", "null"],
                        "title": "BLOCK/WARD"
                    },
                    "population": {
                        "type": ["number", "null"],
                        "title": "POPULATION"
                    },
                    "region": {
                        "type": ["string", "null"],
                        "title": "REGION"
                    },
                    "household": {
                        "type": ["string", "null"],
                        "title": "HOUSEHOLD"
                    },
                    "areaType": {
                        "type": ["string", "null"],
                        "title": "AREA_TYPE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Rural",
                                "value": "Rural"
                            }, {
                                "name": "Market",
                                "value": "Market"
                            }, {
                                "name": "SubUrban",
                                "value": "SubUrban"
                            }, {
                                "name": "Urban",
                                "value": "Urban"
                            }]
                        }
                    },
                    "migration": {
                        "type": ["string", "null"],
                        "title": "MIGRATION",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "udf20": {
                        "type": ["number", "null"],
                        "title": "MIGRATED_POPULATION_PERCENT",
                        "x-schema-form": {
                            condition: "model.bank_survey.migration == 'Yes'",
                            "$validators": {
                                validVaue: function (value) {
                                    if(value < 0 || value > 100) {
                                            return false;
                                    }
                                    return true;
                                }
                            },
                            "validationMessage": {
                               "validVaue": "range is between 0 to 100"
                            }
                        },
                    },
                    "povertyLevel": {
                        "type": ["string", "null"],
                        "title": "POVERTY_LEVEL",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "25%",
                                "value": "25%"
                            }, {
                                "name": "50%",
                                "value": "50%"
                            }, {
                                "name": "75%",
                                "value": "75%"
                            }, {
                                "name": "100%",
                                "value": "100%"
                            }]
                        }
                    },
                    "communities": {
                        "type": ["string", "null"],
                        "title": "COMMUNITIES",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "SC",
                                "value": "SC"
                            }, {
                                "name": "ST",
                                "value": "ST"
                            }, {
                                "name": "General",
                                "value": "General"
                            }, {
                                "name": "Other",
                                "value": "Other"
                            }]
                        }
                    },
                    "udf15": {
                        "type": ["number", "null"],
                        "title": "SC_PERCENTAGE",
                        min: 0,
                        max: 100,
                        "x-schema-form": {
                            "onChange": function(modelValue, form, model) {
                                if (model.bank_survey.udf15 && model.bank_survey.udf16 && model.bank_survey.udf17)  {
                                   model.bank_survey.udf18 = 100 - (model.bank_survey.udf15 + model.bank_survey.udf16 + model.bank_survey.udf17)
                                }
                            },
                            "$validators": {
                                validVaue: function (value) {
                                    if(value < 0 || value > 100) {
                                            return false;
                                    }
                                    return true;
                                }
                            },
                            "validationMessage": {
                               "validVaue": "range is between 0 to 100"
                            }
                        },
                    },
                    "udf16": {
                        "type": ["number", "null"],
                        "title": "ST_PERCENTAGE",
                        min: 0,
                        max: 100,
                        "x-schema-form": {
                            "onChange": function(modelValue, form, model) {
                                if (model.bank_survey.udf15 && model.bank_survey.udf16 && model.bank_survey.udf17)  {
                                   model.bank_survey.udf18 = 100 - (model.bank_survey.udf15 + model.bank_survey.udf16 + model.bank_survey.udf17)
                                }
                            },
                            "$validators": {
                                validVaue: function (value) {
                                    if(value < 0 || value > 100) {
                                            return false;
                                    }
                                    return true;
                                }
                            },
                            "validationMessage": {
                               "validVaue": "range is between 0 to 100"
                            }
                        },
                    },
                    "udf17": {
                        "type": ["number", "null"],
                        "title": "GENERAL_PERCENTAGE",
                        min: 0,
                        max: 100,
                        "x-schema-form": {
                            "onChange": function(modelValue, form, model) {
                                if (model.bank_survey.udf15 && model.bank_survey.udf16 && model.bank_survey.udf17)  {
                                   model.bank_survey.udf18 = 100 - (model.bank_survey.udf15 + model.bank_survey.udf16 + model.bank_survey.udf17)
                                }
                            },
                            "$validators": {
                                validVaue: function (value) {
                                    if(value < 0 || value > 100) {
                                            return false;
                                    }
                                    return true;
                                }
                            },
                            "validationMessage": {
                               "validVaue": "range is between 0 to 100"
                            }
                        },
                    },
                    "udf18": {
                        "type": ["number", "null"],
                        "title": "OTHER_PERCENTAGE",
                        readonly: true,
                        min: 0,
                        max: 100,
                        "x-schema-form": {
                            "$validators": {
                                validVaue: function (value) {
                                    if(value < 0 || value > 100) {
                                            return false;
                                    }
                                    return true;
                                },
                            },
                            "validationMessage": {
                               "validVaue": "range is between 0 to 100"
                            }
                        },
                    },
                    "unit": {
                        "type": ["string", "null"],
                        "title": "UNIT(PROPOSED)"
                    },
                    "market": {
                        "type": ["string", "null"],
                        "title": "MARKET"
                    },
                    "main_road": {
                        "type": ["string", "null"],
                        "title": "MAIN_ROAD"
                    },
                    "block_hq": {
                        "type": ["string", "null"],
                        "title": "BLOCK_HQ/MUNICIPALITY_OFFICE"
                    },
                    "highway": {
                        "type": ["string", "null"],
                        "title": "HIGHWAY"
                    },
                    "bank_one": {
                        "type": ["string", "null"],
                        "title": "BANK"
                    },
                    "post_office": {
                        "type": ["string", "null"],
                        "title": "POST_OFFICE"
                    },
                    "school": {
                        "type": ["string", "null"],
                        "title": "SCHOOL(CLASS 10)"
                    },
                    "phc": {
                        "type": ["string", "null"],
                        "title": "PHC"
                    },
                    "qualified_doctor": {
                        "type": ["string", "null"],
                        "title": "QUALIFIED_DOCTOR"
                    },
                    "electricity": {
                        "type": ["string", "null"],
                        "title": "ELECTRICITY",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Always",
                                "value": "Always"
                            }, {
                                "name": "Regular",
                                "value": "Regular"
                            }, {
                                "name": "Rare",
                                "value": "Rare"
                            }, {
                                "name": "Never",
                                "value": "Never"
                            }]
                        }
                    },
                    "drinkingWater": {
                        "type": ["string", "null"],
                        "title": "DRINKING_WATER",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Easily",
                                "value": "Easily"
                            }, {
                                "name": "Available",
                                "value": "Available"
                            }, {
                                "name": "Difficult",
                                "value": "Difficult"
                            }, {
                                "name": "None",
                                "value": "None"
                            }]
                        }
                    },
                    "irrigationSource": {
                        "type": ["string", "null"],
                        "title": "IRRIGATION_SOURCE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Well",
                                "value": "Well"
                            }, {
                                "name": "River",
                                "value": "River"
                            }, {
                                "name": "Rain",
                                "value": "Rain"
                            }, {
                                "name": "Others",
                                "value": "Others"
                            }]
                        }
                    },
                    "roadQuality": {
                        "type": ["string", "null"],
                        "title": "ROAD_QUALITY",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "RCC",
                                "value": "RCC"
                            }, {
                                "name": "Tar",
                                "value": "Tar"
                            }, {
                                "name": "Kaccha",
                                "value": "Kaccha"
                            }]
                        }
                    },
                    "publicTransport": {
                        "type": ["string", "null"],
                        "title": "PUBLIC_TRANSPORT",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Bus",
                                "value": "Bus"
                            }, {
                                "name": "Jeep",
                                "value": "Jeep"
                            }, {
                                "name": "Others",
                                "value": "Others"
                            }]
                        }
                    },
                    "irrigationAvailable": {
                        "type": ["string", "null"],
                        "title": "IRRIGATION_AVAILABLE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }],
                        }
                    },
                    "udf19": {
                        "type": ["integer", "null"],
                        "title": "NUMBER_OF_MONTHS",
                        "x-schema-form": {
                            condition: "model.bank_survey.irrigationAvailable == 'Yes'",
                        },
                    },
                    "noOfKiranaShop": {
                        "type": ["number", "null"],
                        "title": "KINARA_SHOP",
                    },
                    "noOfTeaShops": {
                        "type": ["number", "null"],
                        "title": "TEA_SHOPS"
                    },
                    "noOfWell": {
                        "type": ["number", "null"],
                        "title": "WELL"
                    },
                    "noOfHandPumps": {
                        "type": ["number", "null"],
                        "title": "HAND_PUMPS"
                    },
                    "businessAtmosphere": {
                        "type": ["string", "null"],
                        "title": "BUSINESS_ATMOSPHERE_IN_LOCATION",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Good",
                                "value": "Good"
                            }, {
                                "name": "Ok",
                                "value": "Ok"
                            }, {
                                "name": "Poor",
                                "value": "Poor"
                            }]
                        }
                    },
                    "councillorName": {
                        "type": ["string", "null"],
                        "title": "SARPANCH/COUNCILLOR_NAME"
                    },
                    "workDone": {
                        "type": ["string", "null"],
                        "title": "WORK_DONE_BY_PANCHAYAT/MUNICIPALITY",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Panchayat",
                                "value": "Panchayat"
                            }, {
                                "name": "Municipality",
                                "value": "Municipality"
                            }, ]
                        }
                    },
                    "lawAndOrder": {
                        "type": ["string", "null"],
                        "title": "LAW_&_ORDER/CRIME",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Good",
                                "value": "Good"
                            }, {
                                "name": "Ok",
                                "value": "Ok"
                            }, {
                                "name": "Poor",
                                "value": "Poor"
                            }, {
                                "name": "None",
                                "value": "None"
                            }]
                        }
                    },
                    "socialRelation": {
                        "type": ["string", "null"],
                        "title": "SOCIAL_RELATION",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Good",
                                "value": "Good"
                            }, {
                                "name": "Ok",
                                "value": "Ok"
                            }, {
                                "name": "Poor",
                                "value": "Poor"
                            }, {
                                "name": "None",
                                "value": "None"
                            }]
                        }
                    },
                    "politicalClimate": {
                        "type": ["string", "null"],
                        "title": "POLITICAL_CLIMATE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Clean",
                                "value": "Clean"
                            }, {
                                "name": "Normal",
                                "value": "Normal"
                            }, {
                                "name": "Bad",
                                "value": "Bad"
                            }]
                        }

                    },
                    "surveyEconomicDetailsList": {
                        "type": "array",
                        "title": "ACTIVITY",
                        "items": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "economicActivity": {
                                    "type": ["string", "null"],
                                    "title": "ACTIVITY",
                                }
                            }
                        }
                    },
                     "surveyCreditSourceList": {
                        "type": "array",
                        "title": "SOURCE_OF_CREDIT_IN_THE_VILLAGE/SLUM",
                        "items": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "source": {
                                    "type": ["string", "null"],
                                    "title": "SOURCE",
                                    "x-schema-form": {
                                        "type": "select",
                                        "titleMap": [{
                                            "name": "Bank",
                                            "value": "Bank"
                                        }, {
                                            "name": "MFI",
                                            "value": "MFI"
                                        }, {
                                            "name": "MoneyLender",
                                            "value": "MoneyLender"
                                        }, {
                                            "name": "Wholesaler",
                                            "value": "Wholesaler"
                                        }]
                                    }
                                },
                                "instituteName": {
                                    "type": ["string", "null"],
                                    "required": true,
                                    "title": "INSTITUTE_NAME"
                                },
                                "sourcingDifficulty": {
                                    "type": ["string", "null"],
                                    "title": "DIFFICULTY_SOURCING",
                                    "x-schema-form": {
                                        "type": "select",
                                        "titleMap": [{
                                            "name": "High",
                                            "value": "High"
                                        }, {
                                            "name": "Medium",
                                            "value": "Medium"
                                        }, {
                                            "name": "Low",
                                            "value": "Low"
                                        }]
                                    }
                                },
                                 "minimumLoanSize": {
                                    "type": ["number", "null"],
                                    "title": "MINIMUM_LOAN_SIZE",
                                    "required": true,
                                    "x-schema-form": {
                                        "type": "number",
                                    }

                                },
                                "maximumLoanSize": {
                                    "type": ["number", "null"],
                                    "title": "MAXIMUM_LOAN_SIZE",
                                    "required": true,
                                    "x-schema-form": {
                                        "type": "number",
                                    }
                                },
                                "interestRate": {
                                    "type": ["number", "null"],
                                    "title": "INTEREST_RATES",
                                    "required": true,
                                    "x-schema-form": {
                                        "type": "number",
                                    }
                                },
                                "repaymentPeriod": {
                                    "type": ["number", "null"],
                                    "title": "REPAYMENT_PERIOD(MONTHS)",
                                    "required": true,
                                    "x-schema-form": {
                                        "type": "number",
                                    }
                                },
                                "repaymentFrequency": {
                                    "type": ["string", "null"],
                                    "title": "REPAYMENT_FREQUENCY",
                                    "x-schema-form": {
                                        "type": "select",
                                        "titleMap": [{
                                            "name": "Daily",
                                            "value": "Daily"
                                        }, {
                                            "name": "Weekly",
                                            "value": "Weekly"
                                        }, {
                                            "name": "Fortnightly",
                                            "value": "Fortnightly"
                                        }, {
                                            "name": "Monthly",
                                            "value": "Monthly"
                                        }, {
                                            "name": "Quarterly",
                                            "value": "Quarterly"
                                        }, {
                                            "name": "Yearly",
                                            "value": "Yearly"
                                        }]
                                    }
                                },
                                "collateral": {
                                    "type": ["string", "null"],
                                    "title": "COLLATERAL"
                                },
                                "pernaltyAction": {
                                    "type": ["string", "null"],
                                    "title": "PENALTY_ACTION"
                                },
                                "clientBase": {
                                    "type": ["string", "null"],
                                    "title": "CLIENT_BASE"
                                },
                                "operationSince": {
                                    "type": ["string", "null"],
                                    "title": "OPERATION_SINCE",
                                    "x-schema-form": {
                                        "type": "date",
                                    }
                                },
                            }
                        }
                    },
                    "udf1": {
                        "type": ["string", "null"],
                        "title": "ACTIVITY"
                    },
                    "udf3": {
                        "type": ["string", "null"],
                        "title": "SOURCE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Bank",
                                "value": "Bank"
                            }, {
                                "name": "MFI",
                                "value": "MFI"
                            }, {
                                "name": "MoneyLender",
                                "value": "MoneyLender"
                            }, {
                                "name": "Wholesaler",
                                "value": "Wholesaler"
                            }]
                        }
                    },
                    "udf4": {
                        "type": ["string", "null"],
                        "title": "INSTITUTE_NAME"
                    },
                    "udf5": {
                        "type": ["string", "null"],
                        "title": "DIFFICULTY_SOURCING",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "High",
                                "value": "High"
                            }, {
                                "name": "Medium",
                                "value": "Medium"
                            }, {
                                "name": "Low",
                                "value": "Low"
                            }]
                        }
                    },
                    "latitude": {
                        "type": ["string", "null"],
                        "title": "GEO_TAG",
                        "x-schema-form": {
                            "type": "geotag",
                            "latitude": "bank_survey.latitude",
                            "longitude": "bank_survey.longitude",
                        }
                    },
                    "longitude": {
                        "type": ["string", "null"],
                        "title": "LONGITUDE"
                    },
                    "udf6": {
                        "type": ["number", "null"],
                        "title": "MINIMUM_LOAN_SIZE",
                        "x-schema-form": {
                            "type": "number",
                        }

                    },
                    "udf7": {
                        "type": ["number", "null"],
                        "title": "MAXIMUM_LOAN_SIZE",
                        "x-schema-form": {
                            "type": "number",
                        }
                    },
                    "udf8": {
                        "type": ["number", "null"],
                        "title": "INTEREST_RATES",
                        "x-schema-form": {
                            "type": "number",
                        }
                    },
                    "udf9": {
                        "type": ["number", "null"],
                        "title": "REPAYMENT_PERIOD(MONTHS)",
                        "x-schema-form": {
                            "type": "number",
                        }
                    },
                    "udf10": {
                        "type": ["string", "null"],
                        "title": "REPAYMENT_FREQUENCY",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Daily",
                                "value": "Daily"
                            }, {
                                "name": "Weekly",
                                "value": "Weekly"
                            }, {
                                "name": "Fortnightly",
                                "value": "Fortnightly"
                            }, {
                                "name": "Monthly",
                                "value": "Monthly"
                            }, {
                                "name": "Quarterly",
                                "value": "Quarterly"
                            }, {
                                "name": "Yearly",
                                "value": "Yearly"
                            }]
                        }
                    },
                    "udf11": {
                        "type": ["string", "null"],
                        "title": "COLLATERAL"
                    },
                    "udf12": {
                        "type": ["string", "null"],
                        "title": "PENALTY_ACTION"
                    },
                    "udf13": {
                        "type": ["string", "null"],
                        "title": "CLIENT_BASE"
                    },
                    "udf14": {
                        "type": ["number", "null"],
                        "title": "OPERATION_SINCE",
                        "x-schema-form": {
                            "type": "number",
                        }
                    },
                    "bankAvailable": {
                        "type": ["string", "null"],
                        "title": "BANK",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "mfiAvailable": {
                        "type": ["string", "null"],
                        "title": "MFI",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "moneylenderAvailable": {
                        "type": ["string", "null"],
                        "title": "MONEY_LENDER",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "wholeSalerAvailable": {
                        "type": ["string", "null"],
                        "title": "WHOLE_SALER",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "postOfficeAvailable": {
                        "type": ["string", "null"],
                        "title": "POST_OFFICE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "microfinanceRequired": {
                        "type": ["string", "null"],
                        "title": "NEED_FOR_MICROFINANCE_IN_VILLAGE/SLUM",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Yes",
                                "value": "Yes"
                            }, {
                                "name": "No",
                                "value": "No"
                            }]
                        }
                    },
                    "noOfPotentialMember": {
                        "type": ["number", "null"],
                        "title": "POTENTIAL_#_MEMBER_IN_VILLAGE/SLUM"
                    },
                    "memberProfile": {
                        "type": ["string", "null"],
                        "title": "MEMBER_PROFILE",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "High",
                                "value": "High"
                            }, {
                                "name": "Medium",
                                "value": "Medium"
                            }, {
                                "name": "Low",
                                "value": "Low"
                            }]
                        }
                    },
                    "motivationRequired": {
                        "type": ["string", "null"],
                        "title": "MOTIVATION_REQUIRED",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "High",
                                "value": "High"
                            }, {
                                "name": "Medium",
                                "value": "Medium"
                            }, {
                                "name": "Low",
                                "value": "Low"
                            }]
                        }
                    },
                    "udf2": {
                        "type": ["string", "null"],
                        "title": "COMMENT",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "Positive",
                                "value": "Positive"
                            }, {
                                "name": "Nagative",
                                "value": "Nagative"
                            }]
                        }
                    },
                    "surveyContacts": {
                        "type": "array",
                        "title": "DETAILS_OF_PERSONS_CONTACTED",
                        "items": {
                            "type": "object",
                            "required": ["contactName", "mobileNo"],
                            "properties": {
                                "contactName": {
                                    "type": ["string", "null"],
                                    "title": "NAME",
                                    pattern: "^[a-zA-Z\. ]+$",
                                    validationMessage: {202 : "Only alphabets and space are allowed."}
                                },
                                "mobileNo": {
                                    "type": ["string", "null"],
                                    "title": "MOBILE_NUMBER",
                                    "maxLength": 10,
                                    "minLength": 10,
                                },
                            }
                        }
                    },
                    "surveyFacilityDistance": {
                        "type": "array",
                        "title": "SURVEY_FACILITY_DISTANCE",
                        "items": {
                            "type": "object",
                            "properties": {
                                "facilityName": {
                                    "type": ["string", "null"],
                                    "title": "NAME",
                                    "x-schema-form": {
                                        "type": "select",
                                        "titleMap": [{
                                            "name": "Market",
                                            "value": "Market"
                                        }, {
                                            "name": "Main Road",
                                            "value": "Main Road"
                                        }, {
                                            "name": "Highway",
                                            "value": "Highway"
                                        }, {
                                            "name": "Block HQ/Municipality Office",
                                            "value": "Block HQ/Municipality Office"
                                        }, {
                                            "name": "Bank",
                                            "value": "Bank"
                                        }, {
                                            "name": "Post Office",
                                            "value": "Post Office"
                                        }, {
                                            "name": "School(Class 10)",
                                            "value": "School(Class 10)"
                                        }, {
                                            "name": "PHC",
                                            "value": "PHC"
                                        }, {
                                            "name": "Qualified Doctor",
                                            "value": "Qualified Doctor"
                                        },]
                                    }
                                },
                                "facilityDistance": {
                                    "type": ["number", "null"],
                                    "title": "DISTANCE",
                                    "maximum": 50,
                                    "minimum": 0,
                                    "x-schema-form": {
                                        "type":"number"
                                    }
                                },
                            }
                        }
                    },
                    "geo_tag": {
                        "type": "geotag",
                        "title": "GEO_TAG"
                    }

                },
                "required": [
                    "surveyDate",
                    "surveyOfficerName",
                    "branchId",
                    "surveyVillage",
                    "areaType",
                    "migration",
                    "povertyLevel",
                    "communities",
                    "electricity",
                    "drinkingWater",
                    "irrigationSource",
                    "roadQuality",
                    "publicTransport",
                    "lawAndOrder",
                    "socialRelation",
                    "politicalClimate",
                    "microfinanceRequired",
                    "noOfPotentialMember",
                    "motivationRequired",
                    "udf2",
                   // "latitude",
                ]
            }
        },
        "required": [
            "date",
            "fso_name",
            "village",
            "electricity",
            "drinking_water",
            "irrigation_source",
            "raod_quality",
            "public_transport",
            "business_location",
            "sarpanch_councillor_name",
            "social_relation",
            "political_climate",
            "microfinance_village",
            "potential_village",
            "name",
            "contact"
        ]
    };
    var res = $resource(endpoint, null, {
        search: searchResource({
            method: 'GET',
            url: endpoint
        }),
        save: {
            method: 'POST',
            url: endpoint
        },
        update: {
            method: 'PUT',
            url: endpoint
        },
        get: {
            method: 'GET',
            url: endpoint + '/{id}'
        },
    });

    res.getSchema = function() {
        return surverJson;
    }

    return res;
});