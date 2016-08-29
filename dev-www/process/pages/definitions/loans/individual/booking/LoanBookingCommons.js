irf.commons.factory('LoanBookingCommons', [
    function(){

        return {
            getDocsForProduct: function(productCode){
                return [
                    {
                        docTitle: "Loan Application",
                        docCode: "LOANAPPLICATION",
                        formsKey: 'loan',
                        downloadRequired: false
                    },
                    {
                        docTitle: "Legal Agreements",
                        docCode: "LEGALAGREEMENTS",
                        formsKey: 'legal',
                        downloadRequired: false
                    },
                    {
                        docTitle: 'Legal Schedule',
                        docCode: 'LEGALSCHEDULE',
                        formsKey: 'legalSchedule',
                        downloadRequired: true
                    }
                ]
            },
            getDocumentDetails: function(docsForProduct, docCode){
                var i = 0;
                for (i=0;i <docsForProduct.length; i++){
                    if (docsForProduct[i].docCode == docCode){
                        return docsForProduct[i];
                    }
                }
                return null;
            }
        }
    }
])
