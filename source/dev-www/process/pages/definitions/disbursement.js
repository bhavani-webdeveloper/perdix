irf.pageCollection.factory("Pages__DisbursementDemoPage",
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    var branch = SessionStore.getBranch();

    return {
        "id": "DemoPage",
        "type": "schema-form",
        "name": "DemoPage",
        "title": "Demo Page",
        "subTitle": "Demo Page secondary title",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"],
                item["customer"]["villageName"]
            ]
        },
        form: [{
    "type": "box",
    "title": "CUSTOMER_PROFILE", // sample label code
    "colClass": "col-sm-6", // col-sm-6 is default, optional
    "readonly": false, // default-false, optional, this & everything under items becomes readonly
    "items": [
        {
            "key": "customer.last_name",
            "title": "CUSTOMER_LASTNAME",
            "type": "text"
        },
        {
            "key": "customer.gender",
            "type": "radios",
        },
        {
            "key": "customer.miscellaneous.aalcoholConsumption",
            "type": "text"

        },
        {
         "key": "customer.physicalAssets",
          "type": "array",
          "items": [
              {
                key: "customer.physicalAssets[].address"
              },
              {
                key: "customer.physicalAssets[].nameOfOwnedAsset"
              }
          ]
      }


    ]
}],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            }
        }
    };
}]);
