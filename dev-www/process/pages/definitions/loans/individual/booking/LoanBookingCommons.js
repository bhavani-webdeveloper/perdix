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
            }
        }
    }
])
