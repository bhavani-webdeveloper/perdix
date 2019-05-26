irf.commons.factory('LoanBookingCommons', [ 'Queries',
    function(Queries){

        return {
            getDocsForProduct: function(productCode,process,stage){
                return Queries.getLoanProductDocuments(productCode,process,stage)
            },
            getDocumentDetails: function(docsForProduct, docCode){
                var i = 0;
                for (i=0;i <docsForProduct.length; i++){
                    if (docsForProduct[i].document_code == docCode){
                        return docsForProduct[i];
                    }
                }
                return null;
            },
            getCentreCodeFromId: function(centreId, formHelper){
                var centres = formHelper.enum('centre');
                for (var i = 0; i< centres.data.length; i++){
                    var c = centres.data[i];
                    if (parseInt(c.code) == centreId){
                        //console.log(c);
                        return c.field5;
                    }
                }
            },
            getLoanAccountRelatedCustomersLegacy: function(loanAccount){
                var ids = [];
                var urns = [];
                if (loanAccount.customerId){
                    ids.push(loanAccount.customerId);
                }

                if (loanAccount.applicant){
                    urns.push(loanAccount.applicant);
                }

                if (loanAccount.coBorrowers && loanAccount.coBorrowers.length > 0) {
                    for (var i=0;i<loanAccount.coBorrowers.length; i++){
                        ids.push(loanAccount.coBorrowers[i].customerId);
                    }
                }

                if (loanAccount.portfolioInsuranceUrn){
                    urns.push(loanAccount.portfolioInsuranceUrn);
                }

                if (loanAccount.guarantors && loanAccount.guarantors.length > 0) {
                    for (var i=0;i<loanAccount.guarantors.length; i++){
                        ids.push(loanAccount.guarantors[i].guaCustomerId);
                    }

                }
                Queries.getCustomerBasicDetails({
                    urns: urns,
                    ids: ids
                }).then(
                    function (resQuery) {
                        if (_.hasIn(resQuery.ids, loanAccount.customerId))
                            loanAccount.entityName = resQuery.ids[loanAccount.customerId].first_name;
                        
                        if (_.hasIn(resQuery.urns, loanAccount.applicant))
                            loanAccount.applicantName = resQuery.urns[loanAccount.applicant].first_name;
                        
                        if (_.hasIn(resQuery.urns, loanAccount.portfolioInsuranceUrn))
                            loanAccount.portfolioInsuranceCustomerName = resQuery.urns[loanAccount.portfolioInsuranceUrn].first_name;
                        for (var i=0;i<loanAccount.coBorrowers.length; i++){
                            if (_.hasIn(resQuery.ids, loanAccount.coBorrowers[i].customerId))
                                loanAccount.coBorrowers[i].coBorrowerName = resQuery.ids[loanAccount.coBorrowers[i].customerId].first_name;
                        }
                        for (var i=0;i<loanAccount.guarantors.length; i++){
                            if (_.hasIn(resQuery.ids, loanAccount.guarantors[i].guaCustomerId))
                                loanAccount.guarantors[i].guaFirstName = resQuery.ids[loanAccount.guarantors[i].guaCustomerId].first_name;
                        }
                       
                        
                    },
                    function (errQuery) {
                    }
                );
            }
        }
    }
])
