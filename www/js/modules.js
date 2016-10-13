//HEAD 
(function(app) {
try { app = angular.module("irf.elements.tpls"); }
catch(err) { app = angular.module("irf.elements.tpls", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("irf/template/commons/SimpleModal.html","<div class=\"lov\">\n" +
    "  <div class=\"modal-dialog\" style=\"margin-left:0;margin-right:0\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\" ng-style=\"{'border-bottom':(showLoader?'none':''), 'margin-bottom':(showLoader?'0':'1px')}\">\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"$close()\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button>\n" +
    "        <h4 class=\"modal-title\" ng-bind-html=\"title\"></h4>\n" +
    "      </div>\n" +
    "      <div ng-if=\"showLoader\" class=\"loader-bar\"></div>\n" +
    "      <div class=\"modal-body form-horizontal\" ng-bind-html=\"body\"></div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default pull-left\" ng-click=\"$close()\">Close</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/actionbox.html","<div class=\"col-xs-12 action-box-col\">\n" +
    "  <div class=\"box no-border\" ng-init=\"$emit('box-init')\">\n" +
    "    <div class=\"box-body\">\n" +
    "        <div class=\"schema-form-submit {{form.htmlClass}}\">\n" +
    "            <div class=\"schema-form-actions {{form.htmlClass}}\">\n" +
    "                <button ng-repeat-start=\"item in form.items\"\n" +
    "                        class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                        type=\"button\"\n" +
    "                        ng-if=\"item.type === 'save'\"\n" +
    "                        ng-disabled=\"form.readonly\"\n" +
    "                        ng-click=\"evalExpr('save()')\"\n" +
    "                        style=\"margin-right:10px\">\n" +
    "                        <i class=\"fa fa-save\">&nbsp;</i>\n" +
    "                        {{item.title | translate}}\n" +
    "                </button>\n" +
    "                <button class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                        type=\"submit\"\n" +
    "                        ng-if=\"item.type === 'submit'\"\n" +
    "                        ng-disabled=\"form.readonly\"\n" +
    "                        ng-click=\"evalExpr('buttonClick(event,form)', {event:$event,form:item})\"\n" +
    "                        style=\"margin-right:10px\">\n" +
    "                        <i class=\"fa fa-circle-o\">&nbsp;</i>\n" +
    "                        {{item.title | translate}}\n" +
    "                </button>\n" +
    "                <button ng-repeat-end\n" +
    "                        class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                        type=\"button\"\n" +
    "                        ng-if=\"!(item.type === 'submit' || item.type === 'save')\"\n" +
    "                        ng-disabled=\"form.readonly\"\n" +
    "                        ng-click=\"evalExpr('buttonClick(event,form)', {event:$event,form:item})\"\n" +
    "                        style=\"margin-right:10px\">\n" +
    "                        <i ng-if=\"item.icon\" class=\"{{item.icon}}\">&nbsp;</i>\n" +
    "                        {{item.title | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/actions.html","<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <label class=\"col-sm-4 hidden-xs control-label\"></label>\n" +
    "    <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\">\n" +
    "        <button ng-repeat-start=\"item in form.items\"\n" +
    "                class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                type=\"button\"\n" +
    "                ng-if=\"item.type === 'save'\"\n" +
    "                ng-disabled=\"form.readonly\"\n" +
    "                ng-click=\"evalExpr('save()')\"\n" +
    "                style=\"margin-right:10px\">\n" +
    "                <i class=\"fa fa-save\">&nbsp;</i>\n" +
    "                {{item.title | translate}}\n" +
    "        </button>\n" +
    "        <button class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                type=\"submit\"\n" +
    "                ng-if=\"item.type === 'submit'\"\n" +
    "                ng-disabled=\"form.readonly\"\n" +
    "                ng-click=\"evalExpr('buttonClick(event,form)', {event:$event,form:item})\"\n" +
    "                style=\"margin-right:10px\">\n" +
    "                <i class=\"fa fa-circle-o\">&nbsp;</i>\n" +
    "                {{item.title | translate}}\n" +
    "        </button>\n" +
    "        <button ng-repeat-end\n" +
    "                class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                type=\"button\"\n" +
    "                ng-if=\"!(item.type === 'submit' || item.type === 'save')\"\n" +
    "                ng-disabled=\"form.readonly\"\n" +
    "                ng-click=\"evalExpr('buttonClick(event,form)', {event:$event,form:item})\"\n" +
    "                style=\"margin-right:10px\">\n" +
    "                <i ng-if=\"item.icon\" class=\"{{item.icon}}\">&nbsp;</i>\n" +
    "                {{item.title | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/amount.html","<div class=\"form-group {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label {{form.labelHtmlClass}}\">{{ form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\" irf-amount>\n" +
    "    <span class=\"input-group-addon\" ng-bind-html=\"iconHtml\" ng-class=\"{readonly:form.readonly}\"></span>\n" +
    "    <input sf-field-model=\"replaceAll\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           irf-amount-formatter\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"number\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           placeholder=\"{{ form.placeholderExpr ? evalExpr(form.placeholderExpr, {form:form, arrayIndex:arrayIndex}) : (form.placeholder | translate) }}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\"></span>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/anchor.html","<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <label class=\"col-sm-4 hidden-xs control-label\"\n" +
    "        ng-class=\"{'sr-only': form.notitle}\"></label>\n" +
    "    <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\">\n" +
    "        <a class=\"{{ item.style ? item.style : 'color-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "            href=\"\"\n" +
    "            ng-href=\"{{form.href}}\"\n" +
    "            ng-click=\"!form.href && evalExpr('buttonClick(event,form)', {event:$event,form:form})\"\n" +
    "            ng-disabled=\"form.readonly\">\n" +
    "            <i ng-if=\"form.icon\" class=\"{{form.icon}}\">&nbsp;</i>\n" +
    "            {{form.title | translate}}\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/array.html","<div class=\"box-body form-horizontal array-box\" sf-field-model=\"sf-new-array\" sf-new-array=\"$$value$$\" id=\"{{pid}}\" ng-init=\"pid=form.key.join('_')\">\n" +
    "  <div schema-form-array-items sf-field-model=\"ng-repeat\" ng-repeat=\"item in $$value$$ track by $index\" class=\"array-box-theme panel {{form.fieldHtmlClass}}\" ng-init=\"id=pid+'_'+($index+1)\" ng-class=\"{'array-box-last':$last}\">\n" +
    "    <h4 ng-if=\"!form.notitle\" class=\"box-title box-title-theme\">\n" +
    "      <span class=\"text\" data-toggle=\"{{form.view==='fixed'?'':'collapse'}}\" data-target=\"#{{id}}\" data-parent=\"#{{pid}}\" style=\"cursor:pointer\">{{ ($first ? ($$value$$.length > 1 ? \"1. \":\"\") : ($index + 1) + \". \") + (form.titleExpr ? evalExpr(form.titleExpr, {form:form,arrayIndex:$index}) : (form.title | translate)) }}</span>\n" +
    "      <span ng-hide=\"form.readonly || form.remove === null\" class=\"pull-right\" style=\"margin-right:0;margin-top:1px\">\n" +
    "        <span class=\"controls\" style=\"padding:0 0 0 7px;\">\n" +
    "          <a ng-click=\"$emit('irfSfDeleteFromArray', [$index, (form.titleExpr ? evalExpr(form.titleExpr, {form:form,arrayIndex:$index}) : (form.title | translate))])\"><i class=\"fa fa-close\"></i></a>\n" +
    "        </span>\n" +
    "      </span>\n" +
    "    </h4>\n" +
    "    <div class=\"ng-scope collapse\" ng-class=\"{in:($last && form.add!==null || form.view==='fixed')}\" id=\"{{id}}\">\n" +
    "      <sf-decorator ng-init=\"arrayIndex = $index; copyWithIndex($index);\" form=\"copyWithIndex($index)\" class=\"ng-scope\"></sf-decorator>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-hide=\"form.readonly || form.add === null\" class=\"array-add-btn-wrapper pull-right\">\n" +
    "    <button ng-click=\"appendToArray()\"\n" +
    "            ng-disabled=\"form.schema.maxItems <= modelArray.length\" type=\"button\"\n" +
    "            class=\"btn btn-sm btn-theme {{ form.style.add || 'btn-default' }}\">\n" +
    "      <i class=\"fa fa-plus\">&nbsp;</i>\n" +
    "      {{ form.title | translate }}\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/box.html","<div class=\"{{ form.colClass ? form.colClass : 'col-sm-6' }} box-col closed\" ng-form name=\"BoxForm\">\n" +
    "  <div class=\"box\" id=\"{{pid}}\" ng-init=\"pid=form.title.split(' ').join('_');$emit('box-init');$on('$destroy',evalExpr('boxDestroy()'))\"\n" +
    "    ng-class=\"{'box-danger':BoxForm.$dirty && BoxForm.$invalid, 'box-theme':!BoxForm.$dirty || !BoxForm.$invalid}\">\n" +
    "    <div class=\"box-header with-border\" ng-init=\"id=pid+'_body'\" data-toggle=\"collapse\" data-target=\"#{{id}}\" data-parent=\"#{{pid}}\">\n" +
    "      <h3 class=\"box-title\">{{form.titleExpr ? evalExpr(form.titleExpr, {form:form}) : (form.title | translate)}}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"box-body form-horizontal collapse in\" id=\"{{id}}\">\n" +
    "      <sf-decorator ng-repeat=\"item in form.items\" form=\"item\" class=\"ng-scope\"></sf-decorator>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/button.html","<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <label class=\"col-sm-4 hidden-xs control-label\"\n" +
    "        ng-class=\"{'sr-only': form.notitle}\"></label>\n" +
    "    <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\">\n" +
    "        <button class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                type=\"submit\"\n" +
    "                ng-if=\"form.type==='submit'\"\n" +
    "                ng-click=\"evalExpr('buttonClick(event,form)', {event:$event,form:form})\"\n" +
    "                ng-disabled=\"form.readonly\">\n" +
    "            <span ng-if=\"form.icon\" class=\"{{form.icon}}\"></span>\n" +
    "            {{form.title | translate}}\n" +
    "        </button>\n" +
    "        <button class=\"btn {{ item.style ? item.style : 'btn-theme' }} {{form.fieldHtmlClass}}\"\n" +
    "                type=\"button\"\n" +
    "                ng-if=\"form.type!=='submit'\"\n" +
    "                ng-click=\"evalExpr('buttonClick(event,form)', {event:$event,form:form})\"\n" +
    "                ng-disabled=\"form.readonly\">\n" +
    "            <span ng-if=\"form.icon\" class=\"{{form.icon}}\"></span>\n" +
    "            {{form.title | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/checkbox.html","<div class=\"form-group checkbox schema-form-checkbox {{form.htmlClass}}\">\n" +
    "  <div class=\"col-sm-4 hidden-xs\" ng-class=\"{'sr-only': form.fullwidth || !showTitle()}\"></div>\n" +
    "  <div class=\"col-sm-{{(form.notitle || form.fullwidth) ? '12' : '8'}}\">\n" +
    "    <div class=\"form-control\">\n" +
    "      <label class=\"checkbox-inline checkbox-theme {{form.labelHtmlClass}}\">\n" +
    "        <input type=\"checkbox\"\n" +
    "               sf-field-model\n" +
    "               ng-model=\"$$value$$\"\n" +
    "               ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               class=\"{{form.fieldHtmlClass}}\"\n" +
    "               name=\"{{form.key.slice(-1)[0]}}\">\n" +
    "        <span class=\"control-indicator\"></span>\n" +
    "        <span ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\" ng-bind-html=\"form.title | translate\"></span>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"help-block\" sf-message=\"form.description | translate\"></div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/date.html","<div class=\"form-group form-with-hidden {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label {{form.labelHtmlClass}}\">{{:: form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <input sf-field-model=\"replaceAll\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"hidden\" irf-pikaday=\"form\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <input class=\"form-control {{form.fieldHtmlClass}}\" ng-disabled=\"form.readonly\" placeholder=\"{{form.readonly?'':'DDMMYYYY'}}\"/>\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "    <div ng-if=\"$$value$$ && !form.readonly\" style=\"position:absolute;top:0;right:0;margin-right:15px\">\n" +
    "      <button ng-click=\"$$value$$ = ''\"\n" +
    "        onClick=\"$($(event.target).parents('.form-group')[0]).find('input.form-control').val(null)\"\n" +
    "        class=\"btn btn-box-tool btn-xs\"\n" +
    "        style=\"padding-left:5px;padding-right:7px;outline:none\" tabindex=\"-1\"><i class=\"fa fa-times\"></i></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/default.html","<div class=\"form-group {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label {{form.labelHtmlClass}}\">\n" +
    "    {{ form.titleExpr ? evalExpr(form.titleExpr, {form:form, arrayIndex:arrayIndex}) : (form.title | translate) }}\n" +
    "  </label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <input sf-field-model\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"{{:: form.type || 'text' }}\"\n" +
    "           step=\"any\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           placeholder=\"{{ form.placeholderExpr ? evalExpr(form.placeholderExpr, {form:form, arrayIndex:arrayIndex}) : (form.placeholder | translate) }}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\"></span>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/fieldset.html","<fieldset ng-disabled=\"form.readonly\" class=\"schema-form-fieldset {{form.htmlClass}}\">\n" +
    "  <h4 class=\"box-title box-title-theme\" ng-class=\"{'sr-only': !showTitle() }\">\n" +
    "    <span class=\"text\" style=\"padding: 0 5px;\">{{ form.title | translate }}</span>\n" +
    "  </h4>\n" +
    "  <div class=\"help-block\" ng-show=\"form.description\" ng-bind-html=\"form.description\"></div>\n" +
    "  <sf-decorator ng-repeat=\"item in form.items\" form=\"item\" class=\"ng-scope\"></sf-decorator>\n" +
    "</fieldset>")

$templateCache.put("irf/template/adminlte/geotag.html","<div class=\"form-group geotag {{form.htmlClass}}\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label\">{{:: form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\">\n" +
    "    <div class=\"form-control\" style=\"border:none;height:inherit\">\n" +
    "      <irf-geotag\n" +
    "      	sf-field-model=\"replaceAll\"\n" +
    "      	watch-value=\"$$value$$\"\n" +
    "      	model=\"model\"\n" +
    "      	latitude=\"form.latitude\"\n" +
    "      	longitude=\"form.longitude\"\n" +
    "      	read-only=\"form.readonly\"></irf-geotag>\n" +
    "    </div>\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{ error.message }}&nbsp;</span>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/help.html","<div class=\"helpvalue schema-form-helpvalue {{form.htmlClass}}\"\n" +
    "ng-bind-html=\"form.helpExpr ? evalExpr(form.helpExpr, {form:form}) : form.helpvalue\"></div>")

$templateCache.put("irf/template/adminlte/input-aadhar.html","<div class=\"form-group {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label\">{{:: form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <input sf-field-model\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"{{:: form.type || 'text' }}\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           placeholder=\"{{form.placeholder|translate}}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "\n" +
    "   	<a href=\"\" ng-hide=\"form.readonly\" irf-aadhar irf-aadhar-fieldmap=\"form.outputMap\" irf-aadhar-model=\"model\" style=\"position:absolute;top:-4px;right:0;padding:0 19px;font-size:2rem\">\n" +
    "      <i class=\"fa fa-qrcode color-theme\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/input-file.html","<div class=\"form-group form-with-hidden\" ng-form name=\"SingleInputForm\">\n" +
    "	<label for=\"{{::id}}\"\n" +
    "        ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "		class=\"col-sm-4 control-label\">{{:: form.title | translate }}</label>\n" +
    "	<div class=\"col-sm-{{form.notitle ? '12' : '8'}}\">\n" +
    "		<input\n" +
    "			type=\"hidden\"\n" +
    "			sf-field-model=\"replaceAll\"\n" +
    "			ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "			schema-validate=\"form\"\n" +
    "			ng-model=\"$$value$$\" />\n" +
    "		<irf-input-file irf-form=\"form\" irf-model=\"model\" irf-model-value=\"$$value$$\"></irf-input-file>\n" +
    "		<span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "			(form.required ?\n" +
    "			\"Required \" : \"\")\n" +
    "			+ (form.type ?\n" +
    "			(form.type | initcap) : \"Text\")\n" +
    "			+ (form.minlength ?\n" +
    "			\" Min: \" + form.minlength : \"\")\n" +
    "			+ (form.maxlength ?\n" +
    "			\" Max: \" + form.maxlength : \"\")\n" +
    "			}}&nbsp;\n" +
    "		</span>\n" +
    "	</div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/input-lov.html","<div class=\"form-group {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label\">{{:: form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <input sf-field-model=\"replaceAll\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           ng-disabled=\"form.readonly || form.lovonly\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"{{form.fieldType||'text'}}\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           placeholder=\"{{form.placeholder|translate}}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "\n" +
    "   	<a ng-hide=\"form.readonly\" irf-lov irf-model-value=\"$$value$$\" irf-form=\"form\" irf-model=\"model\"\n" +
    "      style=\"position:absolute;top:0;right:15px;padding:7px 9px 6px;\" href=\"\">\n" +
    "      <i class=\"fa fa-bars color-theme\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/qrcode.html","<div class=\"form-group {{form.htmlClass}}\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label\">{{:: form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <input sf-field-model=\"replaceAll\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"{{:: form.type || 'text' }}\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           placeholder=\"{{form.placeholder|translate}}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "\n" +
    "   	<a href=\"\" ng-hide=\"form.readonly\" irf-zxing=\"$$value$$\" irf-zxing-form=\"form\" irf-zxing-model=\"model\" style=\"position:absolute;top:-4px;right:0;padding:0 19px;font-size:2rem\">\n" +
    "      <i class=\"fa fa-{{form.type==='qrcode'?'qrcode':(form.type==='barcode'?'barcode':'code')}} color-theme\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/radios.html","<div class=\"form-group {{form.htmlClass}} radios\" ng-form name=\"SingleInputForm\">\n" +
    "  <label class=\"col-sm-4 control-label {{form.labelHtmlClass}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         for=\"{{form.key.slice(-1)[0]}}\">\n" +
    "    {{ form.titleExpr ? evalExpr(form.titleExpr, {form:form}) : (form.title | translate) }}\n" +
    "  </label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <div class=\"form-control {{form.readonly?'read-only':''}}\"\n" +
    "        ng-init=\"form.enumCode = form.enumCode ? form.enumCode : form.schema.enumCode; evalExpr('registerForTitleMap(form)', {form:form})\">\n" +
    "      <label\n" +
    "        class=\"radio-item radio-theme {{form.readonly?'read-only':''}}\"\n" +
    "        ng-repeat=\"item in (form.titleMap | filter:form._filters:true)\"\n" +
    "        ng-if=\"!form.readonly || $$value$$ == item.value\">\n" +
    "        <input type=\"radio\"\n" +
    "          class=\"{{form.fieldHtmlClass}}\"\n" +
    "          ng-if=\"!form.readonly\"\n" +
    "          sf-field-model=\"replaceAll\"\n" +
    "          ng-model=\"$$value$$\"\n" +
    "          ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "          ng-value=\"item.value\"\n" +
    "          name=\"{{form.key.join('$')}}\"\n" +
    "        /><!-- \n" +
    "          ng-change=\"$emit('irfSelectValueChanged', [form.enumCode, (form.titleMap | filter:{value:$$value$$})[0].code])\" -->\n" +
    "        <span ng-if=\"!form.readonly\" class=\"control-indicator\"></span>\n" +
    "        <span class=\"radio-label\">{{ item.name | translate }}</span>\n" +
    "      </label>&nbsp;\n" +
    "    </div>\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "  </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/adminlte/section.html","<div class=\"schema-form-section {{form.htmlClass}}\">\n" +
    "	<div ng-if=\"form.html\" sg-bind-html=\"form.html\"></div>\n" +
    "	<sf-decorator ng-if=\"!form.html\" ng-repeat=\"item in form.items\" form=\"item\"></sf-decorator>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/select.html","<div class=\"form-group {{form.htmlClass}} schema-form-select\" ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label\">\n" +
    "    {{ form.titleExpr ? evalExpr(form.titleExpr, {form:form}) : (form.title | translate) }}\n" +
    "  </label>{{helper}}\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <!--input ng-if=\"form.readonly\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           type=\"text\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\" /-->\n" +
    "    <select sf-field-model=\"replaceAll\"\n" +
    "      ng-model=\"$$value$$\"\n" +
    "      ng-if=\"form.readonly\"\n" +
    "      schema-validate=\"form\"\n" +
    "      class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "      id=\"{{form.id}}\" name=\"{{form.id}}\"\n" +
    "      ng-init=\"form.enumCode = form.enumCode ? form.enumCode : form.schema.enumCode; evalExpr('registerForTitleMap(form)', {form:form}); form.id=form.key.slice(-1)[0]\"\n" +
    "      irf-options-builder=\"form\"\n" +
    "      ng-options=\"item.value as item.name for item in form.filteredTitleMap\"\n" +
    "      ng-disabled=\"form.readonly\"\n" +
    "    ></select>\n" +
    "    <select sf-field-model=\"replaceAll\"\n" +
    "      ng-model=\"$$value$$\"\n" +
    "      ng-if=\"!form.readonly\"\n" +
    "      ng-change=\"evalExpr('callSelectOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "      schema-validate=\"form\"\n" +
    "      class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "      id=\"{{form.id}}\" name=\"{{form.id}}\"\n" +
    "      ng-init=\"form.enumCode = form.enumCode ? form.enumCode : form.schema.enumCode; evalExpr('registerForTitleMap(form)', {form:form}); form.id=form.key.slice(-1)[0]\"\n" +
    "      irf-options-builder=\"form\"\n" +
    "      ng-options=\"item.value as item.name group by item.group for item in form.filteredTitleMap\"\n" +
    "    >\n" +
    "      <option value=\"\">{{('CHOOSE'|translate)+' '+(form.title|translate)}}</option>\n" +
    "    </select>\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/table.html","<table class=\"table sf-table {{form.htmlClass}}\" sf-field-model=\"sf-new-array\" sf-new-array=\"$$value$$\">\n" +
    "	<tbody>\n" +
    "		<tr>\n" +
    "			<th ng-repeat=\"ft in form.items\" ng-class=\"{'required':ft.required&&!ft.readonly}\">\n" +
    "				{{( ft.titleExpr ? evalExpr(ft.titleExpr, {ft:ft,arrayIndex:$index}) : (ft.title | translate)) }}\n" +
    "			</th>\n" +
    "		</tr>\n" +
    "		<tr schema-form-array-items sf-field-model=\"ng-repeat\" ng-repeat=\"item in $$value$$ track by $index\" ng-init=\"pindex=$index\">\n" +
    "			<td ng-repeat=\"item in form.items\" ng-init=\"item.fullwidth=(item.type==='checkbox'?true:!(item.notitle=true))\">\n" +
    "				<!-- <sf-decorator form=\"copyWithIndex($index)\"></sf-decorator> -->\n" +
    "				<sf-decorator form=\"item\" ng-init=\"evalExpr('initTableCell(item, index)', {item:item, index:pindex})\"></sf-decorator>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "	<tfoot>\n" +
    "		<div ng-hide=\"form.readonly || form.add === null\" class=\"table-add-btn-wrapper pull-right\">\n" +
    "			<button ng-click=\"appendToArray()\"\n" +
    "				ng-disabled=\"form.schema.maxItems <= modelArray.length\" type=\"button\"\n" +
    "				class=\"btn btn-sm btn-theme {{ form.style.add || 'btn-default' }}\">\n" +
    "				<i class=\"fa fa-plus\">&nbsp;</i>\n" +
    "				{{ form.title | translate }}\n" +
    "			</button>\n" +
    "		</div>\n" +
    "	</tfoot>\n" +
    "</table>")

$templateCache.put("irf/template/adminlte/tablebox.html","<div class=\"col-sm-6 box-col\">\n" +
    "  <div class=\"box box-theme\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">{{form.title | translate}}</h3>\n" +
    "        <div class=\"box-tools pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"box-body no-padding\">\n" +
    "        <irf-simple-table table-promise=\"form.tablePromise(key)\" table-key=\"$$value$$\" sf-field-model=\"replaceAll\"></irf-simple-table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/tabs.html","<div ng-init=\"selected = { tab: 0 }\" class=\"schema-form-tabs {{form.htmlClass}}\">\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ng-repeat=\"tab in form.tabs\"\n" +
    "        ng-disabled=\"form.readonly\"\n" +
    "        ng-click=\"$event.preventDefault() || (selected.tab = $index); tab.onOpen($index)\"\n" +
    "        ng-class=\"{active: selected.tab === $index}\">\n" +
    "        <a href=\"#\">{{ tab.title }}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content {{form.fieldHtmlClass}}\">\n" +
    "    <sf-decorator ng-repeat=\"item in form.tabs[selected.tab].items\" form=\"item\" class=\"ng-scope\"></sf-decorator>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/textarea.html","<div class=\"form-group has-feedback {{form.htmlClass}} schema-form-textarea\"\n" +
    "     ng-form name=\"SingleInputForm\">\n" +
    "  <label for=\"{{form.key.slice(-1)[0]}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label {{form.labelHtmlClass}}\">{{:: form.title | translate }}</label>\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\">\n" +
    "    <textarea ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\"\n" +
    "              class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "              id=\"{{form.key.slice(-1)[0]}}\"\n" +
    "              ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "              placeholder=\"{{form.placeholder|translate}}\"\n" +
    "              ng-disabled=\"form.readonly\"\n" +
    "              sf-field-model\n" +
    "              ng-model=\"$$value$$\"\n" +
    "              schema-validate=\"form\"\n" +
    "              name=\"{{form.key.slice(-1)[0]}}\"></textarea>\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength ?\n" +
    "        \" Min: \" + form.minlength : \"\")\n" +
    "      + (form.maxlength ?\n" +
    "        \" Max: \" + form.maxlength : \"\")\n" +
    "    }}&nbsp;</span>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/uiselect.html","<div class=\"form-group {{form.htmlClass}} sf-uiselect\" ng-form name=\"SingleInputForm\" ng-init=\"id=form.key.join('_')\">\n" +
    "  <label for=\"{{id}}\"\n" +
    "         ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "         class=\"col-sm-4 control-label\">\n" +
    "    {{ form.titleExpr ? evalExpr(form.titleExpr, {form:form}) : (form.title | translate) }}\n" +
    "  </label>{{helper}}\n" +
    "  <div class=\"col-sm-{{form.notitle ? '12' : '8'}}\" style=\"position:relative;\"\n" +
    "    sf-field-model=\"replaceAll\"\n" +
    "  >\n" +
    "    <irf-select-handler irf-select-form=\"form\" irf-select-model=\"model\" irf-select-model-value=\"$$value$$\"></irf-select-handler>\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\"></span> \n" +
    "  </div>\n" +
    "  <input\n" +
    "    type=\"hidden\"\n" +
    "    schema-validate=\"form\"\n" +
    "    ng-model=\"$$value$$\"\n" +
    "    id=\"{{id}}_hidden\"\n" +
    "  />\n" +
    "</div>")

$templateCache.put("irf/template/adminlte/validate-biometric.html","<div class=\"form-group form-with-hidden\" ng-form name=\"SingleInputForm\">\n" +
    "	<label for=\"{{::id}}\"\n" +
    "        ng-class=\"{'sr-only': !showTitle(), 'required':form.required&&!form.readonly}\"\n" +
    "		class=\"col-sm-4 control-label\">{{:: form.title | translate }}</label>\n" +
    "	<div class=\"col-sm-{{form.notitle ? '12' : '8'}}\">\n" +
    "		<input\n" +
    "			type=\"hidden\"\n" +
    "			sf-field-model=\"replaceAll\"\n" +
    "			ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "			schema-validate=\"form\"\n" +
    "			ng-model=\"$$value$$\" />\n" +
    "		<irf-validate-biometric irf-form=\"form\" irf-model=\"model\" irf-model-value=\"$$value$$\"></irf-validate-biometric>\n" +
    "		<span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\"></span>\n" +
    "	</div>\n" +
    "</div>")

$templateCache.put("irf/template/dashboardBox/dashboard-box.html","<div class=\"col-md-12 dashboard-box\">\n" +
    "  <div class=\"box box-theme no-border\">\n" +
    "    <div class=\"box-header\">\n" +
    "      <h3 class=\"box-title\" ng-if=\"!menu.parentMenu\">\n" +
    "        <i class=\"{{ menu.iconClass }}\" ng-if=\"menu.iconClass\" style=\"color:#666\"> </i>\n" +
    "        {{ menu.title | translate }}\n" +
    "      </h3>\n" +
    "      <h3 class=\"box-title\" ng-if=\"menu.parentMenu\" ng-click=\"loadPage($event, menu.parentMenu)\" style=\"cursor:pointer\">\n" +
    "        <i class=\"fa fa-arrow-left\" style=\"color:#97a0b3\">&nbsp;&nbsp;</i>\n" +
    "        <i class=\"{{ menu.iconClass }}\" ng-if=\"menu.iconClass\" style=\"color:#666\"> </i>\n" +
    "        {{ menu.title | translate }}\n" +
    "      </h3>\n" +
    "      <div class=\"box-tools pull-right\">\n" +
    "        <button ng-if=\"!menu.parentMenu\" type=\"button\" class=\"btn btn-box-tool\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "        <button ng-if=\"!menu.parentMenu\" type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-chevron-down\"></i></button>\n" +
    "        <button ng-if=\"menu.parentMenu\" type=\"button\" class=\"btn btn-box-tool\" ng-click=\"loadPage($event, menu.parentMenu)\"><i class=\"fa fa-times\"></i></button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"box-body\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-4 col-sm-2\" ng-repeat=\"dItem in dashboardItems\">\n" +
    "        <div class=\"small-box bg-theme\" style=\"cursor:pointer;\" ng-style=\"{'background-color':(dItem.data || dItem.data===0)?getBgColor(dItem.data):''}\">\n" +
    "          <div class=\"inner\" ng-click=\"loadPage($event, dItem)\">\n" +
    "            <h3 ng-if=\"dItem.data || dItem.data===0\" ng-class=\"{offline:dItem.offline}\">{{ dItem.data }}</h3>\n" +
    "            <h3 ng-if=\"!dItem.data && dItem.data!==0\" ng-class=\"{offline:dItem.offline}\"><i class=\"{{ dItem.iconClass || 'fa fa-tasks' }}\"></i></h3>\n" +
    "            <p>{{ (dItem.shortTitle || dItem.title) | translate }}</p>\n" +
    "          </div>\n" +
    "          <div class=\"icon\" ng-click=\"loadPage($event, dItem)\"><i class=\"{{ dItem.iconClass || 'fa fa-tasks' }}\"></i></div>\n" +
    "          <!-- <a ng-if=\"dItem.offline\" ng-click=\"loadOfflinePage($event, dItem)\" href=\"\" class=\"pull-right\"><i class=\"fa fa-download\"></i></a> -->\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/flipswitch/flipswitch.html","<label class=\"switch switch-flat {{sgDisabled ? 'switch-flat-disabled' : 'switch-flat-theme'}}\">\n" +
    "  <input class=\"switch-input\" type=\"checkbox\" ng-model=\"sgModel\" ng-disabled=\"sgDisabled\" />\n" +
    "  <span class=\"switch-label\" data-on=\"{{(before || 'ON')|translate}}\" data-off=\"{{(after || 'OFF')|translate}}\"></span> \n" +
    "  <span class=\"switch-handle\"></span> \n" +
    "</label>")

$templateCache.put("irf/template/geotag/geotag.html","<div ng-if=\"!error.message\" class=\"geotag-fallback-image\">\n" +
    "	<div style=\"height:120px\" ng-style=\"{background: position.geoimageurl ? 'url(\\'' + position.geoimageurl + '\\') no-repeat center' : ''}\"></div>\n" +
    "</div>\n" +
    "<span>\n" +
    "	<i class=\"fa fa-map-marker color-theme\"></i>&nbsp;\n" +
    "	<a href=\"\" ng-href=\"{{ position.geourl }}\" target=\"_blank\" ng-style=\"{color:error.message?'tomato':'inherit'}\">\n" +
    "		{{ (position.geolocation || error.message) | translate }}\n" +
    "	</a>\n" +
    "	<a ng-hide=\"readOnly\" class=\"pull-right\" ng-click=\"refreshLocation()\" href=\"\">\n" +
    "		<i class=\"fa fa-refresh\" style=\"color:#ccc\"></i>\n" +
    "	</a>\n" +
    "</span>")

$templateCache.put("irf/template/inputFile/input-file.html","<div class=\"form-control\" ng-class=\"{'read-only':form.readonly}\" ng-style=\"(isImage || inputFileDataURL) ? {height:'inherit'}:{}\" style=\"position:relative;\">\n" +
    "  <div ng-if=\"isImage\" class=\"row\" style=\"padding-bottom:7px;\">\n" +
    "    <div class=\"col-xs-12\" style=\"text-align:center;height:200px;overflow:hidden\">\n" +
    "      <img ng-if=\"inputImageDataURL\" ng-src=\"{{ inputImageDataURL }}\" src=\"\" height=\"200\" style=\"height:200px;max-width:100%\" />\n" +
    "      <div ng-if=\"!inputImageDataURL\" style=\"position: relative; top: 50%; transform: translateY(-50%);\">\n" +
    "        <div style=\"position:absolute;left:50%;top:-75px;\">\n" +
    "          <svg style=\"position:relative;left:-45%;width:140px;height:140px;lady\" viewBox=\"0 0 50 50\"><rect fill=\"none\" height=\"50\" width=\"50\"/><path style=\"fill:#ededed;\" d=\"M30.933,32.528c-0.026-0.287-0.045-0.748-0.06-1.226c4.345-0.445,7.393-1.487,7.393-2.701  c-0.012-0.002-0.011-0.05-0.011-0.07c-3.248-2.927,2.816-23.728-8.473-23.306c-0.709-0.6-1.95-1.133-3.73-1.133  c-15.291,1.157-8.53,20.8-12.014,24.508c-0.002,0.001-0.005,0.001-0.007,0.001c0,0.002,0.001,0.004,0.001,0.006  c0,0.001-0.001,0.002-0.001,0.002s0.001,0,0.002,0.001c0.014,1.189,2.959,2.212,7.178,2.668c-0.012,0.29-0.037,0.649-0.092,1.25  C19.367,37.238,7.546,35.916,7,45h38C44.455,35.916,32.685,37.238,30.933,32.528z\"/></svg>\n" +
    "        </div>\n" +
    "        <div style=\"position:absolute;left:50%;top:-75px;\">\n" +
    "          <svg style=\"position:relative;left:-55%;width:150px;height:150px;\" viewBox=\"0 0 50 50\"><rect fill=\"none\" height=\"50\" width=\"50\"/><path style=\"fill:#ededed;stroke:#fff\" d=\"M30.933,32.528c-0.146-1.612-0.09-2.737-0.09-4.21c0.73-0.383,2.038-2.825,2.259-4.888c0.574-0.047,1.479-0.607,1.744-2.818  c0.143-1.187-0.425-1.855-0.771-2.065c0.934-2.809,2.874-11.499-3.588-12.397c-0.665-1.168-2.368-1.759-4.581-1.759  c-8.854,0.163-9.922,6.686-7.981,14.156c-0.345,0.21-0.913,0.878-0.771,2.065c0.266,2.211,1.17,2.771,1.744,2.818  c0.22,2.062,1.58,4.505,2.312,4.888c0,1.473,0.055,2.598-0.091,4.21C19.367,37.238,7.546,35.916,7,45h38  C44.455,35.916,32.685,37.238,30.933,32.528z\"/></svg>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-hide=\"form.readonly\" class=\"row\" style=\"height:21px\">\n" +
    "    <div ng-if=\"!(modelValue || inputFileName) && isImage\" class=\"col-xs-12\" style=\"text-align:center\">\n" +
    "      <button ng-if=\"isCordova\" ng-click=\"startImageUpload($event, 'camera')\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-camera\">&nbsp;</i>{{ 'CAMERA' | translate }}&nbsp;</button>\n" +
    "      <button ng-if=\"!isCordova\" ng-click=\"startImageUpload($event, 'gallery')\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-image\">&nbsp;</i>{{ 'GALLERY' | translate }}</button>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!(modelValue || inputFileName) && isBiometric\" class=\"col-xs-12\">\n" +
    "      <button ng-click=\"startBiometricCapture($event)\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-hand-pointer-o\">&nbsp;</i>{{ 'CAPTURE_BIOMETRIC' | translate}}</button>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!(modelValue || inputFileName) && !isImage && !isBiometric\" class=\"col-xs-12\">\n" +
    "      <button ng-click=\"startFileUpload($event)\" class=\"btn btn-theme btn-xs\" style=\"margin-top:-3px;margin-left:-7px\"><i class=\"fa fa-file\">&nbsp;</i>{{ 'CHOOSE_FILE' | translate}}</button>\n" +
    "    </div>\n" +
    "    <div ng-if=\"modelValue || inputFileName\" ng-class=\"{'col-xs-7':showUploadProgress,'col-xs-10':!showUploadProgress}\" style=\"overflow:hidden;text-overflow:ellipsis;white-space:nowrap;\">\n" +
    "      <span ng-if=\"!fileError\">\n" +
    "        <a ng-show=\"modelValue && modelValue!='$$OFFLINE_FILE$$'\" href=\"{{ inputFileDataURL }}\" class=\"color-theme\">\n" +
    "          {{'DOWNLOAD'|translate}}\n" +
    "        </a>\n" +
    "        <span ng-hide=\"modelValue && modelValue!='$$OFFLINE_FILE$$'\" ng-bind=\"inputFileName\"></span>\n" +
    "      </span>\n" +
    "      <span ng-if=\"fileError\" style=\"color:tomato\"><i class=\"fa fa-exclamation-circle\">&nbsp;</i>{{ fileError }}</span>\n" +
    "    </div>\n" +
    "    <button ng-if=\"modelValue || inputFileName\" ng-click=\"removeUpload($event)\" class=\"btn btn-box-tool btn-xs pull-right\" style=\"padding-top:0;padding-right:10px\"><i class=\"fa fa-times\"></i></button>\n" +
    "    <div ng-if=\"showUploadProgress\" class=\"col-xs-3 pull-right\">\n" +
    "      <div class=\"progress\" style=\"margin-bottom:0\">\n" +
    "        <div class=\"progress-bar progress-bar-theme\" role=\"progressbar\" aria-valuenow=\"{{ uploadProgress }}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{ uploadProgress }}%\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-show=\"form.readonly && !isImage && !isBiometric\">\n" +
    "    <div class=\"col-xs-12\" style=\"overflow:hidden;text-overflow:ellipsis;white-space:nowrap;\">\n" +
    "      <a ng-show=\"modelValue && modelValue!='$$OFFLINE_FILE$$' && inputFileDataURL\" href=\"{{ inputFileDataURL }}\" class=\"color-theme\">\n" +
    "        {{'DOWNLOAD'|translate}}\n" +
    "      </a>\n" +
    "      <span ng-hide=\"modelValue && modelValue!='$$OFFLINE_FILE$$' && inputFileDataURL\" style=\"color:tomato\"><i class=\"fa fa-exclamation-circle\">&nbsp;</i>{{ fileError }}</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <input type=\"hidden\" autofocus=\"true\" />\n" +
    "  <input type=\"file\" id=\"{{'input_' + form.key.join('$')}}\" style=\"width: 0.1px;height: 0.1px;opacity: 0;overflow: hidden;position: absolute;z-index: -1;\" />\n" +
    "</div>")

$templateCache.put("irf/template/listView/list-view-item.html","<ng-switch on=\"listStyle\">\n" +
    "    <div ng-switch-default class=\"list-view list-group-item\" ng-class=\"{'expanded':expanded}\">\n" +
    "        <div class=\"list-group-item-body\"\n" +
    "            ng-click=\"expandable ? expand($event) : cb({item:actualItem,index:itemIndex})\">\n" +
    "            <h4 class=\"list-group-item-heading\" sg-bind-html=\"item[0]\" ng-style=\"{'padding-left':selectable?'22px':''}\">&nbsp;</h4>\n" +
    "            <p ng-if=\"item.length > 1\" sg-bind-html=\"item[1]\" class=\"list-group-item-text gray\">&nbsp;</p>\n" +
    "            <p ng-if=\"item.length > 2\" sg-bind-html=\"item[2]\" class=\"list-group-item-text smaller\">&nbsp;</p>\n" +
    "            <p ng-show=\"expanded\" ng-repeat=\"expandItem in expandItems\" sg-bind-html=\"expandItem\" class=\"list-group-item-text smaller\">&nbsp;</p>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\" ng-if=\"selectable\" ng-click=\"actualItem.$selected = !actualItem.$selected\">\n" +
    "            <label class=\"checkbox-inline checkbox-theme\">\n" +
    "                <input type=\"checkbox\"\n" +
    "                       ng-model=\"actualItem.$selected\">\n" +
    "                <span class=\"control-indicator\"></span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"list-context-menu\" ng-if=\"actions.length\">\n" +
    "            <div class=\"dropdown irf-action-dropdown\">\n" +
    "                <button class=\"btn btn-lv-item-tool dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" type=\"button\" ng-click=\"c.toggleActionBox()\">\n" +
    "                    <i class=\"glyphicon glyphicon-option-vertical\"></i>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu dropdown-menu-right irf-action-dropdown-menu bg-tint-theme\" aria-labelledby=\"dropdownMenu1\">\n" +
    "                    <li ng-repeat=\"action in actions\" ng-if=\"action.isApplicable(actualItem, itemIndex)\">\n" +
    "                        <a href=\"\" ng-click=\"action.fn(actualItem, itemIndex);\">\n" +
    "                            <i ng-if=\"action.icon\" class=\"{{action.icon}}\"></i>\n" +
    "                            {{ action.name | translate }}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-switch-when=\"simple\" class=\"list-view-simple list-group-item\"\n" +
    "        ng-click=\"actualItem.$selected=!!!actualItem.$selected\">\n" +
    "        <h4 class=\"list-group-item-heading\" ng-bind-html=\"item[0]\">&nbsp;</h4>\n" +
    "        <p ng-if=\"item.length > 1\" ng-bind-html=\"item[1]\" class=\"list-group-item-text smaller\">&nbsp;</p>\n" +
    "        <div class=\"checkbox-simple color-theme\" ng-if=\"selectable && actualItem.$selected\">\n" +
    "            <i class=\"fa fa-check\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"dropdown-simple\" ng-if=\"actions.length && !selectable\">\n" +
    "            <button class=\"btn btn-lv-item-tool dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" type=\"button\" ng-click=\"c.toggleActionBox()\">\n" +
    "                <i class=\"glyphicon glyphicon-option-vertical\"></i>\n" +
    "            </button>\n" +
    "            <ul class=\"dropdown-menu dropdown-menu-right irf-action-dropdown-menu bg-tint-theme\" aria-labelledby=\"dropdownMenu1\">\n" +
    "                <li ng-repeat=\"action in actions\" ng-if=\"action.isApplicable(actualItem, itemIndex)\">\n" +
    "                    <a href=\"\" ng-click=\"action.fn(actualItem, itemIndex);\">\n" +
    "                        <i ng-if=\"action.icon\" class=\"{{action.icon}}\"></i>\n" +
    "                        {{ action.name | translate }}\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-switch>")

$templateCache.put("irf/template/listView/list-view-rest-wrapper.html","<div>\n" +
    "    <div ng-show=\"isAvailable && listViewDefn\">\n" +
    "        <h4 class=\"box-title box-title-theme\" style=\"text-align:center; margin: 20px 5px 10px\">\n" +
    "          <span class=\"text\" style=\"padding: 0 5px;\">{{ 'Results' | translate }}</span>\n" +
    "        </h4>\n" +
    "        <div ng-show=\"!isLoading\">\n" +
    "            <irf-list-view list-style=\"basic\" list-info=\"listViewDefn\" irf-list-items=\"listViewItems\" irf-list-actual-items=\"items\"></irf-list-view>\n" +
    "        </div>\n" +
    "        <div ng-show=\"isLoading\" style=\"text-align: center\">\n" +
    "            <irf-preloader></irf-preloader>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"isAvailable && listViewItems.length\" class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <div ng-if=\"paginationOpts.is_any_page_url_builder_available && paginationOpts.total_items!=null && paginationOpts.items_per_page!=null\" class=\"paginatelte\">\n" +
    "                <uib-pagination ng-model=\"page.currentPage\" ng-change=\"c.pageChanged()\" boundary-links=\"true\" total-items=\"paginationOpts.total_items\" rotate=\"true\" max-size=\"5\" force-ellipsis=\"true\" class=\"pagination-sm\" force-ellipses=\"true\" items-per-page=\"paginationOpts.items_per_page\"></uib-pagination>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <div class=\"paginate-info\" ng-if=\"page.totalItemsCount\">\n" +
    "                {{ 'Showing' | translate }} \n" +
    "                {{ page.currentPage * page.itemsPerPage - page.itemsPerPage + 1 }} to \n" +
    "                {{ (page.currentPage * page.itemsPerPage) > page.totalItemsCount ? page.totalItemsCount : page.currentPage * page.itemsPerPage }} of \n" +
    "                {{ page.totalItemsCount }} {{ 'entries' | translate }}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"isAvailable && !listViewItems.length\" class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <div class=\"alert\" style=\"padding:0 15px;\">\n" +
    "                <h5><i class=\"icon fa fa-warning\"></i> {{ 'No results found' | translate }}</h5>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "<style type=\"text/css\">\n" +
    ".paginate-info {\n" +
    "    padding-top: 6px;\n" +
    "    text-align: center;\n" +
    "}\n" +
    ".paginatelte {\n" +
    "    margin: 0;\n" +
    "    white-space: nowrap;\n" +
    "    text-align: center;\n" +
    "}\n" +
    ".paginatelte ul.pagination {\n" +
    "    margin: 2px 0 !important;\n" +
    "    white-space: nowrap;\n" +
    "}\n" +
    "</style>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/listView/list-view.html","<div class=\"irf-list-view-wrapper\">\n" +
    "    <div class=\"list-group\">\n" +
    "        <irf-list-view-item ng-repeat=\"item in listItems\"\n" +
    "            list-style=\"listInfo.listStyle\"\n" +
    "        	callback=\"callback(item)\"\n" +
    "        	list-item=\"item\"\n" +
    "        	list-item-index=\"$index\"\n" +
    "        	list-actual-item=\"listActualItems[$index]\"\n" +
    "        	list-actions=\"listInfo.actions\"\n" +
    "        	selectable=\"listInfo.selectable\"\n" +
    "            expandable=\"listInfo.expandable\"\n" +
    "        ></irf-list-view-item>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("irf/template/lov/modal-lov.html","<div class=\"lov\">\n" +
    "  <div class=\"modal-dialog\" style=\"margin-left:0;margin-right:0\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\" ng-style=\"{'border-bottom':(showLoader?'none':''), 'margin-bottom':(showLoader?'0':'1px')}\">\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"$close()\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button>\n" +
    "        <h4 class=\"modal-title\">{{ 'Pick' | translate }} - {{ form.title | translate }}</h4>\n" +
    "      </div>\n" +
    "      <div ng-if=\"showLoader\" class=\"loader-bar\"></div>\n" +
    "      <div class=\"modal-body form-horizontal\">\n" +
    "        <irf-sf\n" +
    "          ng-if=\"inputForm.length\"\n" +
    "          irf-form-name=\"formName\"\n" +
    "          irf-schema=\"inputSchema\"\n" +
    "          irf-form=\"inputForm\"\n" +
    "          irf-actions=\"inputActions\"\n" +
    "          irf-model=\"inputModel\"\n" +
    "          irf-helper=\"inputFormHelper\"\n" +
    "        ></irf-sf>\n" +
    "        <h4 ng-if=\"inputForm.length && listDisplayItems.length\" class=\"box-title box-title-theme\" style=\"text-align:center; margin: 20px 5px 10px\">\n" +
    "          <span class=\"text\" style=\"padding: 0 5px;\">{{ 'Results' | translate }}</span>\n" +
    "        </h4>\n" +
    "        <irf-list-view\n" +
    "          list-style=\"simple\"\n" +
    "          list-info=\"listViewOptions\"\n" +
    "          irf-list-items=\"listDisplayItems\"\n" +
    "          irf-list-actual-items=\"listResponseItems\"\n" +
    "          callback=\"callback(item)\"></irf-list-view>\n" +
    "          <span>{{noRecordError|translate}}</span>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default pull-left\" ng-click=\"$close()\">Close</button>\n" +
    "        <!-- <button type=\"button\" class=\"btn btn-theme\" ng-click=\"$close()\">Save changes</button> -->\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/progressMessage/progress-message-container.html","<div class=\"irf-p-m-c\" style=\"z-index:10000\">\n" +
    "    <irf-progress-message data-ng-repeat=\"msg in irfProgressMessages\" irf-progress-msg=\"msg\">\n" +
    "\n" +
    "    </irf-progress-message>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/progressMessage/progress-message.html","<div class=\"irf-pmc-pm\">\n" +
    "    <span class=\"a-wb-K-s\">\n" +
    "        <span class=\"a-wb-ra-s\">\n" +
    "            <div class=\"wb-x\">{{ msg.text }}</div>\n" +
    "        </span>\n" +
    "        <div>\n" +
    "            <button class=\"wb-ua-I a-wb-Uo-e a-wb-Uo-e-Oa\" ng-click=\"dismiss()\">\n" +
    "                <svg x=\"0px\" y=\"0px\" width=\"12px\" height=\"12px\" viewBox=\"0 0 10 10\" focusable=\"false\">\n" +
    "                    <polygon class=\"a-pa-wd-At1hV-Ff\" fill=\"#FFFFFF\"\n" +
    "                             points=\"10,1.01 8.99,0 5,3.99 1.01,0 0,1.01 3.99,5 0,8.99 1.01,10 5,6.01 8.99,10 10,8.99 6.01,5 \"></polygon>\n" +
    "                </svg>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </span>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/searchBox/search-box.html","<div>\n" +
    "	<form sf-schema=\"def.searchSchema\" sf-form=\"def.searchForm\" sf-model=\"searchOptions\" ng-submit=\"startSearch()\"></form>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/schemaforms/schemaforms.html","<div>\n" +
    "	<form\n" +
    "		name=\"{{formName}}\"\n" +
    "		ng-submit=\"submit()\"\n" +
    "		sf-schema=\"schema\"\n" +
    "		sf-form=\"form\"\n" +
    "		sf-model=\"model\"\n" +
    "	></form>\n" +
    "	<div ng-if=\"showLoading\" class=\"cantina-loader-wrapper\"><div class=\"cantina-loader\"></div></div>\n" +
    "	<div ng-if=\"maskSchemaForm\" class=\"spinner-section-far-wrapper\"><div class=\"spinner-section-far\"></div></div>\n" +
    "</div>")

$templateCache.put("irf/template/searchListWrapper/modal-resource-queue.html","<div class=\"lov\">\n" +
    "  <div class=\"modal-dialog\" style=\"margin-left:0;margin-right:0\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\" ng-style=\"{'border-bottom':(showLoader?'none':''), 'margin-bottom':(showLoader?'0':'1px')}\">\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"$close()\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button>\n" +
    "        <h4 class=\"modal-title\">{{ queueDefinition.title | translate }}</h4>\n" +
    "      </div>\n" +
    "      <div ng-if=\"showLoader\" class=\"loader-bar\"></div>\n" +
    "      <div class=\"modal-body form-horizontal\" style=\"padding-top:10px\">\n" +
    "        <irf-resource-search-wrapper\n" +
    "          definition=\"queueDefinition\"\n" +
    "          modal-popup=\"modalPopup\"\n" +
    "          irf-model=\"model\"\n" +
    "        ></irf-resource-search-wrapper>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-theme\" ng-click=\"toggle = !toggle\"><span ng-bind-html=\"toggleIcon\"></span> {{ toggleText | translate }}</button>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default pull-left\" ng-click=\"$close()\">{{ 'CLOSE' | translate }}</button>\n" +
    "        <button type=\"button\" class=\"btn btn-theme\" ng-click=\"saveSelection()\">{{ 'SAVE_SELECTION' | translate }}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div style=\"\"></div>\n" +
    "</div>")

$templateCache.put("irf/template/searchListWrapper/resource-search-wrapper.html","<div>\n" +
    "  <irf-sf\n" +
    "    ng-if=\"definition.searchForm.length\"\n" +
    "    initialize=\"initSF(model, form, formCtrl)\"\n" +
    "    irf-schema=\"definition.searchSchema\"\n" +
    "    irf-form=\"searchForm\"\n" +
    "    irf-actions=\"definition.actions\"\n" +
    "    irf-model=\"model.searchOptions\"\n" +
    "    irf-helper=\"formHelper\"\n" +
    "    irf-form-name=\"definition.formName\"></irf-sf>\n" +
    "\n" +
    "  <div ng-if=\"!modalPopup\" class=\"box-col\" ng-class=\"{'col-sm-12':listStyle==='table','col-sm-6':listStyle!=='table'}\">\n" +
    "    <div class=\"box box-theme\" id=\"{{pid}}\" ng-init=\"pid=definition.formName.split(' ').join('_')\">\n" +
    "      <div class=\"box-header with-border\" ng-init=\"id=pid+'_body'\" data-toggle=\"collapse\" data-target=\"#{{id}}\" data-parent=\"#{{pid}}\">\n" +
    "          <h3 class=\"box-title\">{{ 'RESULTS' | translate }} <small>{{ getTotalItems() ? 'Showing ' + items.length + ' of ' + getTotalItems() + ' records':'' }}</small></h3>\n" +
    "          <!-- <div class=\"box-tools pull-right\">\n" +
    "              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\">\n" +
    "                  <i class=\"fa fa-chevron-down\"></i></button>\n" +
    "          </div> -->\n" +
    "      </div>\n" +
    "      <div ng-switch=\"model.view\" class=\"box-body collapse in\" id=\"{{id}}\">\n" +
    "        <div ng-switch-when=\"idle\">\n" +
    "            {{ 'SEARCH_HINT' | translate }}\n" +
    "        </div>\n" +
    "        <div ng-switch-when=\"results-loading\">\n" +
    "            {{ 'LOADING' | translate }}...\n" +
    "        </div>\n" +
    "        <div ng-switch-when=\"results-failed\">\n" +
    "            {{ 'SEARCH_FAILED' | translate }}...\n" +
    "        </div>\n" +
    "        <div ng-switch-when=\"results-loaded\" ng-show=\"!isLoading\">\n" +
    "          <irf-table-view ng-if=\"listStyle == 'table'\"\n" +
    "            table-options=\"listViewOptions\"\n" +
    "            table-data=\"items\"\n" +
    "          ></irf-table-view>\n" +
    "          <irf-list-view ng-if=\"listStyle != 'table'\"\n" +
    "            list-style=\"listStyle\"\n" +
    "            list-info=\"listViewOptions\"\n" +
    "            irf-list-items=\"listItems\"\n" +
    "            irf-list-actual-items=\"items\"\n" +
    "            callback=\"definition.listOptions.itemCallback(item, index)\"></irf-list-view>\n" +
    "          <uib-pagination\n" +
    "            ng-show=\"getTotalItems() > items.length && (listViewOptions.listStyle !== 'table' || listViewOptions.config.serverPaginate !== false)\"\n" +
    "            ng-change=\"loadResults(model.searchOptions, currentPage)\"\n" +
    "            ng-model=\"pageInfo.currentPage\"\n" +
    "            boundary-links=\"true\"\n" +
    "            total-items=\"getTotalItems()\"\n" +
    "            rotate=\"true\"\n" +
    "            max-size=\"5\"\n" +
    "            force-ellipsis=\"true\"\n" +
    "            class=\"pagination-sm\"\n" +
    "            force-ellipses=\"true\"\n" +
    "            items-per-page=\"getItemsPerPage()\"></uib-pagination>\n" +
    "        </div>\n" +
    "        <div ng-if=\"bulkActions.length\">\n" +
    "          <button ng-repeat=\"bulkAction in bulkActions\"\n" +
    "            ng-click=\"bulkAction.fn(items | filter:{$selected:true}:true)\"\n" +
    "            ng-disabled=\"!bulkAction.isApplicable(items | filter:{$selected:true}:true)\"\n" +
    "            class=\"btn btn-theme\"\n" +
    "          >\n" +
    "            <i ng-if=\"bulkAction.icon\" class=\"{{bulkAction.icon}}\">&nbsp;</i>\n" +
    "            {{ bulkAction.name | translate }}\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-if=\"modalPopup\">\n" +
    "    <h4 ng-if=\"definition.searchForm.length\" class=\"box-title box-title-theme\" style=\"text-align:center; margin: 20px 5px 10px\">\n" +
    "        <span class=\"text\" style=\"padding: 0 5px;\">{{ 'RESULTS' | translate }} <small>{{ getTotalItems() ? 'Showing ' + items.length + ' of ' + getTotalItems() + ' records':'' }}</small></span>\n" +
    "    </h4>\n" +
    "    <div ng-switch=\"model.view\" class=\"box-body\">\n" +
    "      <div ng-switch-when=\"results-loading\">\n" +
    "          {{ 'LOADING' | translate }}...\n" +
    "      </div>\n" +
    "      <div ng-switch-when=\"results-failed\">\n" +
    "          {{ 'SEARCH_FAILED' | translate }}...\n" +
    "      </div>\n" +
    "      <div ng-switch-when=\"results-loaded\" ng-show=\"!isLoading\">\n" +
    "        <irf-list-view\n" +
    "          list-style=\"listStyle\"\n" +
    "          list-info=\"listViewOptions\"\n" +
    "          irf-list-items=\"listItems\"\n" +
    "          irf-list-actual-items=\"items\"\n" +
    "          callback=\"definition.listOptions.itemCallback(item, index)\"></irf-list-view>\n" +
    "        <uib-pagination\n" +
    "          ng-show=\"getTotalItems() > items.length && (listViewOptions.listStyle !== 'table' || listViewOptions.config.serverPaginate !== false)\"\n" +
    "          ng-change=\"loadResults(model.searchOptions)\"\n" +
    "          ng-model=\"pageInfo.currentPage\"\n" +
    "          boundary-links=\"true\"\n" +
    "          total-items=\"getTotalItems();\"\n" +
    "          rotate=\"true\"\n" +
    "          max-size=\"5\"\n" +
    "          force-ellipsis=\"true\"\n" +
    "          class=\"pagination-sm\"\n" +
    "          force-ellipses=\"true\"\n" +
    "          items-per-page=\"getItemsPerPage()\"></uib-pagination>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"spinner-wrapper spinner-section-far-wrapper\" ng-show=\"showSearchSectionFarLoader\">\n" +
    "      <div class=\"spinner-section-far\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("irf/template/searchListWrapper/search-list-wrapper.html","<div class=\"col-md-6\">\n" +
    "  <div class=\"box box-theme\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">{{definition.title | translate}}</h3>\n" +
    "        <div class=\"box-tools pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"box-body form-horizontal\">\n" +
    "        <irf-search-box irf-search-definition=\"definition.searchDefinition\" irf-search-url=\"searchUrl\"></irf-search-box>\n" +
    "        <irf-list-view-rest-wrapper irf-lvr-wrapper-def=\"definition.restListDefinition\" irf-lvr-query-url=\"searchUrl\"></irf-list-view-rest-wrapper>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")

$templateCache.put("irf/template/table/SimpleTable.html","<div class=\"table-responsive\">\n" +
    "	<table class=\"table table-condensed\">\n" +
    "	    <tbody>\n" +
    "	        <tr>\n" +
    "	            <th ng-repeat=\"column in definition.columns\" style=\"{{column.style}}\" ng-bind-html=\"column.title\"></th>\n" +
    "	        </tr>\n" +
    "	        <tr ng-repeat=\"item in definition.data\">\n" +
    "	            <td ng-repeat-start=\"i in item\" ng-if=\"!isObject(i)\" ng-bind-html=\"i\"></td>\n" +
    "	            <td ng-repeat-end ng-if=\"isObject(i)\" sg-attrs=\"i\" ng-bind-html=\"i.value\"></td>\n" +
    "	        </tr>\n" +
    "	    </tbody>\n" +
    "	</table>\n" +
    "</div>")

$templateCache.put("irf/template/tableView/table-view.html","<div class=\"irf-table-view table-responsive \">\n" +
    "\n" +
    " <table id=\"example\" class=\"root-table dt-responsive table table-condensed  width=\"100\" no-wrap role=\"grid\"\" ></table>\n" +
    " \n" +
    "</div> \n" +
    "\n" +
    "")

$templateCache.put("irf/template/uiselect/uiselect.html"," <ui-select\n" +
    "      ng-if=\"form.selection!=='multiple'\"\n" +
    "      theme=\"selectize\"\n" +
    "      ng-model=\"ctrl.modelValue\"\n" +
    "      ng-disabled=\"form.readonly\"\n" +
    "      ng-change=\"onChange($event)\"\n" +
    "      name=\"{{id}}\"\n" +
    "      id=\"{{id}}\"\n" +
    "      class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "    >\n" +
    "      <ui-select-match>{{$select.selected.name}}</ui-select-match>\n" +
    "      <ui-select-choices repeat=\"item in itemArray | filter: $select.search\">\n" +
    "        <span ng-bind=\"item.name\"></span>\n" +
    "      </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "    \n" +
    "    <ui-select\n" +
    "      ng-if=\"form.selection==='multiple'\"\n" +
    "      multiple\n" +
    "      close-on-select=\"false\"\n" +
    "      theme=\"select2\"\n" +
    "      ng-model=\"modelValue\"\n" +
    "      ng-disabled=\"form.readonly\"\n" +
    "      ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:modelValue, event:$event})\"\n" +
    "      name=\"{{id}}\"\n" +
    "      id=\"{{id}}\"\n" +
    "      class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "    >\n" +
    "      <ui-select-match>{{$select.selected.name}}</ui-select-match>\n" +
    "      <ui-select-choices repeat=\"item in itemArray | filter: $select.search\">\n" +
    "        <span ng-bind=\"item.name\"></span>\n" +
    "      </ui-select-choices>\n" +
    "    </ui-select>")

$templateCache.put("irf/template/validateBiometric/validate-biometric.html","<div ng-class=\"{'read-only':form.readonly}\" style=\"position:relative;height:inherit;\">\n" +
    "  <div class=\"row\" style=\"padding-bottom:7px;\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <select\n" +
    "        ng-disabled=\"disabled\"\n" +
    "        ng-change=\"buttonTitle=buttonText\"\n" +
    "        ng-model=\"validationId\"\n" +
    "        ng-options=\"option.value as option.name group by option.type for option in options\"\n" +
    "        class=\"form-control\"\n" +
    "        style=\"width:100%\">\n" +
    "      </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\" style=\"height:21px\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <button ng-click=\"validateFinger($event)\" class=\"btn btn-theme btn-xs btn-block\" ng-disabled=\"disabled\"><i class=\"fa fa-hand-pointer-o\">&nbsp;</i>{{ buttonTitle | translate}}</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>")
}]);
})();
angular.module('irf.aadhar', ['irf.elements.commons'])
.directive('irfAadhar', ["$q", "$log", "elementsUtils", function($q, $log, elementsUtils){
	// Runs during compile
	return {
		scope: {
			irfAadharFieldmap: "=",
			model: "=irfAadharModel"
		},
		restrict: 'A',
		link: function($scope, iElm, iAttrs, controller) {
			if (typeof cordova === 'undefined') {
				$(iElm).remove();
				return;
			}

			$(iElm).click(function(e, rowId){
				$scope.scanAadharQR($scope.irfAadharFieldmap);
			});

			$scope.scanAadharQR = function(fieldMappings){

				$log.info("Inside scanCustomerAadhaarQRCode");
				//$log.info($scope);
				var deferred = $q.defer();
				try {
					cordova.plugins.barcodeScanner.scan(
						function (result) {
							$log.info("We got a barcode" +
							"\nResult: " + result.text +
							"\nFormat: " + result.format +
							"\nCancelled: " + result.cancelled);
							if (!result.cancelled) {
								if (result.format == 'QR_CODE') {
									var aadhaarXmlData;
									try {
										var aadhaarDoc = $.parseXML(result.text);
										aadhaarXmlData = $(aadhaarDoc).find('PrintLetterBarcodeData');
										if (!aadhaarXmlData || !aadhaarXmlData.length) {
											deferred.reject('Invalid ADHAAR QR Code');
											return;
										}
									} catch (e) {
										deferred.reject('Invalid ADHAAR QR Code');
										return;
									}
									var aadhaarData = {};
									var aadhaarLog = 'aadhaarData:';
									angular.forEach(aadhaarXmlData[0].attributes, function(attr, i){
										this[attr.name] = attr.value;
										aadhaarLog += '\t\n ' + attr.name + ':'+ attr.value;
									}, aadhaarData);
									$log.info(aadhaarLog);

									deferred.resolve(aadhaarData);
									$scope.mapAadharFields(aadhaarData,fieldMappings);
								} else {
									deferred.reject('Invalid QR Code');
								}
							}
						}, function (error) {
							deferred.reject("Scanning failed: " + error);
						}
					);
				} catch (e) {
					deferred.reject("Unsupported feature");
					$log.info("error running cordova:" + e);
				}
				return deferred.promise;
					
			};

			$scope.mapAadharFields=function(aadhaarData,fieldMappings){
				$log.info("aadhaarData ->");
				$log.info(aadhaarData);
				$log.info("fieldMappings ->");
				$log.info(fieldMappings);
				aadhaarData['pc'] = Number(aadhaarData['pc']);
				aadhaarData['gender'] = (aadhaarData['gender'] === 'M') ? 'MALE' : (aadhaarData['gender'] === 'F' ? 'FEMALE' : 'OTHERS');
				elementsUtils.mapOutput(fieldMappings, aadhaarData, $scope.model);
				$scope.$apply();
				//$log.info($scope.model);
			};

			var testAadhaar = function(fieldMappings) {
				var testAadhaarData = {
					"uid" :"UID_234029382134",
					"name":"Stalin Gino",
					"gender":"M",
					"yob":"",
					"co":"",
					"house":"7A",
					"street":"",
					"lm":"",
					"loc":"",
					"vtc":"",
					"dist":"",
					"state":"",
					"pc":""
				};
				$scope.mapAadharFields(testAadhaarData,fieldMappings);
			};

			// $scope.scanAadharQR = testAadhaar;
		}
	};
}]);
angular.module('irf.schemaforms.adminlte', ['schemaForm', 'ui.bootstrap', 'irf.elements.commons', 'ui.select', 'ngSanitize'])
.config(function(schemaFormDecoratorsProvider, sfBuilderProvider, schemaFormProvider) {
    var _path = "irf/template/adminlte/";
    var _builders = sfBuilderProvider.stdBuilders;

    var irfAdminlteUI = {
        "default": "default.html",
        "number": "default.html",
        "password": "default.html",
        "box": "box.html",
        "actionbox": "actionbox.html",
        "array": "array.html",
        "fieldset": "fieldset.html",
        "file": "input-file.html",
        "aadhar": "input-aadhar.html",
        "lov": "input-lov.html",
        "button": "button.html",
        "submit": "button.html",
        "actions": "actions.html",
        "checkbox": "checkbox.html",
        "radios": "radios.html",
        "select": "select.html",
        "uiselect": "uiselect.html",
        "amount": "amount.html",
        "date": "date.html",
        "textarea": "textarea.html",
        "geotag": "geotag.html",
        "tablebox": "tablebox.html",
        "tabs": "tabs.html",
        "help": "help.html",
        "section": "section.html",
        "conditional": "section.html",
        "biometric": "biometric.html",
        "qrcode": "qrcode.html",
        "barcode": "qrcode.html",
        "validatebiometric": "validate-biometric.html",
        "anchor": "anchor.html",
        "table": "table.html"
    };

    angular.forEach(irfAdminlteUI, function(value, key){
        schemaFormDecoratorsProvider.defineAddOn("bootstrapDecorator", key, _path+value, _builders);
        //schemaFormDecoratorsProvider.addMapping("bootstrapDecorator", key, _path+value);
    });

    //schemaFormDecoratorsProvider.defineDecorator("bootstrapDecorator", schemaForms.irfAdminlteUI, []);

    //console.log(schemaFormProvider.defaults.string[0]);
})
.directive('irfAmount', ["irfElementsConfig", function(irfElementsConfig){
    return {
        restrict: 'A',
        transclude: true,
        template: '<div class="input-group" ng-transclude></div>',
        link: function(scope, elem, attrs) {
            var ccy = irfElementsConfig.currency;
            scope.iconHtml = ccy.iconHtml;
        }
    };
}])
.directive('irfAmountFormatter', ['AccountingUtils', '$log', function(AccountingUtils, $log){
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;
/*
            ngModel.$formatters.push(function(modelValue){
                $log.info('formatting:'+modelValue);
                return AccountingUtils.formatMoney(modelValue);
            });

            ngModel.$parsers.push(function(viewValue){
                var parsed = AccountingUtils.parseMoney(viewValue);
                $log.info('parsing:'+viewValue+' to '+parsed);
                return parsed;
            });

            ngModel.$render = function() {
                $log.info($(element).val());
                $(element).val(AccountingUtils.formatMoney(ngModel.$modelValue));
            };

            var read = function() {
                ngModel.$setViewValue(AccountingUtils.formatMoney($(element).val()));
            };

            $(element).on('blur', function() {
                read();
            });
            read();*/
        }
    };
}])
;

angular.module('irf.elements.commons', ['pascalprecht.translate', 'ngJSONPath'])
/*
.filter("titleMapByParent", function() {
	return function(titleMap) {
		if (dob)
			return moment().diff(dob, "years");
		else
			return "NA";
	}
})
*/

.provider('irfElementsConfig', function() {
	var fileUpload = {
		fileUploadUrl: null,
		dataUploadUrl: null,
		fileDeleteUrl: null,
		fileStreamUrl: null,
		responseSelector: null
	};
	var pikaday = {
		minDate: new Date(1800, 0, 1),
		maxDate: new Date(2050, 12, 31),
		yearRange: [1800,2050],
		format: 'YYYY-MM-DD'
	};
	var currency = {
		iconHtml: '<i class="fa fa-inr"></i>',
		decimalPoints: 2
	};

	this.configCurrency = function(config0) {
		currency = config0;
	};

	this.configFileUpload = function(config0) {
		fileUpload = config0;
	};

	this.configPikaday = function(config0) {
		angular.extend(pikaday, config0);
	};

	this.$get = function() {
		return {
			fileUpload: {
				fileUploadUrl: fileUpload.fileUploadUrl,
				fileDeleteUrl: fileUpload.fileDeleteUrl,
				fileStreamUrl: fileUpload.fileStreamUrl,
				responseSelector: '$.' + (fileUpload.responseSelector || 'fileId')
			},
			pikaday: pikaday,
			currency: currency,
			setDateDisplayFormat: function(dateDisplayFormat) {
				pikaday.dateDisplayFormat = dateDisplayFormat;
			}
		};
	};
})

.factory('elementsUtils',
["$log", "$q", "$parse", "$rootScope", "irfOfflineFileRegistry",
function($log, $q, $parse, $rootScope, offlineFileRegistry){

	var getArrayIndex = function(key) {
		if (key && key.length) {
			for(i = key.length - 1;  i >= 0; i--) {
				if (_.isNumber(key[i])) {
					return key[i];
				}
			}
		}
		return null;
	};

	/* ALL rootScope functions write before this line and bind after */
	$rootScope.getArrayIndex = getArrayIndex;

	var stripBase64 = function(base64Data) {
		var base64plain, mimeString;
		var idx = base64Data.indexOf(';base64,');
		if (idx > 0) {
			base64plain = base64Data.substr(idx + 8);
			mimeString = base64Data.substr(5, idx - 5);
			return [base64plain, mimeString];
		}
	};

	var getBlob = function(byteArrays, mimeString) {
		try {
			return new Blob(byteArrays, {type: mimeString});
		} catch (e) {
			$log.error(e);
			// The BlobBuilder API has been deprecated in favour of Blob, but older
			// browsers don't know about the Blob constructor
			// IE10 also supports BlobBuilder, but since the `Blob` constructor
			//  also works, there's no need to add `MSBlobBuilder`.
			var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
			var bb = new BlobBuilder();
			bb.append(byteArrays);
			return bb.getBlob(mimeString);
		}
		return base64Data;
	};

	var arrayBufferToBase64 = function(buffer) {
		var binary = '';
		var bytes = new Uint8Array( buffer );
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
		}
		return window.btoa( binary );
	}

	var base64toBlob = function (base64Data, contentType) {

			contentType = contentType || 'image/jpg';
			var sliceSize = 1024;
			var byteCharacters = atob(base64Data);
			var bytesLength = byteCharacters.length;
			var slicesCount = Math.ceil(bytesLength / sliceSize);
			var byteArrays = new Array(slicesCount);

			for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
				var begin = sliceIndex * sliceSize;
				var end = Math.min(begin + sliceSize, bytesLength);

				var bytes = new Array(end - begin);
				for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
					bytes[i] = byteCharacters[offset].charCodeAt(0);
				}
				byteArrays[sliceIndex] = new Uint8Array(bytes);
			}
			return getBlob(byteArrays, contentType);
		};

	return {
		generateUUID: function() {
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
			$log.info("Generated UUID: " + uuid);
			return uuid;
		},
		mapValue: function(path, data, value) {
			$parse(path).assign(data, value);
		},
		mapInput: function(map, data, output, locals) {
			angular.forEach(map, function(value, key){
				if (value) {
					$parse(key).assign(output, $parse(value)(data, locals));
				}
			});
		},
		mapOutput: function(map, data, output, locals) {
			angular.forEach(map, function(value, key){
				if (value) {
					var getter = $parse(value);
					if (_.isObject(locals)) {
						angular.extend(output, locals);
					}
					getter.assign(output, $parse(key)(data));
				}
			});
		},
		getArrayIndex: getArrayIndex,
		hslToHex: function(h, s, l) {
			var r, g, b;

			if (s == 0) {
				r = g = b = l; // achromatic
			} else {
				var hue2rgb = function(p, q, t) {
					if(t < 0) t += 1;
					if(t > 1) t -= 1;
					if(t < 1/6) return p + (q - p) * 6 * t;
					if(t < 1/2) return q;
					if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				}
				var pad2 = function(c) {
					return c.length == 1 ? '0' + c : '' + c;
				}

				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}

			return [
				pad2(Math.round(r * 255).toString(16)),
				pad2(Math.round(g * 255).toString(16)),
				pad2(Math.round(b * 255).toString(16))
			].join("");
		},
		alert: function(message, title) {
			if (typeof cordova === 'undefined') {
				alert(message);
			} else {
				navigator.notification.alert(
					message,
					null, // callback
					(typeof title === 'undefined' || !title) ? 'Alert' : title, // title
					'OK'
				);
			}
		},
		confirm: function(message, title) {
			var deferred = $q.defer();
			if (typeof cordova === 'undefined') {
				if (window.confirm(message))
					deferred.resolve();
			} else {
				navigator.notification.confirm(
					message,
					function(buttonText){
						$log.debug('User Responded for confirm:'+buttonText);
						if(buttonText===1) deferred.resolve();
						else deferred.reject();
					},
					(typeof title === 'undefined' || !title) ? 'Confirm' : title, // title
					['Yes', 'No']
				);
			}
			return deferred.promise;
		},
		jicCompress: function(sourceImg, options) {
			var deferred = $q.defer();
			var sourceImgObj = $('<img>').get(0);
			sourceImgObj.src = null;
			sourceImgObj.onload = function(){
				var outputFormat = 'jpeg';
				var quality = options.resizeQuality * 100 || 70;
				var mimeType = 'image/jpeg';
				if (outputFormat !== undefined && outputFormat === 'png') {
					mimeType = 'image/png';
				}
				var maxHeight = options.resizeMaxHeight || 450;
				var maxWidth = options.resizeMaxWidth || 300;
				var height = sourceImgObj.height;
				var width = sourceImgObj.width;
				// calculate the width and height, constraining the proportions
				if (width > height && width > maxWidth) {
					height = Math.round(height *= maxWidth / width);
					width = maxWidth;
				} else if (height > maxHeight) {
					width = Math.round(width *= maxHeight / height);
					height = maxHeight;
				}
				var cvs = $('<canvas>').get(0);
				cvs.width = width; //sourceImgObj.naturalWidth;
				cvs.height = height; //sourceImgObj.naturalHeight;
				var ctx = cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, width, height);
				var newImageData = cvs.toDataURL(mimeType, quality / 100);
				delete sourceImgObj;
				deferred.resolve(newImageData);
			};
			sourceImgObj.src = sourceImg;
			return deferred.promise;
		},
		stripBase64: stripBase64,
		getBlob: getBlob,
		base64toBlob: base64toBlob,
		arrayBufferToBase64: arrayBufferToBase64,
		uploadOfflineFiles: function(offlineFiles) {
			var deferred = $q.defer();
			var promises = [];
			_.each(offlineFiles, function(v,k){
				if (v.data) {
					var d = $q.defer();
					fileCtrl = offlineFileRegistry.get(k);
					var file = null;
					if (v.filename === 'biometric.iso') {
						file = getBlob([v.data], 'application/json');
					} else {
						var b2 = stripBase64(v.data);
						var base64plain = b2[0];
						var mimeString = b2[1];
						file = base64toBlob(base64plain, mimeString);
					}
					file.name = v.filename;
					fileCtrl.fileUpload(file)
						.then(function(modelValue){
							v.data = null;
							d.resolve(modelValue);
						})
						.catch(function(fileError){
							d.reject(fileError);
						});
					promises.push(d.promise);
				}
			});
			$q.all(promises).then(function(dataArray) {
/*
				_.each(dataArray, function(value,k){
					var response = value[0];
					var offlineFile = value[1];
					var r = [k, v]; // TODO fileId should come here.
					formCtrl.scope.$broadcast('irf-offline-upload-end', r);
				});
*/
				deferred.resolve();
			}, function(){
				deferred.reject();
			});
			return deferred.promise;
		}
	};
}])

.factory('irfOfflineFileRegistry', [function(){
	var fileRegistry = {};
	return {
		push: function(fileKey, fileCtrl){
			fileRegistry[fileKey] = fileCtrl;
		},
		get: function(fileKey){
			var c =fileRegistry[fileKey];
			return c;
		},
		pop: function(fileKey){
			var c =fileRegistry[fileKey];
			fileRegistry[fileKey] = null;
			return c;
		},
		clear: function(){
			fileRegistry = {};
		}
	};
}])

.factory('irfSimpleModal', ["$log", "$uibModal", function($log, $uibModal){
	return function(title, body) {
		var modalWindow = $uibModal.open({
			templateUrl: "irf/template/commons/SimpleModal.html",
			controller: function($scope) {
				$scope.title = title;
				$scope.body = body;
			}
		});
		return modalWindow;
	};
}])

.factory('AccountingUtils', ['$log', function($log){
	return {
		formatMoney: function(money){
			return accounting.formatMoney(money, "");
		},
		parseMoney: function(formattedMoney){
			return accounting.unformat(formattedMoney);
		}
	}
}])

.directive('sgBindHtml', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch(function () {
				return scope.$eval(attrs.sgBindHtml);
			}, function (value) {
				element.html(value);
				$compile(element.contents())(scope);
			});
		}
	};
}])

/* This is created for SimpleTable for AMS */
.directive('sgAttrs', function(){
	return {
		restrict: "A",
		scope: {
			sgAttrs: "="
		},
		link: function(scope, element, attrs) {
			_.forEach(scope.sgAttrs, function(v, k){
				if (!_.startsWith(k, '$$'))
					$(element).attr(k, v);
			});
		}
	};
})
.directive('sgSelectFilter', function(){
	return {
		restrict: "A",
		scope: {
			sgSelectFilter: "=",
			sgSelectModel: "="
		},
		controller: function($scope, $element, $compile) {
			if (!$scope.sgSelectFilter) {
				return;
			}
			var el = $compile('<div class="schema-select-filter">\
				<a href class="f {{sgSelectModel?\'text-red\':\'color-theme\'}}" tabindex="-1"><i class="fa fa-filter"></i></a>\
				<div>\
					<input ng-model="sgSelectModel" tabindex="-1"/>\
					<a href ng-show="sgSelectModel" ng-click="sgSelectModel=\'\'" class="c color-theme" tabindex="-1"><i class="fa fa-times"></i></a>\
				</div>\
			</div>')($scope);
			$element.after(el);
			var i = $(el).find('input');
			var a = $(el).find('a.f');
			var c = $(el).find('a.c');
			var d = $(el).find('div');
			a.on('click', function(){
				a.hide();
				d.show();
				i.focus();
			});
			var keepFocus = false;
			var closeFilter = function() {
				if (!keepFocus) {
					a.show();
					d.hide();
				}
			}
			i.on('blur', function(event){
				keepFocus = false;
				setTimeout(closeFilter, 200);
			});
			c.on('blur', function(event){
				i.focus();
			}).on('focus', function(event){
				keepFocus = true;
			});
		}
	};
})
.directive('irfOptionsBuilder', function(){

	var matchParentKey = function(myKey, myParentKey){
		var myKeysArr = _.sortBy(_.keys(myKey), function(o){ return parseInt(o)}) ;
		var myParentKeysArr = _.sortBy(_.keys(myParentKey), function(o){ return parseInt(o)}) ;

		if (myKeysArr.length !== myParentKeysArr.length){
			return false;
		}

		for (var i=0, tLength = myKeysArr.length-1; i<tLength; i++){
			if (myKey[myKeysArr[i]]!= myParentKey[myParentKeysArr[i]]){
				return false;
			}
		}
		return true;
	}
	return {
		restrict: "A",
		scope: {
			"form":"=irfOptionsBuilder"
		},
		link: function(scope, element, attrs){
			if (scope.form.parentEnumCode){
				scope.form.finalTitleMap = [];
			} else {
				scope.form.filteredTitleMap = scope.form.titleMap;
			}

			if (scope.form.parentValueExpr){
				var sfScope = element.parents("[sf-form]").scope();
				sfScope.$watch(scope.form.parentValueExpr, function(newVal){
					var finalTitleMap = [];
					for (var i=0, tLength=scope.form.titleMap.length; i<tLength; i++)
					{
						var item = scope.form.titleMap[i];
						if (item.parentCode == newVal) {
							finalTitleMap.push(item);
						}
					}
					scope.form.filteredTitleMap = finalTitleMap;
				})
			}

			scope.$on('selectbox-value-changed', function(event, args){
				var parentForm = args[1];
				if (scope.form.parentEnumCode && scope.form.parentEnumCode==args[1].enumCode && matchParentKey(scope.form.key, parentForm.key)){
					var value = args[2];
					var parentItem = null;
					var finalTitleMap = [];
					for (var i=0, tLength = parentForm.filteredTitleMap.length;i<tLength;i++){
						var item = parentForm.filteredTitleMap[i];
						if (item.value == value){
							parentItem = item;
							break;
						}
					}
					if (parentItem){
						for (var i=0, tLength=scope.form.titleMap.length; i<tLength; i++){
							var item = scope.form.titleMap[i];
							if (item.parentCode == parentItem.code) {
								finalTitleMap.push(item);
							}
						}
						scope.form.filteredTitleMap = finalTitleMap;
					}
				}
			})
		}
	}
})
.factory('irfSelectRegistry', [function() {
	var registry = {};
	return {
		put: function(key, data) {
			registry[key] = data;
		},
		get: function(key) {
			var c = registry[key];
			return c;
		},
		pop: function(key) {
			var c = registry[key];
			registry[key] = null;
			return c;
		},
		clear: function() {
			registry = {};
		}
	};
}])
.directive('irfSelectHandler', ['$log', '$filter', 'irfSelectRegistry', function($log, $filter, irfSelectRegistry) {
	return {
		scope: {
			form: '=irfSelectForm',
			model: '=irfSelectModel',
			modelValue: '=irfSelectModelValue'
		},
		replace: false,
		templateUrl: "irf/template/uiselect/uiselect.html",
		link: function($scope, elem, attrs, ctrl) {
			var id = $scope.form.key.join('$');

			if (_.isFunction($scope.form.getTitleMap) || _.isString($scope.form.getTitleMap)) {
				var result = null;
				var code = null;
				if (_.isString($scope.form.getTitleMap)) {
					try {
						result = $scope.$parent.evalExpr($scope.form.getTitleMap, {
							modelValue: $scope.modelValue,
							form: $scope.form,
							model: $scope.model
						});
					} catch (e) {
						$log.debug('Calling "' + $scope.form.getTitleMap + '" failed');
						$log.error(e);
					}
				} else {
					result = $scope.form.getTitleMap($scope.modelValue, $scope.form, $scope.model);
				}
				if (result) {
					if (_.isFunction(result.then)) {
						result.then(function(titleMap) {
							ctrl.init(titleMap, true);
						});
					} else if (_.isArray(result)) {
						ctrl.init(result, true);
					} else {
						// TODO failure case
					}
				}
			} else if (_.isArray($scope.form.titleMap)) {
				ctrl.init(angular.copy($scope.form.titleMap));
			}
		},
		controller: ["$scope", "$element", "$compile", function($scope, $element, $compile) {
			var self = this;

			var id = $scope.form.key.join('_');
			$scope.form.returns = $scope.form.returns || 'value';
			var _returnFilter = {};

			if ($scope.form.selection === 'multiple')
				$element.find('#' + id).attr('multiple');

			self.init = function(_titleMap, usingFunction) {
				var titleMap = _titleMap;
				self.refresh = usingFunction && $scope.form.refreshTitleMap;

				if ($scope.form.filters || self.refresh) {
					$scope.$on('irf-sf-model-changed', function() {
						// modelValue assignment
						debugger;
						_returnFilter[$scope.form.returns] = $scope.modelValue;
						self.modelValue = $filter('filter')(titleMap, _returnFilter, true)[0];
						// filters processing
						if ($scope.form.filters) {
							var filter = $scope.form.filters;
							// $log.info(filter);
							var finalTitleMap = _.cloneDeep(titleMap);
							for (var i = 0; i < filter.length; i++) {
								var obj = filter[i];
								var f = obj.filterOn;
								code = obj.getFilteredBy($scope.model, $scope.form, $scope.form.filters);
								var tempTitleMap = [];
								for (var j = 0, tLength = finalTitleMap.length; j < tLength; j++) {
									var item = titleMap[j];
									var flt = item[f];
									if (item[f] == code) {
										tempTitleMap.push(item);
									}
								}
								finalTitleMap = tempTitleMap;
							}
							$scope.itemArray = finalTitleMap;
						}
					});
				} else {
					$scope.itemArray = titleMap;
				}
			};

			$scope.onChange = function(event) {
				$scope.modelValue = self.modelValue ? self.modelValue[$scope.form.returns] : '';
				$scope.$parent.evalExpr('callOnChange(event, form, modelValue)', {form: $scope.form, modelValue: $scope.modelValue, event: event});
			};
		}],
		controllerAs: 'ctrl'
	};
}])
/*
.directive('sgParse', ['$log', '$parse', function($log, $parse){
	return {
		restrict: 'A',
		scope: {
			sgModel: '=',
			sgValue: '='
		},
		link: function($scope, elem, attrs, ctrl) {
			$scope.$watch(function(scope) {return scope.sgModel},function(n,o){
				$log.info(attrs.sgParse);
				$scope.sgValue = $parse(attrs.sgParse)(n);
			});
		}
	};
}])*/
;

angular.module('irf.dashboardBox', ['ui.router', 'irf.elements.commons'])
.directive('irfDashboardBox', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			definition: "="
		},
		templateUrl: 'irf/template/dashboardBox/dashboard-box.html',
		controller: 'irfDashboardBoxCtrl',
		controllerAs: 'c'
	}
})
.controller('irfDashboardBoxCtrl', ["$log", "$scope", "$q", "$element", "$state", "elementsUtils", function($log, $scope, $q, $element, $state, elementsUtils) {

	$scope.$watch(function(scope){return scope.definition;}, function(newValue, oldValue){
		if (newValue) load($scope.definition);
	});

	var load = function(menu) {
		$scope.dashboardItems = [];

		var max = 0;

		for (var i = 0; i < menu.items.length; i++) {
			menu.items[i].parentMenu = menu;
			$scope.dashboardItems[i] = menu.items[i];
			try {
				if (max < menu.items[i].data)
					max = menu.items[i].data;
			} catch (e) {}
		};

		$scope.max = max;
		$scope.menu = menu;
	};

	var getColor = function (value) {
		//value from 0 to 1
		var hue=Number((value*100).toString(10))/255;
		var hex = elementsUtils.hslToHex(hue, 0.5, 0.4);
		return "#"+hex;
	};

	$scope.getBgColor = function(data){
		var ii = $scope.dashboardItems, max = 0;
		for (var i = 0; i < ii.length; i++) {
			try {
				if (max < ii[i].data)
					max = ii[i].data;
			} catch (e) {}
		};
		return getColor((max - data)/max);
	};

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + ' | ' + document.mainTitle;
	};

	var __loadPage = function(menu) {
		if (menu.state) {
			$state.go(menu.state, menu.stateParams);
			updateAppTitle(menu.title);
		} else if (menu.items) {
			load(menu);
		}
	};

	$scope.loadPage = function(event, menu) {
		event.preventDefault();
		if (menu) {
			if (menu.onClick) {
				if (angular.isFunction(menu.onClick)) {
					var promise = menu.onClick(event, menu);
					if (promise && angular.isFunction(promise.then)) {
						promise.then(function(_menu){
							__loadPage(_menu);
						});
					}
				}
			} else {
				__loadPage(menu);
			}
		}
	};

	$scope.loadOfflinePage = function(event, menu) {
		event.preventDefault();
		$state.go('Page.EngineOffline', menu.stateParams);
		updateAppTitle("Offline | " + menu.title);
	};

}])
;
angular.module('irf.flipswitch', ['irf.elements.commons'])
.directive('irfFlipswitch', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			sgModel: "=?",
			sgDisabled: "=?",
			before: "@?",
			after: "@?"
		},/*
		link: function(scope, element, attrs){
			scope.checked = 'checked' in attrs;
		},*/
		templateUrl: 'irf/template/flipswitch/flipswitch.html'
	};
})
angular.module('irf.inputFile', ['ngFileUpload', 'irf.elements.commons'])

.directive('irfInputFile', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			form: "=irfForm",
			model: "=irfModel",
			modelValue: "=irfModelValue"
		},
		templateUrl: function(elem, attr){
			return "irf/template/inputFile/input-file.html";
		},
		link: function(scope, elem, attrs, ctrl) {
			ctrl.init(elem);
		},
		controller: "irfInputFileController"
	};
})

.controller('irfInputFileController', [
	"$scope",
	"$element",
	"$attrs",
	"$log",
	"$q",
	"Upload",
	"$http",
	"$httpParamSerializer",
	"jsonPath",
	"elementsUtils",
	"irfElementsConfig",
	"irfOfflineFileRegistry",
	function(
		$scope,
		$element,
		$attrs,
		$log,
		$q,
		Upload,
		$http,
		$httpParamSerializer,
		jsonPath,
		Utils,
		elementsConfig,
		offlineFileRegistry) {

	var self = this;

	var category = $scope.form.category || $scope.form.schema.category;
	var subCategory = $scope.form.subCategory || $scope.form.schema.subCategory;

	self.fileUpload = function(file) {
		var deferred = $q.defer();
		$scope.inputFileName = $scope.inputFileName || file.name;
		$scope.uploadProgress = 0;
		$scope.showUploadProgress = true;
		$scope.fileError = false;

/*

  *url: 'server/upload/url', // upload.php script, node.js route, or servlet url
  /*
  Specify the file and optional data to be sent to the server.
  Each field including nested objects will be sent as a form data multipart.
  Samples: {pic: file, username: username}
    {files: files, otherInfo: {id: id, person: person,...}} multiple files (html5)
    {profiles: {[{pic: file1, username: username1}, {pic: file2, username: username2}]} nested array multiple files (html5)
    {file: file, info: Upload.json({id: id, name: name, ...})} send fields as json string
    {file: file, info: Upload.jsonBlob({id: id, name: name, ...})} send fields as json blob, 'application/json' content_type
    {picFile: Upload.rename(file, 'profile.jpg'), title: title} send file with picFile key and profile.jpg file name * /
  *data: {key: file, otherInfo: uploadInfo},
  /*
  This is to accommodate server implementations expecting nested data object keys in .key or [key] format.
  Example: data: {rec: {name: 'N', pic: file}} sent as: rec[name] -> N, rec[pic] -> file  
     data: {rec: {name: 'N', pic: file}, objectKey: '.k'} sent as: rec.name -> N, rec.pic -> file * /  
  objectKey: '[k]' or '.k' // default is '[k]'
  /*
  This is to accommodate server implementations expecting array data object keys in '[i]' or '[]' or 
  ''(multiple entries with same key) format.
  Example: data: {rec: [file[0], file[1], ...]} sent as: rec[0] -> file[0], rec[1] -> file[1],...  
    data: {rec: {rec: [f[0], f[1], ...], arrayKey: '[]'} sent as: rec[] -> f[0], rec[] -> f[1],...* /  
  arrayKey: '[i]' or '[]' or '.i' or '' //default is '[i]'
  method: 'POST' or 'PUT'(html5), default POST,
  headers: {'Authorization': 'xxx'}, // only for html5
  withCredentials: boolean,
  /*
  See resumable upload guide below the code for more details (html5 only) * /
  resumeSizeUrl: '/uploaded/size/url?file=' + file.name // uploaded file size so far on the server.
  resumeSizeResponseReader: function(data) {return data.size;} // reads the uploaded file size from resumeSizeUrl GET response
  resumeSize: function() {return promise;} // function that returns a prommise which will be
                                            // resolved to the upload file size on the server.
  resumeChunkSize: 10000 or '10KB' or '10MB' // upload in chunks of specified size
  disableProgress: boolean // default false, experimental as hotfix for potential library conflicts with other plugins
  ... and all other angular $http() options could be used here.
*/

		self.upload = Upload.upload({
			url: FILE_UPLOAD_URL + $httpParamSerializer({
				category: category,
				subCategory: subCategory,
			}),
			data: {
				file: file
			}
		});

		self.upload.then(function(resp) {
			$scope.modelValue = jsonPath(resp.data, responseSelector)[0];
			$log.info($scope.modelValue);
			try {$scope.$apply()} catch(e) {$log.debug('error apply in fileUpload modelValue')}
			deferred.resolve($scope.modelValue);
		}, function(resp) {
			// handle error
			if ($scope.uploadAborted) {
				$scope.uploadAborted = false;
				$log.error("File upload aborted");
			} else {
				$log.error(resp);
				try {
					$scope.fileError = resp.data.error;
				} catch (e) {
					$scope.fileError = resp.data;
				}
			}
			$scope.showUploadProgress = false;
			deferred.reject($scope.fileError);
		}, function(e) {
			// progress notify file : evt.config.data.file.name
			$scope.uploadProgress = (e.loaded / e.total) * 100;
		});

		self.upload.finally(function(){
			$scope.showUploadProgress = false;
		});
		return deferred.promise;
	}

	self.getFileContent = function(mimeType, capture) {
		var deferred = $q.defer();
		var fileInput = $element.find('input:file')[0];
		if (capture == 'camera') {
			fileInput.setAttribute('capture', 'camera');
			fileInput.setAttribute('accept', mimeType + ';capture=camera');
		} else {
			fileInput.setAttribute('accept', mimeType);
		}

		fileInput.onchange = function() {
			var file = fileInput.files[0];
			if (file) {
				$log.info("file selected:" + file.name);
				if (capture) {
					var reader = new FileReader();
					reader.onloadend = function () {
						// reader.result will have prefix -> data:image/jpeg;base64,
						deferred.resolve([reader.result, file.name]);
					};
					reader.readAsDataURL(file);
				} else if ($scope.offlineFile) {
					var reader = new FileReader();
					reader.onloadend = function () {
						// reader.result will have prefix -> data:image/jpeg;base64,
						$scope.offlineFile.filename = file.name;
						$scope.offlineFile.data = reader.result;
						try {$scope.$apply()} catch(e) {$log.debug('error apply in reader.onloadend')}
					};
					reader.readAsDataURL(file);
				} else {
					deferred.resolve(file);
				}
			}
		};
		fileInput.click();

		return deferred.promise;
	};

	$scope.startFileUpload = function($event) {
		$event.preventDefault();
		$scope.uploadAborted = false;
		if ($scope.form.customHandle && _.isFunction($scope.form.customHandle)) {
			self.getFileContent($scope.form.fileType, false).then(function(file){
				$scope.inputFileName = $scope.inputFileName || file.name;
				$scope.uploadProgress = 0;
				$scope.showUploadProgress = true;
				$scope.fileError = false;
				var promise = $scope.form.customHandle(file, function(e){$scope.uploadProgress = (e.loaded / e.total) * 100;}, $scope.modelValue, $scope.form, $scope.model);
				if (promise && _.isFunction(promise.then)) {
					promise.finally(function(){
						$scope.showUploadProgress = false;
					});
				}
			});
		} else {
			self.getFileContent($scope.form.fileType, false).then(self.fileUpload);
		}
	};

	self.getBiometric = function(mimeType) {
		var deferred = $q.defer();
		$log.info('inside getBiometric: ' + mimeType);

		if (cordova && cordova.plugins && cordova.plugins.irfBluetooth && _.isFunction(cordova.plugins.irfBluetooth.enroll)) {
			cordova.plugins.irfBluetooth.enroll(function(result){
				if (result && result.code === 200 && result.data) {
					var string_data = JSON.stringify(result.data);
					$log.debug(string_data);
					if ($scope.offlineFile) {
						$scope.offlineFile.filename = 'biometric.iso';
						$scope.offlineFile.data = string_data;
						try {$scope.$apply()} catch(e) {$log.debug('error apply in cordova.plugins.irfBluetooth.enroll success')}
					} else {
						var biometricFile = Utils.getBlob([string_data], 'application/json');
						biometricFile.name = 'biometric.iso';
						deferred.resolve(biometricFile);
					}
				} else {
					deferred.reject('ERR_BIOMETRIC_CAPTURE_INVALID');
				}
			}, function(error){
				deferred.reject('ERR_BIOMETRIC_CAPTURE_FAILED');
			});
		} else {
			deferred.reject('ERR_BIOMETRIC_PLUGIN_MISSING');
		}

		return deferred.promise;
	};

	$scope.startBiometricCapture = function($event) {
		$event.preventDefault();
		$scope.uploadAborted = false;
		self.getBiometric($scope.form.fileType).then(self.fileUpload).catch(function(errMsg){
			$log.error(errMsg);
		});
	};

	var getPicture = function (options) {
		$log.info('Inside Utils.getPicture:', options);
		var deferred = $q.defer();

		var defaultOptions = {
			quality: 50,
			sourceType: options.captureMode == 'gallery'? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.DATA_URL,
			allowEdit: true/*,
			targetWidth: 75,
			targetHeight: 75*/
		};
		options = angular.extend(defaultOptions, options);

		navigator.camera.getPicture(function(imageData) {
			if (!_.startsWith(imageData, 'data:image/')) {
				imageData = 'data:image/jpeg;base64,' + imageData;
			}
			deferred.resolve([imageData, options.captureMode + '.jpg']);
		}, function(message) {
			deferred.reject(message);
		}, options);

		return deferred.promise;
	};

	$scope.startImageUpload = function($event, mode) {
		$event.preventDefault();
		$scope.uploadAborted = false;
		var processPicture = function(args){
			$scope.inputFileName = args[1];
			// $scope.inputImageDataURL = args[0];

			Utils.jicCompress(args[0], {
				resizeQuality: 0.75
			}).then(function(base64Out) {
				$scope.inputImageDataURL = base64Out; // data:image/jpeg;base64,
				try {
					var b2 = Utils.stripBase64(base64Out);
					var base64plain = b2[0];
					var mimeString = b2[1];

					if ($scope.offlineFile) {
						$scope.offlineFile.filename = $scope.inputFileName;
						$scope.offlineFile.data = base64Out;
					} else {
						$scope.uploadProgress = 0;
						$scope.showUploadProgress = true;

						var file = Utils.base64toBlob(base64plain, mimeString);
						file.name = $scope.inputFileName;
						self.fileUpload(file);
					}
					$scope.fileError = false;
					// try {$scope.$apply()} catch(e) {$log.debug('error apply in jicCompress success success')}
				} catch (e) {
					$scope.fileError = e;
					$scope.showUploadProgress = false;
					$log.error('File conversion failed.' + e);
					// try {$scope.$apply()} catch(e) {$log.debug('error apply in jicCompress success catch')}
				}
			});
		};

		var handleError = function(message){
			$log.info("getPicture failed: " + message);
			$scope.fileError = message;
			$scope.showUploadProgress = false;
		};

		if (typeof cordova === 'undefined') {
			self.getFileContent($scope.form.fileType, mode).then(processPicture).catch(handleError);
		} else {
			getPicture({
				captureMode: mode/*,
				targetWidth: 350,
				targetHeight:450*/
			}).then(processPicture).catch(handleError);
		}
	}

	$scope.removeUpload = function($event) {
		$event.preventDefault();
		Utils.confirm("Do you really want to remove the " + ($scope.isImage? "image?":"file?"), "Alert").then(function(){
			if (self.upload) {
				try {
					self.upload.abort();
					$scope.uploadAborted = true;
				} catch (e) {
					$scope.fileError = e.message;
				}
			}
			self.upload = null;

			if ($scope.offlineFile) {
				$scope.offlineFile.filename = null;
				$scope.offlineFile.data = null;
			} else if ($scope.modelValue) {
				$http.get(DELETE_URL + "file=" + $scope.modelValue);
			}

			$scope.modelValue = "";
			$scope.inputFileName = null;
			$scope.inputImageDataURL = null;
			$scope.uploadProgress = 0;
			$scope.showUploadProgress = false;
			$scope.fileError = false;

			$element.find('input:file')[0].value = '';
		});
	};
/*
	$scope.showError = function() {
		$log.error($scope.fileError);
		alert($scope.fileError);
	};*/

	var FILE_UPLOAD_URL = elementsConfig.fileUpload.fileUploadUrl + '?'; // ;
	var DATA_UPLOAD_URL = elementsConfig.fileUpload.fileUploadUrl + '?'; // ;
	var DELETE_URL = elementsConfig.fileUpload.fileDeleteUrl + '?'; // "http://ifmr_prot1.shahalpk.name/api/v1/media/image";
	var STREAM_URL = elementsConfig.fileUpload.fileStreamUrl + '/';
	var responseSelector = elementsConfig.fileUpload.responseSelector; // '$.fileId';

	var fileKey = $scope.form.key.join('$');

	self.init = function(elem) {
		$scope.isCordova = (typeof cordova) !== 'undefined';

		// $scope.id = 'input_' + $scope.form.key.join('$');
		$scope.label = $scope.form.title;
		// $scope.modelValue = "";

		$scope.uploadAborted = false;
		$scope.showUploadProgress = false;
		$scope.uploadProgress = 0;
		$scope.fileError = false;
		$scope.inputFileName = null;

		$scope.isImage = $scope.form.fileType && $scope.form.fileType.substr(0, 6) == 'image/';
		$scope.isBiometric = $scope.form.fileType && $scope.form.fileType.substr(0, 10) == 'biometric/';

		var getDataUrl = function(fileId) {
			if ((fileId+'').indexOf('-') > 1) {
				return STREAM_URL + fileId;
			} else {
				var httpParams = {
					category: category,
					subCategory: subCategory,
					accountNumber: fileId
				};
				if (angular.isFunction($scope.form.viewParams)) {
					var viewParams = $scope.form.viewParams($scope.modelValue, $scope.form, $scope.model);
					angular.extend(httpParams, viewParams);
				}
				return STREAM_URL + '?' + $httpParamSerializer(httpParams);
			}
			return null;
		};

		if ($scope.form.customHandle && _.isFunction($scope.form.customHandle)) {
			return;
		}

		$scope.$watch('modelValue', function(n,o){
			if (n) {
				if ($scope.isImage) {
					$scope.inputImageDataURL = getDataUrl(n);
				} else if (!$scope.isBiometric) {
					$scope.inputFileDataURL = getDataUrl(n);
				}
			}
		});

		if ($scope.form.offline) {
			$scope.model['$$OFFLINE_FILES$$'] = $scope.model['$$OFFLINE_FILES$$'] || {};
			$scope.offlineFile = $scope.model['$$OFFLINE_FILES$$'][fileKey] = $scope.model['$$OFFLINE_FILES$$'][fileKey] || {
				data: null,
				filename: null,
				category: category,
				subCategory: subCategory
			};

			$scope.$watch('offlineFile.data', function(n,o) {
				var d = $scope.offlineFile;
				$log.debug('model.$$OFFLINE_FILES$$.'+fileKey+' fire.' + !!d.data);
				// $scope.offlineFile.filename = d.filename;
				// $scope.offlineFile.data = d.data;
				$scope.inputFileName = d.filename;
				if ($scope.isImage && (n || !$scope.modelValue)) {
					$scope.inputImageDataURL = n;
				}
				if (n) {
					offlineFileRegistry.push(fileKey, self);
				}
			});

/*			$scope.$on('irf-offline-upload-start', function(e,d){
				if (d[0]===fileKey) {
					$scope.showUploadProgress = true;
				}
			});

			$scope.$on('irf-offline-upload-end', function(e,d){
				if (d[0]===fileKey) {
					$scope.showUploadProgress = false;
					$scope.modelValue = d[1];
				}
			});

			$scope.$on('irf-offline-upload-progress', function(e,d){
				if (d[0]===fileKey) {
					$scope.uploadProgress = d[1];
				}
			});*/
		}
	};

}]);

angular.module('irf.geotag', ['pascalprecht.translate'])
.directive('irfGeotag', function(){
	return {
		restrict: "E",
		replace: false,
		scope: { // 
			// { lat, long, geolocation /* readable format */, geourl /* url to map */ }
			watchValue: "=",
			model: "=",
			latitude: "=",
			longitude: "=",
			readOnly: "="
		},
		templateUrl: 'irf/template/geotag/geotag.html',
		controller: 'irfGeotagCtrl',
		controllerAs: 'c'
	}
})
.controller('irfGeotagCtrl',
["$log", "$scope", "$q", "$element", "$parse", "elementsUtils",
function($log, $scope, $q, $element, $parse, elementsUtils) {

	var formatGeolocation = function(lat, long) {
		if (!lat || !long) {
			return null;
		}
		var ConvertDDToDMS = function(D, lng) {
			var coord = {
				dir : D<0?lng?'W':'S':lng?'E':'N',
				deg : 0|(D<0?D=-D:D),
				min : 0|D%1*60,
				sec :(0|D*60%1*6000)/100
			};
			return coord.deg + "\xB0 " + coord.min + "' " + coord.sec + '" ' + coord.dir;
		};
		return ConvertDDToDMS(lat, false) + ', ' + ConvertDDToDMS(long, true);
	};

	var getGeoUrl = function(lat, long) {
		if (!lat || !long) {
			return null;
		}
		var geo = lat + ',' + long + '?q=' + lat + '+' + long + '&zoom=12.75'; // encodeURIComponent
		return (typeof cordova === 'undefined') ? ('//www.google.com/maps/@' + geo) : ('geo:' + geo);
	};

	var getGeoImageUrl = function(lat, long) {
		if (!lat || !long) {
			return null;
		}
		var color = localStorage.getItem("irfThemeColor");
		return "//maps.googleapis.com/maps/api/staticmap?size=360x160&zoom=16&markers=color:"
			+ color + "|" + lat + ',' + long
			+ "&style=feature:landscape|color:0xffffff&style=feature:road|element:geometry.fill";
	};

	var tryGeolocation = function (deferred, options) {
		var deferred = $q.defer();
		navigator.geolocation.getCurrentPosition(function(position) {
			$log.info('Location captured: latitude:' + position.coords.latitude);
			$log.info('longitude:' + position.coords.longitude);
			var lat = position.coords.latitude, long = position.coords.longitude;

			/** OUTPUT FORMAT **/
			var pos = {
				"latitude": lat,
				"longitude": long,
				"geolocation": formatGeolocation(lat, long),
				"geourl": getGeoUrl(lat, long),
				"geoimageurl": getGeoImageUrl(lat, long)
			};

			deferred.resolve(pos);
		}, function(error){
			switch(error.code) {
				case error.PERMISSION_DENIED:
					error.message = "GPS_USER_DENIED";
				break;
				case error.POSITION_UNAVAILABLE:
					error.message = "GPS_NO_GEOPOSITION";
				break;
				case error.TIMEOUT:
					error.message = "GPS_REQ_TIMEOUT";
				break;
				case error.UNKNOWN_ERROR:
					error.message = "GPS_ERR_UNKNOWN";
				break;
			}
			deferred.reject(error);
		}, options);
		return deferred.promise;
	}

	var getGeolocation = function() {
		var deferred = $q.defer();
		$log.info(navigator.geolocation);
		if (navigator.geolocation) {
			tryGeolocation({
				"maximumAge": 3000,
				"timeout": 5000,
				"enableHighAccuracy": true
			}).then(deferred.resolve, function (error) {
				$log.error(error);
				tryGeolocation({
					"maximumAge": 3000,
					"timeout": 30000,
					"enableHighAccuracy": false
				}).then(deferred.resolve, deferred.reject);
			});
		} else {
			deferred.reject('Unsupported feature');
		}
		return deferred.promise;
	};

	$scope.refreshLocation = function() {
		$scope.position = null;
		$scope.error = null;
		$element.find(".fa-refresh").addClass("fa-spin");
		getGeolocation().then(function(position){
			$scope.position = position;
			elementsUtils.mapValue($scope.latitude, $scope.model, position.latitude);
			elementsUtils.mapValue($scope.longitude, $scope.model, position.longitude);
			$element.find(".fa-refresh").removeClass("fa-spin");
		}).catch(function(error){
			$log.error(error);
			$scope.error = error;
			$element.find(".fa-refresh").removeClass("fa-spin");
		});
	};

	//if ($scope.readOnly) {
		$scope.$watch(function(scope){ return scope.watchValue; }, function(newValue, oldValue){
			var lat = $parse($scope.latitude)($scope.model);
			var long = $parse($scope.longitude)($scope.model);
			if (lat && long && lat > 0 && long > 0) {
				$scope.error = null;
				$scope.position = $scope.position || {};
				$scope.position.latitude = lat;
				$scope.position.longitude = long;
				$scope.position.geolocation = formatGeolocation($scope.position.latitude, $scope.position.longitude);
				$scope.position.geourl = getGeoUrl($scope.position.latitude, $scope.position.longitude);
				$scope.position.geoimageurl = getGeoImageUrl(lat, long);
			} else {
				$scope.error = {};
				$scope.error.message = "GPS_NO_LOCATION_INFO";
			}
		});
	/*} else {
		$scope.refreshLocation();
	}*/
}])
;
angular.module('irf.listViewRestWrapper', ['irf.elements.commons'])
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
        $scope.items = null;
        $scope.resultsLoaded = false;
        $scope.page = {
            currentPage: null,
            totalItemsCount: null,
            itemsPerPage: null
        };
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
            var def = $scope.def.paginationOptions;
            if (def.getTotalItemsCount!=null && def.getNthPageUrl!=null){
                uibPaginationOpts['boundary_links'] = true;
            }

            if (def.getPreviousPageUrl!=null && def.getPreviousPageUrl!=null){
                uibPaginationOpts['direction_links'] = true;
            }

            if (def.getTotalItemsCount!=null) {
                $scope.page.totalItemsCount = uibPaginationOpts['total_items'] = def.getTotalItemsCount(rawResponse);
            }

            if (def.getItemsPerPage!=null) {
                $scope.page.itemsPerPage = uibPaginationOpts['items_per_page'] = def.getItemsPerPage(rawResponse);
            }

            if (def.getNthPageUrl!=null){
                uibPaginationOpts['is_any_page_url_builder_available'] = true;
            }

            $scope.paginationOpts = uibPaginationOpts;
        };

        function updateListViewDefn(newItems){
            $log.info("Updating List View Definition");
            $scope.listViewDefn = {
                actions: $scope.def.listOptions.getActions()
            }
            $scope.listViewItems = newItems;
        }

        function resetAll(){
            $scope.listViewDefn = null;
            $scope.paginationDefn = null;
            $scope.isAvailable = false;
            $scope.page.currentPage = 1;
        }

        function loadData(url){
            if (url){
                $scope.isLoading = true;
                $http.get(url)
                    .success(function(data){
                        rawResponse = data;
                        currentResults = $scope.def.listOptions.getListItems(data);
                        $scope.resultsLoaded = false;
                        updateListViewDefn(currentResults);
                        $scope.items = $scope.def.listOptions.getItems(data);
                        buildUibPaginationOpts();
                    })
                    .error(function(data){

                    })
                    .finally(function(){
                        $scope.isLoading = false;
                        $scope.isAvailable = true;
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
            $log.info("New page is ::" + $scope.page.currentPage);
            var pageUrl = $scope.def.paginationOptions.getNthPageUrl($scope.page.currentPage, baseQuery, rawResponse);
            loadData(pageUrl);
        }

    }])
angular.module('irf.listView', ['irf.elements.commons'])
.directive('irfListView',['$log', function($log){
	return {
		restrict: "E",
		replace: true,
		scope: {
			listStyle: "=?",
			listInfo: "=listInfo",
			listItems: "=irfListItems",
			listActualItems: "=irfListActualItems",
			cb: "&?callback"
		},
		templateUrl: "irf/template/listView/list-view.html",
		link: function(scope, elem, attrs) {

		},
		controller: "irfListViewController"
	}
}])
.controller('irfListViewController', ['$scope', function($scope){

	$scope.callback = function(item, index) {
		$scope.cb ? $scope.cb({"item":item, "index":index}) : '';
	}
}])

.directive('irfListViewItem', ['$log',function($log){
	return {
		restrict: "E",
		replace: true,
		scope: {
			listStyle: "=",
			item: "=listItem",
			actualItem: "=listActualItem",
			actions: "=listActions",
			itemIndex: "=listItemIndex",
			selectable: "=",
			expandable: "=",
			cb: "&?callback"
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

	$scope.expanded = false;
	$scope.expand = function($event) {
		if ($scope.item && $scope.item.length > 3) {
			$scope.expandItems = $scope.item.slice(3);
			$scope.expanded = !$scope.expanded;
		}
	}
}])
;

angular.module('irf.lov', ['irf.elements.commons', 'schemaForm'])
.directive('irfLov', ["$q", "$log", "$uibModal", "elementsUtils", "schemaForm", function($q, $log, $uibModal, elementsUtils, schemaForm){
	return {
		scope: {
			form: "=irfForm",
			modelValue: "=?irfModelValue",
			parentModel: "=irfModel"
		},
		restrict: 'A',
		link: function($scope, elem, attrs, ctrl) {
			$(elem).click(ctrl.onClickLOV);
		},
		controller: 'irfLovCtrl'
	};
}])
.controller('irfLovCtrl', ["$scope", "$q", "$log", "$uibModal", "elementsUtils", "schemaForm", "$element",
function($scope, $q, $log, $uibModal, elementsUtils, schemaForm, $element){
	var self = this;
	$scope.inputFormHelper = $scope.form.searchHelper;

	self.onClickLOV = function(e) {
		e.preventDefault();

		$scope.listResponseItems = null;
		$scope.listDisplayItems = null;
		$scope.bindModel = {};
		$scope.inputModel = {};
		$scope.locals = {};
		$scope.inputForm = [];
		$scope.formName = $scope.form.key.join('__');

		$scope.locals.arrayIndex = elementsUtils.getArrayIndex($scope.form.key);

		elementsUtils.mapInput($scope.form.bindMap, $scope.parentModel, $scope.bindModel, $scope.locals);

		elementsUtils.mapInput($scope.form.inputMap, $scope.parentModel, $scope.inputModel, $scope.locals);

		$scope.inputSchema = {
			"type": "object",
			"properties": {}
		};

		angular.forEach($scope.form.inputMap, function(value, key){
			var v;
			if (_.isObject(value)) {
				v = value.key.split(".");
				var vv = _.clone(value);
				vv.key = key;
				$scope.inputForm.push(vv);
			} else {
				$scope.inputForm.push(key);
				v = value.split(".");
			}
			var s = $scope.$parent.$parent.schema;
			for (i = 0; i < v.length; i++) {
				if (_.endsWith(v[i], '[]')) {
					v[i] = v[i].substring(0, v[i].length-2);
					s = s["properties"][v[i]]["items"];
				} else {
					s = s["properties"][v[i]];
				}
			}
			$scope.inputSchema.properties[key] = s;
		});

		/*var mergedInputForm = schemaForm.merge($scope.$parent.$parent.schema, _.values($scope.form.inputMap));

		angular.forEach(mergedInputForm, function(value, key){
			$scope.inputSchema.properties[key] = s;
		});*/

		var bindSize = _.size($scope.form.bindMap);
		if (bindSize && bindSize != _.remove(_.values($scope.bindModel), undefined).length) {
			self.showBindValueAlert($scope.form.bindMap);
			return;
		}

		if ($scope.form.autolov) {
			$element.find('i').attr('class', 'fa fa-spinner fa-pulse fa-fw color-theme');
			self.init($scope.inputModel);
			getSearchPromise().then(function(out){
				if (out.body && out.body.length === 1) {
					$scope.callback(out.body[0]);
				} else {
					displayListOfResponse(out);
					self.launchLov(true, true);
				}
				$element.find('i').attr('class', 'fa fa-bars color-theme');
			}, function(){
				self.launchLov(true, false);
				$element.find('i').attr('class', 'fa fa-bars color-theme');
			});
		} else {
			self.launchLov(false, false);
		}
	};

	self.showBindValueAlert = function(bindKeys) {
		elementsUtils.alert("Value(s) for " + _.keys(bindKeys).join(", ") + " which is/are required is missing");
	};

	self.launchLov = function(isInitialized, isSubmitted) {
		if (!isInitialized) {
			self.init($scope.inputModel);
		}
		if ($scope.inputForm.length) {
			$scope.inputForm.push({"type":"submit", "title":"Search"});
		} else if (!isSubmitted) {
			$scope.inputActions.submit();
		}

		$scope.modalWindow = $uibModal.open({
			scope: $scope,
			templateUrl: "irf/template/lov/modal-lov.html",
			controller: function($scope) {
				$scope.$broadcast('schemaFormValidate');
				//$log.info($scope.locals);
			}
		});
	};

	self.init = function(model) {
		if (angular.isFunction($scope.form.initialize)) {
			$scope.form.initialize(model, $scope.form, $scope.parentModel, $scope.locals);
		} else if ($scope.form.initialize) {
			$scope.evalExpr($scope.form.initialize, {inputModel:model, form:$scope.form, model:$scope.parentModel, context:$scope.locals});
		}
	};

	$scope.inputActions = {};

	var getSearchPromise = function() {
		angular.extend($scope.inputModel, $scope.bindModel);
		var promise;
		if (angular.isFunction($scope.form.search)) {
			promise = $scope.form.search($scope.inputModel, $scope.form, $scope.parentModel, $scope.locals);
		} else if ($scope.form.search) {
			promise = $scope.evalExpr($scope.form.search, {inputModel:$scope.inputModel, form:$scope.form, model:$scope.parentModel, context:$scope.locals});
		}
		return promise;
	};

	var displayListOfResponse = function(out) {
		$scope.noRecordError = null;
		$scope.listResponseItems = out.body;
		$scope.listDisplayItems  =[];
		if (!out.body || !out.body.length) {
			$scope.noRecordError = "NO_RECORDS_FOUND";
		}
		angular.forEach(out.body, function(value, key) {
			c = $scope.form.getListDisplayItem(value, key);
			this.push(c);
		}, $scope.listDisplayItems);
	};

	$scope.inputActions.submit = function(model, form, formName) {
		$scope.showLoader = true;
		getSearchPromise().then(function(out){
			displayListOfResponse(out);
			$scope.showLoader = false;
		},function(){
			$scope.showLoader = false;
		});
	};

	$scope.callback = function(item) {
		if ($scope.form.outputMap) {
			elementsUtils.mapOutput($scope.form.outputMap, item, $scope.parentModel, $scope.locals);
		}
		if ($scope.form.onSelect) {
			if (angular.isFunction($scope.form.onSelect)) {
				$scope.form.onSelect(item, $scope.parentModel, $scope.locals);
			} else if ($scope.form.onSelect) {
				$scope.evalExpr($scope.form.onSelect, {result:item, model:$scope.parentModel, context:$scope.locals});
			}
		}
		self.close();
	};

	self.close = function() {
		if ($scope.modalWindow) $scope.modalWindow.close();
		$scope.listResponseItems = null;
		$scope.listDisplayItems = null;
	};
}])
;
angular.module('irf.pikaday', ['irf.elements.commons'])
.directive('irfPikaday', ["$log", "irfElementsConfig", function($log, elemConfig){
	// Runs during compile
	return {
		restrict: 'A',
		require: '^ngModel',
		scope: {
			ngModel: '=',
			form: '=irfPikaday'
		},
		link: function($scope, element, attrs, ctrl) {
			var elem = $(element);
			var datepicker = 'pikaday';
			var pikadayOptions = {
				// minDate: new Date(1800, 0, 1),
				// maxDate: new Date(2050, 12, 31),
				// yearRange: [1800,2050],
				// format: 'YYYY-MM-DD'
			};
			angular.extend(pikadayOptions, elemConfig.pikaday);
			if (!$scope.form.readonly) {
				if (typeof cordova !== 'undefined' && window.datePicker) {
					elem.next().on('click', function(){
						window.datePicker.show({
							date: $scope.ngModel ? moment($scope.ngModel, 'YYYY-MM-DD').toDate() : new Date(),
							mode: 'date'
						}, function(date){
							$log.info(date);
							$scope.ngModel = moment(date, 'YYYY-MM-DD').format(pikadayOptions.format);
							elem.val($scope.ngModel);
							elem.controller('ngModel').$setViewValue($scope.ngModel);
						});
					});
				} else {
					var setValue = function(value) {
						$scope.ngModel = value;
						elem.val($scope.ngModel);
						elem.controller('ngModel').$setViewValue($scope.ngModel);
					};
					pikadayOptions.field = elem.next()[0];
					pikadayOptions.onSelect = function(date) {
						setValue(this.getMoment().format(pikadayOptions.format));
					};
					pikadayOptions.onDraw = function() {
						$('.pika-label').contents().filter(function(){return this.nodeType===3}).remove();
					};
					var picker = new Pikaday(pikadayOptions);
					elem.next().on('blur', function(e){
						if (this.value && this.value.length == 8) {
							var m = moment(this.value, 'DDMMYYYY');
							setValue(m.format('YYYY-MM-DD'));
						} else if (!this.value) {
							setValue('');
						}
					}).on('focus', function(e){
						this.select();
					});
				}
			}
			// $scope.$parent.datePattern = /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/i;
			$scope.$watch(function(scope){return scope.ngModel}, function(n,o){
				if (n) {
					if (pikadayOptions.dateDisplayFormat) {
						elem.next().val(moment(n, 'YYYY-MM-DD').format(pikadayOptions.dateDisplayFormat));
					} else {
						elem.next().val(moment(n, 'YYYY-MM-DD').format('DD-MM-YYYY'));
					}
				} else {
					elem.next().val('');
				}
			});
		}
	};
}]);
angular.module('irf.progressMessage',[])
    .run(['$document', '$log', '$rootScope', '$compile', function($document, $log, $rootScope, $compile){
        $log.info("Inside run() of irf.progressMessage");

        var $body = $document.find('body');
        var progressMsgContainer = "<irf-progress-message-container></irf-progress-message-container>";
        $body.append(progressMsgContainer);
        $rootScope.irfProgressMessages = [];

    }])
    .factory('irfProgressMessage', ['$rootScope', '$timeout', function($rootScope, $timeout){

        return {
            pop: function(id, text, timeSpan, level, title){
                /* Validation */
                if (!text || text==""){ return; }

                timeSpan = timeSpan || 0;

                var messages = $rootScope.irfProgressMessages;
                var existingMessage = null;

                for (var i=0; i< messages.length; i++){
                    var message = messages[i];
                    if (message.id == id){
                        existingMessage = message;
                    }
                }

                if (existingMessage != null){
                    existingMessage.text = text;
                    existingMessage.level = level;
                } else {
                    $rootScope.irfProgressMessages.push({
                        id: id,
                        text: text,
                        level: level,
                        title: title
                    })
                }

                if (timeSpan>0){
                    $timeout(function(){
                        for (var i=0; i< messages.length; i++){
                            var message = messages[i];
                            if (message.id == id){
                                messages.splice(i, 1);
                            }
                        }
                    }, timeSpan)
                }
            },
            clear: function(id){
                var messages = $rootScope.irfProgressMessages;
                for (var i=0; i< messages.length; i++){
                    var message = messages[i];
                    if (message.id == id){
                        messages.splice(i, 1);
                    }
                }
            },
            gracefulClearAll: function(timespan){
                timespan = timespan || 1000;
                $timeout(function(){
                    var messages = $rootScope.irfProgressMessages;
                    for (var i=0; i< messages.length; i++){
                        messages.splice(i, 1);
                    }
                }, timespan)
            }
        }
    }])
    .directive('irfProgressMessageContainer', function(){

        return {
            restrict: "E",
            templateUrl: function(element, attrs){
                return attrs.templateUrl || "irf/template/progressMessage/progress-message-container.html";
            },
            controller: "irfProgressMessageContainerController",
            controllerAs: "c",
            replace: true
        }
    })
    .controller('irfProgressMessageContainerController', ['$scope', '$log', function($scope, $log){
        $log.info("Inside irfProgressMessageContainerController");


    }])
    .directive('irfProgressMessage', function(){

        return {
            restrict: "E",
            scope: {
                msg: "=irfProgressMsg"
            },
            templateUrl: function(element, attrs){
                return attrs.templateUrl || "irf/template/progressMessage/progress-message.html";
            },
            controller: "irfProgressMessageController",
            controllerAs: "c",
            replace: true
        }
    })
    .controller('irfProgressMessageController', ['$scope', '$log', '$rootScope', function($scope, $log, $rootScope){
        $log.info("Inside irfProgressMessageController");
        var id = $scope.msg.id;
        $scope.dismiss = function(){
            var messages = $rootScope.irfProgressMessages;
            var existingMessage = null;

            for (var i=0; i< messages.length; i++){
                var message = messages[i];
                if (message.id == id){
                    messages.splice(i,1);
                }
            }
            $scope.msg = null;
        }
    }])

angular.module('irf.schemaforms', ['irf.schemaforms.adminlte'])
.directive("irfSf", ["$log", "$filter", "$timeout", "elementsUtils", function($log, $filter, $timeout, elementsUtils){
	return {
		restrict: "E",
		replace: true,
		scope: {
			form: "=irfForm",
			schema: "=irfSchema",
			actions: "=irfActions",
			model: "=irfModel",
			helper: "=irfHelper",
			formName: "=irfFormName",
			initialize: "&?"
		},
		templateUrl: "irf/template/schemaforms/schemaforms.html",
		link: function($scope, elem, attrs) {
			$scope.log = $log.info;
			$scope.schemaForm = $scope[$scope.formName];
			if ($scope.schemaForm) {
				$scope.schemaForm.scope = $scope;
				$scope.schemaForm.submit = function() {
					document.forms[$scope.formName].submit();
				};
			}
			if (angular.isFunction($scope.initialize)) {
				var start = new Date().getTime();
				$timeout(function() {
					if (!angular.isFunction($scope.form)) {
						$log.debug('init delay:' + ((new Date().getTime()) - start));
						$scope.initialize({model:$scope.model, form:$scope.form, formCtrl:$scope.schemaForm});
					} else {
						$log.debug('form is FUNCTION');
					}
				});
			}

			$scope.boxDestroy = function() {
				return function() {
					$scope.$emit('box-destroy');
				};
			};
			
			$scope.callSelectOnChange = function(event, form, modelValue){
				$scope.$broadcast('selectbox-value-changed', [event, form, modelValue])
				$scope.callOnChange(event, form, modelValue);
			}

			$scope.callOnChange = function(event, form, modelValue) {
				var arrayIndex = elementsUtils.getArrayIndex(form.key);
				if (arrayIndex || arrayIndex===0) {
					/*event.arrayIndex = */form.arrayIndex = arrayIndex;
				}
				if (angular.isFunction(form.onChange)) {
					form.onChange(modelValue, form, $scope.model, $scope.schemaForm, event);
				} else if (angular.isString(form.onChange)) {
					$scope.$eval(form.onChange, {modelValue:modelValue, form:form, model:$scope.model, formCtrl: $scope.schemaForm, $event:event});
				}
			};

			$scope.buttonClick = function(event, form) {
				var arrayIndex = elementsUtils.getArrayIndex(form.key);
				if (arrayIndex || arrayIndex===0) {
					event.arrayIndex = form.arrayIndex = arrayIndex;
				}
				if (angular.isFunction(form.onClick)) {
					form.onClick($scope.model, $scope.schemaForm, form, event);
				} else if (angular.isString(form.onClick)) {
					$scope.$eval(form.onClick, {model:$scope.model, formCtrl: $scope.schemaForm, form:form, $event:event});
				}
			}

			$scope.$on('irfSfDeleteFromArray', function($event, args) {
				var index = args[0];
				var title = args[1];
				elementsUtils.confirm("Do you really want to remove " + (index+1) + ". " + title + " ?", "Alert").then(function(){
					$event.targetScope.deleteFromArray(index);
				});
			});

			$scope.save = function() {
				if (!$scope.model.$$STORAGE_KEY$$) {
					$scope.model.$$STORAGE_KEY$$ = elementsUtils.generateUUID();
				}
				$scope.helper.save($scope.model, $scope.schemaForm, $scope.formName, $scope.actions);
			}

			$scope.submit = function() {
				$log.debug('Form submit fired!');
				if ($scope.model && angular.isObject($scope.model.$$OFFLINE_FILES$$)) {
					$scope.maskSchemaForm = true;
					elementsUtils.uploadOfflineFiles($scope.model.$$OFFLINE_FILES$$).then(function(){
						$timeout(function(){
							$scope.$broadcast('schemaFormValidate');
							$scope.helper.submit($scope.model, $scope.schemaForm, $scope.formName, $scope.actions);
						});
					}).finally(function(){
						$scope.maskSchemaForm = false;
					});
				} else {
					$scope.$broadcast('schemaFormValidate');
					$scope.helper.submit($scope.model, $scope.schemaForm, $scope.formName, $scope.actions);
				}
			}

			$scope.initTableCell = function(item, index) {
				item.key.splice(item.key.length-2, 1, index);
				$log.debug(item.key);
			};

			/*
			Form will be introduced with new variables

			parentClassifier: standard parent classifier,
			parentCode: standard parent code, used to filter values,
			_filters: array of key values used to filter select options
			*/
			var selectsUnderParent = {};
			var selectsUnderFilter = {};
			var filtersUnderWatch = {};
			$scope.registerForTitleMap = function(form) {
				if (form && form.enumCode/* && (!form.titleMap || form.titleMap.length==0)*/) {
					var r = $scope.helper.enum(form.enumCode);
					// debugger;
					if (r) {
						var titleMap = r.data;
	/*					var key = r.parentClassifier;
						if (key) {
							if (!selectsUnderParent[key]) {
								selectsUnderParent[key] = [];
							}
							selectsUnderParent[key].push(form);
							form.parentClassifier = key;
						}*/
						form.titleMap = titleMap;

						var ai = elementsUtils.getArrayIndex(form.key);
						var f = form.filter;
						if (f && _.isObject(f)) {
							form._filters = {};
							_.forEach(f, function(vai, k){
								var v = _.replace(vai, 'arrayIndex', ai);
								if (!selectsUnderFilter[v]) {
									selectsUnderFilter[v] = [];
								}
								selectsUnderFilter[v].push([form, k]);
								if (!filtersUnderWatch[v]) {
									filtersUnderWatch[v] = selectsUnderFilter[v];
									$log.debug('under watch:'+v);
									$scope.$watch(v, function(val, key){
										var ar = selectsUnderFilter[v];
										for (i = 0; i < ar.length; i++) {
											var _form = ar[i][0];
											var filterKey = ar[i][1];
											var fk = filterKey.split(' as ');
											var value = null;
											if (fk[1]) {
												value = $scope.code(val, fk[1]);
												fk = fk[0];
											} else {
												value = val;
												fk = filterKey;
											}
											$log.debug(fk + ':' + value);
											_form._filters[fk] = value;
										}
									});
								}
							});
						}
					}
				}
			};

			$scope.code = function(value, classifier) {
				if (value) {
					$log.debug(value+" as "+classifier);
					var r = $scope.helper.enum(classifier);
					if (r) {
						var d = $filter('filter')(r.data, {value:value});
						if (d && d.length == 1 && _.isObject(d[0])) {
							return d[0].code;
						} else if (d.length > 1) {
							$log.debug('TOO MANY parent REFCODES for '+classifier+' value:'+value);
							$log.debug(d);
						}
					}
				}
				return null;
			};

			$scope.$watch('model', function(n,o) {
				$log.info('ji');
				$scope.$broadcast('irf-sf-model-changed');
			}, true);

			$scope.$on('irfSelectValueChanged', function(event, data) {
				if (data && data.length === 2) {
					var classifier = data[0];
					var code = data[1];
					// $log.info('In irfSelectValueChanged:code: ' + code);
					var childForms = selectsUnderParent[classifier];
					if (childForms && childForms.length) {
						for(i = 0; i < childForms.length; i++) {
							childForms[i].parentCode = code;
						}
					}
				}
			});

			$scope.showLoading = true;
			$scope.$on('sf-render-finished', function(event){
				$log.info("on sf-render-finished");
				$scope.showLoading = false;
			});

			$scope.$emit('irf-sf-init');
		}
	};
}])
;
angular.module('irf.searchBox', [])
    .directive('irfSearchBox', function(){
        return {
            restrict: "E",
            replace: true,
            scope: {
                def: "=irfSearchDefinition",
                searchUrl: "=irfSearchUrl"
            },
            templateUrl: 'irf/template/searchBox/search-box.html',
            controller: 'irfSearchBoxController',
            controllerAs: 'c'
        }
    })
    .controller('irfSearchBoxController', ["$log", "$scope", function($log, $scope){
        $scope.searchOptions = {};
        $scope.searchUrl = "";

        $scope.startSearch = function(){
            $log.info("Starting search");
            $scope.searchUrl = $scope.def.urlBuilder($scope.searchOptions);
            $log.info($scope.searchOptions);
        }
    }])
;

angular.module('irf.resourceSearchWrapper', ['irf.elements.commons', 'ngResource'])
.directive('irfResourceSearchWrapper', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			definition: '=',
			modalPopup: '=?',
			model: '=irfModel',
			initialize: '&?'
		},
		templateUrl: 'irf/template/searchListWrapper/resource-search-wrapper.html',
		controller: 'irfResourceSearchWrapperController',
		controllerAs: 'c,',
		link: function(scope, element, attrs){
			var def = scope.definition;
			scope.model.view = 'idle';

			scope.listViewOptions = {
				listStyle: def.listOptions.listStyle,
				selectable: def.listOptions.selectable,
				expandable: def.listOptions.expandable,
				actions: def.listOptions.getActions()
			};
			if (angular.isFunction(def.listOptions.getTableConfig)) {
				scope.listViewOptions.config = def.listOptions.getTableConfig();
			}
			if (angular.isFunction(def.listOptions.getColumns)) {
				scope.listViewOptions.columns = def.listOptions.getColumns();
			}
		}
	}
})
.controller('irfResourceSearchWrapperController',
['$log', '$q', '$scope',
function($log, $q, $scope){

	$scope.loadResults = function(searchOptions) {
		var deferred = $q.defer();
		$scope.showSearchSectionFarLoader = true;
		var pageOptions = {
			pageNo: $scope.pageInfo.currentPage,
			itemsPerPage: $scope.getItemsPerPage()
		};

		if (_.isFunction($scope.definition.listOptions.getBulkActions))
			$scope.bulkActions = $scope.definition.listOptions.getBulkActions();

		$scope.model.view = 'results-loading';
		var promise = $scope.definition.getResultsPromise(searchOptions, pageOptions);

		promise.then(function(out){ /* Success callback */
			response = out.body;
			headers = out.headers;

			/* Build results */
			var items = $scope.definition.listOptions.getItems(response, headers);
			$scope.model._result = $scope.model._result || {};
			$scope.model._result.items = items;

			deferred.resolve($scope.model.searchOptions);
		}, function(){ /* Failure callback */
			$scope.model.view = 'results-failed';
			deferred.reject($scope.model.view);
		}).finally(function(){
			$scope.showSearchSectionFarLoader = false;
		});
		return deferred.promise;
	};

	$scope.$watch('model._result.items', function(n,o) {
		$log.debug('watch model._result.items.fire.' + !!n);
		if (n && _.isArray(n)) {
			var listItems = [];
			for (var i=0; i< n.length; i++){
				var listItem = $scope.definition.listOptions.getListItem(n[i]);
				listItems.push(listItem);
			}
			$scope.items = n;
			$scope.listItems = listItems;
			$scope.model.view = 'results-loaded';
		}
	});

	$scope.definition.actions = $scope.definition.actions || {};
	$scope.definition.actions.submit = function(searchOptions, form, formName) {
		$scope.model.searchOptions = searchOptions;
		if (!form || form.$valid)
			return $scope.loadResults(searchOptions);
	};

	$scope.getTotalItems = function(){
		try {
			if ($scope.definition.paginationOptions){
				var out = $scope.definition.paginationOptions.getTotalItemsCount(response, headers);
				if (out) return out;
			}
		} catch (e) {}
		if ($scope.model._result && $scope.model._result.items) {
			$log.debug("offline item length:" + $scope.model._result.items.length);
			return $scope.model._result.items.length;
		}
		return null;
	};

	$scope.getItemsPerPage = function(){
		if ($scope.definition.paginationOptions){
			var out = $scope.definition.paginationOptions.getItemsPerPage(response, headers);
			return out;
		}
	}
	$scope.definition.actions.redoSearch = $scope.loadResults;
	/** INIT Section **/
	/**
	 * Performs the following tasks
	 *
	 * 1) On Submit Button on the form, we'll trigger the method to call results
	 */
	$scope.pageInfo = {
		currentPage: 1
	};

	var response, headers;

	$scope.formHelper = $scope.definition.getSearchFormHelper();

	if ($scope.definition.searchForm && $scope.definition.searchForm.length) {
		var sfc = _.cloneDeep($scope.definition.searchForm);
		if (sfc[sfc.length - 1].type !== 'actions') {
			var actions = null;
			var submitOnClick = function(model, formCtrl, form, event) {
				if (window.innerWidth <= 768 || $scope.definition.listOptions.listStyle === 'table') {
					$(event.target).parents('.box-body.collapse.in').removeClass('in');
				}
			};
			if ($scope.definition.offline) {
				actions = [{
					"type": "submit",
					"title": "SEARCH",
					"onClick": submitOnClick
				},{
					"type": "save",
					"title": "SEARCH_AND_SAVE"
				}];
			} else {
				actions = [{
					"type": "submit",
					"title": "SEARCH",
					"onClick": submitOnClick
				}];
			}
			sfc.push({
				"type": "section",
				"html": "<hr/>"
			});
			if ($scope.definition.sorting && $scope.definition.sortByColumns) {
				sfc.push({
					"type": "section",
					"htmlClass": "row",
					"items": [{
						"type": "section",
						"htmlClass": "col-xs-10",
						"items": [{
							"key": "sortBy",
							"type":"select",
							"title": "SORT_BY",
							"titleMap": $scope.definition.sortByColumns
						}]
					},{
						"type": "section",
						"htmlClass": "col-xs-2",
						"items": [{
							"type":"anchor",
							"notitle":true,
							"title": "",
							"icon": "fa fa-sort-amount-asc",
							"onClick": function (model, formCtrl, form, event) {
								if (form.icon == "fa fa-sort-amount-asc") {
									form.icon = "fa fa-sort-amount-desc";
									if (model.sortBy && !_.startsWith(model.sortBy, '-')) {
										try {
											//$scope.searchForm[0].
										} catch (e) {}
										var v = $scope.definition.sortByColumns[model.sortBy];
										model.sortBy = '-' + model.sortBy;
										$scope.definition.sortByColumns[model.sortBy] = v;
									}
								} else {
									form.icon = "fa fa-sort-amount-asc";
									if (model.sortBy && _.startsWith(model.sortBy, '-')) {
										model.sortBy = model.sortBy.slice(1);
									}
								}
							}
						}]
					}]
				});
			}
			sfc.push({
				"type": "actions",
				"notitle": true,
				"items": actions
			});
		}
		if ($scope.modalPopup) {
			$scope.searchForm = sfc;
		} else {
			var b = {
				"type": "box",
				"title": $scope.definition.title,
				"items": sfc
			};
			if ($scope.definition.listOptions.listStyle === 'table') {
				b.colClass = 'col-sm-12';
			}
			$scope.searchForm = [b];
		}
	}

	$scope.model = $scope.model || {};
	$scope.model.searchOptions = $scope.model.searchOptions || {};

	if ($scope.definition.listOptions.listStyle) {
		$scope.listStyle = $scope.definition.listOptions.listStyle;
	} else {
		$scope.listStyle = "basic";
	}

	var init = function(model, form, formCtrl) {
		if ($scope.initialize && angular.isFunction($scope.initialize)) {
			$scope.initialize({model:$scope.model.searchOptions, form:$scope.searchForm, formCtrl:formCtrl});
		}
		if ($scope.definition.autoSearch) {
			$log.info('Auto Searching');
			$scope.loadResults($scope.model.searchOptions);
		}
	};

	$scope.initSF = function(model, form, formCtrl) {
		init(model, form, formCtrl);
	};

	if (!$scope.definition.searchForm || !$scope.definition.searchForm.length) {
		$scope.definition.autoSearch = true;
		init($scope.model.searchOptions, $scope.searchForm, null);
	}

}])

.factory('irfModalQueue', ['$log', '$q', '$filter', '$uibModal', function($log, $q, $filter, $uibModal){
	return {
		showModalQueue: function(definition) {
			$log.info(definition);
			var deferred = $q.defer();
			var modalQueueWindow = $uibModal.open({
				templateUrl: 'irf/template/searchListWrapper/modal-resource-queue.html',
				controller: function($scope){
					$scope.queueDefinition = definition;

					try{
						$scope.model = $scope.model || {};
						$scope.model.searchOptions = $scope.model.searchOptions || {};
						$scope.queueDefinition.initialize($scope.model.searchOptions);
					}catch(err){
						$log.error(err);
					}

					$scope.queueDefinition.listOptions.selectable = true;
					if (!$scope.queueDefinition.listOptions.listStyle) {
						$scope.queueDefinition.listOptions.listStyle = "simple";
					}
					$scope.modalPopup = true;


					$scope.saveSelection = function() {
						if ($scope.model._result && $scope.model._result.items) {
							var items = $filter('filter')($scope.model._result.items, {$selected:true}, true);
							modalQueueWindow.close();
							deferred.resolve(items);
						}
					};
					$scope.toggle = true;
					$scope.$watch('toggle', function(){
						$scope.toggleText = $scope.toggle ? 'SELECT_ALL' : 'DESELECT_ALL';
						$scope.toggleIcon = $scope.toggle?"<i class='fa fa-check-square-o'></i>":"<i class='fa fa-square-o'></i>"
						if ($scope.model._result && $scope.model._result.items) {
							_.each($scope.model._result.items, function(v,k){
								v.$selected = !$scope.toggle;
							});

						}

					})
				}
			});
			return deferred.promise;
		}
	}
}])
;
angular.module('irf.searchListWrapper', ['irf.elements.commons', 'ngResource'])
	.directive('irfSearchListWrapper', function(){
		return {
			restrict: "E",
			replace: true,
			scope: {
				definition: "="
			},
			templateUrl: 'irf/template/searchListWrapper/search-list-wrapper.html',
			controller: 'irfSearchListWrapperCtrl',
			controllerAs: 'c'
		}
	})
	.controller('irfSearchListWrapperCtrl', ["$log", "$scope", function($log, $scope){

	}])
	.constant('searchResponseTransform', function(data, headersGetter){
		var response = {};
		response.data = data;
		response.headers = headersGetter();
		return response;
	})
;

angular.module('irf.tableView', ['irf.elements.commons'])
	.directive('irfTableView', ['$log', function($log) {
		return {
			restrict: "E",
			replace: true,
			scope: {
				tableOptions: "=",
				tableData: "="
			},
			templateUrl: "irf/template/tableView/table-view.html",
			link: function(scope, elem, attrs, ctrl) {
				ctrl.init(elem);
			},
			controller: "irftableViewController"
		}
	}])
	.controller('irftableViewController', ['$scope', '$element', '$filter', '$compile', '$log', '$timeout',
		function($scope, $element, $filter, $compile, $log, $timeout) {
			var dataTable;
			var actionsTemplate = '<div class="dropdown" ng-if="tableOptions.actions.length">' +
				'    <button class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
				'        <i class="glyphicon glyphicon-option-vertical"></i>' +
				'    </button>' +
				'    <ul class="dropdown-menu dropdown-menu-right irf-action-dropdown-menu bg-tint-theme" >' +
				'        <li ng-repeat="action in tableOptions.actions" ng-if="action.isApplicable(tableData[$$itemIndex$$], $$itemIndex$$)">' +
				'            <a href="" ng-click="action.fn(tableData[$$itemIndex$$], $$itemIndex$$);">' +
				'                <i ng-if="action.icon" class="{{action.icon}}"></i>' +
				'                {{ action.name | translate }}' +
				'            </a>' +
				'        </li>' +
				'    </ul>' +
				'</div>';

			$log.info($scope.tableOptions);
			var datatableConfig = {};
			var defaultConfig = {
				"info": false,
				"paginate": false,
				"deferRender": true,
				"order": [],
				"PaginationType": 'bootstrap',
				"autoWidth": false,
				"oLanguage": {
					"sSearch": "<i class='fa fa-search'></i>"
				},
				"columnDefs": [{
					"targets": 0,
					"responsivePriority": 1
				}, {
					"targets": -1,
					"responsivePriority": 2
				}],

				

				fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {

					$log.info("[fnrowCallback] enter: " + this.fnSettings().bSorted);

					var at = actionsTemplate.replace(/\$\$itemIndex\$\$/g, iDisplayIndex);
					$(nRow)
						.attr('ng-class', "{'bg-active-theme choosen':tableData[" + iDisplayIndexFull + "].$selected}")
						.attr('array-index', iDisplayIndexFull)
						.find('td.actions-control').html(at);

					//$(nRow).html($(nRow).html().replace(/\$\$itemIndex\$\$/g, iDisplayIndex));
				},
				drawCallback: function() {
					$log.info("[fnDrawCallback] enter: " + this.fnSettings().bSorted);

					var r =$element.find('table td.actions-control');

					$log.info(r);

					$compile($element.find('table').contents())($scope);
					$element.find('table td:not(.actions-control):not(.expand-control)').off('click').on('click', function(e) {
						var index = Number($(this).parent().attr('array-index'));
						$log.info(index);
						$timeout(function() {
							$log.info($scope.tableData[index].$selected);
							$scope.tableData[index].$selected = !$scope.tableData[index].$selected;
						});
					});

					$('.selectalltoggle').off('change').change(function() {
						var condition=$(this).is(':checked');

						$timeout(function() {
						for (var i = 0; i < $scope.tableData.length; i++) 
						{
						 $scope.tableData[i].$selected= condition;	
						}

						});
                         
					});
				}
			};

			var columns = [{
				"className": 'expand-control ',
				"width": '20px',
				"select":false,
				'title': '<input type="checkbox" class="selectalltoggle checkbox-theme" />',
				"orderable":false,
				"targets": 0,
				"data": null,
				"defaultContent": '<i class="fa color-theme"></i>'
			}]
			columns = columns.concat(angular.copy($scope.tableOptions.columns));
			columns.push({
				"className": 'actions-control ',
				"width": '20px',
				"select": false,
				"aria-controls":"example",
				'title': '',
				"orderable":false,
				"data": null,
				" responsivePriority": -1,
				"defaultContent": '<i class="glyphicon glyphicon-option-vertical"></i>',	
			});
			for (var i = 0; i < columns.length; i++) {
				columns[i].title = $filter('translate')(columns[i].title);
			};
			var dataConfig = {
				data: $scope.tableData,
				columns: columns,
			};
			if (!_.isObject($scope.tableOptions.config)) {
				$scope.tableOptions.config = {};
			}  
			angular.extend(datatableConfig, defaultConfig, $scope.tableOptions.config,dataConfig);
			$log.debug(datatableConfig);

			this.init = function(elem) {
				$log.info($(elem));
				var tableElem = $(elem).find('table');

				dataTable = tableElem.DataTable(datatableConfig);

				$('.dataTables_filter input').addClass('form-control');

				$scope.$watch('tableData', function(n, o) {
					dataTable.draw();
				});
			};
		}
	]);
angular.module('irf.table', ['irf.elements.commons'])
.directive('irfSimpleTable', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			tableKey: "=",
			tablePromise: "&"
		},
		templateUrl: 'irf/template/table/SimpleTable.html',
		controller: 'irfSimpleTableCtrl'
	}
})
.controller('irfSimpleTableCtrl', ["$log", "$scope", function($log, $scope) {
	$scope.tablePromise({key:$scope.tableKey}).then(function(data){
		$scope.definition = data;
	});

	$scope.isObject = angular.isObject;
}])
;


angular.module('irf.validateBiometric', ['irf.elements.commons'])
.directive('irfValidateBiometric', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			form: "=irfForm",
			model: "=irfModel",
			modelValue: "=irfModelValue"
		},
		templateUrl: 'irf/template/validateBiometric/validate-biometric.html',
		controller: 'irfValidateBiometricController',
		controllerAs: 'c,',
		link: function(scope, element, attrs, controller){
			controller.init();
		}
	}
})
.controller('irfValidateBiometricController',
['$log', '$q', '$scope', 'elementsUtils', '$parse',
function($log, $q, $scope, elementsUtils, $parse){
	var self = this;

	$scope.buttonText = 'VALIDATE_FINGERPRINT';

	$scope.buttonTitle = $scope.buttonText;

	$scope.disabled = true;
	$scope.options = [];
	var locals = {
		arrayIndex: elementsUtils.getArrayIndex($scope.form.key)
	};
	var output = {};

	var assigned = false;
	var assignFinger = function(name, type, value) {
		if (value) {
			$scope.options.push({
				name: name,
				value: value,
				type: type
			});
		}
	};

	$scope.$watch(function(scope) {
		if ($parse(scope.form.biometricMap.leftThumb)(scope) ||
			$parse(scope.form.biometricMap.leftIndex)(scope) ||
			$parse(scope.form.biometricMap.leftMiddle)(scope) ||
			$parse(scope.form.biometricMap.leftRing)(scope) ||
			$parse(scope.form.biometricMap.leftLittle)(scope) ||
			$parse(scope.form.biometricMap.rightThumb)(scope) ||
			$parse(scope.form.biometricMap.rightIndex)(scope) ||
			$parse(scope.form.biometricMap.rightMiddle)(scope) ||
			$parse(scope.form.biometricMap.rightRing)(scope) ||
			$parse(scope.form.biometricMap.rightLittle)(scope) ) {
			return true;
		} else {
			return false;
		}
	}, function(n,o) {
		if (n===true && !assigned) {
			elementsUtils.mapInput($scope.form.biometricMap, $scope, output, locals);

			assignFinger('Thumb', 'Left Hand', output.leftThumb);
			assignFinger('Index', 'Left Hand', output.leftIndex);
			assignFinger('Middle', 'Left Hand', output.leftMiddle);
			assignFinger('Ring', 'Left Hand', output.leftRing);
			assignFinger('Little', 'Left Hand', output.leftLittle);
			assignFinger('Thumb', 'Right Hand', output.rightThumb);
			assignFinger('Index', 'Right Hand', output.rightIndex);
			assignFinger('Middle', 'Right Hand', output.rightMiddle);
			assignFinger('Ring', 'Right Hand', output.rightRing);
			assignFinger('Little', 'Right Hand', output.rightLittle);
			assigned = true;
			$scope.disabled = false;
		}
	});

	$scope.validateFinger = function($event) {
		$event.preventDefault();
		var fingerId = $scope.validationId;
		if (fingerId) {
			$scope.buttonTitle = 'VALIDATING';
			$scope.disabled = true;

			var params = {
				category: $scope.form.category || $scope.form.schema.category,
				subCategory: $scope.form.subCategory || $scope.form.schema.subCategory,
				accountNumber: fingerId
			};
			if (angular.isFunction($scope.form.viewParams)) {
				var viewParams = $scope.form.viewParams($scope.modelValue, $scope.form, $scope.model);
				angular.extend(params, viewParams);
			}

			$scope.form.helper.getFileStreamAsDataURL(fingerId, params, true).then(function(fpData){
				cordova.plugins.irfBluetooth.validateSingleFP(function(out){
					if (out && out.code == 200) {
						$scope.modelValue = true;
						$scope.buttonTitle = 'VALIDATION_SUCCESS';
					} else {
						$scope.modelValue = false;
						$scope.buttonTitle = 'VALIDATION_FAILED';
					}
					$scope.disabled = false;
					$scope.$apply();
				}, function(){
					$scope.modelValue = false;
					$scope.disabled = false;
					$scope.buttonTitle = 'PLUGIN_FAILED';
					$log.error('VALIDATING_FINGERPRINT_FAILED');
					$scope.$apply();
				}, [fpData]);
			});
		}
	};

	self.init = function() {
		
	};
}])
;
angular.module('irf.zxing', ['irf.elements.commons'])
.directive('irfZxing', ["$q", "$log", "elementsUtils", function($q, $log, elementsUtils){
	var formats = {
		qrcode: "QR_CODE",
		barcode: "DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14"
	};
	// Runs during compile
	return {
		scope: {
			modelValue: "=irfZxing",
			form: "=irfZxingForm",
			model: "=irfZxingModel"
		},
		restrict: 'A',
		link: function($scope, iElm, iAttrs, controller) {
			if (typeof cordova === 'undefined') {
				$(iElm).remove();
				return;
			}

			$(iElm).click(function(e, rowId){
				$scope.scanZxing($scope.model).then(function(result){
					if ($scope.form.onCapture) {
						if (angular.isFunction($scope.form.onCapture)) {
							try {$scope.form.arrayIndex = elementsUtils.getArrayIndex($scope.form.key);}catch (e){$log.error(e)}
							$scope.form.onCapture(result, $scope.model, $scope.form);
						}
						else if (angular.isString($scope.form.onCapture))
							$scope.$parent.evalExpr($scope.form.onCapture, {result:result, model:$scope.model, form:$scope.form})
					}
				});
			});

			$scope.scanZxing = function(model) {
				$log.info("Inside scanZxing");
				var deferred = $q.defer();
				try {
					cordova.plugins.barcodeScanner.scan(function(result){
						$log.info("We got a " + result.format + ": " + result.text);
						if (result.cancelled) {
							deferred.reject('QR_CANCELLED');
						} else {
							if ($scope.form.type === 'qrcode' && result.format == 'QR_CODE') {
								deferred.resolve(result);
							} else if ($scope.form.type==='barcode') {
								deferred.resolve(result);
							} else {
								deferred.reject('QR_INVALID');
							}
						}
					},function(error){
						$log.warn(error);
						deferred.reject('QR_FAILED');
					},{
						prompt: "", // supported on Android only
						formats: formats[$scope.form.type], // default: all but PDF_417 and RSS_EXPANDED
						orientation: "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
					});
				} catch (e) {
					deferred.reject("QR_UNSUPPORTED");
					$log.error(e);
				}
				return deferred.promise;
			};

			var testZxing = function(model) {
				var deferred = $q.defer();
				deferred.resolve({
					text: '<PrintLetterBarcodeData uid="UID_234029382134" name="Stalin Gino" />'
				});
				return deferred.promise;
			};

			//$scope.scanZxing = testZxing;
		}
	};
}]);
angular.module('irf.elements',['irf.elements.tpls','irf.elements.commons','irf.aadhar','irf.lov','irf.inputFile','irf.listView','irf.schemaforms.adminlte','irf.schemaforms','irf.searchBox','irf.resourceSearchWrapper','irf.geotag','irf.dashboardBox','irf.pikaday','irf.flipswitch','irf.progressMessage','irf.zxing','irf.tableView','irf.table','irf.validateBiometric'])
var irf = irf || {};
var irfModels = irf.models = angular.module('IRFModels', ['ngResource', 'ngJSONPath', 'irf.SessionManager']);

irf.models
	.constant('searchResource', function(opts){
		var obj = {
			transformResponse: function(response, headersGetter){
				var headers = headersGetter();
				var response = {
					body: JSON.parse(response),
					headers: headers
				}
				return response;
			}
		}
		return angular.extend(obj, opts);
	})
;

var irf = irf || {};
/* CONSTANTS */
irf.SESSION_AUTH_KEY = 'AuthData';
irf.SESSION_USER_KEY = 'User';
irf.REDIRECT_STATE = 'Login';

irf.models.factory('AuthTokenHelper', ['SessionStore', '$log', function(SessionStore, $log){
	var authData = {};
	return {
		setAuthData: function(data){
			authData = data;
			SessionStore.setItem(irf.SESSION_AUTH_KEY, data);
			$log.info("Setting AuthData into Session");
		},
		getAuthData: function(){
			if (!authData || !authData.access_token) {
				authData = SessionStore.getItem(irf.SESSION_AUTH_KEY); //authData;
			}
			return authData;
		},
		clearAuthData:function(){
			authData={};
			SessionStore.removeItem(irf.SESSION_AUTH_KEY);
		}
	};
}]);

irf.models.factory('Auth', function($resource,$httpParamSerializer,$http,BASE_URL,AuthTokenHelper){
	var endpoint = BASE_URL + '/oauth/token?cacheBuster=' + Date.now();
	var resource = $resource(endpoint, {}, {
		'login':{
			method: 'POST',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			transformRequest: function (data) {
				return $httpParamSerializer(data);
			}
		}
	});

	resource.getToken = function(credentials){
		credentials.grant_type = 'password';
		credentials.scope = 'read write';
		credentials.client_secret = 'mySecretOAuthSecret';
		credentials.client_id='application';
		credentials.skip_relogin = 'yes';

		return resource.login(credentials,function(response){
			//$http.defaults.headers.common['Authorization']= 'Bearer '+response.access_token;
			AuthTokenHelper.setAuthData(response);
		});
	};

	return resource;
});

irf.models.factory('Account',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/account';
    /*
     * :service can be {change_expired_password,change_password,reset_password}
     * :action can be {init,finish}
     *
     * POST and SAVE are eqvt
     *
     * eg:
     * /api/account/change_expired_password => {service:'change_expired_password'}
     * /api/account/reset_password/init => {service:'reset_password',action:'init'}
     *
     */

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint
        },
        query:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:action'

        },
        save:{
            method:'POST',
            url:endpoint+'/:service/:action'
        }
    });
});

irf.USER_ALLOWED_PAGES = "__userAllowedPages";
irf.models.factory('PagesDefinition', ["$resource", "$log", "BASE_URL", "$q", "Queries", "SessionStore", "Link",
    function($resource, $log, BASE_URL, $q, Queries, SessionStore, Link){
    var endpoint = BASE_URL + '/api';

    var pDef = $resource(endpoint, null, {
        getPagesJson: {
            method:'GET',
            url:'process/pages.json'
        },
    });

    var userAllowedPages = null;

    pDef.getRoleAllowedPageList = function() {
        var deferred = $q.defer();
        //pDef.getPagesJson().$promise
        var localPages = SessionStore.getItem(SessionStore.getLoginname() + irf.USER_ALLOWED_PAGES);
        Queries.getPagesDefinition(SessionStore.getLoginname(), (localPages && localPages.length))
        .then(function(response){
            delete response.$promise;
            delete response.$resolved;
            userAllowedPages = response;
            SessionStore.setItem(SessionStore.getLoginname() + irf.USER_ALLOWED_PAGES, userAllowedPages);
            deferred.resolve(response);
        }, function(error) {
            $log.error(error);
            if (localPages && localPages.length) {
                $log.info("old menu in use");
                userAllowedPages = localPages;
                deferred.resolve(localPages);
            } else {
                deferred.reject(error);
            }
        });
        return deferred.promise;
    };

    var __parseMenuDefinition = function(allowedPages, menuMap, md) {
        for (var i = md.length - 1; i >= 0; i--) {
            if (angular.isString(md[i])) {
                menuMap[md[i]] = allowedPages[md[i]];
                md[i] = allowedPages[md[i]];

                if (!md[i]) {
                    md.splice(i, 1);
                }
            } else if (angular.isObject(md[i])) {
                if (md[i].items) {
                    // SUBMENU
                    md[i].items = __parseMenuDefinition(allowedPages, menuMap, md[i].items);
                    if (!md[i].items || md[i].items.length == 0) {
                        md.splice(i, 1);
                    }
                } else if (md[i].link || md[i].linkId) {
                    // LINKS
                    var l = md[i].link;
                    if (md[i].linkId) {
                        var lid = md[i].linkId;
                        md[i].onClick = function(event, menu) {
                            Link[lid](event, menu, l);
                        };
                    } else {
                        md[i].onClick = function(event, menu) {
                            window.open(event, menu, l);
                        };
                    }
                }
            }
        }
        return md;
    };

    var parseMenuDefinition = function(allowedPages, menuDef) {
        var md = _.cloneDeep(menuDef);
        if (angular.isObject(md)) {
            var menuMap = {};
            md.items = __parseMenuDefinition(allowedPages, menuMap, md.items);
            md.$menuMap = menuMap;
            return md;
        }
        return null;
    };

    pDef.getUserAllowedDefinition = function(menuDef) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            deferred.resolve(parseMenuDefinition(userAllowedPages, menuDef));
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                deferred.resolve(parseMenuDefinition(userAllowedPages, menuDef));
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    pDef.getRolePageConfig = function(pageUri) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            var p = userAllowedPages[pageUri];
            if (p) {
                deferred.resolve(p.config);
            } else {
                deferred.reject("PAGE_ACCESS_RESTRICTED");
            }
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                var p = userAllowedPages[pageUri];
                if (p) {
                    deferred.resolve(p.config);
                } else {
                    deferred.reject("PAGE_ACCESS_RESTRICTED");
                }
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    pDef.getPageDefinition = function(pageUri) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            var p = userAllowedPages[pageUri];
            if (p) {
                deferred.resolve(p);
            } else {
                deferred.reject("PAGE_ACCESS_RESTRICTED");
            }
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                var p = userAllowedPages[pageUri];
                if (p) {
                    deferred.resolve(p);
                } else {
                    deferred.reject("PAGE_ACCESS_RESTRICTED");
                }
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    var isStateAllowed = function(state) {
        _.forEach(userAllowedPages, function(v, k){
            if (v.state === state)
                return true;
        });
        return false;
    };

    pDef.isStateAllowed = function(state) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            var p = isStateAllowed(state);
            if (p) {
                deferred.resolve(p);
            } else {
                deferred.reject("PAGE_ACCESS_RESTRICTED");
            }
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                var p = isStateAllowed(state);
                if (p) {
                    deferred.resolve(p);
                } else {
                    deferred.reject("PAGE_ACCESS_RESTRICTED");
                }
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    var readOnlyFormCache = {};
    pDef.setReadOnlyByRole = function(pageUri, form) {
        var deferred = $q.defer();
        pDef.getRolePageConfig(pageUri).then(function(config){
            if (config) {
                $log.info("config:");
                $log.info(config);
                if (!readOnlyFormCache[pageUri]) {
                    readOnlyFormCache[pageUri] = form;
                }
                var f = _.cloneDeep(form);
                for (var i = f.length - 1; i >= 0; i--) {
                    f[i].readonly = !!config.readonly;
                };
                deferred.resolve(f);
            } else if (readOnlyFormCache[pageUri]) {
                $log.debug('resetting initial form');
                deferred.resolve(readOnlyFormCache[pageUri]);
            } else {
                deferred.resolve(form);
            }
            $log.info("Profile Page got initialized");
        }, function(){
            deferred.resolve(form);
        });
        return deferred.promise;
    };

    return pDef;
}]);

irf.models.factory('Files',function($resource,$httpParamSerializer,BASE_URL, $q, $http){
    var endpoint = BASE_URL + '/api';

    var resource =  $resource(endpoint, null, {
        uploadBase64:{
            method:'POST',
            url:endpoint+'/files/upload/base64'
            /* file, type, subType, extn */
        }/*,
        stream:{
            method:'GET',
            url:endpoint+'/stream/:fileId'
        }*/
    });

    var getDataUrl = function(fileId, params) {
        if ((fileId+'').indexOf('-') > 1) {
            return endpoint+'/stream/' + fileId;
        } else {
            return endpoint+'/stream/' + '?' + $httpParamSerializer(params);
        }
        return null;
    };

    resource.stream = function(fileId, params) {
        var deferred = $q.defer();
        $http.get(getDataUrl(fileId, params)).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    resource.getBase64DataFromFileId = function(fileId,params,stripDesctiptors){
        stripDesctiptors = stripDesctiptors || false;
        var url = getDataUrl(fileId,params);
        var deferred = $q.defer();
        $http({
            method:'GET',
            url:url,
            responseType: "blob"
        }).then(function(resp){

            var reader = new window.FileReader();
            reader.readAsDataURL(resp.data);
            reader.onloadend = function(){
                console.log(reader.result);
                if(stripDesctiptors){
                    deferred.resolve(reader.result.split(",")[1]);
                }
                else{
                    deferred.resolve(reader.result);
                }
            };

        },function(resp){
            deferred.reject(resp);
        });

        return deferred.promise;

    };

    resource.getFileDownloadURL = function(fileId){
        return endpoint + "/stream/" + fileId;
    }

    return resource;
});

irf.models.factory('Queries',[
"$resource", "$httpParamSerializer", "BASE_URL", "$q", "$log",
function($resource,$httpParamSerializer,BASE_URL, $q, $log){
	var endpoint = BASE_URL + '/api';

	var resource =  $resource(endpoint, null, {
		query:{
			method:'POST',
			url:endpoint+'/query'
		}
	});

	resource.getResult = function(id, params, limit, offset) {
		return resource.query({identifier:id, limit:limit || 0, offset:offset || 0, parameters:params}).$promise;
	};

	resource.getPagesDefinition = function(userId, skip_relogin) {
		var deferred = $q.defer();
		resource.query({identifier:'userpages.list', limit: 0, offset: 0, parameters:{user_id:userId}, skip_relogin: skip_relogin || false}).$promise.then(function(records){
			if (records && records.results) {
				var def = {};
				_.each(records.results, function(v, k){
					var d = {
						"uri": v.uri,
						"offline": v.offline,
						"directAccess": v.directAccess,
						"title": v.title,
						"shortTitle": v.shortTitle,
						"iconClass": v.iconClass,
						"state": v.state,
						"stateParams": {
							"pageName": v.pageName,
							"pageId": v.pageId
						},
						"config": v.pageConfig
					};
					if (v.addlParams) {
						try {
							var ap = JSON.parse(v.addlParams);
							angular.extend(d.stateParams, ap);
						} catch (e) {}
					}
					if (v.pageConfig) {
						try {
							var pc = JSON.parse(v.pageConfig);
							d.config = pc;
						} catch (e) {}
					}
					def[v.uri] = d;
				});
				deferred.resolve(def);
			}
		}, deferred.reject);
		return deferred.promise;
	};

	resource.searchPincodes = function(pincode, district, state) {
		var deferred = $q.defer();
		var request = {"pincode":pincode || '', "district":district || '', "state":state || ''};
		resource.getResult("pincode.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
	};

	var prepareTranslationJSON = function(arr, langCode) {
		var result = {};
		for (var i = arr.length - 1; i >= 0; i--) {
			result[arr[i].code] = arr[i][langCode];
		};
		return result;
	};
	var translationResult = [];
	var translationLangs = {};
	resource.downloadTranslations = function() {
		var deferred = $q.defer();
		resource.getResult("translations.list", {}).then(function(records){
			if (records && records.results && records.results.length) {
				translationResult = records.results;
				deferred.resolve(translationResult);
			}
		}, deferred.reject);
		return deferred.promise;
	};
	resource.getTranslationJSON = function(translationResult, langCode) {
		if (!translationLangs[langCode] && translationResult && translationResult.length) {
			$log.info('all translation array avilable in memory for ' + langCode);
			translationLangs[langCode] = prepareTranslationJSON(translationResult, langCode);
		}
		return translationLangs[langCode];
	};

    resource.getLoanProductDocuments = function(prodCode, process, stage){
        var deferred = $q.defer();
        resource.getResult('loan_products.list', {product_code: prodCode, process:process, stage:stage}).then(
            function(res){
                if (res && res.results && res.results.length){
                    deferred.resolve(res.results);
                } else {
                    deferred.reject(res);
                }
            }, function(res){
                deferred.reject(res.data);
            }
        )
        return deferred.promise;
    }

    resource.getGlobalSettings = function(name){
        var deferred = $q.defer();
        resource.getResult('globalSettings.list', {name:name}).then(
            function(res){
            	$log.info("checking checking");
            	$log.info(res);
                if (res && res.results && res.results.length){
                    deferred.resolve(res.results[0].value);
                } else {
                    deferred.reject(res);
                }
            }, function(err){
                deferred.reject(err);
            }
        )
        return deferred.promise;
    }

    resource.getCustomerBankAccounts = function(customerId){
        var deferred = $q.defer();
		var request = {"customer_id":customerId};
		resource.getResult("customerBankAccounts.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
    }

    resource.getBankAccounts = function(){
        var deferred = $q.defer();
		var request = {};
		resource.getResult("bankAccounts.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
    }

    resource.getLatestLoanRepayment = function(accountNumber) {
    	var deferred = $q.defer();
    	resource.getResult("latestLoanRepayments.list", {account_number: accountNumber}, 1).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
    	}, deferred.reject);
    	return deferred.promise;
    };

    resource.getDepositList = function(depositUser){
        var deferred = $q.defer();
		var request = {"deposit_user":depositUser};
		resource.getResult("depositstage.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
    }

	return resource;
}]);

irf.models.factory('ReferenceCodeResource',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/_refs/referencecodes';
    return $resource(endpoint, null, {
        fetchClassifiers:{
            method:'GET',
            url:endpoint+"/classifiers",
            isArray:"true"
        },
        fetchRefCode:{
            method:"GET",
            url:endpoint+"/all/codes/:classifiers"
        },
        findAll: {
            method: "GET",
            url: BASE_URL + "/api/allreferencecodes",
            isArray:"true"
        }
    });
});

irf.models.factory('Bank', [
    "$resource", "$httpParamSerializer", "BASE_URL", "searchResource",
    function($resource, $httpParamSerializer, BASE_URL, searchResource) {
        var endpoint = BASE_URL + '/api';

        return $resource(endpoint, null, {
            getBankAccounts: {
                method: 'GET',
                url: endpoint + '/bankaccounts',
                isArray: true
            }
        });
    }
]);
irf.models.factory('Link', [
    "$resource", "$httpParamSerializer", "BASE_URL", "SessionStore",
    function($resource, $httpParamSerializer, BASE_URL, SessionStore) {
        var endpoint = BASE_URL + '/api';

        var links = $resource(endpoint, null, {});

        links.BI_LINK1 = function(event, menu, link) {
            window.open(link);
        }

        return links;
    }
]);

/*

{
	"title": "BI_LINK",
	"iconClass": "fa fa-area-chart",
	"linkId": "BI_LINK1",
	"link": "http://www.heromotocorp.com/en-in/reach-us/book-bike-service-appointment.html"
}

*/
var irf = irf || {};
var commons = irf.commons = angular.module("IRFCommons", ['IRFModels', 'ui.bootstrap']);

commons.constant("languages", {
	"en": {
		"code": "en",
		"codeLanguage": "En",
		"titleLanguage": "English",
		"titleEnglish": "English"
	},
	"hi": {
		"code": "hi",
		"codeLanguage": "क",
		"titleLanguage": "हिन्दी",
		"titleEnglish": "Hindi"
	},
	"ta": {
		"code": "ta",
		"codeLanguage": "த",
		"titleLanguage": "தமிழ்",
		"titleEnglish": "Tamil"
	}
});

irf.commons.factory("irfConfig", function(){
	var dataMainPath = "process/";
	return {
		elementsViewpath: "modules/irfelements/templates/default/",
		getMenuDefUrl: function() {
			return dataMainPath + "MenuDefinition.json";
		},
		getFSDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/FieldSetsDefinition.json";
		},
		getSchemaDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/SchemaDefinition.json";
		},
		getOldStageDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/StagesOldDefinition.json";
		},
		getStageDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/StagesDefinition.json";
		},
		getActionsUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/irfActions.js";
		}
	};
});

irf.commons.filter("age", function() {
	return function(dob) {
		if (dob)
			return moment().diff(dob, "years");
		else
			return "NA";
	}
});

irf.commons.filter("initcap", function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
});


irf.commons.factory("Utils", ["$log", "$q","$http", function($log, $q,$http){
	var isCordovaFlag = typeof cordova !== 'undefined';
	return {
		isCordova: isCordovaFlag,

		downloadFile:function(url){
			try {

				try {
					cordova.InAppBrowser.open(url, '_system', 'location=yes');
					return true;
				} catch (err) {
					window.open(url, '_blank', 'location=yes');
					return true;
				}
			}catch(err){
				console.error(err);
			}
			return false;
		},

		getFullName: function(f, m, l) {
			return f + (m&l?' '+m:'') + (l?' '+l:'');
		},
		alert: function(message, title) {
			if (typeof cordova === 'undefined') {
				alert(message);
			} else {
				navigator.notification.alert(
					message,
					null, // callback
					(typeof title === 'undefined' || !title) ? 'Alert' : title, // title
					'OK'
				);
			}
		},
		confirm: function(message, title) {
			var deferred = $q.defer();
			if (typeof cordova === 'undefined') {
				if (window.confirm(message))
					deferred.resolve();
			} else {
				navigator.notification.confirm(
					message,
					function(buttonText){
						$log.debug('User Responded for confirm:'+buttonText);
						if(buttonText===1) deferred.resolve();
						else deferred.reject();
					},
					(typeof title === 'undefined' || !title) ? 'Confirm' : title, // title
					['Yes', 'No']
				);
			}
			return deferred.promise;
		},
		swiper: function(swipeBody, swipeMenu) {
			window.mySwipe = new Swipe($(swipeBody)[0], {continuous:false, callback:function(i, el) {
				$(swipeMenu + ' .active').removeClass('active');
				$(swipeMenu + ' a[href="#'+(i+1)+'"]').parent().addClass('active');
				window.scrollTo(0, 0);
			}});
			$(swipeMenu + ' a').click(function(e) {
				e.preventDefault();
				try {
					var i = Number(this.hash.substr(1));
					if(!i) return;
					window.mySwipe.slide(i-1);
				} catch(e) {}
			});
			window.scrollTo(0, 0);
		},
		getCurrentDate:function(){
            //TODO : format date
            // var date = new Date();
            // var y = date.getFullYear();
            // var m = (date.getMonth()+1);
            // var d = date.getDate();
            // m = (m.toString().length<2)?("0"+m):m;
            // d = (d.toString().length<2)?("0"+d):d;

            return moment().format('YYYY-MM-DD');
        },
		getCurrentDateTime:function(){
            return moment().format();
        },
        convertJSONTimestampToDate: function(jsonTimestamp){
            var a = moment.utc(jsonTimestamp);
            return a.format("YYYY-MM-DD");
        },
		removeNulls:function(obj, recurse) {

			for (var i in obj) {
				try{
					delete obj[i].$promise;
					delete obj[i].$resolved;

				}catch(err){

				}
				if (obj[i] === null) {
					delete obj[i];
				}else if(_.isArray(obj[i])){
                    if(obj[i].length<=0){
                        delete obj[i];
                    }
					else if(recurse){
						this.removeNulls(obj[i],recurse);
					}
                }
                else if (recurse && typeof obj[i] === 'object') {

					this.removeNulls(obj[i], recurse);
				}
			}
			return obj;
		}

	};
}]);

irf.commons.factory("BiometricService", ['$log', '$q', function($log, $q){

	return {
        getLabel: function(fingerId){
            var labelCode = null;
            switch (fingerId){
                case 'LeftThumb':
                    labelCode = 'LEFT_HAND_THUMB';
                    break;
                case 'LeftIndex':
                    labelCode = 'LEFT_HAND_INDEX';
                    break;
                case 'LeftMiddle':
                    labelCode = 'LEFT_HAND_MIDDLE';
                    break;
                case 'LeftRing':
                    labelCode = 'LEFT_HAND_RING';
                    break;
                case 'LeftLittle':
                    labelCode = 'LEFT_HAND_SMALL';
                    break;
                case 'RightThumb':
                    labelCode = 'RIGHT_HAND_THUMB';
                    break;
                case 'RightIndex':
                    labelCode = 'RIGHT_HAND_INDEX';
                    break;
                case 'RightMiddle':
                    labelCode = 'RIGHT_HAND_MIDDLE';
                    break;
                case 'RightRing':
                    labelCode = 'RIGHT_HAND_RING';
                    break;
                case 'RightLittle':
                    labelCode = 'RIGHT_HAND_SMALL';
                    break;
            }
            return labelCode;
        },
        getFingerTF: function(fingerId){
            var tableField = null;
            switch (fingerId) {
                case 'LeftThumb':
                    tableField = 'leftHandThumpImageId';
                    break;
                case 'LeftIndex':
                    tableField = 'leftHandIndexImageId';
                    break;
                case 'LeftMiddle':
                    tableField = 'leftHandMiddleImageId';
                    break;
                case 'LeftRing':
                    tableField = 'leftHandRingImageId';
                    break;
                case 'LeftLittle':
                    tableField = 'leftHandSmallImageId';
                    break;
                case 'RightThumb':
                    tableField = 'rightHandThumpImageId';
                    break;
                case 'RightIndex':
                    tableField = 'rightHandIndexImageId';
                    break;
                case 'RightMiddle':
                    tableField = 'rightHandMiddleImageId';
                    break;
                case 'RightRing':
                    tableField = 'rightHandRingImageId';
                    break;
                case 'RightLittle':
                    tableField = 'rightHandSmallImageId';
                    break;
            }

            return tableField;
        },
		capture: function(model){
			var deferred = $q.defer();
			if (typeof(cordova)!=='undefined' && cordova && cordova.plugins && cordova.plugins.irfBluetooth && _.isFunction(cordova.plugins.irfBluetooth.enroll)) {
				cordova.plugins.irfBluetooth.enroll(function(result){
					if (result && result.code === 200 && result.data) {
						var out = result.data;
						var returnVals = {};
                        var tableField = null;

						for (var key in out){
							if (out.hasOwnProperty(key)){
                                tableField = null;
								switch (key) {
                                    case 'LeftThumb':
                                        tableField = 'leftHandThumpImageId';
                                        break;
                                    case 'LeftIndex':
                                        tableField = 'leftHandIndexImageId';
                                        break;
                                    case 'LeftMiddle':
                                        tableField = 'leftHandMiddleImageId';
                                        break;
                                    case 'LeftRing':
                                        tableField = 'leftHandRingImageId';
                                        break;
                                    case 'LeftLittle':
                                        tableField = 'leftHandSmallImageId';
                                        break;
                                    case 'RightThumb':
                                        tableField = 'rightHandThumpImageId';
                                        break;
                                    case 'RightIndex':
                                        tableField = 'rightHandIndexImageId';
                                        break;
                                    case 'RightMiddle':
                                        tableField = 'rightHandMiddleImageId';
                                        break;
                                    case 'RightRing':
                                        tableField = 'rightHandRingImageId';
                                        break;
                                    case 'RightLittle':
                                        tableField = 'rightHandSmallImageId';
                                        break;
                                }
                                if (tableField!=null) {
                                    out[key]['table_field'] = tableField;
                                }
							}
						}
						deferred.resolve(out);
					} else {
						deferred.reject('ERR_BIOMETRIC_CAPTURE_INVALID');
					}
				}, function(error){
					deferred.reject('ERR_BIOMETRIC_CAPTURE_FAILED');
				});
			} else {
				deferred.reject('ERR_BIOMETRIC_PLUGIN_MISSING');
			}
			return deferred.promise;
		}
	}
}])

irf.commons.config(function($translateProvider) {
	/*$translateProvider.useStaticFilesLoader({
		prefix: './process/translations/',
		suffix: '.json'
	});*/
	$translateProvider.useLoader('irfTranslateLoader');
	$translateProvider.preferredLanguage('en').fallbackLanguage('en');
	//$translateProvider.useMissingTranslationHandlerLog();
});
irf.commons.factory('irfTranslateLoader',
['languages', 'Queries', '$q', 'irfStorageService', '$log',
function(languages, Queries, $q, irfStorageService, $log){
	return function(options) {
		var deferred = $q.defer();
		var translations = irfStorageService.retrieveJSON('irfTranslations');
		var isSameWeek = false;
		if (translations && translations._timestamp) {
			isSameWeek = moment(translations._timestamp).diff(moment(new Date().getTime()), 'day') < 7;
			$log.info('Translations isSameWeek:' + isSameWeek);
		}
		if (isSameWeek && translations && translations[options.key] && !options.forceServer) {
			deferred.resolve(translations[options.key]);
		} else {
			Queries.downloadTranslations().then(function(translationResult) {
				$log.info('Translations loading from server');
				var langCodes = _.keys(languages);
				translations = {
					_timestamp: new Date().getTime()
				};
				for (var i = langCodes.length - 1; i >= 0; i--) {
					translations[langCodes[i]] = Queries.getTranslationJSON(translationResult, langCodes[i]);
				};
				irfStorageService.storeJSON('irfTranslations', translations);
				deferred.resolve(translations[options.key]);
			}, function() {
				deferred.reject(options.key);
			});
		}
		return deferred.promise;
	};
}]);

irf.commons.service("entityManager", ["$log", function($log) {
	var self = this;

	var modelHolder = {};

	self.getModel = function(pageName) {
		if (!modelHolder[pageName]) {
			modelHolder[pageName] = {};
		}
		return modelHolder[pageName];
	};

	self.setModel = function(pageName, model) {
		$log.info("setting entitty model for: " + pageName);
		//$log.info(model);
		modelHolder[pageName] = model;
	};

	/* Sample Data */
	modelHolder["CustomerEnrollmentStage1"] = {};
	modelHolder["CustomerEnrollmentStage1"]["Customer"] = {"email":"stalin@gino.mail", "name":"Stalin Gino", "religion":"C", "enrolled_as":"E", "photo":"http://bit.ly/1SEDKqa"};
	modelHolder["CustomerEnrollmentStage1"]["Asset"] = {};
}]);
var irfSessionManager = angular.module("irf.SessionManager", []);

irfSessionManager.factory('SessionStore', ["$log", "$window", function($log, $window){
	var self = this;

	self.session = {
		passwordHash: null,
		//photo: "//bit.ly/1SEDKqa",
		//photo: '//bit.ly/1V4DF1Z',
		status: "invalid",

		activated:false,
		agentAmtLimit:null,
		bankName:null,
		branchName:"Karambayam",
		branchSetCode:null,
		email:null,
		firstName:null,
		id:null,
		langKey:null,
		lastName:null,
		login:null,
		password:null,
		roleCode:null,
		roles:null,
		version:null
	};
	var session = self.session;

	self.profile = {

	};

	self.settings = {
		
	};

	self.clear = function() {
		session = self.session = {};
		self.profile = {};
		self.settings = {};
	};

	self.getUsername = function() {
		return (session.firstName || session.lastName)
			? [session.firstName, session.lastName].join(" ")
			: (session.userName ? session.userName : session.login);
	};

	self.getLoginname = function() {
		return session.login;
	};

	self.getEmail = function() {
		return session.email;
	};

	self.verifyPassword = function(password) {
		return password === session.passwordHash;
	};

	self.getRole = function() {
		var role;
		switch(session.roleCode) {
			case 'A':
				role = 'WEALTH_MANAGER';
				break;
			case 'SA':
				role = 'SENIOR_WEALTH_MANAGER';
				break;
		}
		return role;
	};

	self.getLanguage = function() {
		return session.language ? session.language : (self.settings.language ? self.settings.language : 'en');
	};

	self.setLanguage = function(l) {
		self.session.language = l;
	};

	self.getBranch = function() {
		return session.branchName;
	};

	self.getBranchCode = function() {
		return session.branchCode;
	};

	self.getBranchId = function() {
		return session.branchId;
	};

	self.getBankName = function() {
		return session.bankName;
	};

	self.getPhoto = function() {
		return session.photo;
	};

	self.getSystemDateFormat = function() {
		return 'YYYY-MM-DD';
	};

	self.getDateFormat = function() {
		return (self.settings && self.settings.dateFormat) ? self.settings.dateFormat : self.getSystemDateFormat();
	};

	self.getFormatedDate = function(dt) {
		return dt ? dt.format(self.getDateFormat()) : dt;
	};

	self.setItem = function(key, value){
		value = JSON.stringify(value);
		$window.localStorage.setItem(key, value);
	};

	self.getItem = function(key){
		return JSON.parse($window.localStorage.getItem(key));
	};

	self.removeItem = function(key){
		$window.localStorage.removeItem(key);
	};

	self.setSession = function(session) {
		angular.extend(self.session, session);
	};

	return self;
}]);
/**
 * AuthService have the following duties
 *
 * 1) Store and Retrieve user information
 * 2) User information should be stored in the Session
 * 3) Make sure the session is still valid.
 * 4)
 */

irf.commons.factory('authService',
['Auth', 'Account', '$q', '$log', 'SessionStore', 'irfStorageService', 'AuthTokenHelper',
function(Auth, Account, $q, $log, SessionStore, irfStorageService, AuthTokenHelper) {
	var userData = null;

	var login = function(username, password) {
		var promise = Auth.getToken({
			"username": username,
			"password": password
		}).$promise;

		return promise;
	};

	var setUserData = function(_userData) {
		if (_userData && _userData.login) {
			userData = _userData;
			$log.error(_userData);
			return true;
		}
		return false;
	};

	var removeUserData = function() {
		userData = null;
		SessionStore.setSession({});
	};

	var getUser = function() {
		var deferred = $q.defer();
		Account.get({'service': 'account'}, function(accountResponse){
			setUserData(accountResponse);
			irfStorageService.storeJSON('UserData', accountResponse);
			deferred.resolve(accountResponse);
		}, function(response){
			deferred.reject({
				'status': response.status,
				'statusText': response.statusText,
				'data': response.data
			});
		});
		return deferred.promise;
	};

	return {
		login: login,
		getUser: getUser,
		getUserData: function() {
			return userData;
		},
		loginAndGetUser: function(username, password){
			var deferred = $q.defer();
			login(username, password).then(function(arg){
				removeUserData();
				getUser().then(function(result){
					var m = irfStorageService.getMasterJSON("UserProfile");
					var km = _.keys(m);
					if (km.length !== 1 || km[0] !== username) {
						// clear UserProfile
						irfStorageService.removeMasterJSON("UserProfile");
					}
					setUserData(result);
					deferred.resolve(result);
				},function(response){
					deferred.reject(response);
				});
			},function(errorArg){
				deferred.reject(errorArg);
			});
			return deferred.promise;
		},
		isUserDataResolved: function(){
			if (userData && userData.login) {
				return true;
			}
			return false;
		},
		getRedirectState: function(){
			return irf.REDIRECT_STATE;
		},
		setUserData: setUserData,
		logout: function() {
			removeUserData();
			AuthTokenHelper.clearAuthData();
		}
	}
}]);

irf.commons.config(["$httpProvider", function($httpProvider){
	$httpProvider.interceptors.push(function($q, AuthTokenHelper, AuthPopup) {
		return {
			'request': function(config) {
				var authToken = AuthTokenHelper.getAuthData();
				authToken = authToken ? authToken.access_token : authToken;
				config.headers['Authorization']= 'Bearer '+ authToken;
				return config;
			},
			'responseError': function(rejection) {
				if (rejection.status === 401 && !(rejection.config && rejection.config.data && rejection.config.data.skip_relogin=='yes')) {
					var deferred = $q.defer();
					AuthPopup.pushToRelogin(deferred, rejection);
					return deferred.promise;
				}
				// $log.error(rejection);
				return $q.reject(rejection);
			}
		};
	});
}]);

irf.commons.run(['AuthTokenHelper', 'SessionStore', '$log', function(AuthTokenHelper, Session, $log){
	$log.info("Inside run() of IRFModels");
	$log.info("-------------------------");
	$log.info("Loading Auth Information from Session...");
	var authData = Session.getItem(irf.SESSION_AUTH_KEY)
	if (authData!=null){
		AuthTokenHelper.setAuthData(authData);
		$log.info("Auth information found in the Session. Updated to Auth Resource")
	} else {
		$log.info("No Auth info in Session");
	}
}]);

irf.commons.factory('AuthPopup', ['AuthTokenHelper', '$log', function(AuthTokenHelper, $log){
	var self = this;

	self.pipe = [];

	return {
		promisePipe: self.pipe,
		pushToRelogin: function(deferred, rejection) {
			$log.info("inside popup");
			// 1. show popup
			// 2. complete login
			// 3. rejection.config to request
			// 4. send response back
			if (_.endsWith(rejection.config.url, 'api/account')) { // TODO need to work on different way to check this
				deferred.reject(rejection);
			} else {
				self.pipe.push({deferred:deferred, rejection: rejection});
			}

		}
	};
}]);

irf.commons.factory("irfSearchService", ["$log", "Enrollment", function($log, Enrollment) {
	return {
		searchCustomer: function(id, params) {
			var output;
			switch(id) {
				case 'URN':
					output = Enrollment.search(params);
					break;
			}
			return output;
		}
	};
}]);

irf.commons.value('RefCodeCache',{
	refCodes: null
});

irf.commons.factory("irfStorageService",
["$log","$q","ReferenceCodeResource","RefCodeCache", "SessionStore", "$filter",
function($log,$q,rcResource,RefCodeCache, SessionStore, $filter){
	var retrieveItem = function(key) {
		return localStorage.getItem(key);
	};
	var storeItem = function(key, value) {
		localStorage.setItem(key, value);
	};
	var removeItem = function(key) {
		localStorage.removeItem(key);
	};
	var masters = {};
	var processMasters = function(codes) {
		var classifiers = {};
		var l = codes.length;
		for (i = 0; i < l; i++) {
			var d = codes[i];
			var c = classifiers[d['classifier']];
			if (!c) {
				c = classifiers[d['classifier']] = {};
				c.data = [];
				if (d['parentClassifier']) {
					c['parentClassifier'] = d['parentClassifier'];
				}
			}
			var _data = {
				code: d['code'],
				name: d['name'],
				value: d['name'],
				id: d['id']
			};
			if (d['parentClassifier'] && d['parentReferenceCode'])
				_data.parentCode = d['parentReferenceCode'].trim();
			if (d['field1']) _data.field1 = d['field1'].trim();
			if (d['field2']) _data.field2 = d['field2'].trim();
			if (d['field3']) _data.field3 = d['field3'].trim();
			if (d['field4']) _data.field4 = d['field4'].trim();
			if (d['field5']) _data.field5 = d['field5'].trim();
			c.data.push(_data);
		}

		/** removing other bank branches, district **/
		var bankId = null;
		try {
			var bankName = SessionStore.getBankName();
			var bankId = null;
			try {
				bankId = $filter('filter')(classifiers['bank'].data, {name:bankName}, true)[0].code;
			} catch (e) {}
			if (bankId) {
				classifiers['branch'].data = $filter('filter')(classifiers['branch'].data, {parentCode:bankId}, true);
				classifiers['district'].data = $filter('filter')(classifiers['district'].data, {parentCode:bankId}, true);
			}
		} catch (e) {
			$log.error('removing other bank branches FAILED after master fetch');
			$log.error(e);
		}
		/** sort branches, centre **/
		try {
			classifiers['branch'].data = _.sortBy(classifiers['branch'].data, 'name');
			classifiers['centre'].data = _.sortBy(classifiers['centre'].data, 'name');
		} catch (e) {
			$log.error('Branch,centre SORT FAILED after master fetch');
		}
		return classifiers;
	};
	var factoryObj = {
		storeJSON: function(key, value){
			try {
				storeItem(key, JSON.stringify(value));
			} catch (e) {}
		},
		retrieveJSON: function(key){
			try {
				return JSON.parse(retrieveItem(key));
			} catch (e) {}
		},
		removeJSON: function(key){
			removeItem(key);
		},
		getMasterJSON: function(key, cb) {
			var master = retrieveItem(key);
			try {
				master = JSON.parse(master);
			} catch (e) {}
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb(master);
			} else {
				return master;
			}
		},
		removeMasterJSON: function(key, cb) {
			try {
				removeItem(key);
			} catch (e) {}
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb();
			}
		},
		getJSON: function(key, storageKey, cb) {
			var master = retrieveItem(key);
			var value;
			try {
				master = JSON.parse(master);
				value = master[storageKey];
			} catch (e) {}
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb(value);
			} else {
				return value;
			}
		},
		putJSON: function(key, value, cb) {
			var master = retrieveItem(key);
			try {
				master = JSON.parse(master);
			} catch (e) {}
			if (!master)
				master = {};
			master[value.$$STORAGE_KEY$$] = value;
			storeItem(key, JSON.stringify(master));
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb();
			}
		},
		deleteJSON: function(key, storageKey) {
			var master = retrieveItem(key);
			var value;
			try {
				master = JSON.parse(master);
				delete master[storageKey];
				storeItem(key, JSON.stringify(master));
				return true;
			} catch (e) {
				$log.debug("Error occured while deleteJSON");
				$log.debug(e);
				return false;
			}
		},
		cacheAllMaster: function(isServer, forceFetch) {
			if (!masters || _.isEmpty(masters)) {
				masters = factoryObj.retrieveJSON('irfMasters');
			} else {
				$log.info('masters already in memory');
			}
			if (isServer) {
				$log.info('masters isServer');
				var deferred = $q.defer();
				try {
					var isSameDay = false;
					if (masters && masters._timestamp) {
						isSameDay = moment(masters._timestamp).startOf('day').isSame(moment(new Date().getTime()).startOf('day'));
					}
					if (forceFetch || !isSameDay) {
						rcResource.findAll(null).$promise.then(function(codes) {
							var _start = new Date().getTime();

							masters = processMasters(codes);
							masters._timestamp = new Date().getTime();
							factoryObj.storeJSON('irfMasters', masters);

							$log.info(masters);
							$log.info("Time taken to process masters (ms):" + (new Date().getTime() - _start));
							deferred.resolve("masters download complete");
						});
					} else {
						deferred.resolve("It's the same day for Masters/ not downloading");
					}
				} catch (e) {
					deferred.reject(e);
				}
				return deferred.promise;
			}
		},
		getMaster: function(classifier) {
			return masters[classifier];
		}
	};
	return factoryObj;
}]);

irf.commons.factory("formHelper",
["$log", "$state", "irfStorageService", "SessionStore", "entityManager", "irfProgressMessage",
"$filter", "Files", "$q", "elementsUtils",
function($log, $state, irfStorageService, SessionStore, entityManager, irfProgressMessage,
	$filter, Files, $q, elementsUtils){
	return {
		enum: function(key) {
			// console.warn(key);
			var r = irfStorageService.getMaster(key);
			var branchId = ""+SessionStore.getBranchId();
			if (r && _.isArray(r.data)) {
				var ret = {parentClassifier:r.parentClassifier,data:[]};
				switch (key.toString().trim()) {
					//Write custom cases for (name,value) pairs in enumCodes
					case 'bank':
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							ret.data[i].value = ret.data[i].code;
						}
						break;
					case 'loan_product':
						$log.debug(key);
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							ret.data[i].value = ret.data[i].field1.toString().trim();
						}
						break;
					case 'centre':
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
                            ret.data[i].value = Number(ret.data[i].code);
						}
                        // console.warn(ret);
						break;
                    case 'village':
                        console.log("branchid:"+branchId);
						ret.data = r.data = $filter('filter')(r.data, {parentCode:branchId}, true);
						$log.warn('village:'+ret.data.length);
						break;
                    case 'branch_id':
                        ret.data = _.clone(r.data);
                        for (var i=0 ;i<ret.data.length; i++){
                            ret.data[i].value = Number(ret.data[i].code);
                        }
                        break;
					case 'partner':
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
								ret.data[i].value = ret.data[i].code;
						}
						// console.warn(ret);
						break;
					default:
						ret.data = r.data; // value <-- name
				}
				return ret;
			}
			$log.error('No record found for enum key: ' + key);
			return null;
		},
		titleMap: function(key) {
			var ret = this.enum(key);
			if (ret)
				return ret.data;
			return ret;
		},
		filterByParentCode: function(modelValue, classifier) {
			if (modelValue) {
				$log.debug(modelValue+" as "+classifier);
				var r = $scope.helper.enum(classifier);
				if (r) {
					var d = $filter('filter')(r.data, {value:modelValue}, true);
					if (d && d.length == 1 && _.isObject(d[0])) {
						return d[0].code;
					} else if (d.length > 1) {
						$log.debug('TOO MANY parent REFCODES for '+classifier+' value:'+modelValue);
						$log.debug(d);
					}
				}
			}
			return null;
		},
		save: function(model, formCtrl, formName, actions) {
			var pageName = formName.substring(6).replace(/\$/g, '.');
			var promise = true;
			if (angular.isFunction(actions.preSave)) {
				promise = actions.preSave(model, formCtrl, formName);
				if (promise && _.isFunction(promise.then)) {
					promise.then(function(){
						irfStorageService.putJSON(pageName, model);
						$state.go('Page.EngineOffline', {pageName: pageName});
					}).catch(function(){
						// nothing to do
					});
				}
			} else {
				irfStorageService.putJSON(pageName, model);
				$state.go('Page.EngineOffline', {pageName: pageName});
			}
		},
		submit: function(model, formCtrl, formName, actions) {
			$log.info("on systemSubmit");
			// entityManager.setModel(formName, null);
			$log.warn(formCtrl);
			if (formCtrl && formCtrl.$invalid) {
				irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
				return false;
			}
			$log.warn('Going TO submit');
			actions.submit(model, formCtrl, formName);
			return true;
		},
    	getFileStreamAsDataURL: function(fileId, params,stripDescriptors) {
	        var deferred = $q.defer();
	        Files.getBase64DataFromFileId(fileId, params,stripDescriptors).then(function(fpData){
				deferred.resolve(fpData);
	        }, function(err){
				deferred.reject(err);
			});
	        return deferred.promise;
	    }

	};
}]);

var irf = irf || {};

irf.page = function(path) {
	return "Pages__" + path.replace(/\./g, '$');
};

irf.form = function(path) {
	return "Form__" + path.replace(/\./g, '$');
};

var pageCollection = irf.pageCollection = angular.module("IRFPageCollection", ["ui.router", "IRFCommons"]);

var pages = irf.pages = angular.module("IRFPages", ["irf.elements", "IRFPageCollection"], function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo):/);
});

irf.pages.factory("config", function(){
	return {
		something: function(){
			return "sumthn";
		}
	};
});

irf.pages.constant('ALLOWED_STATES', ['Login']);

irf.pages.run(
["$rootScope", "$log", "$timeout", "$q", "$state", "authService", "$location", "ALLOWED_STATES",
"irfStorageService", "entityManager", "SessionStore", "irfElementsConfig", "irfOfflineFileRegistry",
"PageHelper", "$translate",
function($rootScope, $log, $timeout, $q, $state, authService, $location, ALLOWED_STATES,
	irfStorageService, entityManager, SessionStore, irfElementsConfig, irfOfflineFileRegistry,
	PageHelper, $translate){

	var setProfilePreferences = function(userData) {
		$log.info('set ProfilePreferences');
		SessionStore.setSession(userData);
		irfStorageService.storeJSON('UserData', userData);
		var m = irfStorageService.getMasterJSON(irf.form("UserProfile"));
		var km = _.keys(m);
		if (km.length === 1 && km[0] === userData.login) {
			m = m[km[0]];
			$log.info('set ProfilePreferences -> found saved settings');
			SessionStore.profile = m.profile;
			SessionStore.settings = m.settings;
			$log.saveLog = SessionStore.settings.consoleLog;
			$log.debug(m.settings.dateFormat);
			irfElementsConfig.setDateDisplayFormat(m.settings.dateFormat);
		} else {
			$log.saveLog = false;
			SessionStore.profile = {};
			SessionStore.settings = {};
		}
		SessionStore.setLanguage(SessionStore.getLanguage());
		$translate.use(SessionStore.getLanguage());
	}

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
		$log.info('|--------Changing State START--------|');

        /* Clearing page errors */
        PageHelper.clearErrors();

        /* Gracefully clearing progress messages */
        PageHelper.gracefulClearProgress();

        /* Hiding Loader */
        PageHelper.hideLoader();

		if (fromState.name === 'Page.Engine' && fromParams && fromParams.pageName) {
			var model = entityManager.getModel(fromParams.pageNam);
			if (model.persist) {
				$log.debug('Previous page persisted:' + fromParams.pageName);
			} else {
				entityManager.setModel(fromParams.pageName, null);
				$log.info('Previous page cleaned:' + fromParams.pageName);
			}
			irfOfflineFileRegistry.clear();
			$log.info("offline file registry cleared");
		}
		$log.info("Destination State is ::" + toState.name);
		$log.info("Destination page is ::" + ((!toParams)|| toParams.pageName));

		if (!authService.isUserDataResolved()) {
			$log.debug('> userdata not resolved');
			if (_.indexOf(ALLOWED_STATES, toState.name) == -1) {
				/* Check Auth info */
				if (SessionStore.session && SessionStore.session.offline) {
					$log.debug("> Offline page loaing");
					var userData = irfStorageService.retrieveJSON('UserData');
					authService.setUserData();
					setProfilePreferences(userData);
					//$state.go(toState, toParams);
					//return;
				} else {
					$log.debug("> Online page loaing");
					event.preventDefault();
					authService.getUser().then(function(result){ /* Success Callback */
						$log.info("User account information loaded.");

						setProfilePreferences(result);
						irfStorageService.cacheAllMaster(false);
						$state.transitionTo(toState, toParams);
						return;
					}, function(response){ /* Error callback */
						$log.info("Unable to load user information. Redirecting to Login...");
						$state.transitionTo(authService.getRedirectState());
						return;
					});
				}
			}
		} else {
			$log.info("UserData is already in Session");
			setProfilePreferences(authService.getUserData());
		}
		irfStorageService.cacheAllMaster(false);
		$log.info('|--------Changing State END--------|');
	});
	$rootScope.$on('$stateChangeSuccess', function(){
		$log.debug('$stateChangeSuccess');
		if (!irf.loggerCleanerRunning && SessionStore.settings
			&& SessionStore.settings.consoleLogAutoClear
			&& SessionStore.settings.consoleLogAutoClearDuration
			&& SessionStore.settings.consoleLogAutoClearDuration > 0) {
			irf.loggerCleanerRunning = setInterval(function(){
				var lastTimeToClean = $log.lastLogTime.subtract(SessionStore.settings.consoleLogAutoClearDuration, 'minutes');
				var cleanHead = '<span class="time">' + lastTimeToClean.format('MMM-DD:HH:mm:');
				$log.allLogs = $log.allLogs.substring($log.allLogs.lastIndexOf(cleanHead));
			}, SessionStore.settings.consoleLogAutoClearDuration * 59000);
			$log.debug('irf.loggerCleanerRunning:'+irf.loggerCleanerRunning);
		}

		PageHelper.scrollToTop();
	});
}]);

irf.loggerCleanerRunning = false;

irf.pages.config([
	"$stateProvider", "$urlRouterProvider",
	function($stateProvider, $urlRouterProvider) {
	var statesDefinition = [{
		name: "Login",
		url: "/Login",
		templateUrl: "modules/irfpages/templates/Login.html",
		controller: 'LoginCtrl',
		controllerAs: 'c'
	},{
		name: "Page",
		url: "/Page",
		templateUrl: "modules/irfpages/templates/Page.html",
		controller: "PageCtrl"
	},{
		name: "Page.Engine",
		url: "/Engine/:pageName/:pageId",
		params: {
			pageName: {value: null},
			pageId: {value: null, squash: true},
			pageData: null
		},
		templateUrl: "modules/irfpages/templates/pages/Page.Engine.html",
		controller: "PageEngineCtrl"
	},{
		name: "Page.EngineError",
		url: "/EngineError/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.EngineError.html",
		controller: "PageEngineErrorCtrl"
	},{
		name: "Page.EngineOffline",
		url: "/Offline/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.EngineOffline.html",
		controller: "PageEngineOfflineCtrl"
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});
	$urlRouterProvider.otherwise("/Login");
}]);

irf.HOME_PAGE = {
	"to": "Login",
	"params": {},
	"options": {}
};

irf.pages.controller('LoginCtrl',
['$scope', 'authService', '$log', '$state', 'irfStorageService', 'SessionStore', 'Utils', 'irfTranslateLoader', '$q',
function($scope, authService, $log, $state, irfStorageService, SessionStore, Utils, irfTranslateLoader, $q){

	var onlineLogin = function(username, password, refresh) {
		authService.loginAndGetUser(username,password).then(function(arg){ // Success callback
			$scope.showLoading = true;

			var p = [
				irfStorageService.cacheAllMaster(true, refresh),
				irfTranslateLoader({forceServer: refresh})
			]
			$q.all(p).then(function(msg){
				$log.info(msg);
                SessionStore.session.offline = false;
                themeswitch.changeTheme(themeswitch.getThemeColor(), true);
				$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
				if (refresh) {
					window.location.hash = '#/' + irf.HOME_PAGE.url;
					window.location.reload();
				}
			},function(e){
				$log.error(e)
			}).finally(function(){
				$scope.showLoading = false;
			});
		}, function(arg){ // Error callback
			$scope.showLoading = false;
			$log.error(arg);
			if (arg.data && arg.data.error_description) {
				$scope.errorMessage = arg.data.error_description;
			} else {
				$scope.errorMessage = arg.statusText || (arg.status + " Unknown Error");
			}
		});
	};

	this.onlineLogin = function(username, password){
		$log.info("Inside onlineLogin");
		if (!username || !password) {
			$scope.errorMessage = 'LOGIN_USERNAME_PASSWORD_REQ';
			return false;
		}
		$scope.errorMessage = null;
		if (userData && userData.login && username.toLowerCase() !== userData.login.toLowerCase()) {
			// different user
			Utils.confirm('User is different. This will clear all data saved by previous user ('+
				userData.login+'). Do you want to proceed?', 'User Data Clear Alert')
				.then(function(){
					// clear al offline records.
					$scope.showLoading = 'cc';
					$log.debug('localStorage.clear()');
					localStorage.clear();
					SessionStore.clear();

					setTimeout(function() {onlineLogin(username, password, true);});
				});
		} else {
			$scope.showLoading = 'cc';
			onlineLogin(username, password);
		}
	};

	this.offlineLogin = function(pin){
		$log.info("Inside offlineLogin");
		if (!pin) {
			$scope.errorMessage = 'LOGIN_PIN_REQ';
			return false;
		}
		$scope.errorMessage = null;
		if (pin === $scope.offlinePin) {
			authService.setUserData(userData);
			SessionStore.session.offline = true;
			themeswitch.changeTheme('deepteal');
			$log.debug("Offline login success");
			$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
		} else {
			$scope.errorMessage = "LOGIN_INVALID_PIN";
			return false;
		}
		
		return true;
	};

	$scope.isOnline = true;
	$scope.onlyOnline = true;

	var userData = irfStorageService.retrieveJSON('UserData');
	if (userData && userData.login) {
		var m = irfStorageService.getMasterJSON(irf.form("UserProfile"));
		var km = _.keys(m);
		if (km.length === 1 && km[0] === userData.login) {
			if (m[km[0]] && m[km[0]].settings) {
				if (m[km[0]].settings.loginMode) {
					var model = m[km[0]];
					$scope.offlineUserName = model.profile.firstName || model.profile.login;
					$scope.offlinePin = model.settings.offlinePin;
					if ($scope.offlinePin) {
						$scope.onlyOnline = false;
						$scope.isOnline = model.settings.loginMode === 'online';
					}
					SessionStore.profile = model.profile;
					SessionStore.settings = model.settings;
					$log.debug("Offline login available");
				}
			}
		}
	}

}])

irf.pages.controller("PageCtrl",
["$log", "$scope", "$stateParams", "$q", "$http", "$uibModal", "authService", "AuthPopup", "PageHelper",
"SessionStore", "$window", "$rootScope", "PagesDefinition",
function ($log, $scope, $stateParams, $q, $http, $uibModal, authService, AuthPopup, PageHelper,
    SessionStore, $window, $rootScope, PagesDefinition) {
        $log.info("Page.html loaded $uibModal");
        var self = this;

        $scope.loginPipe = AuthPopup.promisePipe;

        $scope.$watch(function (scope) {
            return scope.loginPipe.length;
        }, function (n, o) {
            if (n > o && n == 1) {
                $log.info("Inside LoginPipeProcessor");
                SessionStore.session.offline = true;
                themeswitch.changeTheme('deepteal');

                self.launchRelogin().then(function(){
                    SessionStore.session.offline = false;
                    themeswitch.changeTheme(themeswitch.getThemeColor(), true);
                    _.each($scope.loginPipe, function(lpo, k){
                        $http(lpo.rejection.config).then(function (data) {
                            lpo.deferred.resolve(data);
                        }, function (data) {
                            lpo.deferred.reject(data);
                        });
                    });
                    $scope.loginPipe.length = 0;
                }).catch(function(){
                    _.each($scope.loginPipe, function(lpo, k){
                        $log.info(lpo);
                        lpo.deferred.reject(lpo.rejection);
                    });
                    $scope.loginPipe.length = 0;
                });
            }
        });

        $scope.$on('server-error', function (event, args) {
            $scope.errors = args;
        })

        $scope.$on('page-loader', function(event, arg){
            $log.info("Inside listener for show-loader");
            $scope.showSectionFarLoader = arg;
        })

        self.loginSuccess = false;
        self.launchRelogin = function () {
            var def = $q.defer();
            var modalWindow = $uibModal.open({
                templateUrl: "modules/irfpages/templates/modals/Relogin.html",
                windowTopClass: "relogin-window",
                scope: $scope,
                backdrop: 'static',
                controller: function ($scope) {

                    $scope.cancelRelogin = function () {
                        modalWindow.close();
                        def.reject();
                    };

                    $scope.relogin = function (username, password) {
                        $log.info("Inside onlineLogin");
                        if (!username || !password) {
                            return false;
                        }
                        var userData = authService.getUserData();
                        if (username.toLowerCase() !== userData.login.toLowerCase()) {
                            $scope.errorMessage = "Only current user can login";
                            return false;
                        }
                        $scope.errorMessage = null;
                        authService.login(username, password)
                            .then(function (arg) { // Success callback
                                modalWindow.close();
                                // TODO
                                def.resolve();
                            }, function (arg) { // Error callback
                                $scope.showLoading = false;
                                $log.error(arg);
                                $scope.errorMessage = arg.statusText || arg.status;
                            });
                        return true;
                    };

                }
            });
            return def.promise;
        };

        // Access Rights
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
            if (_.startsWith(toState, 'Page') && toState !== 'Page.Engine') {
                // Custom Pages
                PagesDefinition.isStateAllowed(toState).then(function(){
                    
                });
            }
        });

    }])
    .factory('PageHelper', ['$rootScope', '$log', '$document', 'irfProgressMessage', function ($rootScope, $log, $document, irfProgressMessage) {

        /**
         * A error object will be like
         * code:
         * message:
         * severity:
         *
         * @type {Array}
         */
        var errors = [];

        var clearErrorsFn = function(){
            errors = [];
            $rootScope.$broadcast('server-error', errors);
        }

        /* Add `clearErrors` method on $rootScope */

        $rootScope.clearErrors = clearErrorsFn;

        return {
            clearErrors: clearErrorsFn,
            setError: function (error) {
                $log.info("Inside setError");
                $log.info(error);
                this.setErrors([error]);
            },
            setErrors: function (newErrors) {
                $log.info("Inside setErrors");
                errors = _.concat(errors, newErrors);
                $rootScope.$broadcast('server-error', errors);
                this.scrollToErrors();
            },
            getErrors: function () {
                $log.info("Inside getErrors");
                return errors;
            },
            scrollToErrors: function () {
                jQuery('html, body').animate({
                    scrollTop: $("#errors-wrapper").offset().top - 50
                }, 500);
            },
            scrollToTop: function(){
                jQuery('html, body').animate({
                    scrollTop: 0
                }, 500);
            },
            showLoader: function(){
                $log.info("Inside showLoader");
                $rootScope.$broadcast('page-loader', true);
            },
            hideLoader: function(){
                $log.info("Inside hideLoader");
                $rootScope.$broadcast('page-loader', false);
            },
            showProgress: function(id, text, timeSpan, level, title){
                $log.info("Inside progressMessage");
                irfProgressMessage.pop(id, text, timeSpan, level, title);
            },
            gracefulClearProgress: function(){
                irfProgressMessage.gracefulClearAll(2000);
            },
            showErrors: function(res){
                this.clearErrors();
                try {
                    var data = res.data;
                    var errors = [];
                    if (_.hasIn(data, 'errors')) {
                        _.forOwn(data.errors, function (keyErrors, key) {
                            var keyErrorsLength = keyErrors.length;
                            for (var i = 0; i < keyErrorsLength; i++) {
                                var error = {"message": "<strong>" + key + "</strong>: " + keyErrors[i]};
                                errors.push(error);
                            }
                        });

                    }
                    if (_.hasIn(data, 'error')) {
                        errors.push({message: data.error});
                    }
                    this.setErrors(errors);
                }catch(err){
                    $log.error(err);
                }

            },
            navigateGoBack: function(){
                return window.history.back();
            }
        }
    }]);

irf.pages.controller("PageEngineCtrl",
["$log", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout",
function($log, $scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout) {
	var self = this;

	var allCards = true;
	var showAllCards = function() {
		var h = window.innerHeight;
		$('.content-wrapper').css({'height':h+'px', 'overflow':'auto'});

		/*** close any opened cards ***/
		var opened = $('.page-row>.page-form .box-col.opened');
		// opened.css('top', opened.attr('boxtop'));
		// opened.css({'position':'absolute', 'top':opened.attr('boxtop')});
		opened.find('.box-body').collapse("hide");
		opened.find('.box-header').css('height', '60px');
		opened.addClass('closed').removeClass('opened');

		/*** arrange closed cards ***/
		var closed = $('.page-row>.page-form .box-col.closed');
		var closedTop = 0;
		closed.each(function(){
			var t = $(this);
			t.css({'position': 'absolute', 'top': closedTop + 'px', 'z-index':''});
			closedTop += 60;
			t.removeClass('minimized');
		});
		// closed.show();
		var bcs = $('#bottom-card-selector');
		bcs.find('span.title').html('');
		bcs.hide();

		closedTop += 20;
		var actioncols = $('.page-row>.page-form .action-box-col');
		actioncols.each(function(){
			$(this).css({'position':'absolute', 'top': closedTop + 'px', 'margin-bottom':'30px'});
			closedTop += 60;
		});
		// $('.page-row>.page-form .action-box-col').css({'position': 'absolute', 'top': (closedTop+20) + 'px'});
		allCards = closed.length * 60 + actioncols.length * 80 + 50;
	};

	var openOneCard = function(box) {
		$('.content-wrapper').css({'height':'', 'overflow':''});

		box.css({'position':'static', 'top':'0'});
		box.find('.box-header').css('height', 'auto');
		box.find('.box-body').collapse("show");
		box.addClass('opened').removeClass('closed');
		var closed = $('.page-row>.page-form .box-col.closed');
		var closedTitles = [];
		if (closed.length) {
			var bottom = -33, cl = closed.length;
			var bottomdy = 10/(cl-1?cl-1:cl);
			closed.each(function(){
				var t = $(this);
				t.css({'position': 'fixed', 'top':'', 'bottom':bottom+'px', 'z-index':'50'});
				t.addClass('minimized');
				// closedTitles.push(t.find('h3.box-title').text());
				bottom -= bottomdy;
			});
			closedTitles = closedTitles.join(', ');
			var bcs = $('#bottom-card-selector');
			bcs.find('span.title').html(closedTitles);
			bcs.show();
		}
		// closed.hide();

		$('.page-row>.page-form .action-box-col').css('position', 'static');
		allCards = false;
	};

	var showBoxLayout = function() {
		var boxcols = $('.page-row>.page-form .box-col');
		console.log('>> on showBoxLayout:' + boxcols.length);
		if (!boxcols || boxcols.length < 2) {
			console.log('>> returning');
			allCards = false;
			return false;
		}
		var actionboxcols = $('.page-row>.page-form .action-box-col');
		// boxcols.find('.btn-box-tool').attr('data-widget', '').hide();
		boxcols.addClass('closed');
		boxcols.find('.box-body').collapse("hide");
		boxcols.find('.box-header').css('height', '60px').removeAttr('data-toggle');
		/*var top = 0;
		boxcols.each(function(item){
			$(this).css({'position':'absolute', 'top': top + 'px'});
			// $(this).attr('boxtop', top + 'px');
			top += 60;
		});
		top += 20;
		actionboxcols.each(function(item){
			$(this).css({'position':'absolute', 'top': top + 'px', 'margin-bottom':'30px'});
			top += 60;
		});*/

		showAllCards();

		$('section.content').css('min-height', (top+20)+'px');

		if (!$('#bottom-card-selector').length) {
			$('<div id="bottom-card-selector"><span class="title"></span></div>').appendTo('.page-row>.page-form');
		}

		boxcols.find('.box-header').on('click', function(event){
			event.preventDefault();
			event.stopPropagation();
			var tt = $(this);
			var pp = tt.parent().parent();
			if (pp.is('.closed:not(.minimized)')) {
				openOneCard(pp);
			} else if (pp.is('.opened')) {
				showAllCards();
			}
		});
		$('#bottom-card-selector').on('click', showAllCards);
		return true;
	};

	var removeBoxLayout = function() {
		console.log('on removeBoxLayout');
		var boxcols = $('.page-row>.page-form .box-col');
		var actionboxcols = $('.page-row>.page-form .action-box-col');
		boxcols.removeClass('opened closed minimized').css({'position':'static', 'top':'', 'bottom':'', 'z-index':''});
		boxcols.find('.box-body:not(.in)').collapse("show");
		boxcols.find('.box-header').attr('data-toggle', 'collapse').css('height', 'auto').off('click');
		boxcols.show();

		actionboxcols.css({'position':'static', 'top':'0', 'margin-bottom':'0'});

		$('#bottom-card-selector').remove();
		$('section.content').css('min-height', '250px');

		$timeout(function(){$scope.collapsedView = false;});
	};

	var isBoxLayout = false;
	var isBoxLayoutShown = false;
	var renderBoxLayout = function() {
		var w = window.innerWidth;
		if (w <= 768) {
			if (allCards) {
				var h = window.innerHeight;
				$('.content-wrapper').css({'height':h+'px', 'overflow':'auto'});
			}
			if (!isBoxLayout) {
				isBoxLayoutShown = showBoxLayout();
				if (!isBoxLayoutShown) {
					allCards = false;
					$('.content-wrapper').css({'height':'', 'overflow':''});
				}
				isBoxLayout = true;
			}
		} else {
			$('.content-wrapper').css({'height':'', 'overflow':''});
			if (isBoxLayout) {
				removeBoxLayout();
				isBoxLayout = false;
			}
		}
		$timeout(function(){$scope.showCollapsedViewButton = !isBoxLayout;});
	};

	$scope.showCollapsedViewButton = true;
	$scope.collapsedView = false;

	var renderLayout = function() {
		renderBoxLayout();
		$(window).resize(renderBoxLayout);
		var rerender = function(){
			/*if (isBoxLayout && isBoxLayoutShown) {
				showAllCards();
			}*/
			removeBoxLayout();
			isBoxLayout = false;
			renderBoxLayout();
		};
		$scope.$on('box-init', rerender);
		$scope.$on('box-destroy', function(){
			setTimeout(function() {
				rerender();
			});
		});
	};

	$scope.$watch('collapsedView', function(n, o){
		if (n) {
			$('.page-row>.page-form .box-col').find('.box-body').collapse("hide");
		} else {
			$('.page-row>.page-form .box-col .box-body').collapse("show");
		}
	});

	$scope.expandCollapseView = function() {
		if (!$scope.showCollapsedViewButton)
			return;
		$scope.collapsedView = !$scope.collapsedView;
	};

	/* =================================================================================== */
	$log.info("Page.Engine.html loaded");
	/* =================================================================================== */

	$scope.pageName = $stateParams.pageName;
	$scope.formName = irf.form($scope.pageName);
	$scope.pageNameHtml = $stateParams.pageName.split('.').join('<br/>');
	$scope.pageId = $stateParams.pageId;
	$scope.error = false;
	try {
		$scope.page = $injector.get(irf.page($scope.pageName));
	} catch (e) {
		$log.error(e);
		$scope.error = true;
		//$state.go('Page.EngineError', {pageName:$scope.pageName});
	}

	if ($scope.page) {
		if($scope.page.type == 'schema-form') {
			$scope.model = entityManager.getModel($scope.pageName);
			if (angular.isFunction($scope.page.schema)) {
				var promise = $scope.page.schema();
				promise.then(function(data){
					$scope.page.schema = data;

					if (angular.isFunction($scope.page.form)) {
						var promise = $scope.page.form();
						promise.then(function(data){
							$scope.page.form = data;
							$timeout(function() {
								$scope.page.initialize($scope.model, $scope.page.form, $scope.formCtrl);
							});
						});
					}
				});
			}
			$scope.formHelper = formHelper;

			$scope.$on('irf-sf-init', function(event){
				$scope.formCtrl = event.targetScope[$scope.formName];
			});
			$scope.$on('sf-render-finished', function(event){
				$log.warn("on sf-render-finished on page, rendering layout");
				setTimeout(renderLayout);
			});
		} else if ($scope.page.type == 'search-list') {
			$scope.model = entityManager.getModel($scope.pageName);
			$scope.page.definition.formName = $scope.formName;
			if ($scope.page.offline === true) {
				$scope.page.definition.offline = true;
				var acts = $scope.page.definition.actions = $scope.page.definition.actions || {};
				acts.preSave = function(model, formCtrl, formName) {
					var deferred = $q.defer();
					$log.warn('on pageengine preSave');
					var offlinePromise = $scope.page.getOfflinePromise(model);
					if (offlinePromise && _.isFunction(offlinePromise.then)) {
						offlinePromise.then(function(out){
							$log.warn('offline results:');
							$log.warn(out.body.length);
							/* Build results */
							var items = $scope.page.definition.listOptions.getItems(out.body, out.headers);
							model._result = model._result || {};
							model._result.items = items;

							deferred.resolve();
						}).catch(function(){
							deferred.reject();
						});
					} else {
						deferred.reject();
					}
					return deferred.promise;
				};
			}
		}
		if ($scope.page.uri)
			$scope.breadcrumb = $scope.page.uri.split("/");
		$log.info("Current Page Loaded: " + $scope.pageName);

		if ($scope.pageId && angular.isFunction($scope.page.modelPromise)) {
			var promise = $scope.page.modelPromise($scope.pageId, $scope.model);
			if (promise && angular.isFunction(promise.then)) {
				promise.then(function(model) {
					$scope.model = model;
					$log.info(model);
				});
			} else {
				$log.error("page.modelPromise didn't return promise as promised");
			}
		}
	}
	$scope.callAction = function(actionId) {
		if (self.actionsFactory && self.actionsFactory.StageActions && 
					self.actionsFactory.StageActions[stage.stageName] && 
						self.actionsFactory.StageActions[stage.stageName][actionId]) {
			var _fn = self.actionsFactory.StageActions[stage.stageName][actionId];
			if (_fn)
				_fn($scope.modelHolder);
		}
	};

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadOfflinePage = function(event) {
		event.preventDefault();
		$state.go('Page.EngineOffline', {pageName: $scope.pageName});
		updateAppTitle("Offline | " + $scope.page.title);
	};

}]);

irf.pages.controller("PageEngineErrorCtrl", ["$log", "$scope", "$state", "$stateParams", "$injector", "entityManager", "formHelper", function($log, $scope, $state, $stateParams, $injector, entityManager, formHelper) {
	var self = this;
	$log.info("Page.Engine.Error.html loaded");

	// $scope.pageName = $stateParams.pageName;
	$scope.pageNameHtml = $stateParams.pageName.split('.').join('<br/>');
}]);

irf.pages.controller("PageEngineOfflineCtrl", [
	"$log",
	"$scope",
	"$state",
	"$stateParams",
	"$injector",
	"irfStorageService",
	"elementsUtils",
	"entityManager",
function(
	$log,
	$scope,
	$state,
	$stateParams,
	$injector,
	irfStorageService,
	elementsUtils,
	entityManager
) {
	var self = this;
	$log.info("Page.EngineOffline.html loaded");

	$scope.pageName = $stateParams.pageName;
	$scope.page = $injector.get(irf.page($scope.pageName));

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadPage = function(event) {
		event && event.preventDefault();
		$state.go('Page.Engine', {pageName: $scope.pageName});
		updateAppTitle($scope.page.title);
	};

	$scope.callback = function(item, index) {
		$log.debug("Restoring offline data");
		entityManager.setModel($scope.pageName, item);
		$scope.loadPage(null);
	};

	if ($scope.page.offline && angular.isFunction($scope.page.getOfflineDisplayItem)) {
		var items = irfStorageService.getMasterJSON($scope.pageName);

		var offlineItems = [], displayItems = [];
		var idx = 0;
		_.forEach(items, function(value, key) {
			offlineItems[idx] = value;
			try {displayItems[idx] = $scope.page.getOfflineDisplayItem(value, idx);} catch (e) {displayItems[idx] = ['PARSING_ERROR', e.message];}
			for (var i = 0; i < displayItems[idx].length; i++) {
				if (angular.isNumber(displayItems[idx][i]))
					displayItems[idx][i] = displayItems[idx][i].toString();
			};
			idx++;
		});
		$scope.offlineItems = offlineItems;
		$scope.displayItems = displayItems;

	} else {
		$log.error("Offline not supported for " + $scope.pageName);
		$scope.loadPage(null);
	}

	$scope.offlineListInfo = {
		actions: [{
			name: "Delete",
			icon: "fa fa-trash",
			fn: function(item, index){
				_.pullAt($scope.displayItems, index);
				_.pullAt($scope.offlineItems, index);
				irfStorageService.deleteJSON($scope.pageName, item.$$STORAGE_KEY$$);
			},
			isApplicable: function(item, index){
				//if (index%2==0){
				//	return false;
				//}
				return true;
			}
		}]
	};
}]);

/*
----Under Dev----
@TODO:
1. Log message to Server endpoint
2. Format error report/console output 

Usage:
1. Add irfLogger as module dependency and use $log for logging
2. To log ajax calls, config() the module as follows:

.config(function($httpProvider) {
	$httpProvider.interceptors.push('irfHttpLogInterceptor');
});

*/
angular.module('IRFLogger', [])
.service('$log', function () {
	var self = this;

	self.loggingEnabled = true;
	self.showConsole = true;
	self.saveLog = false;
	self.lastLogTime = null;

	var log2Server = function(logLevel,msg){
		//logLevel =  v,d,i,w,e corresponding to Verbose, Debug, Info, Warn and Error
		//@TODO : Log to server endpoint
		// console.log("Sending Report to server");
	};

	self.allLogs = "";

	var _saveLog = function(logLevel, msg) {
		var log = msg;
		self.lastLogTime = moment(new Date());
		head = '<span class="time">' + self.lastLogTime.format('MMM-DD:HH:mm:ss') + ' =&gt; </span>';
		if (_.isObject(msg)) {
			log = '<span class="object">' + JSON.stringify(msg) + '</span>';
		}
		log = head + log;
		switch (logLevel) {
			case 'info':
				self.allLogs +=  '<p class="info">' + log + '</p>\r\n';
				break;
			case 'debug':
				self.allLogs +=  '<p class="debug">' + log + '</p>\r\n';
				break;
			case 'warn':
				self.allLogs +=  '<p class="warn">' + log + '</p>\r\n';
				break;
			case 'error':
				self.allLogs +=  '<p class="error">' + log + '</p>\r\n';
				break;
			default:
				self.allLogs +=  '<p class="log">' + log + '</p>\r\n';
		}
	};

	self.getAllLogs = function() {
		return self.allLogs;
	};

	self.clearLogs = function() {
		self.allLogs = "";
	};

	var windowConsole = window.console;
	window.console = {};

	window.console.log = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.log(msg);
			if (self.saveLog) _saveLog('log', msg);
		}
	};

	window.console.debug = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.debug(msg);
			if (self.saveLog) _saveLog('debug', msg);
		}
	};

	window.console.info = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.info(msg);
			if (self.saveLog) _saveLog('info', msg);
		}
	};

	window.console.warn = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.warn(msg);
			if (self.saveLog) _saveLog('warn', msg);
		}
	};

	window.console.error = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.error(msg);
			if (self.saveLog) _saveLog('error', msg);
		}
	};

	self.log = window.console.log;
	self.info = window.console.info;
	self.debug = window.console.debug;
	self.warn = window.console.warn;
	self.error = window.console.error;

	window.onerror = function(message, file, line, position, error) {
		_saveLog('error', {message:message, file:file, line:line, position:position, error:error});
	};

})
.config(['$provide', function($provide){
	$provide.decorator('$exceptionHandler', ['$log', function($log){
		return function(exception, cause){
			$log.error.apply($log, [exception.stack]);
		};
	}]);
}])
.factory('irfHttpLogInterceptor',function($q,$log){
	var httpInterceptor = {
		'request': function (config) {
			config.msBeforeAjaxCall = new Date().getTime();
			return config;
		},
		'response': function (response) {
			if (response.config.warningAfter) {
				var msAfterAjaxCall = new Date().getTime();
				var timeTakenInMs =  msAfterAjaxCall - response.config.msBeforeAjaxCall;
				if (timeTakenInMs > response.config.warningAfter) {
					$log.warn({ 
					  timeTakenInMs: timeTakenInMs, 
					  config: response.config, 
					  data: response.data });
				}
			}
			return response;
		},
		'responseError': function (rejection) {
			var errorMessage = "timeout";
			if (rejection && rejection.status && rejection.data) {
				errorMessage = rejection.data.ExceptionMessage;
			}
			$log.error({ 
					  errorMessage: errorMessage, 
					  status: rejection.status, 
					  config: rejection.config,
					  data:rejection.data});

			return $q.reject(rejection);
		}
	};
	return httpInterceptor;
});

var MainApp = angular.module("MainApp", ["IRFPages", "IRFLogger"]);

MainApp.controller("MainController",
["$scope", "$log", "SessionStore", "Queries", "$state", "$timeout",
function($scope, $log, SessionStore, Queries, $state, $timeout) {
	$scope.appShortName = "Px";
	$scope.appName = "Perdix";
	document.mainTitle = "Perdix Mobility";

	$scope.isCordova = typeof(cordova) !== 'undefined';

	$.getJSON("app_manifest.json", function(json) {
		$scope.$apply(function(){
			$scope.app_manifest = json;
			$scope.appName = json.title;
			document.mainTitle = json.name;
		});
		if ($scope.isCordova) {
			Queries.getGlobalSettings('cordova.latest_apk_version').then(function(value){
				$scope.latest_version = value;
				if ($scope.app_manifest.version != $scope.latest_version) {
					Queries.getGlobalSettings('cordova.latest_apk_url').then(function(url){
						$log.debug('latest_apk_url:'+url);
						$scope.latest_apk_url = url;
					});
				}
			});
		}
		if ($scope.app_manifest.connect_perdix7) {
			$timeout(function() {
				$scope.connect_perdix7 = true;
				if ($state.current.name === irf.REDIRECT_STATE) {
					$log.debug("Legacy Perdix7 interoperability enabled, and trying redirect assuming token is avilable.");
					$state.transitionTo(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
				}
			});
		}
	});

	$.AdminLTE.options.navbarMenuSlimscroll = false;
	if ($.AdminLTE.options.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
		$(".navbar .menu").slimscroll({
			height: $.AdminLTE.options.navbarMenuHeight,
			alwaysVisible: false,
			size: $.AdminLTE.options.navbarMenuSlimscrollWidth
		}).css("width", "100%");
	}

	$.AdminLTE.options.boxWidgetOptions.boxWidgetIcons.collapse = "fa-chevron-down";
	$.AdminLTE.options.boxWidgetOptions.boxWidgetIcons.open = "fa-chevron-right";
	$.AdminLTE.options.sidebarPushMenu = false;

	var menuResize = function(){
		var w = window.innerWidth; // $(window).width();
		if (w > ($.AdminLTE.options.screenSizes.sm - 1) && w < $.AdminLTE.options.screenSizes.md) {
			$("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
		} else if (w > ($.AdminLTE.options.screenSizes.md - 1)) {
			$("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
		}
	};
	$(window).resize(menuResize);
	menuResize();
}]);


MainApp.directive('irfHeader', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			theme: '='
		},
		templateUrl: "modules/app/templates/header.html",
		link: function(scope, elem, attrs, ctrl) {
			//ctrl.init(elem);
		},
		controller: "irfHeaderController"
	};
});

MainApp.controller("irfHeaderController",
["$scope", "$log", "$http", "irfConfig", "SessionStore", "$translate", "languages", "$state",
	"authService", "irfSimpleModal", "irfProgressMessage",
function($scope, $log, $http, irfConfig, SessionStore, $translate, languages, $state,
	authService, irfSimpleModal, irfProgressMessage) {

	$scope.ss = SessionStore;

	$scope.photo = SessionStore.getPhoto();

	$("a[href='#']").click(function(e){e.preventDefault()});

	$scope.showLogs = function() {
		var allLogs = $log.getAllLogs();
		var body = '<div class="log-div">' + allLogs + '</div>';
		irfSimpleModal('<i class="fa fa-terminal">&nbsp;</i>Console Logs', body).opened.then(function(){
			setTimeout(function() {
				$(".log-div span.object").each(function(){
					try {
						var jjson = JSON.parse($(this).text());
						$(this).html('');
						this.appendChild(renderjson.set_show_to_level(1)(jjson));
					} catch (e) {}
				});
				$('.modal-dialog button.pull-left')[0].scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 500);
		});
	};

	$scope.clearLogs = function() {
		$log.clearLogs();
		irfProgressMessage.pop("logs", "Console Logs Cleared", 2500);
	};

	$scope.logout = function() {
		authService.logout();

		$state.go("Login");
	};

	$scope.languages = languages;

	$scope.changeLanguage = function(lang) {
		$translate.use(lang.code);
		SessionStore.session.language = lang.code;
	};

	var dxScale = 0.1;
	$scope.changeFontSize = function(event, increase) {
		event.preventDefault();
		if (typeof(increase)=='undefined')
			initialScale = 1;
		else
			initialScale += increase ? dxScale : -dxScale;
		setFontSize(initialScale);
	};

	var setFontSize = function(scale) {
		$('meta[name="viewport"]').attr("content", "width=100, initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no");
		$scope.scalePercent = Math.round(scale * 100) - 100;
		localStorage.setItem('initialScale', scale);
	};

	var initialScale = localStorage.getItem('initialScale');
	if (initialScale == null)
		initialScale = 1;
	else
		initialScale = Number(initialScale);
	setFontSize(initialScale);

	$scope.isTouchDevice = (function () {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	})();
}]);


MainApp.directive('irfMainMenu', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			
		},
		templateUrl: "modules/app/templates/menu.html",
		link: function(scope, elem, attrs, ctrl) {
			//ctrl.init(elem);
		},
		controller: "irfMainMenuController"
	};
});

MainApp.controller("irfMainMenuController", [
	"$scope", "$log", "$http", "$state", "SessionStore", "PagesDefinition",
	function($scope, $log, $http, $state, SessionStore, PagesDefinition) {

	$scope.ss = SessionStore;

	$scope.photo = SessionStore.getPhoto();

	$http.get("process/MenuDefinition.json").then(function(response){
		PagesDefinition.getUserAllowedDefinition(response.data).then(function(resp){
			$scope.definition = resp;
			$.AdminLTE.layout.activate();
			$.AdminLTE.tree('.sidebar');
			// $('.main-sidebar').slimScroll();
			$("a[href='#']").click(function(e){e.preventDefault()});
		});
	});

	var adminLteSidemenuFixOnSmallScreen = function() {
		if ($(window).width() < ($.AdminLTE.options.screenSizes.sm)) {
			if ($("body").hasClass('sidebar-open')) {
				$("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
			}
		}
	};

	/*$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){ 
		if (toState === 'PageView.PageEngine' && toParams && toParams.pageName) {
			
		}
	});*/

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadPage = function(event, menu) {
		event.preventDefault();
		if (menu && menu.state) {
			$state.go(menu.state, menu.stateParams);
			adminLteSidemenuFixOnSmallScreen();
			updateAppTitle(menu.title);
			window.scrollTo(0,0);
		}
		if (angular.isFunction(menu.onClick)) {
			menu.onClick(event, menu);
		}
	};

	$scope.loadOfflinePage = function(event, menu) {
		event.preventDefault();
		if (menu && menu.offline && menu.state) {
			$state.go(menu.state + 'Offline', menu.stateParams);
			adminLteSidemenuFixOnSmallScreen();
			updateAppTitle("Offline | " + menu.title);
			window.scrollTo(0,0);
		}
	};

	$scope.isActive = function(id) {
		return $state.current.name === id;
	};
}]);

String.prototype.startsWith = function(sub) {
	return this.substring(0, sub.length) == sub;
};

$(document).ready(function(){
    angular.bootstrap($("html"), ['MainApp']);
});