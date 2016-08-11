#Creating a new Page

The following basic types of pages can be created by the framework:

    1. Dashboard
    2. Forms (for Create/View/Edit/Delete pages)
    3. Search and List (or Queues)


##The Page Definition - Forms

The Page definition, as the name suggests, defines the page.
It will contain the view, data and actions that will be available in the
page for the end-user. Hence, the creation of a new page in the framework
starts with writing the page definition.

A simple page definition is given below

```
irf.pageCollection.factory(irf.page("demo.Demo"),
["$log", "Enrollment", "SessionStore",
    function($log, Enrollment, SessionStore){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Demo Page",
            "subTitle": "Demo Page secondary title",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
            },
            form: [],
            schema: {

            },
            actions: {
                submit: function(model, form, formName){
                }
            }
        };
    }
]);


```

* Each page is an [AngularJS Factory Recipe](https://docs.angularjs.org/guide/providers).
* The Factory Name must be generated using `irf.page` function.
* If the page is defined inside the _pages/demo/Demo.js_, the page name generator must be
invoked as `irf.page("demo.Demo")`
* The demo page can be accessed by the url [http://localhost/perdix/ir-perdix-view/dev-www/#/Page/Engine/Demo](http://localhost/perdix/ir-perdix-view/dev-www/#/Page/Engine/Demo)
if you followed the [Installation Documentation](./Installation.md)
* The demo page definition can be located at `dev-www\process\pages\definitions\demo`
* The `initialize` function can be used to initialize the form values (eg: fetch data from server and prepopulate form model)
* `Schema` represents the data structure and `Form` is how and what data should be shown to the end-user
* `Schema` can be generated for a given set of data using [json-schema-generator](http://jsonschema.net/#/)
* More `form` and `schema` references can be found at
    - [JSON Schema](http://json-schema.org/)
    - [Angularjs Schema Forms](http://schemaform.io/)
    - [Schema Forms GitHub](https://github.com/json-schema-form/angular-schema-form/blob/master/docs/index.md)
    - [Examples](http://schemaform.io/examples/bootstrap-example.html)
* The above page definition with a form and schema will look as follows

 ```
 irf.pageCollection.factory("Pages__Demo",
 ["$log", "Enrollment", "SessionStore",
     function($log, Enrollment, SessionStore){

         var branch = SessionStore.getBranch();

         return {
             "type": "schema-form",
             "title": "Demo Page",
             "subTitle": "Demo Page secondary title",
             initialize: function (model, form, formCtrl) {
                 $log.info("Demo Customer Page got initialized");
             },
             form: [
                 {
                     "type":"box",
                     "title":"Details",
                     "items":[
                         "address.streetAddress",
                         {
                             key:"address.city",
                             type:"select",
                             titleMap:{
                                 "city_A":"City A",
                                 "city_B":"City B"
                             }

                         },
                         "phoneNumber"
                     ]
                 }

             ],
             schema: {
                 "$schema": "http://json-schema.org/draft-04/schema#",
                 "type": "object",
                 "properties": {
                     "address": {
                         "type": "object",
                         "title":"Address",
                         "properties": {
                             "streetAddress": {
                                 "type": "string",
                                 "title":"Street Address"
                             },
                             "city": {
                                 "type": "string",
                                 "title":"City"
                             }
                         },
                         "required": [
                             "streetAddress",
                             "city"
                         ]
                     },
                     "phoneNumber": {
                         "type": "array",
                         "title":"Phone Numbers",
                         "items": {
                             "type": "object",
                             "title":"Phone#",
                             "properties": {
                                 "location": {
                                     "type": "string",
                                     "title":"Location"
                                 },
                                 "code": {
                                     "type": "integer",
                                     "title":"Code"
                                 },
                                 "number":{
                                     "type":"integer",
                                     "title":"Number"
                                 }
                             },
                             "required": [
                                 "code",
                                 "number"
                             ]
                         }
                     }
                 },
                 "required": [
                     "address",
                     "phoneNumber"
                 ]
             },
             actions: {
                 submit: function(model, form, formName){
                 }
             }
         };
     }
 ]);

 ```
##The Page Definition - Search and List pages (or Queues)

Search and List pages are those pages where the user is required to input a set of filters
and upon hitting a Search button, a list of values are to be displayed

A sample search page definition will look like below

```

irf.pageCollection.factory("Pages__VillageSearch",
["$log", "formHelper", "Masters","$state", "SessionStore",
function($log, formHelper, Masters,$state, SessionStore){
	var branchId = SessionStore.getBranchId();
	return {
		"id": "VillageSearch",
		"type": "search-list",
		"name": "VillageSearch",
		"title": "VILLAGE_SEARCH",
		"subTitle": "",
		"uri":"Village Search",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Villages",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"name": {
						"title": "VILLAGE_NAME",
						"type": "string"
					}


				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Masters.query({
					'action':'listVillages',
					'branchId': branchId,
					'villageName': searchOptions.name
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 100;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count'];
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
                    $state.go("Page.Engine",{
                        pageName:"Management_VillageCRU",
                        pageId:item.id
                    });

				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.village_name,
						'PINCODE : ' + item.pincode,
						null
					]
				},
				getActions: function(){
					return [

					    {
                            name: "Menu Action 1",
                            desc: "",
                            fn: function(item, index){

                                alert("you chose action 1");

                            },
                            isApplicable: function(item, index){

                                return true;
                            }
                        },
                        {
                            name: "Menu Action 2",
                            desc: "",
                            fn: function(item, index){

                                alert("you chose action 2");

                            },
                            isApplicable: function(item, index){

                                return true;
                            }
                        }


					];
				}
			}


		}
	};
}]);


```
* Like the Form pages, the Search Pages are also Angular JS Factory recipe
* The `definition` parameter defines the Search Page Structure and actions
* The `searchForm` and `searchSchema` defines the filters that are to be applied for the search. These are similar to the `form` and `schema` on a normal form page
* The `getResultsPromise` method should return a *promise* which can be used for querying the server
* Read more about `promises` [here](https://docs.angularjs.org/api/ng/service/$q)
* The `paginationOptions` can be used to customize pagination, like the number of records to be displayed per page
* The `listOption` can be used to customize the list items

**getResultsPromise(searchOptions,pageOptions)**

 * The `searchOptions`will have the search parameters that user have entered on the search screens.
 * `searchOptions` hence can be used in the server query
 * `pageOptions` will have the options like the pagination


**listOptions**

* `getItems` function will have the response from server passed to it as a parameter. If some operation has to be performed
on the response from the server as a whole (eg: filter duplicates, exclude some results etc), these can be done here.

* `itemCallback` function will be invoked when an Item in the search result is clicked. Hence this can be used as
shown in the example for redirecting to another page with the clicked item as a parameter

* `getListItem` function will determine the displayed result for an item. A brief detailing of the search result
  can be done here by projecting the key data about the each result

* `getActions` function can be used to add additional actions other than the click. Users will be presented with a
contextual menu, and on click of these menu items, they can perform distinct actions. The function must return array of objects
(as in the example) and each object will correspond to one action

