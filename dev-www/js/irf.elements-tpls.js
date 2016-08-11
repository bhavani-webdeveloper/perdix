//HEAD 
(function(app) {
try { app = angular.module("irf.elements.tpls"); }
catch(err) { app = angular.module("irf.elements.tpls", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("irf/template/adminlte/actions.html","<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <label class=\"col-sm-4 hidden-xs control-label\"></label>\n" +
    "    <div class=\"col-sm-8\">\n" +
    "        <div class=\"btn-group schema-form-actions {{form.htmlClass}}\">\n" +
    "            <input ng-repeat-start=\"item in form.items\"\n" +
    "                   type=\"submit\"\n" +
    "                   class=\"btn btn-sm {{ item.style || 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                   value=\"{{item.title}}\"\n" +
    "                   ng-if=\"item.type === 'submit'\">\n" +
    "            <button ng-repeat-end\n" +
    "                    class=\"btn btn-sm {{ item.style || 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                    type=\"button\"\n" +
    "                    ng-disabled=\"form.readonly\"\n" +
    "                    ng-if=\"item.type !== 'submit'\"\n" +
    "                    ng-click=\"buttonClick($event,item)\"><span ng-if=\"item.icon\" class=\"{{item.icon}}\"></span>{{item.title}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/array.html","<div class=\"box-body form-horizontal array-box\" sf-field-model=\"sf-new-array\" sf-new-array=\"$$value$$\">\n" +
    "  <div schema-form-array-items sf-field-model=\"ng-repeat\" ng-repeat=\"item in $$value$$ track by $index\" class=\"array-box-theme\" ng-class=\"{'array-box-last':$last}\">\n" +
    "    <h4 class=\"box-title box-title-theme\">\n" +
    "      <span class=\"text\">{{:: ($first ? \"\" : ($index + 1) + \". \") + form.title }}</span>\n" +
    "      <span class=\"pull-right\" style=\"margin-right:0;margin-top:1px\">\n" +
    "        <span class=\"controls\" style=\"padding:0 0 0 7px;\">\n" +
    "          <a ng-click=\"deleteFromArray($index)\"><i class=\"fa fa-close\"></i></a>\n" +
    "        </span>\n" +
    "      </span>\n" +
    "    </h4>\n" +
    "    <sf-decorator ng-init=\"arrayIndex = $index; copyWithIndex($index).notitle = true;\" form=\"copyWithIndex($index)\" class=\"ng-scope\"></sf-decorator>\n" +
    "  </div>\n" +
    "  <button ng-hide=\"form.readonly || form.add === null\" ng-click=\"appendToArray()\"\n" +
    "          ng-disabled=\"form.schema.maxItems <= modelArray.length\" type=\"button\"\n" +
    "          class=\"btn btn-sm btn-theme {{ form.style.add || 'btn-default' }} pull-right array-add-btn\">\n" +
    "      <i class=\"glyphicon glyphicon-plus\"></i>\n" +
    "      {{ \"Add \" + form.title }}\n" +
    "    </button>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/box.html","<div class=\"col-md-6\">\n" +
    "  <div class=\"box box-theme\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">{{form.title}}</h3>\n" +
    "        <div class=\"box-tools pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"box-body form-horizontal\">\n" +
    "        <sf-decorator ng-repeat=\"item in form.items\" form=\"item\" class=\"ng-scope\"></sf-decorator>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/button.html","<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <label class=\"col-sm-4 hidden-xs control-label\"></label>\n" +
    "    <div class=\"col-sm-8\">\n" +
    "        <input type=\"submit\"\n" +
    "               class=\"btn btn-sm {{ form.style || 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "               value=\"{{form.title}}\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               ng-if=\"form.type === 'submit'\">\n" +
    "        <button class=\"btn btn-sm {{ form.style || 'btn-theme' }}\"\n" +
    "                type=\"button\"\n" +
    "                ng-click=\"buttonClick($event,form)\"\n" +
    "                ng-disabled=\"form.readonly\"\n" +
    "                ng-if=\"form.type !== 'submit'\">\n" +
    "            <span ng-if=\"form.icon\" class=\"{{form.icon}}\"></span>\n" +
    "            {{form.title}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/input-aadhar.html","<div class=\"form-group\" ng-form name=\"SingleInputForm\">\n" +
    "	<label for=\"{{:: id }}\" class=\"col-sm-4 control-label\">{{:: form.title }}</label>\n" +
    "	<div class=\"col-sm-8\">\n" +
    "		<input sf-field-model schema-validate=\"form\" type=\"text\" class=\"form-control\" placeholder=\"{{:: form.title }}\" />\n" +
    "\n" +
    "		<button irf-aadhar irf-aadhar-fieldmap=\"form.aadharFieldMap\" irf-aadhar-model=\"model\" type=\"button\" class=\"btn btn-theme btn-xs\" style=\"position:absolute;top:6px;right:22px\">&nbsp;Scan&nbsp;</button>\n" +
    "\n" +
    "	</div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/input-file-directive.html","<div>\n" +
    "<irf-input-file definition=\"form\" model=\"model\"></irf-input-file>\n" +
    "\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/input-file.html","<div class=\"form-group\">\n" +
    "\n" +
    "  <label for=\"{{::id}}\" class=\"col-sm-4 control-label\">{{:: label }}</label>\n" +
    "  <div class=\"col-sm-8\">\n" +
    "    <div class=\"form-control\" ng-style=\"isImage ? {height:'inherit'}:{}\" style=\"position:relative;\">\n" +
    "      <div ng-if=\"isImage\" class=\"row\" style=\"padding-bottom:7px;\">\n" +
    "        <div class=\"col-xs-12\" style=\"text-align:center;height:200px;overflow:hidden\">\n" +
    "          <img ng-if=\"inputFileName\" ng-src=\"{{ inputImageDataURL }}\" src=\"\" height=\"200\" style=\"height:200px;max-width:100%\" />\n" +
    "          <div ng-if=\"!inputFileName\" style=\"position: relative; top: 50%; transform: translateY(-50%);\">\n" +
    "            <div style=\"position:absolute;left:50%;top:-75px;\">\n" +
    "              <svg style=\"position:relative;left:-45%;width:140px;height:140px;lady\" viewBox=\"0 0 50 50\"><rect fill=\"none\" height=\"50\" width=\"50\"/><path style=\"fill:#ededed;\" d=\"M30.933,32.528c-0.026-0.287-0.045-0.748-0.06-1.226c4.345-0.445,7.393-1.487,7.393-2.701  c-0.012-0.002-0.011-0.05-0.011-0.07c-3.248-2.927,2.816-23.728-8.473-23.306c-0.709-0.6-1.95-1.133-3.73-1.133  c-15.291,1.157-8.53,20.8-12.014,24.508c-0.002,0.001-0.005,0.001-0.007,0.001c0,0.002,0.001,0.004,0.001,0.006  c0,0.001-0.001,0.002-0.001,0.002s0.001,0,0.002,0.001c0.014,1.189,2.959,2.212,7.178,2.668c-0.012,0.29-0.037,0.649-0.092,1.25  C19.367,37.238,7.546,35.916,7,45h38C44.455,35.916,32.685,37.238,30.933,32.528z\"/></svg>\n" +
    "            </div>\n" +
    "            <div style=\"position:absolute;left:50%;top:-75px;\">\n" +
    "              <svg style=\"position:relative;left:-55%;width:150px;height:150px;\" viewBox=\"0 0 50 50\"><rect fill=\"none\" height=\"50\" width=\"50\"/><path style=\"fill:#ededed;stroke:#fff\" d=\"M30.933,32.528c-0.146-1.612-0.09-2.737-0.09-4.21c0.73-0.383,2.038-2.825,2.259-4.888c0.574-0.047,1.479-0.607,1.744-2.818  c0.143-1.187-0.425-1.855-0.771-2.065c0.934-2.809,2.874-11.499-3.588-12.397c-0.665-1.168-2.368-1.759-4.581-1.759  c-8.854,0.163-9.922,6.686-7.981,14.156c-0.345,0.21-0.913,0.878-0.771,2.065c0.266,2.211,1.17,2.771,1.744,2.818  c0.22,2.062,1.58,4.505,2.312,4.888c0,1.473,0.055,2.598-0.091,4.21C19.367,37.238,7.546,35.916,7,45h38  C44.455,35.916,32.685,37.238,30.933,32.528z\"/></svg>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\" style=\"height:21px\">\n" +
    "        <div ng-if=\"!inputFileName && isImage\" class=\"col-xs-12\" style=\"text-align:center\">\n" +
    "          <button ng-click=\"startImageUpload('camera')\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-camera\"></i>&nbsp; Camera&nbsp;</button>\n" +
    "          <button ng-click=\"startImageUpload('gallery')\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-image\"></i>&nbsp; Gallery</button>\n" +
    "        </div>\n" +
    "        <div ng-if=\"!inputFileName && !isImage\" class=\"col-xs-12\">\n" +
    "          <button ng-click=\"startFileUpload()\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-file\"></i>&nbsp; Choose File</button>\n" +
    "        </div>\n" +
    "        <div ng-if=\"inputFileName\" ng-class=\"{'col-xs-7':showUploadProgress,'col-xs-9':!showUploadProgress}\" style=\"overflow:hidden;text-overflow:ellipsis;white-space:nowrap;\">\n" +
    "          {{ inputFileName }}\n" +
    "        </div>\n" +
    "        <button ng-if=\"inputFileName\" ng-click=\"removeUpload()\" class=\"btn btn-box-tool btn-xs pull-right\" style=\"padding-top:0;padding-right:10px\"><i class=\"fa fa-times\"></i></button>\n" +
    "        <button ng-if=\"fileError\" ng-click=\"showError()\" class=\"btn btn-box-tool btn-xs pull-right\" style=\"padding-top:0;padding-right:10px\"><i class=\"fa fa-exclamation-circle text-danger\"></i></button>\n" +
    "        <div ng-if=\"showUploadProgress\" class=\"col-xs-3 pull-right\">\n" +
    "          <div class=\"progress\" style=\"margin-bottom:0\">\n" +
    "            <div class=\"progress-bar progress-bar-theme\" role=\"progressbar\" aria-valuenow=\"{{ uploadProgress }}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{ uploadProgress }}%\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <input type=\"file\" id=\"{{::id}}\" style=\"width: 0.1px;height: 0.1px;opacity: 0;overflow: hidden;position: absolute;z-index: -1;\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/input-text.html","<div class=\"form-group {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\" class=\"col-sm-4 hidden-xs control-label\">{{:: form.title }}</label>\n" +
    "  <!-- <label ng-if=\"$$value$$\" for=\"{{form.key.slice(-1)[0]}}\" class=\"col-sm-4 visible-xs-inline control-label\" style=\"font-size:12px;\">{{:: form.title }}</label> -->\n" +
    "  <div class=\"col-sm-8\" style=\"position:relative;\">\n" +
    "    <input sf-field-model ng-model=\"$$value$$\" schema-validate=\"form\" type=\"{{:: form.type || 'text' }}\" class=\"form-control\" placeholder=\"{{:: form.placeholder || form.title }}\" id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" class=\"htmlerror\">&nbsp;{{::\n" +
    "    	(form.required ?\n" +
    "    		\"Required \" : \"\")\n" +
    "    	+ (form.type ?\n" +
    "    		(form.type | initcap) : \"Text\")\n" +
    "    	+ (form.minlength ?\n" +
    "    		\" Min: \" + form.minlength : \"\")\n" +
    "    	+ (form.maxlength ?\n" +
    "    		\" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "  </div>\n" +
    "\n" +
    "</div>")

$templateCache.put("irf/template/listView/list-view-item.html","<div class=\"list-group-item\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-10\">\n" +
    "            <h4 class=\"list-group-item-heading\">\n" +
    "                {{ item.master_text }}\n" +
    "            </h4>\n" +
    "            <p class=\"list-group-item-text\">\n" +
    "                {{ item.small_desc }}\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-2\">\n" +
    "            <div class=\"pull-right\">\n" +
    "                <div class=\"dropdown irf-action-dropdown\">\n" +
    "                    <button class=\"btn btn-lv-item-tool dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" type=\"button\" ng-click=\"c.toggleActionBox()\">\n" +
    "                        <i class=\"glyphicon glyphicon-option-vertical\"></i>\n" +
    "                    </button>\n" +
    "                    <!--<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">-->\n" +
    "                    <!--Dropdown-->\n" +
    "                    <!--<span class=\"caret\"></span>-->\n" +
    "                    <!--</button>-->\n" +
    "                    <ul class=\"dropdown-menu dropdown-menu-right irf-action-dropdown-menu\" aria-labelledby=\"dropdownMenu1\">\n" +
    "                        <li ng-repeat=\"action in actions\" ng-if=\"action.isApplicable(item, itemIndex)\">\n" +
    "                            <a href=\"\" ng-click=\"action.fn(item, itemIndex);\">{{ action.name }}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"list-group-item-body\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/listView/list-view-rest-wrapper.html","<div>\n" +
    "    <div class=\"row\" ng-show=\"paginationOpts\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "            <div data-ng-if=\"paginationOpts.is_any_page_url_builder_available && paginationOpts.total_items!=null && paginationOpts.items_per_page!=null\">\n" +
    "                <uib-pagination ng-model=\"Page.current_page\" ng-change=\"c.pageChanged()\" boundary-links=\"true\" total-items=\"paginationOpts.total_items\" rotate=\"true\" max-size=\"5\" force-ellipsis=\"true\" class=\"pagination-sm\" force-ellipses=\"true\" items-per-page=\"paginationOpts.items_per_page\"></uib-pagination>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"listViewDefn\">\n" +
    "        <h3>Results</h3>\n" +
    "        <div ng-show=\"!isLoading\">\n" +
    "            <irf-list-view list-style=\"basic\" list-info=\"listViewDefn\" irf-list-items=\"listViewItems\"></irf-list-view>\n" +
    "        </div>\n" +
    "        <div ng-show=\"isLoading\" style=\"text-align: center\">\n" +
    "            <irf-preloader></irf-preloader>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <hr>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "            Current Page is :: {{ Page.current_page }}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/listView/list-view.html","<div class=\"irf-list-view-wrapper\">\n" +
    "    <div class=\"list-group\">\n" +
    "        <irf-list-view-item ng-repeat=\"item in listItems\" list-item=\"item\" list-item-index=\"$index\" list-actions=\"listInfo.actions\"></irf-list-view-item>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/searchBox/search-box.html","<div>\n" +
    "    <div class=\"well\">\n" +
    "        <form sf-schema=\"def.searchSchema\" sf-form=\"def.searchForm\" sf-model=\"SearchOptions\" ng-submit=\"startSearch()\">\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "")
}]);
})();
angular.module('irf.schemaforms.adminlte', ['schemaForm', 'ui.bootstrap'])
    .config(function(schemaFormDecoratorsProvider, sfBuilderProvider, schemaFormProvider) {
        var _path = "irf/template/adminlte/";
        var _builders = sfBuilderProvider.stdBuilders;

        var irfAdminlteUI = {
            "box": { template: _path + "box.html", builder: _builders },
            "array": { template: _path + "array.html", builder: _builders },
            "text": { template: _path + "input-text.html", builder: _builders },
            "number": { template: _path + "input-text.html", builder: _builders },
            "file": { template: _path + "input-file-directive.html", builder: _builders },
            "aadhar": { template: _path + "input-aadhar.html", builder: _builders },
            "button": { template: _path + "button.html", builder: _builders },
            "submit": { template: _path + "button.html", builder: _builders },
            "actions": { template: _path + "actions.html", builder: _builders }
        };

        angular.forEach(irfAdminlteUI, function(value, key){
            schemaFormDecoratorsProvider.defineAddOn("bootstrapDecorator", key, value.template, value.builder);
        });

        //schemaFormDecoratorsProvider.defineDecorator("bootstrapDecorator", schemaForms.irfAdminlteUI, []);

        //console.log(schemaFormProvider.defaults.string[0]);
    });

angular.module('irf.listView', [])
    .directive('irfListView',['$log', function($log){

        return {
            restrict: "E",
            replace: true,
            scope: {
                listStyle: "@listStyle",
                listInfo: "=listInfo",
                listItems: "=irfListItems",
                listActualItems: "=irfListActualItems"
            },
            templateUrl: "irf/template/listView/list-view.html",
            link: function(scope, elem, attrs) {

            },
            controller: "irfListViewController"
        }
    }])
    .controller('irfListViewController', [function(){

    }])
    .directive('irfListViewItem', ['$log',function($log){
        return {
            restrict: "E",
            replace: true,
            scope: {
                listStyle: "@listStyle",
                item: "=listItem",
                actualItem: "=listActualItem",
                actions: "=listActions",
                itemIndex: "=listItemIndex"
            },
            templateUrl: "irf/template/listView/list-view-item.html",
            link: function(scope, elem, attrs){

            },
            controller: "irfListViewItemController",
            controllerAs: "c"
        }
    }])
    .controller('irfListViewItemController', ['$scope', function($scope){
        /* INIT */
        $scope.isActionBoxShown = false;

        this.toggleActionBox = function(){
            $scope.isActionBoxShown = !!!$scope.isActionBoxShown;
        }
    }])
    .directive('irfListViewRestWrapper', ['$log', function($log){

        return {
            restrict: "E",
            replace: true,
            scope: {
                def: "=irfLvrWrapperDef",
                QueryURL: "=irfLvrQueryUrl"
            },
            templateUrl: 'irf/template/listView/list-view-rest-wrapper.html',
            link: function(scope, elem, attrs){

            },
            controller: 'irfListViewRestWrapperController',
            controllerAs: 'c'
        }
    }])
    .controller('irfListViewRestWrapperController', ['$scope', '$log', '$http',function($scope, $log, $http){
        /**
         * TODO: Handle all kinds of HTTP Request
         * TODO: Think about letting users intercept success and error
         * before the wrapper generic code handles it.
         *
         */

        /* INIT */
        var workingURL;
        var rawResponse = null;
        var currentResults = [];
        var baseQuery = "";
        $scope.actualItems = null;
        $scope.resultsLoaded = false;
        $scope.Page = {};
        //$scope.currentPage = 3;
        $scope.isLoading = false;


        var buildUibPaginationOpts = function(){
            var uibPaginationOpts = {
                'boundary_links': false,
                'direction_links': false,
                'items_per_page': 10,
                'rotate': true,
                'total_items': null,
                'is_any_page_url_builder_available': false
            };
            var def = $scope.def.Pagination;
            if (def.getTotalItems!=null && def.buildNPageUrl!=null){
                uibPaginationOpts['boundary_links'] = true;
            }

            if (def.buildPreviousPageUrl!=null && def.buildPreviousPageUrl!=null){
                uibPaginationOpts['direction_links'] = true;
            }

            if (def.getTotalItems!=null){
                uibPaginationOpts['total_items'] = def.getTotalItems(rawResponse);
            }

            if (def.getItemsPerPage!=null){
                uibPaginationOpts['items_per_page'] = def.getItemsPerPage(rawResponse);
            }

            if (def.buildNPageUrl!=null){
                uibPaginationOpts['is_any_page_url_builder_available'] = true;
            }

            $scope.paginationOpts = uibPaginationOpts;
        };

        function updateListViewDefn(newItems){
            $log.info("Updating List View Definition");
            $scope.listViewDefn = {
                actions: $scope.def.ListView.getActions()
            }
            $scope.listViewItems = newItems;
        }

        function resetAll(){
            $scope.listViewDefn = null;
            $scope.paginationDefn = null;
            $scope.Page.current_page = 1;
        }

        function loadData(url){
            if (url && url != ""){
                $scope.isLoading = true;
                $http.get(url)
                    .success(function(data){
                        rawResponse = data;
                        currentResults = $scope.def.ListView.getItems(data);
                        $scope.resultsLoaded = false;
                        updateListViewDefn(currentResults);
                        $scope.actualItems = $scope.def.ListView.getActualItems(data);
                        buildUibPaginationOpts();
                    })
                    .error(function(data){

                    })
                    .finally(function(){
                        $scope.isLoading = false;
                    })
            }
        }

        resetAll();

        $scope.$watch('QueryURL', function(newVal){
            $log.info("QueryURL changed. Resetting the Wrapper");
            baseQuery = newVal;
            resetAll();
            loadData(baseQuery);
        })

        /* HANDLERS */

        this.pageChanged = function(){
            $log.info("New page is ::" + $scope.Page.current_page);
            var pageUrl = $scope.def.Pagination.buildNPageUrl($scope.Page.current_page, baseQuery, rawResponse);
            loadData(pageUrl);

        }

    }])

angular.module('irf.searchBox', [])
    .directive('irfSearchBox', ["$log", "irfConfig", function($log, irfConfig){
        return {
            restrict: "E",
            replace: true,
            scope: {
                def: "=irfSearchDefinition",
                SearchURL: "=irfSearchUrl"
            },
            templateUrl: 'irf/template/searchBox/search-box.html',
            controller: 'irfSearchBoxController',
            controllerAs: 'c'
        }
    }])
    .controller('irfSearchBoxController', ["$log", "$scope", function($log, $scope){
        $scope.SearchOptions = {};
        $scope.SearchURL = "";

        console.log($scope.SearchURL);

        $scope.def.searchForm.push({
            type: "submit",
            style: "btn-info",
            title: "Search"
        })

        $scope.startSearch = function(){
            $log.info("Starting search");
            $scope.SearchURL = $scope.def.urlBuilder($scope.SearchOptions);
        }
    }])

angular.module('irf.elements',['irf.elements.tpls','irf.listView','irf.schemaforms.adminlte','irf.searchBox'])