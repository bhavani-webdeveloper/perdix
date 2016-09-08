irf.commons.factory('LoanBookingCommons', [ 'Queries',
    function(Queries){

        return {
            getDocsForProduct: function(productCode){
                return Queries.getLoanProductDocuments(productCode)
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
