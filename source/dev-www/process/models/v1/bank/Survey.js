irf.models.factory('Survey', function($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/enrollments';

    var surverJson = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "isMinimumFingerPrintRequired": 1,
        "properties": {
            "bank_survey": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": ["string", "null"],
                        "title": "DATE",
                        "format": "date",
                        "readonly": true
                    },
                    "branch_name": {
                        "type": ["integer", "null"],
                        "title": "BRANCH_NAME",
                        "enumCode": "branch_id",
                        "readonly": true,
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "fso_name": {
                        "type": ["string", "null"],
                        "title": "FSO_NAME"
                    },
                    "village": {
                        "type": ["string", "null"],
                        "title": "VILLAGE/SLUM"
                    },
                    "block": {
                        "type": ["string", "null"],
                        "title": "BLOCK/WARD"
                    },
                    "population": {
                        "type": ["string", "null"],
                        "title": "POPULATION"
                    },
                    "region": {
                        "type": ["string", "null"],
                        "title": "REGION"
                    },
                    "house_hold": {
                        "type": ["string", "null"],
                        "title": "HOUSEHOLD"
                    },
                    "area_type": {
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
                    "poverty_level": {
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
                    "drinking_water": {
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
                    "irrigation_source": {
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
                    "raod_quality": {
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
                    "public_transport": {
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
                    "irrigation_available": {
                        "type": ["string", "null"],
                        "title": "IRRIGATION_AVAILABLE"
                    },
                    "kinara_shop": {
                        "type": ["string", "null"],
                        "title": "KINARA_SHOP"
                    },
                    "tea_shops": {
                        "type": ["string", "null"],
                        "title": "TEA_SHOPS"
                    },
                    "well": {
                        "type": ["string", "null"],
                        "title": "WELL"
                    },
                    "hand_pumps": {
                        "type": ["string", "null"],
                        "title": "HAND_PUMPS"
                    },
                    "business_location": {
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
                    "sarpanch_councillor_name": {
                        "type": ["string", "null"],
                        "title": "SARPANCH/COUNCILLOR_NAME"
                    },
                    "workBy_panchayat": {
                        "type": ["string", "null"],
                        "title": "WORK_DONE_BY_PANCHAYAT/MUNICIPALITY"
                    },
                    "law_order": {
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
                    "social_relation": {
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
                    "political_climate": {
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
                    "activity": {
                        "type": ["string", "null"],
                        "title": "ACTIVITY"
                    },
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
                    "institute_name": {
                        "type": ["string", "null"],
                        "title": "INSTITUTE_NAME"
                    },
                    "difficult_source": {
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
                    "minimum_loan_size": {
                        "type": ["number", "null"],
                        "title": "MINIMUM_LOAN_SIZE"
                    },
                    "maximum_loan_size": {
                        "type": ["number", "null"],
                        "title": "MAXIMUM_LOAN_SIZE"
                    },
                    "interest_rates": {
                        "type": ["number", "null"],
                        "title": "INTEREST_RATES"
                    },
                    "repayment_period": {
                        "type": ["number", "null"],
                        "title": "REPAYMENT_PERIOD(MONTHS)"
                    },
                    "repayment_frequency": {
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
                    "penalty_action": {
                        "type": ["string", "null"],
                        "title": "PENALTY_ACTION"
                    },
                    "client_base": {
                        "type": ["string", "null"],
                        "title": "CLIENT_BASE"
                    },
                    "operation_since": {
                        "type": ["number", "null"],
                        "title": "OPERATION_SINCE"
                    },
                    "bank": {
                        "type": ["string", "null"],
                        "title": "BANK"
                    },
                    "mfi": {
                        "type": ["string", "null"],
                        "title": "MFI"
                    },
                    "money_leader": {
                        "type": ["string", "null"],
                        "title": "MONEY_LENDER"
                    },
                    "whole_saler": {
                        "type": ["string", "null"],
                        "title": "WHOLE_SALER"
                    },
                    "post_office1": {
                        "type": ["string", "null"],
                        "title": "POST_OFFICE"
                    },
                    "microfinance_village": {
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
                    "potential_village": {
                        "type": ["string", "null"],
                        "title": "POTENTIAL_#_MEMBER_IN_VILLAGE/SLUM"
                    },
                    "member_profile": {
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
                    "motivation_required": {
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
                    "comment": {
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
                    "name": {
                        "type": ["string", "null"],
                        "title": "NAME"
                    },
                    "contact": {
                        "type": ["string", "null"],
                        "title": "CONTACT"
                    },
                    "geo_tag": {
                        "type": "geotag",
                        "title": "GEO_TAG"
                    }

                }
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
            "geo_tag",
            "name",
            "contact"

        ]
    };
    var res = $resource(endpoint, null, {

    });

    res.getSchema = function() {
        return surverJson;
    }
    
    return res;
});