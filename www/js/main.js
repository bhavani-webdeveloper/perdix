//HEAD 
(function(app) {
try { app = angular.module("irf.elements.tpls"); }
catch(err) { app = angular.module("irf.elements.tpls", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

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
    "           placeholder=\"{{form.placeholder|translate}}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + \"Amount\"\n" +
    "      + (form.minimum ?\n" +
    "        \" Min: \" + form.minimum : \"\")\n" +
    "      + (form.maximum ?\n" +
    "        \" Max: \" + form.maximum : \"\")\n" +
    "    }}&nbsp;</span>\n" +
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

$templateCache.put("irf/template/adminlte/box.html","<div class=\"{{ form.colClass ? form.colClass : 'col-sm-6' }} box-col\" ng-form name=\"BoxForm\">\n" +
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
    "    <input class=\"form-control {{form.fieldHtmlClass}}\" ng-disabled=\"form.readonly\" readonly/>\n" +
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
    "        style=\"padding-left:5px;padding-right:7px;outline:none\"><i class=\"fa fa-times\"></i></button>\n" +
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
    "           placeholder=\"{{form.placeholder|translate}}\"\n" +
    "           id=\"{{form.key.slice(-1)[0]}}\" />\n" +
    "    <span ng-if=\"SingleInputForm.$dirty && SingleInputForm.$invalid\" sf-message=\"form.description\" class=\"htmlerror\">&nbsp;{{\n" +
    "      (form.required ?\n" +
    "        \"Required \" : \"\")\n" +
    "      + (form.type ?\n" +
    "        (form.type | initcap) : \"Text\")\n" +
    "      + (form.minlength || form.maxlength ?\n" +
    "        \" Length: \"\n" +
    "        + (form.minlength ?\n" +
    "          form.minlength : \"0\")\n" +
    "        + \" to \"\n" +
    "        + (form.maxlength ?\n" +
    "          form.maxlength : \"any\")\n" +
    "         : \"\"\n" +
    "        )\n" +
    "      + (form.minimum ?\n" +
    "        \" Min: \" + form.minimum : \"\")\n" +
    "      + (form.maximum ?\n" +
    "        \" Max: \" + form.maximum : \"\")\n" +
    "    }}&nbsp;</span>\n" +
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
    "    <input sf-field-model\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           ng-disabled=\"form.readonly || form.lovonly\"\n" +
    "           schema-validate=\"form\"\n" +
    "           ng-change=\"evalExpr('callOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "           type=\"text\"\n" +
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
    "   	<a ng-hide=\"form.readonly\" irf-lov irf-form=\"form\" irf-schema=\"form.schema\" irf-model=\"model\"\n" +
    "      style=\"position:absolute;top:6px;right:24px\" href=\"\">\n" +
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
    "          name=\"{{form.key.join('.')}}\"\n" +
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
    "    <select sf-field-model=\"replaceAll\"\n" +
    "      ng-model=\"$$value$$\"\n" +
    "      ng-disabled=\"form.readonly\"\n" +
    "      ng-change=\"evalExpr('callSelectOnChange(event, form, modelValue)', {form:form, modelValue:$$value$$, event:$event})\"\n" +
    "      schema-validate=\"form\"\n" +
    "      class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "      id=\"{{form.id}}\" name=\"{{form.id}}\"\n" +
    "      ng-init=\"form.enumCode = form.enumCode ? form.enumCode : form.schema.enumCode; evalExpr('registerForTitleMap(form)', {form:form}); form.id=form.key.slice(-1)[0]\"\n" +
    "      irf-options-builder=\"form\"\n" +
    "      ng-options=\"item.value as item.name for item in form.filteredTitleMap\"\n" +
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

$templateCache.put("irf/template/dashboardBox/dashboard-box.html","<div class=\"col-md-12 dashboard-box\">\n" +
    "  <div class=\"box box-theme no-border\">\n" +
    "    <div class=\"box-header\">\n" +
    "      <h3 class=\"box-title\" ng-if=\"!menu.parentMenu\">{{ menu.title | translate }}</h3>\n" +
    "      <h3 class=\"box-title\" ng-if=\"menu.parentMenu\" ng-click=\"loadPage($event, menu.parentMenu)\" style=\"cursor:pointer\">\n" +
    "        <i class=\"fa fa-arrow-left\" style=\"color:#97a0b3\">&nbsp;&nbsp;</i>\n" +
    "        <i class=\"{{ menu.iconClass }}\" ng-if=\"menu.iconClass\" style=\"color:#666\"> </i>\n" +
    "        {{ menu.title | translate }}\n" +
    "      </h3>\n" +
    "      <div class=\"box-tools pull-right\">\n" +
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
    "  <div ng-if=\"!isImage && !isBiometric && inputFileDataURL\" class=\"row\" style=\"padding-bottom:7px;\">\n" +
    "    <div class=\"col-xs-12\" style=\"text-align:center;height:22px;overflow:hidden\">\n" +
    "      <a href=\"{{ inputFileDataURL }}\" class=\"color-theme\">{{'VIEW_FILE'|translate}}</a>\n" +
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
    "      <span ng-if=\"!fileError\">{{ (modelValue && modelValue!='$$OFFLINE_FILE$$') ? modelValue : inputFileName }}</span>\n" +
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
    "  <input type=\"file\" id=\"{{::id}}\" style=\"width: 0.1px;height: 0.1px;opacity: 0;overflow: hidden;position: absolute;z-index: -1;\" />\n" +
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
    "        <div class=\"checkbox\" ng-if=\"selectable\" ng-click=\"actualItem.selected = !actualItem.selected\">\n" +
    "            <label class=\"checkbox-inline checkbox-theme\">\n" +
    "                <input type=\"checkbox\"\n" +
    "                       ng-model=\"actualItem.selected\">\n" +
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
    "        ng-click=\"actualItem.selected=!!!actualItem.selected\">\n" +
    "        <h4 class=\"list-group-item-heading\" ng-bind-html=\"item[0]\">&nbsp;</h4>\n" +
    "        <p ng-if=\"item.length > 1\" ng-bind-html=\"item[1]\" class=\"list-group-item-text smaller\">&nbsp;</p>\n" +
    "        <div class=\"checkbox-simple color-theme\" ng-if=\"selectable && actualItem.selected\">\n" +
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
    "          list-style=\"basic\"\n" +
    "          list-info=\"listViewOptions\"\n" +
    "          irf-list-items=\"listDisplayItems\"\n" +
    "          irf-list-actual-items=\"listResponseItems\"\n" +
    "          callback=\"callback(item)\"></irf-list-view>\n" +
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

$templateCache.put("irf/template/searchBox/search-box.html","<div>\n" +
    "	<form sf-schema=\"def.searchSchema\" sf-form=\"def.searchForm\" sf-model=\"searchOptions\" ng-submit=\"startSearch()\"></form>\n" +
    "</div>\n" +
    "")

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
    "  <div ng-if=\"!modalPopup\" class=\"col-sm-6 box-col\">\n" +
    "    <div class=\"box box-theme\" id=\"{{pid}}\" ng-init=\"pid=definition.formName.split(' ').join('_')\">\n" +
    "      <div class=\"box-header with-border\" ng-init=\"id=pid+'_body'\" data-toggle=\"collapse\" data-target=\"#{{id}}\" data-parent=\"#{{pid}}\">\n" +
    "          <h3 class=\"box-title\">{{ 'RESULTS' | translate }}</h3>\n" +
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
    "          <irf-list-view\n" +
    "            list-style=\"listStyle\"\n" +
    "            list-info=\"listViewOptions\"\n" +
    "            irf-list-items=\"listItems\"\n" +
    "            irf-list-actual-items=\"items\"\n" +
    "            callback=\"definition.listOptions.itemCallback(item, index)\"></irf-list-view>\n" +
    "          <uib-pagination\n" +
    "            ng-change=\"loadResults(model.searchOptions, currentPage)\"\n" +
    "            ng-model=\"pageInfo.currentPage\"\n" +
    "            boundary-links=\"true\"\n" +
    "            total-items=\"getTotalItems();\"\n" +
    "            rotate=\"true\"\n" +
    "            max-size=\"5\"\n" +
    "            force-ellipsis=\"true\"\n" +
    "            class=\"pagination-sm\"\n" +
    "            force-ellipses=\"true\"\n" +
    "            items-per-page=\"getItemsPerPage()\"></uib-pagination>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-if=\"modalPopup\">\n" +
    "    <h4 ng-if=\"definition.searchForm.length\" class=\"box-title box-title-theme\" style=\"text-align:center; margin: 20px 5px 10px\">\n" +
    "        <span class=\"text\" style=\"padding: 0 5px;\">{{ 'RESULTS' | translate }}</span>\n" +
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
angular.module('irf.schemaforms.adminlte', ['schemaForm', 'ui.bootstrap', 'irf.elements.commons'])
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
        "anchor": "anchor.html"
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

	var getGeolocation = function() {
		var deferred = $q.defer();
		if (navigator.geolocation) {
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
		var fileInput = document.getElementById($scope.id);
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
		self.getFileContent($scope.form.fileType, false).then(self.fileUpload);
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

			document.getElementById($scope.id).value = '';
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

		$scope.id = $scope.form.key.slice(-1)[0];
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
			parentModel: "=irfModel"
		},
		restrict: 'A',
		link: function($scope, elem, attrs, ctrl) {
			$(elem).click(ctrl.onClickLOV);
		},
		controller: 'irfLovCtrl'
	};
}])
.controller('irfLovCtrl', ["$scope", "$q", "$log", "$uibModal", "elementsUtils", "schemaForm",
function($scope, $q, $log, $uibModal, elementsUtils, schemaForm){
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
				s = s["properties"][v[i]];
			}
			$scope.inputSchema.properties[key] = s;
		});

		if ($scope.inputForm.length == 0) {
			$scope.inputActions.submit();
		} else {
			$scope.inputForm.push({"type":"submit", "title":"Search"});
			// $log.info($scope.inputForm);
		}

		/*var mergedInputForm = schemaForm.merge($scope.$parent.$parent.schema, _.values($scope.form.inputMap));

		angular.forEach(mergedInputForm, function(value, key){
			$scope.inputSchema.properties[key] = s;
		});*/

		var bindSize = _.size($scope.form.bindMap);
		if (bindSize && bindSize != _.remove(_.values($scope.bindModel), undefined).length) {
			self.showBindValueAlert($scope.form.bindMap);
			return;
		}

		self.launchLov();
	};

	self.showBindValueAlert = function(bindKeys) {
		elementsUtils.alert("Value(s) for " + _.keys(bindKeys).join(", ") + " which is/are required is missing");
	};

	self.launchLov = function() {
		$scope.modalWindow = $uibModal.open({
			scope: $scope,
			templateUrl: "irf/template/lov/modal-lov.html",
			controller: function($scope) {
				$scope.$broadcast('schemaFormValidate');
				$log.info($scope.locals);
			}
		});
	};

	$scope.inputActions = {};

	$scope.inputActions.submit = function(model, form, formName) {
		$scope.showLoader = true;
		angular.extend($scope.inputModel, $scope.bindModel);
		var promise;
		if (angular.isFunction($scope.form.search)) {
			promise = $scope.form.search($scope.inputModel, $scope.form);
		} else {
			promise = $scope.evalExpr($scope.form.search, {inputModel:$scope.inputModel, form:$scope.form});
		}
		promise.then(function(out){
			$scope.listResponseItems = out.body;
			$scope.listDisplayItems  =[];
			angular.forEach(out.body, function(value, key) {
				c = $scope.form.getListDisplayItem(value, key);
				this.push(c);
			}, $scope.listDisplayItems);
			$scope.showLoader = false;
		},function(){
			$scope.showLoader = false;
		});
	};

	$scope.callback = function(item) {
		$log.info("Selected Item->");
		$log.info(item);
		elementsUtils.mapOutput($scope.form.outputMap, item, $scope.parentModel, $scope.locals);
		self.close();
	};

	self.close = function() {
		$scope.modalWindow.close();
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
		link: function($scope, elem, attrs, ctrl) {
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
					$(elem).next().on('click', function(){
						window.datePicker.show({
							date: $scope.ngModel ? moment($scope.ngModel).toDate() : new Date(),
							mode: 'date'
						}, function(date){
							$log.info(date);
							$scope.ngModel = moment(date).format(pikadayOptions.format);
							$(elem).val($scope.ngModel);
							$(elem).controller('ngModel').$setViewValue($scope.ngModel);
						});
					});
				} else {
					pikadayOptions.field = $(elem).next()[0];
					pikadayOptions.onSelect = function(date) {
						$scope.ngModel = this.getMoment().format(pikadayOptions.format);
						$(elem).val($scope.ngModel);
						$(elem).controller('ngModel').$setViewValue($scope.ngModel);
					};
					pikadayOptions.onDraw = function() {
						$('.pika-label').contents().filter(function(){return this.nodeType===3}).remove();
					};
					var picker = new Pikaday(pikadayOptions);
				}
			}
			// $scope.$parent.datePattern = /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/i;
			$scope.$watch(function(scope){return scope.ngModel}, function(n,o){
				if (n) {
					if (pikadayOptions.dateDisplayFormat) {
						$(elem).next().val(moment(n).format(pikadayOptions.dateDisplayFormat));
					} else {
						$(elem).next().val(moment(n).format('DD-MM-YYYY'));
					}
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
				if (window.innerWidth <= 768) {
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
			$scope.searchForm = [{
				"type": "box",
				"title": $scope.definition.title,
				"items": sfc
			}];
		}
	}

	$scope.model = $scope.model || {};
	$scope.model.searchOptions = $scope.model.searchOptions || {};

	if ($scope.definition.listOptions.listStyle) {
		$scope.listStyle = $scope.definition.listOptions.listStyle;
	} else {
		$scope.listStyle = "basic";
	}

	$scope.initSF = function(model, form, formCtrl) {
		if ($scope.initialize && angular.isFunction($scope.initialize)) {
			$scope.initialize({model:$scope.model.searchOptions, form:$scope.searchForm, formCtrl:formCtrl});
		}
	};
	if (!$scope.definition.searchForm || !$scope.definition.searchForm.length || $scope.definition.autoSearch) {
		$scope.loadResults($scope.model.searchOptions);
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
							var items = $filter('filter')($scope.model._result.items, {selected:true}, true);
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
								v.selected = !$scope.toggle;
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
angular.module('irf.elements',['irf.elements.tpls','irf.elements.commons','irf.aadhar','irf.lov','irf.inputFile','irf.listView','irf.schemaforms.adminlte','irf.schemaforms','irf.searchBox','irf.resourceSearchWrapper','irf.geotag','irf.dashboardBox','irf.pikaday','irf.flipswitch','irf.progressMessage','irf.zxing','irf.table','irf.validateBiometric'])
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
            var date = new Date();
            var y = date.getFullYear();
            var m = (date.getMonth()+1);
            var d = date.getDate();
            m = (m.toString().length<2)?("0"+m):m;
            d = (d.toString().length<2)?("0"+d):d;

            return y+"-"+m+"-"+d;
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
	
	$translateProvider.useStaticFilesLoader({
    prefix: './process/translations/',
    suffix: '.json'
  })
  .preferredLanguage('en')
  //.useMissingTranslationHandlerLog()
  ;
});

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

	self.getItem = function(key, value){
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
				if (rejection.status === 401 && !(rejection.config && rejection.config.data && rejection.config.data.grant_type=='password')) {
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
		cacheAllMaster: function(isServer,forceFetch) {
			if (!masters || _.isEmpty(masters)) {
				var localMasters = retrieveItem('irfMasters');
				try {
					masters = JSON.parse(localMasters);
					$log.info('masters loaded to memory localStorage');
				} catch (e) {
					$log.error(e);
				}
			} else {
				$log.info('NoNeedToLoadMasters');
			}
			if (isServer) {
				$log.info('masters isServer');
				var deferred = $q.defer();
				try {
					var isSameDay = false;
					if (masters && masters._timestamp) {
						isSameDay = moment(masters._timestamp).startOf('day').isSame(moment(new Date().getTime()).startOf('day'));
					}
					(!forceFetch) && isSameDay && deferred.resolve("It's the same day for Masters/ not downloading");
					((!forceFetch) && isSameDay) || rcResource.findAll(null).$promise.then(function(codes) {
						var _start = new Date().getTime();
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
						$log.info("Time taken to process masters (ms):" + (new Date().getTime() - _start));

						/** removing other bank branches, district **/
						var bankId = null;
						try {
							var bankName = SessionStore.getBankName();
							var bankId = $filter('filter')(classifiers['bank'].data, {name:bankName}, true)[0].code;
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

						classifiers._timestamp = new Date().getTime();
						masters = classifiers;
						$log.info(masters);
						storeItem('irfMasters', JSON.stringify(classifiers));
						deferred.resolve("masters download complete");
					});
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
					case 'loan_product':
						$log.debug(key);
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							ret.data[i].value = ret.data[i].field1.toString().trim();
						}
						break;
					case 'centre':
						r.data = $filter('filter')(r.data, {parentCode:branchId}, true);
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							if (ret.data[i].parentCode == branchId)
								ret.data[i].value = ret.data[i].code;
						}
                        // console.warn(ret);
						break;
                    case 'village':
                        console.log("branchid:"+branchId);
						ret.data = r.data = $filter('filter')(r.data, {parentCode:branchId}, true);
						$log.warn('village:'+ret.data.length);
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
		save: function(model, formCtrl, formName, actions) {
			var promise = true;
			if (angular.isFunction(actions.preSave)) {
				promise = actions.preSave(model, formCtrl, formName);
				if (promise && _.isFunction(promise.then)) {
					promise.then(function(){
						irfStorageService.putJSON(formName, model);
						$state.go('Page.EngineOffline', {pageName: formName});
					}).catch(function(){
						// nothing to do
					});
				}
			} else {
				irfStorageService.putJSON(formName, model);
				$state.go('Page.EngineOffline', {pageName: formName});
			}
		},
		submit: function(model, formCtrl, formName, actions) {
			$log.info("on systemSubmit");
			entityManager.setModel(formName, null);
			if (formCtrl && formCtrl.$invalid) {
				irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
				return false;
			}
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
		var m = irfStorageService.getJSON("UserProfile", userData.login);
		if (m && m.settings) {
			$log.info('set ProfilePreferences -> found saved settings');
			SessionStore.profile = m.profile;
			SessionStore.settings = m.settings;
			$log.saveLog = SessionStore.settings.consoleLog;
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
			$log.info("UserData is present in Session.")
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
['$scope', 'authService', '$log', '$state', 'irfStorageService', 'SessionStore', 'Utils',
function($scope, authService, $log, $state, irfStorageService, SessionStore, Utils){

	var onlineLogin = function(username, password, refresh) {
		authService.loginAndGetUser(username,password).then(function(arg){ // Success callback
			$scope.showLoading = true;

			irfStorageService.cacheAllMaster(true, refresh).then(function(msg){
				$log.info(msg)
				$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
				if (refresh) {
					window.location.hash = '#/' + irf.HOME_PAGE.url;
					window.location.reload();
				}
			},function(e){
				$log.error(e)
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
		var m = irfStorageService.getMasterJSON("UserProfile");
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
["$log", "$scope", "$stateParams", "$q", "$http", "$uibModal", "authService", "AuthPopup", "PageHelper", "SessionStore",
function ($log, $scope, $stateParams, $q, $http, $uibModal, authService, AuthPopup, PageHelper, SessionStore) {
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
                    if (data.errors) {
                        _.forOwn(data.errors, function (keyErrors, key) {
                            var keyErrorsLength = keyErrors.length;
                            for (var i = 0; i < keyErrorsLength; i++) {
                                var error = {"message": "<strong>" + key + "</strong>: " + keyErrors[i]};
                                errors.push(error);
                            }
                        });

                    }
                    if (data.error) {
                        errors.push({message: data.error});
                    }
                    this.setErrors(errors);
                }catch(err){
                    $log.error(err);
                }

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

		$scope.$apply(function(){$scope.collapsedView = false;});
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
		$scope.$apply(function(){$scope.showCollapsedViewButton = !isBoxLayout;});
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
	$scope.formName = $scope.pageName;//.replace(/\./g, '$');
	$scope.pageId = $stateParams.pageId;
	try {
		$scope.page = $injector.get(irf.page($scope.pageName));
	} catch (e) {
		$log.error(e);
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
				$scope.formCtrl = event.targetScope[$scope.pageName];
			});
			$scope.$on('sf-render-finished', function(event){
				$log.warn("on sf-render-finished on page, rendering layout");
				setTimeout(renderLayout);
			});
		} else if ($scope.page.type == 'search-list') {
			$scope.model = entityManager.getModel($scope.pageName);
			$scope.page.definition.formName = $scope.pageName;
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

	$scope.pageName = $stateParams.pageName;
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
			displayItems[idx] = $scope.page.getOfflineDisplayItem(value, idx);
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
["$scope", "$log", "SessionStore",
function($scope, $log, SessionStore) {
	$scope.appShortName = "Px";
	$scope.appName = "Perdix";

	document.mainTitle = "Perdix Mobility | Alpha";

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

	$scope.appShortName = $scope.$parent.appShortName;
	$scope.appName = $scope.$parent.appName;

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
		PagesDefinition
		.getUserAllowedDefinition(response.data)
		.then(function(resp){
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

//kgfs-pilot irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/kgfs-pilot';
//irf.BASE_URL = 'http://works2.sen-sei.in:8080/perdix-server';
irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/perdix-server';
//irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/perdix-server';
//UAT irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/pilot-server';
irf.MANAGEMENT_BASE_URL = 'http://uatperdix.kgfs.co.in:8081/perdixService/index.php';
//irf.MANAGEMENT_BASE_URL = 'http://localhost/perdixService/index.php';
irf.FORM_DOWNLOAD_URL = 'http://uatperdix.kgfs.co.in:8081/saijaforms/DownloadForms.php';

irf.models
	.constant('BASE_URL', irf.BASE_URL)
	.constant('Model_ELEM_FC', {
		'fileUploadUrl': irf.BASE_URL + '/api/files/upload',
		'dataUploadUrl': irf.BASE_URL + '/api/files/upload/base64',
		'fileDeleteUrl': irf.BASE_URL + '/api/files/upload',
		'fileStreamUrl': irf.BASE_URL + '/api/stream',
		'responseSelector': 'fileId'
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
			return SessionStore.getItem(irf.SESSION_AUTH_KEY); //authData;
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

		return resource.login(credentials,function(response){
			//$http.defaults.headers.common['Authorization']= 'Bearer '+response.access_token;
			AuthTokenHelper.setAuthData(response);
		});
	};

	return resource;
});

irf.models.factory('PagesDefinition', ["$resource", "$log", "BASE_URL", "$q", "Queries", "SessionStore",
    function($resource, $log, BASE_URL, $q, Queries, SessionStore){
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
        Queries.getPagesDefinition(SessionStore.getLoginname())
        .then(function(response){
            delete response.$promise;
            delete response.$resolved;
            userAllowedPages = response;
            deferred.resolve(response);
        }, function(error) {
            deferred.reject(error);
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
                md[i].items = __parseMenuDefinition(allowedPages, menuMap, md[i].items);
                if (!md[i].items || md[i].items.length == 0) {
                    md.splice(i, 1);
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

    pDef.parseMenuDefinition = parseMenuDefinition;

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

    pDef.getPageConfig = function(pageUri) {
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

    return resource;
});

irf.models.factory('Queries',function($resource,$httpParamSerializer,BASE_URL, $q){
	var endpoint = BASE_URL + '/api';

	var resource =  $resource(endpoint, null, {
		query:{
			method:'POST',
			url:endpoint+'/query'
		}
	});

	resource.getResult = function(id, params, limit, offset) {
		var deferred = $q.defer();
		resource.query({identifier:id, limit:limit || 0, offset:offset || 0, parameters:params}).$promise.then(deferred.resolve, deferred.reject);
		return deferred.promise;
	};

	/*
		userpages.list=select p.uri, p.title, p.short_title shortTitle, p.icon_class iconClass, p.direct_access directAccess, p.offline, p.state, p.page_name pageName, p.page_id pageId, p.addl_params addlParams, rpa.page_config pageConfig from pages p, role_page_access rpa where p.id = rpa.page_id and rpa.role_id in (select role_id from user_roles where user_id = :user_id)
	*/

	resource.getPagesDefinition = function(userId) {
		var deferred = $q.defer();
		resource.getResult('userpages.list', {user_id:userId}).then(function(records){
			if (records && records.results) {
				var def = {};
				_.each(records.results, function(v, k){
					var d = {
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

	return resource;
});

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

irf.models.factory('Enrollment',function($resource,$httpParamSerializer,BASE_URL, searchResource){
    var endpoint = BASE_URL + '/api/enrollments';
    /*
     * $get : /api/enrollments/{blank/withhistory/...}/{id}
     *  eg: /enrollments/definitions -> $get({service:'definition'})
     *      /enrollments/1           -> $get({id:1})
     * $post will send data as form data, save will send it as request payload
     */
    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint+'/:service/:id'
        },
        query:{
            method:'GET',
            url:endpoint+'/:service/:id',
            isArray:true
        },

        getSchema:{
            method:'GET',
            url:'process/schemas/profileInformation.json'
        },
        search: searchResource({
            method: 'GET',
            url: endpoint + '/'
        }),
        put:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        },
        postWithFile:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'undefined'
            },
            transformRequest: function (data) {
                var fd = new FormData();
                angular.forEach(data, function(value, key) {
                    fd.append(key, value);
                });
                return fd;
            }
        },
        save:{
            method:'POST',
            url:endpoint
        },
        updateEnrollment: {
            method: 'PUT',
            url: endpoint
        },
        getCustomerById: {
            method: 'GET',
            url: endpoint+'/:id'
        },
        getWithHistory: {
            method: 'GET',
            url: endpoint+'/withhistory/:id'
        }
    });
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

irf.models.factory('CreditBureau',function($resource,$httpParamSerializer,BASE_URL,searchResource,$q){
    var endpoint = BASE_URL + '/api/creditbureau';

    var ret = $resource(endpoint, null, {
        creditBureauCheck: {
            method:'GET',
            url: endpoint + '/check/:customerId/:highMarkType/:purpose/:loanAmount'
        },
        listCreditBureauStatus: searchResource({
            method: "GET",
            url: endpoint + '/list'
        }),
        DSCpostCB: {
            method: 'GET',
            url: endpoint + '/postcb/:customerId'
        },
        reinitiateCBCheck: {
            method: 'GET',
            url: endpoint + '/reinitiate/:creditBureauId'
        }
    });

    return ret;
});

irf.models.factory('LoanProcess',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanaccounts';
    /*
    * GET /api/loanaccounts/reverse/{transactionId}/{transactionName} will translate into
    * {action:'reverse',param1:'<tid>',param2:'<tname>'}
    *
    * */

    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+'/:action/:param1/:param2'
        },
        query:{
            method:'GET',
            url:endpoint+'/:action/:param1/:param2',
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:action',
        },
        save:{
            method:'POST',
            url:endpoint+'/:action',
        },
        collectionDemandSearch: searchResource({
            method: "GET",
            url: endpoint + '/collectiondemand'
        }),
        collectionDemandUpdate:{
            method:'PUT',
            url:endpoint+'/collectiondemand/update',
        },
        getPldcSchema:{
            method:'GET',
            url:'process/schemas/pldc.json'
        },
        postArray:{
            method:'POST',
            url:endpoint+'/:action',
            isArray:true
        }
    });
}]);

irf.models.factory('LoanAccount',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanaccounts';
    return $resource(endpoint, null, {
        activateLoan: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/activate/:accountId',
            transformResponse: []
        },
        disburse: {
            method: 'POST',
            url: endpoint + '/disburse'
        },
        getDisbursementDetails: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/groupdisbursement/:partnerCode/:groupCode',
            isArray: true
        },
        get: {
            method: 'GET',
            url: endpoint + '/show/:accountId'
        },
        viewLoans: searchResource({
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/viewloans/:urn'
        }),
        repay:{
            method:'POST',
            url:endpoint +'/repay'
        },
        getGroupRepaymentDetails:{
            method:'GET',
            url:endpoint+'/grouprepayment/:partnerCode/:groupCode/:isLegacy',
            isArray:true
        },
        groupRepayment:{
            method:'POST',
            url:endpoint+'/grouprepayment'
        }
    });
});

irf.models.factory('Groups',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/groups';
    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+"/:service/:action"
        },
        query:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        getDSCData:{
            method:'GET',
            url:BASE_URL+"/api/dsc/{id}"
        },
        getGroup:{
            method:'GET',
            url:endpoint+'/:groupId'
        },
        searchHeaders:{
            method:'HEAD',  //@TODO : Should be HEAD, waiting for Serverside fix
            url:endpoint+'/search',
            isArray:true
        },
        getSchema:{
            method:'GET',
            url:'process/schemas/groups.json'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/search'
        }),
        getDscOverrideList:searchResource({
            method:'GET',
            url:endpoint+"/dscoverridelist"
        }),
        getDscOverrideListHead:{
            method:'HEAD', //@TODO : Should be HEAD, waiting for Serverside fix
            url:endpoint+"/dscoverridelist",
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:action'

        },
        dscQuery:{
            method:'POST',
            url:endpoint+'/grouploandsc',
            isArray:true
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service/:action'
        },
        save:{
            method:'POST',
            url:endpoint+'/:service/:action'
        },
        getDisbursementDetails: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/groupdisbursement/:partnerCode/:groupCode',
            isArray: true

        }
    });
});

    irf.models.factory('ACHPDC',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        var endpoint = BASE_URL + '/api/ach';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */
        return $resource(endpoint, null, {
            getSchema:{
            method:'GET',
            url:'process/schemas/ach.json'
             },
            create:{
                method:'POST',
                url:endpoint+'/create'
            },

            search: searchResource({
                    method: 'GET',
                    url: endpoint + '/search'
            }),
            searchHead:{
                method:'HEAD',
                url: endpoint + '/search',
                 isArray:true
            },
             update:{
                method:'PUT',
                url:endpoint+'/update'           
            }
        });
    });

irf.models.factory('LoanProducts',function($resource,$httpParamSerializer,BASE_URL,searchResource,$q){
    var endpoint = BASE_URL + '/api/loanproducts';


    var ret = $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        getProductData:{
            method:'GET',
            url:endpoint+'/:productCode'
        }

    });

    ret.getLoanPurpose = function(productCode){

        var deferred = $q.defer();
        
        ret.getProductData({productCode:productCode},function(response,headersGetter){
            console.warn(response);
            var result = {
                body:response.purposes,
                headers:headersGetter()
            };
            deferred.resolve(result);
        },function(resp){
            deferred.reject(resp);
        });

        return deferred.promise;

    };

    return ret;
});

irf.models.factory('SchemaResource',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/_refs/referencecodes';
    return $resource(endpoint, null, {
        getLoanAccountSchema: {
            method: 'GET',
            url: 'process/schemas/loanAccount.json'
        }
    });
});

irf.models.factory('IndividualLoan',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/individualLoan';
  

    return $resource(endpoint, null, {
        create:{
            method:'POST',
            url:endpoint
        },
        update:{
            method:'PUT',
            url:endpoint
        },
        close:{
            method:'PUT',
            url:endpoint+'/close'
        },
        getDefiniftion: {
            method: "GET",
            url: endpoint + '/definition'
        },
        disburse:{
            method:'PUT',
            url:endpoint+'/disburse'
        },
        multiTrancheDisbursement:{
            method:'GET',
            url:endpoint+'/disbursementProcess/:loanId'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/find'
        }),
        searchHead:{
            method:'HEAD',
            url:endpoint+'/find',
            isArray:true
        },
        searchDisbursement:searchResource({
            method:'GET',
            url:endpoint+'/findDisbursement'
        }),
        searchDisbursementHead:{
            method:'HEAD',
            url:endpoint+'/findDisbursement',
            isArray:true
        },
        getDocuments:{
            method:'GET',
            url:endpoint+'/getIndividualLoanDocuments'
        },  
        documentsHead:{
            method:'HEAD',
            url:endpoint+'/getIndividualLoanDocuments',
            isArray:true
        },
        updateDisbursement:{
            method:'PUT',
            url:endpoint+'/updateDisbursement'
        },       
         loadSingleLoanWithHistory:{
            method:'GET',
            url:endpoint+'/withhistory/:id'
        },
        get:{
            method:'GET',
            url:endpoint+'/:id'
        }
    });
}]);

irf.models.factory('Masters',function($resource,$httpParamSerializer, searchResource){
    var endpoint = irf.MANAGEMENT_BASE_URL;

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint
        },
        query:searchResource({
            method:'GET',
            url:endpoint
        }),
        post:{
            method:'POST',
            url:endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        }
    });
});


irf.HOME_PAGE = {
	"url": "Page/Landing",
	"to": "Page.Landing",
	"params": {

	},
	"options": {

	}
};

irf.pages.config([
	"$stateProvider", "irfElementsConfigProvider", "Model_ELEM_FC",
	function($stateProvider, elemConfig, Model_ELEM_FC) {
	var statesDefinition = [{
		name: "Page.Landing", // Favorites
		url: "/Landing",
		templateUrl: "process/pages/templates/Page.Landing.html",
		controller: "PageLandingCtrl"
	},{
		name: "Page.Dashboard", // BI Dashboard
		url: "/Dashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageDashboardCtrl"
	},{
		name: "Page.Customer360", // Customer360
		url: "/Customer360/:pageId",
		templateUrl: "process/pages/templates/Page.Customer360.html",
		controller: "Customer360Ctrl"
	},{
		name: "Page.CustomerHistory", // Customer360
		url: "/CustomerHistory/:pageId",
		templateUrl: "process/pages/templates/Page.CustomerHistory.html",
		controller: "CustomerHistoryCtrl"
	},{
		name: "Page.GroupDashboard",
		url: "/GroupDashboard",
		templateUrl: "process/pages/templates/Page.GroupDashboard.html",
		controller: "PageGroupDashboardCtrl"
	},{
		name: "Page.LoansDashboard",
		url: "/LoansDashboard",
		templateUrl: "process/pages/templates/Page.LoansDashboard.html",
		controller: "LoansDashboardCtrl"
	},{
		name: "Page.ManagementDashboard",
		url: "/ManagementDashboard",
		templateUrl: "process/pages/templates/Page.ManagementDashboard.html",
		controller: "PageManagementDashboardCtrl"
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});

	elemConfig.configFileUpload(Model_ELEM_FC);

	elemConfig.configPikaday({
		minDate: new Date(1800, 0, 1),
		maxDate: new Date(2050, 12, 31),
		yearRange: [1801, 2040],
		format: 'YYYY-MM-DD'
	});
}]);

irf.pages.controller("PageLandingCtrl",
	["$log", "$scope", "SessionStore", "PagesDefinition",
	function($log, $scope, SessionStore, PagesDefinition){
	$log.info("Page.Landing loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	var fullDefinition = {
		"title": "FAVORITES",
		"items": [
			"Page/Engine/CustomerSearch",
			"Page/Engine/loans.individual.PendingClearingQueue",
			"Page/Engine/loans.individual.PendingCashQueue",
			"Page/Engine/loans.individual.BounceQueue"
		]
	};

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
    });

}]);
irf.pages.controller("Customer360Ctrl",
["$log", "$scope", "$stateParams", "$q", "formHelper", "SessionStore", "PagesDefinition", "Enrollment", 
"entityManager", "Utils",
function($log, $scope, $stateParams, $q, formHelper, SessionStore, PagesDefinition, Enrollment, 
	entityManager, Utils){
	$log.info("Customer360 loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	$scope.formHelper = formHelper;

	var fullDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			"Page/Engine/customer360.CustomerProfile",
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					{
						"title": "NEW_LOAN",
						"iconClass": "fa fa-key",
						"items": [
							"Page/Engine/Loans.NewJewel",
							"Page/Engine/Loans.NewMEL"
						]
					},
					"Page/Engine/customer360.loans.View",
					"Page/Engine/Loans.Service"
				]
			},
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/CustomerHistory",
			"Page/Engine/customer360.Recapture"
		]
	};

	PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
		$scope.dashboardDefinition = resp;

		Enrollment.getSchema().$promise.then(function(response){
			$scope.customerSchema = response;

			Enrollment.get({id:$scope.customerId}).$promise.then(function(response){
				$scope.initialize(response);
			}, function(errorResponse){

			});
		});

	});

	$scope.initialize = function(data) {
		$log.info(data);
		$scope.model = {};
		$scope.model.customer = data;

		$scope.model.customer.idAndBcCustId = data.id + ' / ' + data.bcCustId;
		$scope.model.customer.fullName = Utils.getFullName(data.firstName, data.middleName, data.lastName);

		$scope.dashboardDefinition.title = (data.urnNo ? (data.urnNo + ": ") : "")
			+ $scope.model.customer.fullName;

		$scope.model.customer.idAndUrn = data.id + ' | ' + data.urnNo;

		$scope.model.customer.age = moment().diff(moment(data.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
		$scope.model.customer.nameWithAge = $scope.model.customer.fullName + ' (' + data.age + ')';

		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};
		var requestMenu = [$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecapturePhoto'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureFingerprint'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureGPS']];
		_.each(requestMenu, function(v,k){
			v.onClick = function(event, menu) {
				menu.stateParams.pageId = $scope.customerId + menu.stateParams.pageId.substring(menu.stateParams.pageId.indexOf(':'));
				entityManager.setModel(menu.stateParams.pageName, $scope.model);
				return $q.resolve(menu);
			};
		});
		$scope.dashboardDefinition.$menuMap['Page/CustomerHistory'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.View'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			return $q.resolve(menu);
		};
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Recapture'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.id + ':FINGERPRINT';
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};
	};

	$scope.initializeSF = function(model, form, formCtrl) {
		$scope.introFormName = "introForm";

		$scope.introForm = [{
			"type": "box",
			"title": "PORTFOLIO",
			"colClass": "col-sm-12",
			"readonly": true,
			"items": [{
				"type": "section",
				"htmlClass": "row",
				"items": [{
					"type": "section",
					"htmlClass": "col-sm-4",
					"items": [{
						"key": "customer.photoImageId",
						"type": "file",
						"fileType": "image/*",
						"viewParams": function(modelValue, form, model) {
							return {
								customerId: model.customer.id
							};
						},
						"readonly": true,
						"notitle": true
					}]
				},{
					"type": "section",
					"htmlClass": "col-sm-6",
					"items": [{
						"key": "customer.nameWithAge",
						"title": "CUSTOMER_NAME"
					},{
						"key": "customer.dateOfBirth",
						"title": "T_DATEOFBIRTH",
						"type": "date"
					},{
						"key": "customer.mobilePhone",
						"title": "MOBILE_PHONE"
					},{
						"key": "customer.identityProofNo",
						"titleExpr": "model.customer.identityProof | translate"
					},{
						"key": "customer.idAndBcCustId",
						"title": "Id & Legacy Cust Id",
						"titleExpr": "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)"
					},{
						"key": "customer.urnNo",
						"title": "URN_NO"
					}]
				},{
					"type": "section",
					"htmlClass": "col-sm-2 hidden-xs",
					"items": []
				}]
			}]
		},{
			"type": "box",
			"title": "PRODUCT_SUMMARY",
			"colClass": "col-sm-12",
			"items": []
		}];
	};

	$scope.actions = {};

}]);
irf.pages.controller("CustomerHistoryCtrl",
["$log", "$scope", "$stateParams", "$q", "formHelper", "SessionStore", "Enrollment", 
"entityManager", "Utils",
function($log, $scope, $stateParams, $q, formHelper, SessionStore, Enrollment, 
	entityManager, Utils){
	$log.info("Page.Landing.html loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.userid = SessionStore.getLoginname();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	$scope.formHelper = formHelper;

	var initialize = function(customerHistory) {
		$log.info(customerHistory);
		$scope.model = customerHistory;
		$scope.model.customer.fullName = Utils.getFullName($scope.model.customer.firstName, $scope.model.customer.middleName, $scope.model.customer.lastName);
		$scope.title = ($scope.model.customer.urnNo ? ($scope.model.customer.urnNo + ": ") : "") + $scope.model.customer.fullName;

		$scope._versions = [];
		$scope._history = {};
		for (var i = $scope.model.enrollmentActions.length - 1; i >= 0; i--) {
			var ea = $scope.model.enrollmentActions[i];
			var history = JSON.parse(ea.diff);
			var key = history.version + ' - ' + ea.userId;
			$scope._history[key] = history;
			$scope._versions.push(key);
		};
	};

	Enrollment.getWithHistory({id:$scope.customerId}).$promise.then(function(response){
		initialize(response);
	}, function(errorResponse){

	});

}]);
irf.pages.controller("PageDashboardCtrl", function($log, $scope, $stateParams){
	$log.info("Page.Dashboard.html loaded");

});
irf.pages.controller("PageGroupDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams','Groups',
    'irfStorageService','SessionStore', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, Groups, irfStorageService, SessionStore, PagesDefinition){
    $log.info("Page.GroupDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Actions",
        "items": [
            "Page/Engine/GroupCRUD",
            "Page/Engine/DscQueue",
            "Page/Engine/Cgt1Queue",
            "Page/Engine/Cgt2Queue",
            "Page/Engine/Cgt3Queue",
            "Page/Engine/GrtQueue",
            "Page/Engine/DscOverrideQueue",
            "Page/Engine/ApplicationPendingQueue",
            "Page/Engine/JLGDisbursementQueue",
            "Page/Engine/CloseGroup",
            "Page/Engine/loans.groups.GroupLoanRepaymentQueue"

        ]
    };

    var getDashboardCounts = function(){

        var partners = irfStorageService.getMaster('partner');

        var stages = {
            'dsc':{
                name:'Stage03',
                count:0
            },
            'cgt1':{
                name:'Stage04',
                count:0
            },
            'cgt2':{
                name:'Stage05',
                count:0
            },
            'cgt3':{
                name:'Stage06',
                count:0
            },
            'grt':{
                name:'Stage07',
                count:0
            },
            'ap':{
                name:'StageAP',
                count:0
            },
            'disbursement':{
                name:'Stage08',
                count:0
            }

        };
        var branchId = ""+SessionStore.getBranchId();
        angular.forEach(partners.data,function(partner){
            angular.forEach(stages,function(stage,key) {
                Groups.searchHeaders({'branchId':branchId,'partner': partner.name,'currentStage':stage.name,'groupStatus':true}, function(response,headerGetter){
                    var headers = headerGetter();

                    stage.count += Number(headers['x-total-count']);

                    switch(key){
                        case 'dsc': $scope.dashboardDefinition.items[1].data = stage.count; break;
                        case 'cgt1': $scope.dashboardDefinition.items[2].data = stage.count; break;
                        case 'cgt2': $scope.dashboardDefinition.items[3].data = stage.count; break;
                        case 'cgt3': $scope.dashboardDefinition.items[4].data = stage.count; break;
                        case 'grt': $scope.dashboardDefinition.items[5].data = stage.count; break;
                        case 'ap': $scope.dashboardDefinition.items[7].data = stage.count; break;
                        case 'disbursement': $scope.dashboardDefinition.items[8].data = stage.count; break;
                    }

                },function(response){
                    switch(key){
                        case 'dsc': $scope.dashboardDefinition.items[1].data = '-'; break;
                        case 'cgt1': $scope.dashboardDefinition.items[2].data = '-'; break;
                        case 'cgt2': $scope.dashboardDefinition.items[3].data = '-'; break;
                        case 'cgt3': $scope.dashboardDefinition.items[4].data = '-'; break;
                        case 'grt': $scope.dashboardDefinition.items[5].data = '-'; break;
                        case 'ap': $scope.dashboardDefinition.items[7].data = '-'; break;
                        case 'disbursement': $scope.dashboardDefinition.items[8].data = '-'; break;
                    }
                });
            });

        });

        //dsc override list
        Groups.getDscOverrideListHead({

            
        },function (resp,headerGetter) {
            var headers = headerGetter();
            $scope.dashboardDefinition.items[6].data = Number(headers['x-total-count']);

        },function(resp){
            $scope.dashboardDefinition.items[6].data = '-';
        });
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        getDashboardCounts();
    });

}]);

irf.pages.controller("PageManagementDashboardCtrl",
	["$log", "$scope", "$stateParams", "formHelper", "SessionStore",
	function($log, $scope, $stateParams, formHelper, SessionStore){
	$log.info("Page.MgmtDash.html loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	$scope.dashboardDefinition = {
		"title": "OPERATIONS",
		"items": [
			{
				"id": "VillageSearch",
				"title": "VILLAGE",
				"state": "Page.Engine",
				"iconClass": "fa fa-search",
				"stateParams": {
					"pageName": "VillageSearch",
					"pageId": null
				}
			},
			{
				"id": "VillageCRU",
				"title": "ADD_VILLAGE",
				"state": "Page.Engine",
				"iconClass": "fa fa-tree",
				"stateParams": {
					"pageName": "Management_VillageCRU",
					"pageId": null
				}
			},
			{
				"id": "CentreSearch",
				"title": "CENTRE",
				"state": "Page.Engine",
				"iconClass": "fa fa-search",
				"stateParams": {
					"pageName": "CentreSearch",
					"pageId": null
				}
			},
			{
				"id": "CentreCRU",
				"title": "ADD_CENTRE",
				"state": "Page.Engine",
				"iconClass": "fa fa-home",
				"stateParams": {
					"pageName": "Management_CentreCRU",
					"pageId": null
				}
			}
		]
	};

}]);
irf.pages.controller("LoansDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams',
    'irfStorageService', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, irfStorageService, PagesDefinition){
    $log.info("Page.LoansDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Actions",
        "items": [
            "Page/Engine/loans.individual.LoanBookingQueue",
            "Page/Engine/loans.individual.PendingClearingQueue",
            "Page/Engine/loans.individual.PendingCashQueue",
            "Page/Engine/loans.individual.BounceQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        $log.info(resp);
        $scope.dashboardDefinition.$menuMap['Page/Engine/loans.individual.LoanBookingQueue'].data=10;
    });

}]);

irf.pageCollection.factory("Pages__UserProfile",
["$log", "$q", "SessionStore", "languages", "$translate", "irfProgressMessage",
	"irfStorageService", "irfElementsConfig","PageHelper", "irfSimpleModal",
function($log, $q, SessionStore, languages, $translate, PM,
	irfStorageService, irfElementsConfig,PageHelper, irfSimpleModal) {

	var languageTitleMap = [];
	_.each(languages, function(v, k){
		languageTitleMap.push({value:v.code, name:v.titleEnglish + ' - ' + v.titleLanguage});
	});

	var dateFormats = ["YYYY-DD-MM", "DD-MM-YYYY", "DD-MMM-YYYY", "Do MMM YYYY", "dddd Do MMM YYYY"];
	var dateTitleMap = [];
	var now = moment(new Date());
	_.each(dateFormats, function(v,k){
		dateTitleMap.push({name: now.format(v) + " | " + v, value: v});
	});

	return {
		"id": "UserProfile",
		"type": "schema-form",
		"name": "UserProfile",
		"title": "USER_PROFILE",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			$log.info("I got initialized");
			var m = irfStorageService.getJSON(formCtrl.$name, model.profile.login);
			if (m && m.profile && m.settings) {
				model.profile = m.profile;
				model.settings = m.settings;
			}
		},
		modelPromise: function(pageId) {
			var deferred = $q.defer();
			if (pageId === SessionStore.session.login) {
				deferred.resolve({profile:SessionStore.session});
			} else {
				deferred.reject({error:"Different User"});
			}
			return deferred.promise;
		},
		form: [{
			type: "box",
			title: "PROFILE_INFORMATION",
			items: [
				{
					key: "profile.login",
					readonly: true
				},
				{
					key: "profile.firstName",
					readonly: true
				},
				{
					title: "EDIT_FAVORITES",
					type: "button",
					onClick: "actions.editFavorites(model, formCtrl, form)"
				}
			]
		},{
			type: "box",
			title: "PROFILE_SETTINGS",
			items: [
				"settings.dateFormat",
				"settings.language",
				"settings.loginMode",
				"settings.offlinePin",
				{
					type: "fieldset",
					title: "LOGGING",
					items: [
						{
							key: "settings.consoleLog",
							onChange: function(modelValue, form, model) {
								if (!modelValue) {
									model.settings.consoleLogAutoClear = false;
								}
							}
						},
						{
							key: "settings.consoleLogAutoClear",
							condition: "model.settings.consoleLog"
						},
						{
							key: "settings.consoleLogAutoClearDuration",
							condition: "model.settings.consoleLogAutoClear"
						}
					]
				}
			]
		},{
			type: "actionbox",
			items: [{
				"type": "save",
				"title": "SAVE_PROFILE_SETTINGS"
			},{
				"type":"button",
				"icon":"fa fa-refresh",
				"title":"REFRESH_CACHE",
				"onClick":"actions.refreshMasters()"
			}]
		}],
		actions: {
			refreshMasters:function(){
				PageHelper.showLoader();
				irfStorageService.cacheAllMaster(true,true).then(function(){
					PageHelper.hideLoader();
					PM.pop('cache-master',"Synced Successfully.",5000);
				},function(){
					PageHelper.hideLoader();
					PM.pop('cache-master',"Sync Failed, Please Try Again.",5000);
				});


			},
			preSave: function(model, formCtrl, formName) {
				var deferred = $q.defer();
				if (formCtrl.$invalid || !model.profile || model.profile.login !== SessionStore.session.login) {
					PM.pop('user-profile', 'Your form have errors. Please fix them.', 5000);
				} else {
					model.$$STORAGE_KEY$$ = model.profile.login;
					irfStorageService.putJSON(formName, model);
					$translate.use(model.settings.language);
					SessionStore.session.language = model.settings.language;
					SessionStore.profile = model.profile;
					SessionStore.settings = model.settings;
					irfElementsConfig.setDateDisplayFormat(model.settings.dateFormat);

					PM.pop('user-profile', 'Profile settings saved.', 3000);
				}
				// deferred.reject();
				return deferred.promise;
			},
			editFavorites: function(model, formCtrl, form) {
				var titleHtml = '<i class="fa fa-heart">&nbsp;</i>Choose Favorites';
				var bodyHtml = '\
<div class="row">\
	<div class="small-box bg-theme" style="cursor:pointer;">\
		<div class="inner">\
			<h3><i class="fa fa-tasks"></i></h3>\
			<p>title</p>\
		</div>\
		<div class="icon"><i class="fa fa-tasks"></i></div>\
	</div>\
</div>\
				';
				irfSimpleModal(titleHtml, bodyHtml).opened.then(function(){
					
				});
			}
		},
		schema: {
			"type": "object",
			"properties": {
				profile: {
					"type":"object",
					"properties": {
						login: {
							"title": "LOGIN",
							"type": "string"
						},
						firstName: {
							"title": "USERNAME",
							"type": "string"
						},
						lastName: {
							"title": "LASTNAME",
							"type": "string"
						}
					}
				},
				settings: {
					"type":"object",
					"properties": {
						dateFormat: {
							"title": "DATE_FORMAT",
							"type": "string",
							"default": "YYYY-DD-MM",
							"x-schema-form": {
								"type": "select",
								"titleMap": dateTitleMap
							}
						},
						language: {
							"title": "PREFERRED_LANGUAGE",
							"type": "string",
							"default": "en",
							"x-schema-form": {
								"type": "select",
								"titleMap": languageTitleMap
							}
						},
						loginMode: {
							"title": "PREFERRED_LOGIN_MODE",
							"type": "string",
							"enum": ["online", "offline"],
							"default": "online",
							"x-schema-form": {
								"type": "radios",
								"titleMap": [{
									"value": "online",
									"name": "ONLINE"
								},{
									"value": "offline",
									"name": "OFFLINE"
								}]
							}
						},
						offlinePin: {
							"title": "OFFLINE_PIN",
							"type": "string",
							"minLength": 4,
							"maxLength": 4,
							"x-schema-form": {
								"type": "password"
							}
						},
						consoleLog: {
							"title": "CONSOLE_LOG",
							"type": "boolean"
						},
						consoleLogAutoClear: {
							"title": "CONSOLE_LOG_AUTO_CLEAR",
							"type": "boolean"
						},
						consoleLogAutoClearDuration: {
							"title": "CONSOLE_LOG_AUTO_CLEAR_DURATION",
							"type": "number"
						}
					}
				}
			}
		}
	}
}]);

irf.pageCollection.factory(irf.page("demo.Demo"),
["$log", "Enrollment", "SessionStore","Files",
    function($log, Enrollment, SessionStore,Files){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Demo Page",
            "subTitle": "Demo Page secondary title",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");

                model.address = model.address || {};
                model.address.streetAddress = "Stt";

                Files.getBase64DataFromFileId(
                    '482acbaf-0090-4168-adca-76aaba818d5a',
                    true
                ).then(function(base64String){
                    console.log(base64String);
                },function(err){

                });



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
                        "phoneNumber",
                        {
                            type: "section",
                            html: "<i>asdf</i>{{model.address.streetAddress}}"
                        }
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

irf.pageCollection.factory("Pages__EnrollmentHouseVerificationQueue",
["$log", "formHelper", "Enrollment", "$state", "SessionStore",
function($log, formHelper, Enrollment, $state, SessionStore){
	return {
		"id": "EnrollmentHouseVerificationQueue",
		"type": "search-list",
		"name": "House Verification Pending Queue",
		"title": "T_HOUSE_VERIFICATION_PENDING_QUEUE",
		"subTitle": "T_ENROLLMENTS_PENDING",
		"uri":"Customer Enrollment/Stage 2",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
			model.branch = SessionStore.getBranch();
			model.stage = 'Stage02';
		},
		offline: true,
		getOfflineDisplayItem: function(item, index){
			return [
				"Branch: " + item["branch"],
				"Centre: " + item["centre"]
			]
		},
		getOfflinePromise: function(searchOptions){      /* Should return the Promise */
			var promise = Enrollment.search({
				'branchName': searchOptions.branch,
				'centreCode': searchOptions.centre,
				'firstName': searchOptions.first_name,
				'lastName': searchOptions.last_name,
				'page': 1,
				'per_page': 100,
				'stage': "Stage02"
			}).$promise;

			return promise;
		},
		definition: {
			title: "T_SEARCH_CUSTOMERS",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"required":["branch"],
				"properties": {
					"first_name": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kyc_no": {
						"title": "KYC_NO",
						"type": "string"
					},
					"branch": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"filter": {
								"parentCode as branch": "model.branch"
							},
							"screenFilter": true
						}
					}
				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
				var promise = Enrollment.search({
					'branchName': searchOptions.branch,
					'centreCode': searchOptions.centre,
					'firstName': searchOptions.first_name,
					'lastName': searchOptions.lastName,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
					'stage': "Stage02"
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
					$log.info("Redirecting");
					$state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.firstName + " " + (item.lastName!=null?item.lastName:""),
						'Customer ID : ' + item.id,
						null
					]
				},
				getActions: function(){
					return [
						{
							name: "Do House Verification",
							desc: "",
							fn: function(item, index){
								$log.info("Redirecting");
								$state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
							},
							isApplicable: function(item, index){
								//if (index%2==0){
								//	return false;
								//}
								return true;
							}
						}
					];
				}
			}
		}
	};
}]);

irf.pageCollection.factory(irf.page("CustomerSearch"),
["$log", "formHelper", "Enrollment","$state", "SessionStore", "Utils",
function($log, formHelper, Enrollment,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerSearch",
		"type": "search-list",
		"name": "CustomerSearch",
		"title": "CUSTOMER_SEARCH",
		"subTitle": "",
		"uri":"Customer Search",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Customers",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"first_name": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kyc_no": {
						"title": "KYC_NO",
						"type": "string"
					},
					"urnNo": {
						"title": "URN_NO",
						"type": "number"
					},
					"branch": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"filter": {
								"parentCode as branch": "model.branch"
							},
							"screenFilter": true
						}
					}

				},
				"required":["branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Enrollment.search({
					'branchName': searchOptions.branch,
					'firstName': searchOptions.first_name,
					'centreCode': searchOptions.centre,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
					'kycNumber': searchOptions.kyc_no,
					'lastName': searchOptions.lastName,
					'urnNo': searchOptions.urnNo
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				selectable: true,
				expandable: true,
				itemCallback: function(item, index) {
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						Utils.getFullName(item.firstName, item.middleName, item.lastName),
						'Customer ID : ' + item.id,
						item.urnNo?('URN : ' + item.urnNo):("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage==='Stage02'?'House verification':
							(item.currentStage==='Stage01'?'Enrollment':item.currentStage))),
						"{{'BRANCH'|translate}} : " + item.kgfsName,
						"{{'CENTRE_CODE'|translate}} : " + item.centreCode,
						"{{'FATHERS_NAME'|translate}} : " + Utils.getFullName(item.fatherFirstName, item.fatherMiddleName, item.fatherLastName)
					]
				},
				getActions: function(){
					return [
						{
							name: "Enroll Customer",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"ProfileInformation",
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage01')
									return true;
								return false;
							}
						},
						{
							name: "Do House Verification",
							desc: "",
							icon: "fa fa-house",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"AssetsLiabilitiesAndHealth",
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage02')
									return true;
								return false;
							}
						},
						{
							name: "Customer 360",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index){
								$state.go("Page.Customer360",{
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Completed')
									return true;
								return false;
							}
						}
					];
				}
			}
		}
	};
}]);

irf.pageCollection.factory("EnrollmentHelper",
["$log", "$q","Enrollment", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
function($log, $q, Enrollment, PageHelper, irfProgressMessage, Utils, SessionStore){

    var fixData = function(model){
        /* TODO Validations */

        /* Fix to make additionalKYCs as an array */
        //reqData['customer']['additionalKYCs'] = [reqData['customer']['additionalKYCs']];

        /* Fix to add atleast one fingerprint */
        model['customer']['leftHandIndexImageId'] = "232";

        if (model['customer']['mailSameAsResidence'] === true){
            model['customer']['mailingDoorNo'] = model['customer']['doorNo'];
            model['customer']['mailingStreet'] = model['customer']['street'];
            model['customer']['mailingLocality'] = model['customer']['locality'];
            model['customer']['mailingPostoffice'] = model['customer']['postOffice'];
            model['customer']['mailingDistrict'] = model['customer']['district'];
            model['customer']['mailingPincode'] = model['customer']['pincode'];
            model['customer']['mailingState'] = model['customer']['state'];
        }

        if(model.customer.addressProofSameAsIdProof){

            model.customer.addressProof=_.clone(model.customer.identityProof);
            model.customer.addressProofImageId=_.clone(model.customer.identityProofImageId);
            model.customer.addressProofNo=_.clone(model.customer.identityProofNo);
            model.customer.addressProofIssueDate=_.clone(model.customer.idProofIssueDate);
            model.customer.addressProofValidUptoDate=_.clone(model.customer.idProofValidUptoDate);
            model.customer.udf.userDefinedFieldValues.udf29 = _.clone(model.customer.udf.userDefinedFieldValues.udf30);
        }
        if (model.customer.udf && model.customer.udf.userDefinedFieldValues
            && model.customer.udf.userDefinedFieldValues.udf1) {
            model.customer.udf.userDefinedFieldValues.udf1 =
                model.customer.udf.userDefinedFieldValues.udf1 === true
                || model.customer.udf.userDefinedFieldValues.udf1 === 'true';
        }

        Utils.removeNulls(model,true);
        return model;
    };

    var validateData = function(model) {
        PageHelper.clearErrors();
        if (model.customer.udf && model.customer.udf.userDefinedFieldValues) {
            if (model.customer.udf.userDefinedFieldValues.udf36
                || model.customer.udf.userDefinedFieldValues.udf35
                || model.customer.udf.userDefinedFieldValues.udf34) {
                if (!model.customer.udf.userDefinedFieldValues.udf33) {
                    PageHelper.setError({message:'Spouse ID Proof type is mandatory when Spouse ID Details are given'});
                    return false;
                }
            }
        }
        if (model.customer.additionalKYCs[0]
            && (model.customer.additionalKYCs[0].kyc1ProofNumber
            || model.customer.additionalKYCs[0].kyc1ProofType
            || model.customer.additionalKYCs[0].kyc1ImagePath
            || model.customer.additionalKYCs[0].kyc1IssueDate
            || model.customer.additionalKYCs[0].kyc1ValidUptoDate)) {
            if (model.customer.additionalKYCs[0].kyc1ProofNumber
                && model.customer.additionalKYCs[0].kyc1ProofType
                && model.customer.additionalKYCs[0].kyc1ImagePath
                && model.customer.additionalKYCs[0].kyc1IssueDate
                && model.customer.additionalKYCs[0].kyc1ValidUptoDate) {
                if (moment(model.customer.additionalKYCs[0].kyc1IssueDate).isAfter(moment())) {
                    PageHelper.setError({message:'Issue date should be a past date in Additional KYC 1'});
                    return false;
                }
                if (moment(model.customer.additionalKYCs[0].kyc1ValidUptoDate).isBefore(moment())) {
                    PageHelper.setError({message:'Valid upto date should be a future date in Additional KYC 1'});
                    return false;
                }
            } else {
                PageHelper.setError({message:'All fields are mandatory while submitting Additional KYC 1'});
                return false;
            }
        }
        if (model.customer.additionalKYCs[1]
            && (model.customer.additionalKYCs[1].kyc1ProofNumber
            || model.customer.additionalKYCs[1].kyc1ProofType
            || model.customer.additionalKYCs[1].kyc1ImagePath
            || model.customer.additionalKYCs[1].kyc1IssueDate
            || model.customer.additionalKYCs[1].kyc1ValidUptoDate)) {
            if (model.customer.additionalKYCs[1].kyc1ProofNumber
                && model.customer.additionalKYCs[1].kyc1ProofType
                && model.customer.additionalKYCs[1].kyc1ImagePath
                && model.customer.additionalKYCs[1].kyc1IssueDate
                && model.customer.additionalKYCs[1].kyc1ValidUptoDate) {
                if (moment(model.customer.additionalKYCs[1].kyc1IssueDate).isAfter(moment())) {
                    PageHelper.setError({message:'Issue date should be a past date in Additional KYC 2'});
                    return false;
                }
                if (moment(model.customer.additionalKYCs[1].kyc1ValidUptoDate).isBefore(moment())) {
                    PageHelper.setError({message:'Valid upto date should be a future date in Additional KYC 2'});
                    return false;
                }
            } else {
                PageHelper.setError({message:'All fields are mandatory while submitting Additional KYC 2'});
                return false;
            }
        }
        return true;
    };
    /*
    * function saveData:
    *
    * if cust id is not set, data is saved and the promise is resolved with SAVE's response
    * if cust id is set, promise is rejected with true (indicates doProceed)
    * if error occurs during save, promise is rejected with false (indicates don't proceed
    * */
    var saveData = function(reqData){

        var deferred = $q.defer();
        $log.info("Attempting Save");
        $log.info(reqData);
        PageHelper.clearErrors();
        PageHelper.showLoader();
        irfProgressMessage.pop('enrollment-save', 'Working...');
        reqData['enrollmentAction'] = 'SAVE';
        var action = reqData.customer.id ? 'update' : 'save';
        Enrollment[action](reqData, function (res, headers) {
            irfProgressMessage.pop('enrollment-save', 'Data Saved', 2000);
            $log.info(res);
            PageHelper.hideLoader();
            deferred.resolve(res);
        }, function (res) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('enrollment-save', 'Oops. Some error.', 2000);
            PageHelper.showErrors(res);
            deferred.reject(false);
        });
        return deferred.promise;

    };
    /*
    * fn proceedData:
    *
    * if cust id not set, promise rejected with null
    * if cust id set, promise resolved with PROCEED response
    * if error occurs, promise rejected with null.
    * */
    var proceedData = function(res){

        var deferred = $q.defer();
        $log.info("Attempting Proceed");
        $log.info(res);
        if(res.customer.id===undefined || res.customer.id===null){
            $log.info("Customer id null, cannot proceed");
            deferred.reject(null);
        }
        else {
            PageHelper.clearErrors();
            PageHelper.showLoader();
            irfProgressMessage.pop('enrollment-save', 'Working...');
            res.enrollmentAction = "PROCEED";
            Enrollment.updateEnrollment(res, function (res, headers) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('enrollment-save', 'Done. Customer created with ID: ' + res.customer.id, 5000);
                deferred.resolve(res);
            }, function (res, headers) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('enrollment-save', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
                deferred.reject(null);
            });
        }
        return deferred.promise;

    };

    var parseAadhaar = function(aadhaarXml) {
        var aadhaarData = {
            "uid" :null,
            "name":null,
            "gender":null,
            "dob":null,
            "yob":null,
            "co":null,
            "house":null,
            "street":null,
            "lm":null,
            "loc":null,
            "vtc":null,
            "dist":null,
            "state":null,
            "pc":null
        };
        var aadhaarDoc = $.parseXML(aadhaarXml);
        aadhaarXmlData = $(aadhaarDoc).find('PrintLetterBarcodeData');
        if (aadhaarXmlData && aadhaarXmlData.length) {
            angular.forEach(aadhaarXmlData[0].attributes, function(attr, i){
                this[attr.name] = attr.value;
            }, aadhaarData);
            aadhaarData['pc'] = Number(aadhaarData['pc']);
            var g = aadhaarData['gender'].toUpperCase();
            aadhaarData['gender'] = (g === 'M' || g === 'MALE') ? 'MALE' : ((g === 'F' || g === 'FEMALE') ? 'FEMALE' : 'OTHERS');
        }
        return aadhaarData;
    };

    var customerAadhaarOnCapture = function(result, model, form) {
        $log.info(result); // spouse id proof
        // "co":""
        // "lm":"" landmark
        var aadhaarData = parseAadhaar(result.text);
        $log.info(aadhaarData);
        model.customer.aadhaarNo = aadhaarData.uid;
        model.customer.firstName = aadhaarData.name;
        model.customer.gender = aadhaarData.gender;
        model.customer.doorNo = aadhaarData.house;
        model.customer.street = aadhaarData.street;
        model.customer.locality = aadhaarData.loc;
        model.customer.villageName = aadhaarData.vtc;
        model.customer.district = aadhaarData.dist;
        model.customer.state = aadhaarData.state;
        model.customer.pincode = aadhaarData.pc;
        if (aadhaarData.dob) {
            $log.debug('aadhaarData dob: ' + aadhaarData.dob);
            if (!isNaN(aadhaarData.dob.substring(2, 3))) {
                model.customer.dateOfBirth = aadhaarData.dob;
            } else {
                model.customer.dateOfBirth = moment(aadhaarData.dob, 'DD/MM/YYYY').format(SessionStore.getSystemDateFormat());
            }
            $log.debug('customer dateOfBirth: ' + model.customer.dateOfBirth);
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        } else if (aadhaarData.yob) {
            $log.debug('aadhaarData yob: ' + aadhaarData.yob);
            model.customer.dateOfBirth = aadhaarData.yob + '-01-01';
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo
            && !model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProofSameAsIdProof = true;
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo) {
            model.customer.identityProof = 'Aadhar card';
            model.customer.identityProofNo = aadhaarData.uid;
        }
        if (!model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProof = 'Aadhar card';
            model.customer.addressProofNo = aadhaarData.uid;
        }
    };

    return {
        fixData: fixData,
        saveData: saveData,
        proceedData: proceedData,
        validateData: validateData,
        parseAadhaar: parseAadhaar,
        customerAadhaarOnCapture: customerAadhaarOnCapture
    };
}]);

irf.pageCollection.factory("Pages__ProfileInformation",
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "ProfileInformation",
        "type": "schema-form",
        "name": "Stage1",
        "title": "CUSTOMER_ENROLLMENT",
        "subTitle": "STAGE_1",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';
            $log.info(formHelper.enum('bank'));
            $log.info("ProfileInformation page got initialized:"+model.branchId);
        },
        modelPromise: function(pageId, _model) {
            var deferred = $q.defer();
            PageHelper.showLoader();
            irfProgressMessage.pop("enrollment-save","Loading Customer Data...");
            Enrollment.getCustomerById({id:pageId},function(resp,header){
                var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                model.customer = resp;
                model = EnrollmentHelper.fixData(model);
                model._mode = 'EDIT';
                if (model.customer.currentStage==='Stage01') {
                    irfProgressMessage.pop("enrollment-save","Load Complete",2000);
                    deferred.resolve(model);
                    window.scrollTo(0, 0);
                } else {
                    irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" already enrolled", 5000);
                    $state.go("Page.Landing");
                }
                PageHelper.hideLoader();
            },function(resp){
                PageHelper.hideLoader();
                irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
                $state.go("Page.Engine",{
                    pageName:"CustomerSearch",
                    pageId:null
                });
            });
            return deferred.promise;
        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"],
                item["customer"]["villageName"]
            ]
        },
        form: [{
            "type": "box",
            "title": "CUSTOMER_INFORMATION",
            "items": [
                {
                    key: "customer.firstName",
                    title:"FULL_NAME",
                    type:"qrcode",
                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
                },
                {
                    key:"customer.photoImageId",
                    type:"file",
                    fileType:"image/*",
                    "offline": true
                },
                {
                    key:"customer.centreCode",
                    type:"select",
                    filter: {
                        "parentCode": "model.branchId"
                    },
                    screenFilter: true
                },
                {
                    key:"customer.enrolledAs",
                    type:"radios"
                },
                {
                    key:"customer.gender",
                    type:"radios"
                },
                {
                    key:"customer.age",
                    title: "AGE",
                    type:"number",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.age > 0) {
                            if (model.customer.dateOfBirth) {
                                model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                            } else {
                                model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                            }
                        }
                    }
                },
                {
                    key:"customer.dateOfBirth",
                    type:"date",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key: "customer.fatherFirstName",
                    title: "FATHER_FULL_NAME"
                },
                {
                    key:"customer.maritalStatus",
                    type:"select"
                },
                {
                    key: "customer.spouseFirstName",
                    title: "SPOUSE_FULL_NAME",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    type:"qrcode",
                    onCapture: function(result, model, form) {
                        $log.info(result); // spouse id proof
                        var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                        $log.info(aadhaarData);
                        model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                        model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                        model.customer.spouseFirstName = aadhaarData.name;
                        if (aadhaarData.yob) {
                            model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key:"customer.spouseAge",
                    title: "SPOUSE_AGE",
                    type:"number",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.spouseAge > 0) {
                            if (model.customer.spouseDateOfBirth) {
                                model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-') + moment(model.customer.spouseDateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                            } else {
                                model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-MM-DD');
                            }
                        }
                    }
                },
                {
                    key:"customer.spouseDateOfBirth",
                    type:"date",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.spouseDateOfBirth) {
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key:"customer.udf.userDefinedFieldValues.udf1",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    title:"SPOUSE_LOAN_CONSENT"

                }

            ]
        },{
            "type": "box",
            "title": "CONTACT_INFORMATION",
            "items":[{
                type: "fieldset",
                title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                items: [

                        "customer.doorNo",
                        "customer.street",
                        "customer.locality",
                        {
                            key:"customer.villageName",
                            type:"select",
                            filter: {
                                'parentCode': 'model.branchId'
                            },
                            screenFilter: true
                        },
                        "customer.postOffice",
                        {
                            key:"customer.district",
                            type:"select",
                            screenFilter: true
                        },
                        "customer.pincode",
                        {
                            key:"customer.state",
                            type:"select",
                            screenFilter: true
                        },
                        "customer.stdCode",
                        "customer.landLineNo",
                        "customer.mobilePhone",
                        "customer.mailSameAsResidence"
                    ]
                },{
                    type: "fieldset",
                    title: "CUSTOMER_PERMANENT_ADDRESS",
                    condition:"!model.customer.mailSameAsResidence",
                    items: [
                        "customer.mailingDoorNo",
                        "customer.mailingStreet",
                        "customer.mailingLocality",
                        "customer.mailingPostoffice",
                        {
                            key:"customer.mailingDistrict",
                            type:"select",
                            screenFilter: true
                        },
                        "customer.mailingPincode",
                        {
                            key:"customer.mailingState",
                            type:"select",
                            screenFilter: true
                        }
                    ]
                }
            ]
        },{
            type:"box",
            title:"KYC",
            items:[
                {
                    "key": "customer.aadhaarNo",
                    type:"qrcode",
                    onChange:"actions.setProofs(model)",
                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
                },
                {
                    type:"fieldset",
                    title:"IDENTITY_PROOF",
                    items:[
                        {
                            key:"customer.identityProof",
                            type:"select"
                        },
                        {
                            key:"customer.identityProofImageId",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf30",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.identityProofNo",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.identityProofNo = result.text;
                            }
                        },
                        {
                            key:"customer.idProofIssueDate",
                            type:"date"
                        },
                        {
                            key:"customer.idProofValidUptoDate",
                            type:"date"
                        },
                        {
                            key:"customer.addressProofSameAsIdProof"
                        }
                    ]
                },
                {
                    type:"fieldset",
                    title:"ADDRESS_PROOF",
                    condition:"!model.customer.addressProofSameAsIdProof",
                    items:[
                        {
                            key:"customer.addressProof",
                            type:"select"
                        },
                        {
                            key:"customer.addressProofImageId",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf29",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.addressProofNo",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.addressProofNo = result.text;
                            }
                        },
                        {
                            key:"customer.addressProofIssueDate",
                            type:"date"
                        },
                        {
                            key:"customer.addressProofValidUptoDate",
                            type:"date"
                        },
                    ]
                },
                {
                    type:"fieldset",
                    title:"SPOUSE_IDENTITY_PROOF",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    items:[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf33",
                            type:"select",
                            onChange: function(modelValue) {
                                $log.info(modelValue);
                            }
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf34",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf35",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf36",
                            condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                            }
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf36",
                            condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                            type:"qrcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob) {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        }
                    ]
                }

            ]
        },{
            "type":"box",
            "title":"ADDITIONAL_KYC",
            "items":[
                {
                    "key":"customer.additionalKYCs",
                    "type":"array",
                    "add":null,
                    "remove":null,
                    "title":"ADDITIONAL_KYC",
                    "items":[
                        {
                            key:"customer.additionalKYCs[].kyc1ProofNumber",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                            }

                        },
                        {
                            key:"customer.additionalKYCs[].kyc1ProofType",
                            type:"select"
                        },
                        {
                            key:"customer.additionalKYCs[].kyc1ImagePath",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.additionalKYCs[].kyc1IssueDate",
                            type:"date"
                        },
                        {
                            key:"customer.additionalKYCs[].kyc1ValidUptoDate",
                            type:"date"
                        },
                        {
                            key:"customer.additionalKYCs[].kyc2ProofNumber",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                            }
                        },
                        {
                            key:"customer.additionalKYCs[].kyc2ProofType",
                            type:"select"
                        },
                        {
                            key:"customer.additionalKYCs[].kyc2ImagePath",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.additionalKYCs[].kyc2IssueDate",
                            type:"date"
                        },
                        {
                            key:"customer.additionalKYCs[].kyc2ValidUptoDate",
                            type:"date"
                        }
                    ]
                }
            ]
        },{
            "type": "actionbox",
            "condition": "model._mode != 'EDIT'",
            "items": [{
                "type": "save",
                "title": "SAVE_OFFLINE",
            },{
                "type": "submit",
                "title": "SUBMIT"
            }]
        },{
            "type": "actionbox",
            "condition": "model._mode == 'EDIT'",
            "items": [{
                "type": "save",
                "title": "SAVE_OFFLINE",
            },{
                "type": "submit",
                "title": "SUBMIT"
            },{
                "type": "button",
                "icon": "fa fa-user-plus",
                "title": "ENROLL_CUSTOMER",
                "onClick": "actions.proceed(model, formCtrl, form, $event)"
            },{
                "type": "button",
                "icon": "fa fa-refresh",
                "title": "RELOAD",
                "onClick": "actions.reload(model, formCtrl, form, $event)"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {

            setProofs:function(model){
                model.customer.addressProofNo=model.customer.aadhaarNo;
                model.customer.identityProofNo=model.customer.aadhaarNo;
                model.customer.identityProof='Aadhar card';
                model.customer.addressProof='Aadhar card';
                model.customer.addressProofSameAsIdProof = true;
                if (model.customer.yearOfBirth) {
                    model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                }
            },
            preSave: function(model, form, formName) {
                var deferred = $q.defer();
                if (model.customer.firstName) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.warn(model);
                if (!EnrollmentHelper.validateData(model)) {
                    $log.warn("Invalid Data, returning false");
                    return false;
                }
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                $log.info(JSON.stringify(sortFn(reqData)));
                EnrollmentHelper.saveData(reqData).then(function(res){
                    model.customer = _.clone(res.customer);
                    model = EnrollmentHelper.fixData(model);
                    /*reqData = _.cloneDeep(model);
                    EnrollmentHelper.proceedData(reqData).then(function(res){
                        $state.go("Page.Landing");
                    });*/
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    });
                });
            },
            proceed: function(model, formCtrl, form, $event) {
                var reqData = _.cloneDeep(model);
                if(reqData.customer.id && reqData.customer.currentStage === 'Stage01'){
                    $log.info("Customer id not null, skipping save");
                    EnrollmentHelper.proceedData(reqData).then(function (res) {
                        $state.go("Page.Landing");
                    });
                }
            },
            reload: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'ProfileInformation',
                    pageId: model.customer.id
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
        }
    };
}]);

irf.pageCollection.factory("Pages__AssetsLiabilitiesAndHealth",
["$log","formHelper","Enrollment", '$state','$stateParams', '$q', 'irfProgressMessage', 'PageHelper',
    'SessionStore','Utils','authService', 'BiometricService', 'Files',
function($log,formHelper,Enrollment,$state, $stateParams, $q, irfProgressMessage, PageHelper,
         SessionStore,Utils,authService, BiometricService, Files) {
    return {
        "id": "AssetsAndLiabilities",
        "type": "schema-form",
        "name": "Stage2",
        "title": "HOUSE_VERIFICATION",
        "subTitle": "Enrollment Stage 2",
        "uri": "Profile/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("I got initialized");
            $log.info($stateParams);

            if (!(model && model.customer && model.customer.id && model.$$STORAGE_KEY$$)) {

                PageHelper.showLoader();
                PageHelper.showProgress("page-init","Loading...");
                var expenditureSourcesTitlemap = formHelper.enum('expenditure').data;
                var customerId = $stateParams.pageId;
                if (!customerId) {
                    PageHelper.hideLoader();
                    $state.go("Page.Engine",{
                        pageName:"EnrollmentHouseVerificationQueue",
                        pageId:null
                    });
                    return;
                }
                Enrollment.get({id: customerId},
                    function(res){
                        _.assign(model.customer, res);

                        model.customer.expenditures = [];
                        model.customer.date = model.customer.date || Utils.getCurrentDate();

                        _.forEach(expenditureSourcesTitlemap, function(v){
                            if (v.value !== 'Other')
                                model.customer.expenditures.push({expenditureSource:v.value,frequency:'Monthly',annualExpenses:0});
                        });

                        model.customer.familyMembers = model.customer.familyMembers || [];
                        var self = null;
                        var spouse = null;
                        _.each(model.customer.familyMembers, function(v){
                            if (v.relationShip === 'Self') {
                                self = v;
                            } else if (v.relationShip === 'Husband' || v.relationShip === 'Wife') {
                                spouse = v;
                            }
                        });
                        if (!self) {
                            self = {
                                customerId: model.customer.id,
                                familyMemberFirstName: model.customer.firstName,
                                relationShip: 'Self',
                                gender: model.customer.gender,
                                dateOfBirth: model.customer.dateOfBirth,
                                maritalStatus: model.customer.maritalStatus,
                                mobilePhone: model.customer.mobilePhone || '',
                                age: moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years')
                            };
                            model.customer.familyMembers.push(self);
                        } else {
                            // TODO already self available, can verify here
                        }
                        if (!spouse) {
                            spouse = {
                                familyMemberFirstName: model.customer.spouseFirstName,
                                relationShip: model.customer.gender === 'MALE' ? 'Wife':'Husband',
                                gender: model.customer.gender === 'MALE' ? 'FEMALE':'MALE',
                                dateOfBirth: model.customer.spouseDateOfBirth,
                                maritalStatus: model.customer.maritalStatus,
                                age: moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years')
                            };
                            model.customer.familyMembers.push(spouse);
                        } else {
                            // TODO already spouse available, can verify here
                        }

                        model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                        try {
                            if (model.customer.verifications.length < 1) {
                                model.customer.verifications = [
                                    {
                                        "relationship": "Neighbour"
                                    },
                                    {
                                        "relationship": "Neighbour"
                                    }
                                ];
                            }
                        }catch(err){
                            model.customer.verifications = [
                                {
                                    "relationship": "Neighbour"
                                },
                                {
                                    "relationship": "Neighbour"
                                }
                            ];
                        }
                        model = Utils.removeNulls(model,true);

                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Done.",2000);

                    },
                    function(res){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Error in loading customer.",2000);
                        PageHelper.showErrors(res);
                        $state.go("Page.Engine", {
                            pageName: 'EnrollmentHouseVerificationQueue',
                            pageId: null
                        });
                    }
                );
            }

            model.isFPEnrolled = function(fingerId){
                //$log.info("Inside isFPEnrolled: " + BiometricService.getFingerTF(fingerId) + " :"  + fingerId);
                if (model.customer[BiometricService.getFingerTF(fingerId)]!=null || (typeof(model.customer.$fingerprint)!='undefined' && typeof(model.customer.$fingerprint[fingerId])!='undefined' && model.customer.$fingerprint[fingerId].data!=null )) {
                    //$log.info("Inside isFPEnrolled: :true");
                    return "fa-check text-success";
                }
                //$log.info("Inside isFPEnrolled: false");
                return "fa-close text-danger";
            }

            model.getFingerLabel = function(fingerId){
                return BiometricService.getLabel(fingerId);
            }

        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"]
            ]
        },
        //modelPromise: function(pageId) {
        //    var deferred = $q.defer();
        //    Enrollment.get({id:pageId}).$promise.then(function(data){
        //        deferred.resolve({customer:data});
        //    });
        //    return deferred.promise;
        //},
        form: [

            {
                "type": "box",
                "title": "T_FAMILY_DETAILS",
                "items": [{
                    key:"customer.familyMembers",
                    type:"array",
                    startEmpty: true,
                    items: [
                        {
                            key:"customer.familyMembers[].customerId",
                            type:"lov",
                            "inputMap": {
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "branchName": {
                                    "key": "customer.kgfsName",
                                    "type": "select"
                                },
                                "centreCode": {
                                    "key": "customer.centreCode",
                                    "type": "select"
                                }
                            },
                            "outputMap": {
                                "id": "customer.familyMembers[arrayIndex].customerId",
                                "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"

                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'branchName': SessionStore.getBranch() || inputModel.branchName,
                                    'firstName': inputModel.first_name,
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' '),
                                    data.id
                                ];
                            }
                        },
                        {
                            key:"customer.familyMembers[].familyMemberFirstName",
                            title:"FAMILY_MEMBER_FULL_NAME"
                        },
                        {
                            key:"customer.familyMembers[].relationShip",
                            type:"select",
                            title: "T_RELATIONSHIP"
                        },
                        {
                            key: "customer.familyMembers[].gender",
                            type: "radios",
                            title: "T_GENDER"
                        },
                        {
                            key:"customer.familyMembers[].age",
                            title: "AGE",
                            type:"number",
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    } else {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                    }
                                }
                            }
                        },
                        {
                            key: "customer.familyMembers[].dateOfBirth",
                            type:"date",
                            title: "T_DATEOFBIRTH",
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        },
                        {
                            key:"customer.familyMembers[].educationStatus",
                            type:"select",
                            title: "T_EDUCATION_STATUS"
                        },
                        {
                            key:"customer.familyMembers[].maritalStatus",
                            type:"select",
                            title: "T_MARITAL_STATUS"
                        },

                        "customer.familyMembers[].mobilePhone",
                        {
                            key:"customer.familyMembers[].healthStatus",
                            type:"radios",
                            titleMap:{
                                "GOOD":"GOOD",
                                "BAD":"BAD"
                            },

                        },
                        {
                            key:"customer.familyMembers[].incomes",
                            type:"array",
                            startEmpty: true,
                            items:[
                                {
                                    key: "customer.familyMembers[].incomes[].incomeSource",
                                    type:"select"
                                },
                                "customer.familyMembers[].incomes[].incomeEarned",
                                {
                                    key: "customer.familyMembers[].incomes[].frequency",
                                    type: "select"
                                }

                            ]

                        }
                    ]
                },
                    {
                        "type": "fieldset",
                        "title": "EXPENDITURES",
                        "items": [{
                            key:"customer.expenditures",
                            type:"array",
                            remove: null,
                            view: "fixed",
                            titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                            items:[{
                                type: 'section',
                                htmlClass: 'row',
                                items: [{
                                    type: 'section',
                                    htmlClass: 'col-xs-6',
                                    items: [{
                                        key:"customer.expenditures[].frequency",
                                        type:"select",
                                        notitle: true
                                    }]
                                },{
                                    type: 'section',
                                    htmlClass: 'col-xs-6',
                                    items: [{
                                        key: "customer.expenditures[].annualExpenses",
                                        type:"amount",
                                        notitle: true
                                    }]
                                }]
                            }]
                        }]
                    }]
            },
            {
                "type":"box",
                "title":"BUSINESS_OCCUPATION_DETAILS",
                "items":[
                    {
                        key:"customer.udf.userDefinedFieldValues.udf13",
                        type:"select"


                    },
                    {
                        type:"fieldset",
                        condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                        items:[
                            {
                                key:"customer.udf.userDefinedFieldValues.udf14",
                                type:"select"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf7"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf22"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf8"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf9"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf10"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf11"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf12"
                            },

                            {
                                key:"customer.udf.userDefinedFieldValues.udf23",
                                type:"radios"
                            },

                            {
                                key:"customer.udf.userDefinedFieldValues.udf17"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf16",
                                type:"select"
                            },

                            {
                                key:"customer.udf.userDefinedFieldValues.udf18",
                                type:"select"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf19",
                                type:"radios"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf20",
                                type:"select"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf21",
                                condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                            }
                        ]
                    },
                    {
                        type:"fieldset",
                        condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                        title:"AGRICULTURE_DETAILS",
                        items:[
                            {
                                key:"customer.udf.userDefinedFieldValues.udf24",
                                type:"select"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf25",
                                type:"select"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf15"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf26"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf27",
                                type:"select"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf28"
                            }
                        ]
                    }

                ]
            },
            {
                "type": "box",
                "title": "T_ASSETS",
                "items": [
                    {
                        key: "customer.physicalAssets",
                        type: "array",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.physicalAssets[].ownedAssetDetails",
                                type:"select"

                            },
                            "customer.physicalAssets[].numberOfOwnedAsset",
                            {
                                key:"customer.physicalAssets[].ownedAssetValue",
                            }
                        ]
                    },
                    {
                        key: "customer.financialAssets",
                        title:"FINANCIAL_ASSETS",
                        type: "array",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.financialAssets[].instrumentType",
                                type:"select"
                            },
                            "customer.financialAssets[].nameOfInstitution",
                            {
                                key:"customer.financialAssets[].instituteType",
                                type:"select"
                            },
                            {
                                key: "customer.financialAssets[].amountInPaisa",
                                type: "amount"
                            },
                            {
                                key:"customer.financialAssets[].frequencyOfDeposite",
                                type:"select"
                            },
                            {
                                key:"customer.financialAssets[].startDate",
                                type:"date"
                            },
                            {
                                key:"customer.financialAssets[].maturityDate",
                                type:"date"
                            }
                        ]
                    }]

            },
            {
                type:"box",
                title:"T_LIABILITIES",
                items:[
                    {
                        key:"customer.liabilities",
                        type:"array",
                        startEmpty: true,
                        title:"FINANCIAL_LIABILITIES",
                        items:[
                            {
                                key:"customer.liabilities[].loanType",
                                type:"select"
                            },
                            {
                                key:"customer.liabilities[].loanSource",
                                type:"select"
                            },
                            "customer.liabilities[].instituteName",
                            {
                                key: "customer.liabilities[].loanAmountInPaisa",
                                type: "amount"
                            },
                            {
                                key: "customer.liabilities[].installmentAmountInPaisa",
                                type: "amount"
                            },
                            {
                                key: "customer.liabilities[].startDate",
                                type:"date"
                            },
                            {
                                key:"customer.liabilities[].maturityDate",
                                type:"date"
                            },
                            {
                                key:"customer.liabilities[].frequencyOfInstallment",
                                type:"select"
                            },
                            {
                                key:"customer.liabilities[].liabilityLoanPurpose",
                                type:"select"
                            }

                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "BIOMETRIC",
                "items": [
                    {
                        type: "button",
                        title: "CAPTURE_FINGERPRINT",
                        notitle: true,
                        fieldHtmlClass: "btn-block",
                        onClick: function(model, form, formName){
                            var promise = BiometricService.capture(model);
                            promise.then(function(data){
                                model.customer.$fingerprint = data;
                            }, function(reason){
                                console.log(reason);
                            })
                        }
                    },
                    {
                        "type": "section",
                        "html": '<div class="row"> <div class="col-xs-6">' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftThumb\')"></i> {{ model.getFingerLabel(\'LeftThumb\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftIndex\')"></i> {{ model.getFingerLabel(\'LeftIndex\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftMiddle\')"></i> {{ model.getFingerLabel(\'LeftMiddle\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftRing\')"></i> {{ model.getFingerLabel(\'LeftRing\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftLittle\')"></i> {{ model.getFingerLabel(\'LeftLittle\') }}</span><br>' +
                        '</div> <div class="col-xs-6">' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightThumb\')"></i> {{ model.getFingerLabel(\'RightThumb\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightIndex\')"></i> {{ model.getFingerLabel(\'RightIndex\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
                        '</div></div>'
                    }
                ]
            },
            {
                "type": "box",
                "title": "T_HOUSE_VERIFICATION",
                "items": [
                    {
                        "key": "customer.firstName",
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    {
                        key:"customer.nameInLocalLanguage"
                    },
                    {
                        key:"customer.addressInLocalLanguage",
                        type:"textarea"
                    },

                    {
                        key:"customer.religion",
                        type:"select"
                    },
                    {
                        key:"customer.caste",
                        type:"select"
                    },
                    {
                        key:"customer.language",
                        type:"select"
                    },
                    {
                        type:"fieldset",
                        title:"HOUSE_DETAILS",
                        items:[
                            {
                                key:"customer.udf.userDefinedFieldValues.udf3",
                                type:"select"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf2",
                                condition:"model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf4",

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf5",
                                type:"radios"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf31",
                                "type":"select"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf32"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf6"
                            }
                        ]
                    },
                    {
                        "key": "customer.latitude",
                        "title": "HOUSE_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    "customer.nameOfRo",
                    {
                        key:"customer.houseVerificationPhoto",
                        offline: true,
                        type:"file",
                        fileType:"image/*"
                    },
                    {
                        "key":"customer.verifications",
                        "title":"VERIFICATION",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                key:"customer.verifications[].houseNo"
                            },
                            {
                                key:"customer.verifications[].houseNoIsVerified"
                            },
                            {
                                key:"customer.verifications[].referenceFirstName"
                            },
                            {
                                key:"customer.verifications[].relationship",
                                type:"select"
                            }

                        ]
                    },
                    {
                        key: "customer.date",
                        type:"date"
                    },
                    "customer.place"
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "Save Offline",
                },{
                    "type": "submit",
                    "title": "Submit"
                }]
            }

        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            captureBiometric: function(model, form, formName){

            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.info(model);
                PageHelper.clearErrors();
                PageHelper.showLoader();

                var out = model.customer.$fingerprint;
                var fpPromisesArr = [];
                for (var key in out) {
                    if (out.hasOwnProperty(key) && out[key].data!=null) {
                        (function(obj){
                            var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                            promise.then(function(data){
                                model.customer[obj.table_field] = data.fileId;
                                delete model.customer.$fingerprint[obj.fingerId];
                            });
                            fpPromisesArr.push(promise);
                        })(out[key]);
                    } else {
                        if (out[key].data == null){
                            delete out[key];
                        }

                    }
                }
                $q.all(fpPromisesArr).then(function(){

                    var reqData = _.cloneDeep(model);

                    if (reqData['customer']['miscellaneous']){
                        var misc = reqData['customer']['miscellaneous'];
                        if (misc['alcoholConsumption']){
                            misc['alcoholConsumption'] = "Yes"
                        } else {
                            misc['alcoholConsumption'] = "No"
                        }

                        if (misc['narcoticsConsumption']){
                            misc['narcoticsConsumption'] = "Yes"
                        } else {
                            misc['narcoticsConsumption'] = "No"
                        }

                        if (misc['tobaccoConsumption']){
                            misc['tobaccoConsumption'] = "Yes"
                        } else {
                            misc['tobaccoConsumption'] = "No"
                        }
                    }

                    try{
                        var liabilities = reqData['customer']['liabilities'];
                        if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                            for (var i=0; i<liabilities.length;i++){
                                var l = liabilities[i];
                                l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                            }
                        }

                        var financialAssets = reqData['customer']['financialAssets'];
                        if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                            for (var i=0; i<financialAssets.length;i++){
                                var f = financialAssets[i];
                                f.amountInPaisa = f.amountInPaisa * 100;
                            }
                        }
                    } catch(e){
                        $log.info("Error trying to change amount info.");
                    }

                    reqData['enrollmentAction'] = 'PROCEED';

                    irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.');

                    reqData.customer.verified = true;
                    if (reqData.customer.hasOwnProperty('verifications')){
                        var verifications = reqData.customer['verifications'];
                        for (var i=0; i<verifications.length; i++){
                            if (verifications[i].houseNoIsVerified){
                                verifications[i].houseNoIsVerified=1;
                            }
                            else{
                                verifications[i].houseNoIsVerified=0;
                            }
                        }
                    }
                    try{
                        for(var i=0;i<reqData.customer.familyMembers.length;i++){
                            var incomes = reqData.customer.familyMembers[i].incomes;

                            for(var j=0;j<incomes.length;j++){
                                switch(incomes[i].frequency){
                                    case 'M': incomes[i].monthsPerYear=12; break;
                                    case 'Monthly': incomes[i].monthsPerYear=12; break;
                                    case 'D': incomes[i].monthsPerYear=365; break;
                                    case 'Daily': incomes[i].monthsPerYear=365; break;
                                    case 'W': incomes[i].monthsPerYear=52; break;
                                    case 'Weekly': incomes[i].monthsPerYear=52; break;
                                    case 'F': incomes[i].monthsPerYear=26; break;
                                    case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                    case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                }
                            }
                        }

                    }catch(err){
                        console.error(err);
                    }
                    Utils.removeNulls(reqData,true);
                    $log.info(reqData);
                    Enrollment.updateEnrollment(reqData,
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Done. Customer URN created : ' + res.customer.urnNo, 5000);
                            $log.info("Inside updateEnrollment Success!");
                            $state.go("Page.Landing");
                        },
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                        })
                    $log.info(reqData);
                })

            }

        }
    }
}]);

irf.pageCollection.factory("Pages__CBCheck",
	["$log", "formHelper", "Enrollment", "CreditBureau", "SessionStore", "$state", "entityManager",
	function($log, formHelper, Enrollment, CreditBureau, SessionStore, $state, entityManager){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerCBCheck",
		"type": "search-list",
		"name": "CustomerCBCheck",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "CUSTOMER_SEARCH",
		"uri":"",
		initialize: function (model, form, formCtrl) {
			model.branchName = branch;
			$log.info("search-CustomerCBCheck got initialized");
		},
		definition: {
			title: "SEARCH_CUSTOMERS",
			pageName: "CustomerCBCheck",
			searchForm: ["*"],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"required": ["branchName"],
				"properties": {
					"firstName": {
						"title": "FULL_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kycNumber": {
						"title": "KYC_NO",
						"type": "string"
					},
					"urnNo": {
						"title": "URN_NO",
						"type": "number"
					},
					"branchName": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true,
						}
					},
					"centreCode": {
						"title": "CENTRE_CODE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"filter": {
								"parentCode as branch": "model.branchName"
							},
							"screenFilter": true
						}
					}
				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){
				var promise = Enrollment.search({
					'branchName': searchOptions.branchName,
					'firstName': searchOptions.firstName,
					'centreCode': searchOptions.centreCode,
					'kycNumber': searchOptions.kycNumber,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
					'lastName': searchOptions.lastName,
					'urnNo': searchOptions.urnNo
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.firstName + " " + (item.lastName!=null?item.lastName:""),
						'Customer ID : ' + item.id,
						null
					]
				},
				getActions: function(){
					return [
						{
							name: "Capture CB check info",
							desc: "",
							fn: function(item, index) {
								$log.info(item.urnNo);
								entityManager.setModel('CBCheckCapture', {_request:item});
								$state.go("Page.Engine", {pageName:"CBCheckCapture", pageId:null});

/*"id": 327989,
"enrollmentId": "50862105161045482653",
"urnNo": null,
"firstName": "Test user",
"lastName": null,
"middleName": null,
"fatherFirstName": "Test father",
"fatherLastName": null,
"fatherMiddleName": null,
"verified": false,
"kgfsName": "Karambayam",
"kgfsBankName": "Pudhuaaru",
"enrolledAs": "CUSTOMER",
"parentCustomerId": null,
"centreCode": null*/
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

irf.pageCollection.factory("Pages__CBCheckCapture",
	["$log", "$q", "CreditBureau", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "irfProgressMessage",
	function($log, $q, CreditBureau, SessionStore, $state, entityManager, formHelper, $stateParams, PM){
	return {
		"id": "CustomerCBCheckCapture",
		"type": "schema-form",
		"name": "CustomerCBCheckCapture",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "LOAN_DATA_CAPTURE",
		initialize: function (model, form, formCtrl) {
			model.creditBureau = "AOR";
			if (model._request) {
				model.customerName = model._request.firstName;
				model.customerId = model._request.id;
			} else {
				$state.go("Page.Engine", {pageName:"CBCheck", pageId:null});
			}
			$log.info("I got initialized");
		},
		form: [{
			"type": "box",
			"title": "CREDIT_BUREAU_CHECK",
			"items": [
				{
					"key": "customerName",
					"readonly": true
				},
				"partner",
				{
					"key":"productCode",
					"filter": {
						"parentCode as partner": "model.partner",
						"field2": "'JLG'"
					}
				},/*
				{
					"key": "creditBureau",
					"titleMap": [{
						"value": "AOR",
						"name": "Highmark - AOR"
					},{
						"value": "Base",
						"name": "Highmark - Base"
					}]
				},*/
				"loanAmount",
				"loanPurpose1"/*,
				{
					"key":"loanPurpose2",
					"filter": {
						"parentCode as loan_purpose_1": "model.loanPurpose1"
					}
				},
				{
					"key":"loanPurpose3",
					"filter": {
						"parentCode as loan_purpose_2": "model.loanPurpose2"
					}
				}*/
			]
		},{
			"type": "actionbox",
			"items": [{
				"type": "submit",
				"title": "SEND_FOR_CB_CHECK"
			}]
		}],
		schema: {
			"type": 'object',
			"required":[
				"customerId",
				"customerName",
				"partner",
				"productCode",
				"creditBureau",
				"loanAmount",
				"loanPurpose1",
				"loanPurpose2",
				"loanPurpose3"
			],
			"properties": {
				"customerId": {
					"title": "CUSTOMER_ID",
					"type": "string"
				},
				"customerName": {
					"title": "CUSTOMER_NAME",
					"type": "string"
				},
				"partner": {
					"title": "PARTNER",
					"type": "string",
					"enumCode":"partner",
					"x-schema-form":{
						"type":"select"
					}
				},
				"productCode": {
					"title": "PRODUCT",
					"type": "string",
					"enumCode":"loan_product",
					"x-schema-form":{
						"type":"select"
					}
				},
				"creditBureau": {
					"title": "CREDIT_BUREAU",
					"type": "string",
					"enum":["AOR", "Base"],
					"x-schema-form":{
						"type":"select"
					}
				},
				"loanAmount": {
					"title": "LOAN_AMOUNT",
					"type": "number",
					"x-schema-form":{
						"type":"amount"
					}
				},
				"loanPurpose1": {
					"title": "LOAN_PURPOSE",
					"type": "string",
					"enumCode": "loan_purpose_1",
					"x-schema-form":{
						"type":"select"
					}
				}
			}
		},
		actions: {
			submit: function(model, form, formName) {
				$log.info("form.$valid: " + form.$valid);
				if (form.$valid) {
					PM.pop('cbcheck-submit', 'CB Check Submitting...');
					CreditBureau.creditBureauCheck({
						customerId: model.customerId,
						highMarkType: model.creditBureau,
						purpose: model.loanPurpose1,
						loanAmount: model.loanAmount
					}, function(response){
						PM.pop('cbcheck-submit', 'CB Check successfully sent for ' + model.customerName, 5000);
						$state.go("Page.Engine", {pageName:"CBCheck", pageId:null});
					}, function(errorResponse){
						PM.pop('cbcheck-submit', 'CB Check Failed for ' + model.customerName, 5000);
					});
				}
			}
		}
	};
}]);

irf.pageCollection.factory("Pages__CBCheckStatusQueue",
["$log", "formHelper", "CreditBureau", "CreditBureau", "SessionStore", "$state", "entityManager",
"irfProgressMessage", "irfSimpleModal", "PageHelper",
function($log, formHelper, CreditBureau, CreditBureau, SessionStore, $state, entityManager,
	PM, showModal, PageHelper){
	var branch = SessionStore.getBranch();
	var nDays = 15;
	return {
		"id": "CBCheckStatusQueue",
		"type": "search-list",
		"name": "CBCheckStatusQueue",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "CUSTOMER_STATUS_QUEUE",
		"uri":"",
		initialize: function (model, form, formCtrl) {
			model.branchName = branch;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "CB_STATUS_LAST_15_DAYS",
			pageName: "CBCheckStatusQueue",
			searchForm: ["*"],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"required": ["branchName"],
				"properties": {
					"status": {
						"title": "STATUS",
						"type": "string",
						"enum": ["PROCESSED", "PENDING", "ERROR"],
						"x-schema-form": {
							"type": "select",
							"titleMap": [
								{"name":"All", "value":""},
								{"name":"Processed", "value":"PROCESSED"},
								{"name":"Pending", "value":"PENDING"},
								{"name":"Error", "value":"ERROR"}
							]
						}
					},/*
					"branchName": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select"
						}
					},*/
					"centreCode": {
						"title": "CENTRE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"filter": {
								"parentCode as branch": "model.branchName"
							},
							"screenFilter": true
						}
					}
				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){
				var today = moment(new Date());
				var nDaysBack = moment(new Date()).subtract(nDays, 'days');
                console.log(searchOptions);
				var promise = CreditBureau.listCreditBureauStatus({
					'branchName': searchOptions.branchName,
                    'status': searchOptions.status,
					'centreCode': searchOptions.centreCode,
					'fromDate': nDaysBack.format('YYYY-MM-DD'),
					'toDate': today.format('YYYY-MM-DD')
				}).$promise;
				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				// listStyle: "simple",
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.customerId + ': ' + item.firstName,
						item.status + ' / Loan Amount: ' + item.loanAmount,
						item.reportType + ' - ' + item.requestType
					]
				},
				getActions: function(){
					return [{
						name: "View CB Status",
						icon: "fa fa-star-half-o",
						desc: "",
						fn: function(item, index) {
							PM.pop('cbcheck-submit', 'Checking status...');
							$log.info(item.customerId);
							CreditBureau.DSCpostCB(
								{customerId:item.customerId},
								function(response){
									PM.pop('cbcheck-submit', 'Checking status...', 10);
									showModal("DSC post CB",
										"<dl class='dl-horizontal'><dt>stopResponse</dt><dd>" + response.stopResponse
										+ "</dd><dt>response</dt><dd>" + response.response
										+ "</dd></dl>"
									);
								},
								function(errorResponse){
									$log.error(errorResponse);
									PM.pop('cbcheck-submit', 'Error checking status...', 3000);
								});
						},
						isApplicable: function(item, index){
							return true;
						}
					},{
						name: "Reinitiate CB Check",
						icon: "fa fa-share-square",
						desc: "",
						fn: function(item, index) {
							$log.info(item.id);
							PM.pop('cbcheck-submit', 'Reinitiating CB Check...');
							CreditBureau.reinitiateCBCheck(
								{creditBureauId:item.id},
								function(response){
									$log.info(response);
									PM.pop('cbcheck-submit', 'CB Check reinitiated ...', 3000);
								},
								function(errorResponse){
									$log.error(errorResponse);
									PM.pop('cbcheck-submit', 'Error reinitiating...', 3000);
									var data = errorResponse.data;
									var errors = [];
									if (data.errors){
										_.forOwn(data.errors, function(keyErrors, key){
											var keyErrorsLength = keyErrors.length;
											for (var i=0;i<keyErrorsLength; i++){
												var error  = {"message": "<strong>" + key  + "</strong>: " + keyErrors[i]};
												errors.push(error);
											}
										})
										PageHelper.setErrors(errors);
									} else if (data.error) {
										errors.push({"message": data.error});
										PageHelper.setErrors(errors);
									}
								});
						},
						isApplicable: function(item, index){
							if (item.status === 'PENDING') {
								return true;
							}
							return false;
						}
					},{
						name: "Enroll Customer",
						icon: "fa fa-user-plus",
						desc: "",
						fn: function(item, index) {
							$log.info(item.id);
							PM.pop('cbcheck-submit', 'Reinitiating CB Check...');
							CreditBureau.reinitiateCBCheck(
								{creditBureauId:item.id},
								function(response){
									$log.info(response);
									PM.pop('cbcheck-submit', 'CB Check reinitiated ...', 3000);
								},
								function(errorResponse){
									$log.error(errorResponse);
									PM.pop('cbcheck-submit', 'Error reinitiating...', 3000);
									var data = errorResponse.data;
									var errors = [];
									if (data.errors){
										_.forOwn(data.errors, function(keyErrors, key){
											var keyErrorsLength = keyErrors.length;
											for (var i=0;i<keyErrorsLength; i++){
												var error  = {"message": "<strong>" + key  + "</strong>: " + keyErrors[i]};
												errors.push(error);
											}
										})
										PageHelper.setErrors(errors);
									} else if (data.error) {
										errors.push({"message": data.error});
										PageHelper.setErrors(errors);
									}
								});
						},
						isApplicable: function(item, index){
							if (item.status === 'PENDING') {
								return true;
							}
							return false;
						}
					}];
				}
			}


		}
	};
}]);

irf.pageCollection.factory("Pages__CustomerRUD",
    ["$log", "$q", "Enrollment", 'PageHelper', 'irfProgressMessage', '$stateParams', '$state',
        'formHelper', "BASE_URL", "$window", "SessionStore", "Utils",
        function ($log, $q, Enrollment, PageHelper, irfProgressMessage, $stateParams, $state,
                  formHelper, BASE_URL, $window, SessionStore, Utils) {

            var fixData = function (model) {
                $log.info("Before fixData");
                Utils.removeNulls(model, true);
                if (_.has(model.customer, 'udf.userDefinedFieldValues')){
                    var fields = model.customer.udf.userDefinedFieldValues;
                    fields['udf17'] = Number(fields['udf17']);
                    fields['udf10'] = Number(fields['udf10']);
                    fields['udf11'] = Number(fields['udf11']);
                    fields['udf28'] = Number(fields['udf28']);
                    fields['udf32'] = Number(fields['udf32']);
                    fields['udf1'] = Boolean(fields['udf1']);
                    fields['udf6'] = Boolean(fields['udf6']);

                    for(var i=1; i<=40; i++){
                        if (!_.has(model.customer.udf.userDefinedFieldValues, 'udf' + i)){
                            model.customer.udf.userDefinedFieldValues['udf'+i] = '';
                        }
                    }
                }

                $log.info("After fixData");
                $log.info(model);

                return model;
            };

            return {
                "id": "CustomerRUD",
                "type": "schema-form",
                "name": "CustomerRUD",
                "title": "Customer Details",
                "subTitle": "",
                "uri": "Profile/Edit Customer",
                initialize: function (model, form, formCtrl) {
                    var custId = $stateParams.pageId;
                    $log.info("Loading data for Cust ID " + custId);

                    if (custId == undefined || custId == null) {
                        $state.go('Page.Engine', {
                            pageName: "CustomerSearch",
                            pageId: null
                        });
                    }
                    model._screenMode = 'VIEW';

                    //try {
                    //    if ($stateParams.pageId !== null) {
                    //        if ($stateParams.pageData.intent !== undefined) {
                    //            model._screenMode = $stateParams.pageData.intent;
                    //        }
                    //        else {
                    //            $state.go('Page.Engine',{
                    //                pageName:"CustomerSearch",
                    //                pageId:null
                    //            });
                    //        }
                    //    }
                    //}catch(err){
                    //    $log.error(err);
                    //    $state.go('Page.Engine',{
                    //        pageName:"CustomerSearch",
                    //        pageId:null
                    //    });
                    //}

                    PageHelper.showLoader();
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...");
                    Enrollment.getCustomerById({id: custId}, function (resp, header) {
                        PageHelper.hideLoader();
                        model.customer = _.cloneDeep(resp);
                        model = fixData(model);
                        $window.scrollTo(0, 0);
                        irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                    }, function (resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                        $state.go("Page.Engine", {
                            pageName: "CustomerSearch",
                            pageId: null
                        });

                    });

                },
                form: [
                    {
                        "type": "box",
                        "title": "CUSTOMER_INFORMATION",
                        "items": [
                            {
                                "key": "customer.aadhaarNo",
                                "type": "aadhar",
                                "outputMap": {
                                    "uid": "customer.aadhaarNo",
                                    "name": "customer.firstName",
                                    "gender": "customer.gender",
                                    "dob": "customer.dateOfBirth",
                                    "yob": "customer.yearOfBirth",
                                    "co": "",
                                    "house": "customer.doorNo",
                                    "street": "customer.street",
                                    "lm": "",
                                    "loc": "customer.locality",
                                    "vtc": "customer.villageName",
                                    "dist": "customer.district",
                                    "state": "customer.state",
                                    "pc": "customer.pincode"
                                },
                                onChange: "actions.setProofs(model)"
                            },
                            {
                                key:"customer.photoImageId",
                                type:"file",
                                fileType:"image/*",
                                "offline": true
                            },
                            {
                                key: "customer.centreCode",
                                type: "select",
                                filter: {
                                    "parentCode as branch": "model.customer.kgfsName"
                                }
                            },
                            {
                                key: "customer.enrolledAs",
                                type: "radios"
                            },
                            {
                                key: "customer.firstName",
                                title: "FULL_NAME"
                            },


                            {
                                key: "customer.gender",
                                type: "radios"
                            },
                            {
                                key: "customer.dateOfBirth",
                                type: "date"
                            },
                            {
                                key: "customer.fatherFirstName",
                                title: "FATHER_FULL_NAME"
                            },
                            {
                                key: "customer.maritalStatus",
                                type: "select"
                            },
                            {
                                key: "customer.spouseFirstName",
                                title: "SPOUSE_FULL_NAME",
                                condition: "model.customer.maritalStatus==='MARRIED'"
                            },
                            {
                                key: "customer.spouseDateOfBirth",
                                type: "date",
                                condition: "model.customer.maritalStatus==='MARRIED'"
                            },
                            {
                                key: "customer.udf.userDefinedFieldValues.udf1",
                                condition: "model.customer.maritalStatus==='MARRIED'",
                                title: "SPOUSE_LOAN_CONSENT"

                            }

                        ]
                    }, {
                        "type": "box",
                        "title": "CONTACT_INFORMATION",
                        "items": [{
                            type: "fieldset",
                            title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                            items: [

                                "customer.doorNo",
                                "customer.street",
                                "customer.locality",
                                {
                                    key: "customer.villageName",
                                    type: "select",
                                    filter: {
                                        'parentCode as branch': 'model.customer.kgfsName'
                                    }
                                },
                                "customer.postOffice",
                                {
                                    key: "customer.district",
                                    type: "select"
                                },
                                "customer.pincode",
                                {
                                    key: "customer.state",
                                    type: "select"
                                },
                                "customer.stdCode",
                                "customer.landLineNo",
                                "customer.mobilePhone",
                                "customer.mailSameAsResidence"
                            ]
                        }, {
                            type: "fieldset",
                            title: "CUSTOMER_PERMANENT_ADDRESS",
                            condition: "!model.customer.mailSameAsResidence",
                            items: [
                                "customer.mailingDoorNo",
                                "customer.mailingStreet",
                                "customer.mailingLocality",
                                "customer.mailingPostoffice",
                                {
                                    key: "customer.mailingDistrict",
                                    type: "select"
                                },
                                "customer.mailingPincode",
                                {
                                    key: "customer.mailingState",
                                    type: "select"
                                }
                            ]
                        }
                        ]
                    }, {
                        type: "box",
                        title: "KYC",
                        items: [
                            {
                                type: "fieldset",
                                title: "IDENTITY_PROOF",
                                items: [
                                    {
                                        key: "customer.identityProof",
                                        type: "select"
                                    },
                                    {
                                        key:"customer.identityProofImageId",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf30",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    "customer.identityProofNo",
                                    {
                                        key: "customer.idProofIssueDate",
                                        type: "date"
                                    },
                                    {
                                        key: "customer.idProofValidUptoDate",
                                        type: "date"
                                    }
                                ]
                            },
                            {
                                type: "fieldset",
                                title: "ADDRESS_PROOF",
                                condition: "!model.customer.addressProofSameAsIdProof",
                                items: [
                                    {
                                        key: "customer.addressProof",
                                        type: "select"
                                    },
                                    {
                                        key:"customer.addressProofImageId",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf29",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    "customer.addressProofNo",
                                    {
                                        key: "customer.addressProofIssueDate",
                                        type: "date"
                                    },
                                    {
                                        key: "customer.addressProofValidUptoDate",
                                        type: "date"
                                    },
                                ]
                            }

                        ]
                    },
                    {
                        "type": "box",
                        "title": "T_FAMILY_DETAILS",
                        "items": [{
                            key: "customer.familyMembers",
                            type: "array",
                            items: [
                                {
                                    key: "customer.familyMembers[].customerId"
                                },
                                {
                                    key: "customer.familyMembers[].familyMemberFirstName",
                                    title: "FAMILY_MEMBER_FULL_NAME"
                                },
                                {
                                    key: "customer.familyMembers[].relationShip",
                                    title: "T_RELATIONSHIP"
                                },
                                {
                                    key: "customer.familyMembers[].gender",
                                    type: "radios",
                                    title: "T_GENDER"
                                },
                                {
                                    key: "customer.familyMembers[].dateOfBirth",
                                    title: "T_DATEOFBIRTH"
                                },
                                {
                                    key: "customer.familyMembers[].educationStatus",
                                    type: "select",
                                    title: "T_EDUCATION_STATUS"
                                },
                                {
                                    key: "customer.familyMembers[].maritalStatus",
                                    type: "select",
                                    title: "T_MARITAL_STATUS"
                                },
                                "customer.familyMembers[].mobilePhone",
                                {
                                    key: "customer.familyMembers[].healthStatus"
                                },
                                {
                                    key: "customer.familyMembers[].incomes",
                                    type: "array",
                                    items: [
                                        {
                                            key: "customer.familyMembers[].incomes[].incomeSource",
                                            type:"select"
                                        },
                                        "customer.familyMembers[].incomes[].incomeEarned",
                                        {
                                            key: "customer.familyMembers[].incomes[].frequency",
                                            type:"select"
                                        }

                                    ]

                                }
                            ]
                        },
                            {
                                "type": "fieldset",
                                "title": "EXPENDITURES",
                                "items": [{
                                    key: "customer.expenditures",
                                    type: "array",
                                    remove: null,
                                    view: "fixed",
                                    titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                                    items: [{
                                        type: 'section',
                                        htmlClass: 'row',
                                        items: [{
                                            type: 'section',
                                            htmlClass: 'col-xs-6',
                                            items: [{
                                                key: "customer.expenditures[].frequency",
                                                type: "select",
                                                notitle: true
                                            }]
                                        }, {
                                            type: 'section',
                                            htmlClass: 'col-xs-6',
                                            items: [{
                                                key: "customer.expenditures[].annualExpenses",
                                                type: "amount",
                                                notitle: true
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                    },
                    {
                        "type":"box",
                        "title":"BUSINESS_OCCUPATION_DETAILS",
                        "items":[
                            {
                                key:"customer.udf.userDefinedFieldValues.udf13",
                                type:"select"


                            },
                            {
                                type:"fieldset",
                                condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf14",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf7"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf22"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf8"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf9"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf10"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf11"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf12"
                                    },

                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf23",
                                        type:"radios"
                                    },

                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf17"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf16",
                                        type:"select"
                                    },

                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf18",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf19",
                                        type:"radios"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf20",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf21",
                                        condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                                    }
                                ]
                            },
                            {
                                type:"fieldset",
                                condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                                title:"AGRICULTURE_DETAILS",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf24",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf25",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf15"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf26"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf27",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf28"
                                    }
                                ]
                            }

                        ]
                    },
                    {
                        "type": "box",
                        "title": "T_ASSETS",
                        "items": [{
                            key: "customer.physicalAssets",
                            type: "array",
                            items: [
                                {
                                    key:"customer.physicalAssets[].ownedAssetDetails"

                                },
                                "customer.physicalAssets[].numberOfOwnedAsset",
                                {
                                    key:"customer.physicalAssets[].ownedAssetValue",
                                }
                            ]
                        },
                            {
                                key: "customer.financialAssets",
                                title:"Financial Assets",
                                items: [
                                    {
                                        key:"customer.financialAssets[].instrumentType",
                                    },
                                    "customer.financialAssets[].nameOfInstitution",
                                    {
                                        key:"customer.financialAssets[].instituteType",
                                    },
                                    {
                                        key: "customer.financialAssets[].amountInPaisa",
                                        type: "amount"
                                    },
                                    {
                                        key:"customer.financialAssets[].frequencyOfDeposite",
                                    },
                                    {
                                        key:"customer.financialAssets[].startDate",
                                        type:"date"
                                    },
                                    {
                                        key:"customer.financialAssets[].maturityDate",
                                        type:"date"
                                    }
                                ]
                            }]

                    },
                    {
                        type:"box",
                        title:"T_LIABILITIES",
                        items:[
                            {
                                key:"customer.liabilities",
                                type:"array",
                                title:"Financial Liabilities",
                                items:[
                                    {
                                        key:"customer.liabilities[].loanType"
                                    },
                                    {
                                        key:"customer.liabilities[].loanSource"
                                    },
                                    "customer.liabilities[].instituteName",
                                    {
                                        key: "customer.liabilities[].loanAmountInPaisa",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.liabilities[].installmentAmountInPaisa",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.liabilities[].startDate",
                                        type:"date"
                                    },
                                    {
                                        key:"customer.liabilities[].maturityDate",
                                        type:"date"
                                    },
                                    {
                                        key:"customer.liabilities[].frequencyOfInstallment"
                                    },
                                    {
                                        key:"customer.liabilities[].liabilityLoanPurpose"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "title": "T_HOUSE_VERIFICATION",
                        "items": [
                            {
                                key:"customer.nameInLocalLanguage"
                            },
                            {
                                key:"customer.addressInLocalLanguage"
                            },

                            {
                                key:"customer.religion"
                            },
                            {
                                key:"customer.caste"
                            },
                            {
                                key:"customer.language"
                            },
                            {
                                type:"fieldset",
                                title:"HOUSE_DETAILS",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf3",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf2",
                                        condition:"model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf4",

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf5",
                                        type:"radios"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf31",
                                        "type":"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf32"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf6"
                                    }
                                ]
                            },
                            {
                                "key": "customer.latitude",
                                "title": "House Location",
                                "type": "geotag",
                                "latitude": "customer.latitude",
                                "longitude": "customer.longitude",
                                "onChange": "fillGeolocation(modelValue, form)"
                            },
                            "customer.nameOfRo",
                            {
                                type: 'section',
                                html: '<center><img ng-src="' + BASE_URL + '/api/stream/{{model.customer.houseVerificationPhoto}}" height="200" style="height:200px;max-width:100%" src="" /></center>'
                            },
                            {
                                key: "customer.date",
                                type:"text"
                            },
                            "customer.place"
                        ]
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "save",
                            "title": "SAVE_OFFLINE",
                        }, {
                            "type": "submit",
                            "title": "SUBMIT"
                        }]
                    }
                ],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    deleteEnrollment: function (model) {
                        if (window.confirm("Delete - Are You Sure, This action is Irreversible?")) {
                            var remarks = window.prompt("Enter Remarks", "Remarks");
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-delete', 'Working...');
                            Enrollment.update({service: "close"}, {
                                "customerId": model.customer.id,
                                "remarks": remarks

                            }, function (resp, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-delete', 'Done.', 2000);
                                $state.go('Page.Engine', {
                                    pageName: "CustomerSearch",
                                    pageId: null
                                });

                            }, function (res) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-delete', 'Oops. An Error Occurred. Please Try Again', 5000);

                                var data = res.data;
                                var errors = [];
                                if (data.errors) {
                                    _.forOwn(data.errors, function (keyErrors, key) {
                                        var keyErrorsLength = keyErrors.length;
                                        for (var i = 0; i < keyErrorsLength; i++) {
                                            var error = {"message": "<strong>" + key + "</strong>: " + keyErrors[i]};
                                            errors.push(error);
                                        }
                                    });

                                }
                                if (data.error) {
                                    errors.push({message: data.error});
                                }
                                PageHelper.setErrors(errors);

                            });

                        }
                    },
                    submit: function (model, form, formName) {

                        if (window.confirm("Update - Are You Sure?")) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-update', 'Working...');
                            model.enrollmentAction = "SAVE";
                            $log.info(model);
                            var reqData = _.cloneDeep(model);
                            Enrollment.updateEnrollment(reqData, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                                $state.go("Page.Engine", {
                                    pageName: "CustomerRUD",
                                    pageId: model.customer.id,
                                    pageData: {
                                        intent: 'VIEW'
                                    }
                                }, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            }, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Oops. Some error.', 2000);
                                $window.scrollTo(0, 0);
                                PageHelper.showErrors(res);
                            })

                        }

                    },
                    doEdit: function (model) {
                        $state.go("Page.Engine", {
                            pageName: "CustomerRUD",
                            pageId: model.customer.id,
                            pageData: {
                                intent: 'EDIT'
                            }
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    exitEdit: function (model) {
                        $state.go("Page.Engine", {
                            pageName: "CustomerRUD",
                            pageId: model.customer.id,
                            pageData: {
                                intent: 'VIEW'
                            }
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });

                    }
                }
            };
        }]);

irf.pageCollection.factory(irf.page("customer.BusinessEntityEnrollment"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';
            model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = "Business";
        },
        modelPromise: function(pageId, _model) {
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
            ]
        },
        form: [
            {
                "type": "box",
                "title": "ENTITY_INFORMATION",
                "items": [
                    {
                        key: "customer.kgfsName",
                        title:"BRANCH_NAME",
                        readonly: true
                    },
                    {
                        key:"customer.centreCode",
                        type:"select",
                        title: "SPOKE",
                        filter: {
                            "parentCode": "model.branchId"
                        },
                        screenFilter: true
                    },
                    {
                        key: "customer.entityId",
                        title:"ENTITY_ID",
                        type: "lov",
                        lovonly: true,
                        inputMap: {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "OLD_CUSTOMER_NAME"
                            },
                            "branchName": {
                                "key": "customer.kgfsName",
                                "type": "select"
                            },
                            "centreCode": {
                                "key": "customer.centreCode",
                                "type": "select"
                            }
                        },
                        outputMap: {
                            "id": "customer.entityId",
                            "firstName": "customer.firstName"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': SessionStore.getBranch() || inputModel.branchName,
                                'firstName': inputModel.first_name,
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' '),
                                data.id
                            ];
                        }
                    },
                    {
                        key: "customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key: "customer.firstName",
                        title:"ENTITY_NAME"
                    }/*,
                    {
                        key:"customer.photoImageId",
                        title: "ENTITY_PHOTO",
                        type:"file",
                        fileType:"image/*"
                    }*/
                ]
            },
            {
                type:"box",
                title:"BUSINESS",
                items:[
                    {
                        key: "customer.enterprise.referredBy",
                        title:"REFERRED_BY",
                        type: "select",
                        titleMap: {
                            "a":"Cold call",
                            "b": "Existing customer reference",
                            "c": "Referral partner"
                        }
                    },
                    {
                        key: "customer.enterprise.referredName",
                        title:"REFERRED_NAME"
                    },
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },
                    {
                        key: "customer.enterprise.companyOperatingSince",
                        title:"OPERATING_SINCE",
                        type: "date"
                    },
                    {
                        key: "customer.enterprise.businessInPresentAreaSince",
                        type: "select",
                        title: "YEARS_OF_BUSINESS_PRESENT_AREA",
                        titleMap: {
                            a: "Less Than 1 Year",
                            b: "1 to 2 Years",
                            c: "2 to 3 Years",
                            d: "3 to 5 Years",
                            e: "5 to 10 Years",
                            f: "Greater Than 10 Years"
                        }
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince",
                        type: "select",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS",
                        titleMap: {
                            a: "Less Than 1 Year",
                            b: "1 to 3 Years",
                            c: "4 to 6 Years",
                            d: "6 to 10 Years",
                            f: "Greater Than 10 Years"
                        }
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "customer.enterprise.ownership",
                        title: "Ownership",
                        type: "select",
                        titleMap: {
                            "Owned": "Owned",
                            "Rent": "Rent",
                            "Lease": "Lease"
                        }
                    },
                    {
                        key: "customer.enterprise.constitution",
                        title: "CONSTITUTION",
                        type: "select",
                        titleMap: {
                            a: "Proprietorship",
                            b: "Partnership",
                            c: "Private Ltd"
                        }
                    },
                    {
                        key: "customer.enterprise.isCompanyRegistered",
                        type: "checkbox",
                        schema: {
                            default: false
                        },
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterprise.registrationType",
                        condition: "model.customer.enterprise.isCompanyRegistered",
                        title: "REGISTRATION_TYPE",
                        type: "select",
                        titleMap: {
                            a: "TIN",
                            b: "SSI number",
                            c: "VAT number",
                            d: "Business PAN number",
                            e: "Service tax number",
                            f: "DIC",
                            g: "MSME",
                            h: "S&E"
                        }
                    },
                    {
                        key: "customer.enterprise.registrationNumber",
                        condition: "model.customer.enterprise.isCompanyRegistered",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "customer.enterprise.businessLine",
                        title: "BUSINESS_LINE",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        titleMap: {}
                    },
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items":[
                    "customer.doorNo",
                    "customer.street",
                    "customer.locality",
                    {
                        key:"customer.villageName",
                        type:"select",
                        filter: {
                            'parentCode': 'model.branchId'
                        },
                        screenFilter: true
                    },
                    "customer.udf.userDefinedFieldValues.udf9",
                    {
                        key:"customer.district",
                        type:"select",
                        screenFilter: true
                    },
                    "customer.pincode",
                    {
                        key:"customer.state",
                        type:"select",
                        screenFilter: true
                    },
                    "customer.stdCode",
                    "customer.landLineNo",
                    "customer.mobilePhone"
                ]
            },
            {
                type: "box",
                title: "CUSTOMER_BANK_ACCOUNTS",
                items: [
                    {
                        key: "customer.bankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.bankAccounts[].ifscCode",
                                title: "IFSC_CODE",
                                type: "lov",
                                inputMap: {
                                    "bankName": {
                                        "key": "customer.bankAccounts[].bankName",
                                        "title": "BRANCH_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.bankAccounts[].branch",
                                        "title": "BRANCH_NAME"
                                    },
                                    "ifscCode": {
                                        "key": "customer.bankAccounts[].ifscCode",
                                        "title": "IFSC_CODE"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.bankAccounts[arrayIndex].bankName",
                                    "branchName": "customer.bankAccounts[arrayIndex].branch",
                                    "ifscCode": "customer.bankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': SessionStore.getBranch() || inputModel.branchName,
                                        'firstName': inputModel.first_name,
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            {
                                key: "customer.bankAccounts[].bankName",
                                title: "BANK_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].branch",
                                title: "BRANCH_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].customerName",
                                title: "CUSTOMER_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].accountNumber",
                                title: "ACCOUNT_NUMBER"
                            },
                            {
                                key: "customer.bankAccounts[].accountType",
                                title: "ACCOUNT_TYPE",
                                type: "select",
                                titleMap: {
                                    a:"Current",
                                    b:"Savings",
                                    c:"OD",
                                    d:"CC"
                                }
                            },
                            {
                                key: "customer.bankAccounts[].isDisbursementAccount",
                                type: "radios",
                                schema: {
                                    default: false
                                },
                                title: "DISBURSEMENT_ACCOUNT",
                                titleMap: [{
                                    value: true,
                                    name: "Yes"
                                },{
                                    value: false,
                                    name: "No"
                                }]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model._mode != 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            },
            {
                "type": "actionbox",
                "condition": "model._mode == 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                },{
                    "type": "button",
                    "icon": "fa fa-user-plus",
                    "title": "ENROLL_CUSTOMER",
                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                },{
                    "type": "button",
                    "icon": "fa fa-refresh",
                    "title": "RELOAD",
                    "onClick": "actions.reload(model, formCtrl, form, $event)"
                }]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {

            setProofs: function(model) {
                model.customer.addressProofNo=model.customer.aadhaarNo;
                model.customer.identityProofNo=model.customer.aadhaarNo;
                model.customer.identityProof='Aadhar card';
                model.customer.addressProof='Aadhar card';
                model.customer.addressProofSameAsIdProof = true;
                if (model.customer.yearOfBirth) {
                    model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                }
            },
            preSave: function(model, form, formName) {
                var deferred = $q.defer();
                if (model.customer.firstName) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.warn(model);
                if (!EnrollmentHelper.validateData(model)) {
                    $log.warn("Invalid Data, returning false");
                    return false;
                }
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                $log.info(JSON.stringify(sortFn(reqData)));
                EnrollmentHelper.saveData(reqData).then(function(res){
                    model.customer = _.clone(res.customer);
                    model = EnrollmentHelper.fixData(model);
                    /*reqData = _.cloneDeep(model);
                    EnrollmentHelper.proceedData(reqData).then(function(res){
                        $state.go("Page.Landing");
                    });*/
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    });
                });
            },
            proceed: function(model, formCtrl, form, $event) {
                var reqData = _.cloneDeep(model);
                if(reqData.customer.id && reqData.customer.currentStage === 'Stage01'){
                    $log.info("Customer id not null, skipping save");
                    EnrollmentHelper.proceedData(reqData).then(function (res) {
                        $state.go("Page.Landing");
                    });
                }
            },
            reload: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'ProfileInformation',
                    pageId: model.customer.id
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("customer.IndividualEntityEnrollment"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "INDIVIDUAL",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';
            model.customer.kgfsName = SessionStore.getBranch();
            model.customer.centreCode = "Basti";
        },
        modelPromise: function(pageId, _model) {
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
            ]
        },
        form: [
            {
                "type": "box",
                "title": "CUSTOMER_INFORMATION",
                "items": [
                    {
                        key: "customer.kgfsName",
                        title:"BRANCH_NAME",
                        readonly: true
                    },
                    {
                        key:"customer.centreCode",
                        title: "SPOKE",
                        readonly: true
                    },
                    {
                        key: "customer.entityId",
                        title:"ENTITY_ID",
                        type: "lov",
                        lovonly: true,
                        inputMap: {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "OLD_CUSTOMER_NAME"
                            },
                            "branchName": {
                                "key": "customer.kgfsName",
                                "type": "select"
                            },
                            "centreCode": {
                                "key": "customer.centreCode",
                                "type": "select"
                            }
                        },
                        outputMap: {
                            "id": "customer.entityId",
                            "firstName": "customer.firstName"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': SessionStore.getBranch() || inputModel.branchName,
                                'firstName': inputModel.first_name,
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' '),
                                data.id
                            ];
                        }
                    },
                    {
                        key: "customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key:"customer.photoImageId",
                        type:"file",
                        fileType:"image/*"
                    },
                    {
                        key: "customer.firstName",
                        title:"FIRST_NAME",
                        placeholder: "FIRST_NAME"
                    },
                    {
                        key: "customer.middleName",
                        title:"MIDDLE_NAME"
                    },
                    {
                        key: "customer.lastName",
                        title:"LAST_NAME"
                    },
                    {
                        key: "customer.maritalStatus",
                        type: "select"
                    },
                    {
                        key:"customer.age",
                        title: "AGE",
                        type:"number",
                        "onChange": function(modelValue, form, model) {
                            if (model.customer.age > 0) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } else {
                                    model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                }
                            }
                        }
                    },
                    {
                        key:"customer.dateOfBirth",
                        type:"date",
                        "onChange": function(modelValue, form, model) {
                            if (model.customer.dateOfBirth) {
                                model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    {
                        key:"customer.gender1",
                        title: "Gender",
                        type:"radios",
                        titleMap: {
                            a:"Male",
                            b:"Female",
                            c:"Unspecified"
                        }
                    },
                    {
                        key: "customer.religion1",
                        title: "Religion",
                        type: "select",
                        titleMap: {
                            a:"Hindu",
                            b:"Muslim",
                            c:"Chirstian",
                            d:"Jain",
                            e:"Buddhism",
                            f:"Others"
                        }
                    },
                    {
                        key: "customer.educationLevel",
                        title: "Education Level",
                        type: "select",
                        titleMap: {
                            a:"Below SSLC",
                            b:"SSLC",
                            c:"HSC",
                            d:"Graduate/Diploma/ITI",
                            e:"Professional Degree",
                            f:"Others"
                        }
                    },
                    {
                        key: "customer.relationshipToBusiness",
                        title: "Relationship to Business",
                        type: "select",
                        titleMap: {
                            a:"Proprietor",
                            b:"Partner",
                            c:"Director",
                            d:"Others"
                        }
                    },
                    {
                        key: "customer.enterpriseCustomerRelations.linkedToCustomerId",
                        type: "lov",
                        title: "BUSINESS"
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items":[{
                    type: "fieldset",
                    title: "CUSTOMER_PRESENT_ADDRESS",
                    items: [
                            "customer.doorNo",
                            "customer.street",
                            {
                                key: "cu",
                                title: "Landmark"
                            },
                            {
                                key: "customer.pincode",
                                type: "lov"
                            },
                            {
                                key:"customer.state"
                            },
                            {
                                key: "customer.district"
                            },
                            {
                                key: "customer.city",
                                title: "City"
                            },
                            {
                                key: "customer.mobilePhone",
                                required: true
                            },
                            "customer.mailSameAsResidence",
                            {
                                key: "customer.latitude",
                                title: "HOUSE_LOCATION",
                                type: "geotag",
                                latitude: "customer.latitude",
                                longitude: "customer.longitude"
                            }
                        ]
                    },{
                        type: "fieldset",
                        title: "CUSTOMER_PERMANENT_ADDRESS",
                        condition:"!model.customer.mailSameAsResidence",
                        items: [
                            "customer.doorNo",
                            "customer.street",
                            {
                                key: "cu",
                                title: "Landmark"
                            },
                            {
                                key: "customer.pincode",
                                type: "lov"
                            },
                            {
                                key:"customer.state"
                            },
                            {
                                key: "customer.district"
                            },
                            {
                                key: "customer.city",
                                title: "City"
                            },
                            {
                                key: "customer.mobilePhone",
                                required: true
                            }
                        ]
                    },
                    {
                        key: "c",
                        title: "Years in current address",
                        type: "select",
                        titleMap: {
                            a: "Less than 1 year",
                            b: "1 to 3 years",
                            c: "4 to 6 years",
                            d: "7 to 10 years",
                            e: "Greater than 10 years"
                        }
                    },
                    {
                        key: "cc",
                        title: "Years in current area",
                        type: "select",
                        titleMap: {
                            a: "Less than 1 year",
                            b: "1 to 3 years",
                            c: "4 to 6 years",
                            d: "7 to 10 years",
                            e: "Greater than 10 years"
                        }
                    },
                    {
                        key: "d",
                        title: "Ownership",
                        type: "select",
                        titleMap: {
                            a:"Owned",
                            b: "Rented",
                            c:"Leased"
                        }
                    }
                ]
            },
            {
                type:"box",
                title:"KYC",
                items:[
                    {
                        type:"fieldset",
                        title:"IDENTITY_PROOF",
                        items:[
                            {
                                key:"customer.identityProof",
                                type:"select"
                            },
                            {
                                key:"customer.identityProofImageId",
                                type:"file",
                                fileType:"image/*",
                                "offline": true
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf30",
                                type:"file",
                                fileType:"image/*",
                                "offline": true
                            },
                            {
                                key:"customer.identityProofNo",
                                type:"barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            {
                                key:"customer.idProofIssueDate",
                                type:"date"
                            },
                            {
                                key:"customer.idProofValidUptoDate",
                                type:"date"
                            }
                        ]
                    }
                ]
            },
            {
                type: "box",
                title: "CUSTOMER_BANK_ACCOUNTS",
                items: [
                    {
                        key: "customer.bankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.bankAccounts[].ifscCode",
                                title: "IFSC_CODE",
                                type: "lov",
                                inputMap: {
                                    "bankName": {
                                        "key": "customer.bankAccounts[].bankName",
                                        "title": "BRANCH_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.bankAccounts[].branch",
                                        "title": "BRANCH_NAME"
                                    },
                                    "ifscCode": {
                                        "key": "customer.bankAccounts[].ifscCode",
                                        "title": "IFSC_CODE"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.bankAccounts[arrayIndex].bankName",
                                    "branchName": "customer.bankAccounts[arrayIndex].branch",
                                    "ifscCode": "customer.bankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': SessionStore.getBranch() || inputModel.branchName,
                                        'firstName': inputModel.first_name,
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            {
                                key: "customer.bankAccounts[].bankName",
                                title: "BANK_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].branch",
                                title: "BRANCH_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].customerName",
                                title: "CUSTOMER_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].accountNumber",
                                title: "ACCOUNT_NUMBER"
                            },
                            {
                                key: "customer.bankAccounts[].accountType",
                                title: "ACCOUNT_TYPE"
                            },
                            {
                                key: "customer.bankAccounts[].isDisbursementAccount",
                                type: "checkbox",
                                schema: {
                                    default: false
                                },
                                title: "DISBURSEMENT_ACCOUNT"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model._mode != 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            },
            {
                "type": "actionbox",
                "condition": "model._mode == 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                },{
                    "type": "button",
                    "icon": "fa fa-user-plus",
                    "title": "ENROLL_CUSTOMER",
                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                },{
                    "type": "button",
                    "icon": "fa fa-refresh",
                    "title": "RELOAD",
                    "onClick": "actions.reload(model, formCtrl, form, $event)"
                }]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {

            setProofs: function(model) {
                model.customer.addressProofNo=model.customer.aadhaarNo;
                model.customer.identityProofNo=model.customer.aadhaarNo;
                model.customer.identityProof='Aadhar card';
                model.customer.addressProof='Aadhar card';
                model.customer.addressProofSameAsIdProof = true;
                if (model.customer.yearOfBirth) {
                    model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                }
            },
            preSave: function(model, form, formName) {
                var deferred = $q.defer();
                if (model.customer.firstName) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.warn(model);
                if (!EnrollmentHelper.validateData(model)) {
                    $log.warn("Invalid Data, returning false");
                    return false;
                }
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                $log.info(JSON.stringify(sortFn(reqData)));
                EnrollmentHelper.saveData(reqData).then(function(res){
                    model.customer = _.clone(res.customer);
                    model = EnrollmentHelper.fixData(model);
                    /*reqData = _.cloneDeep(model);
                    EnrollmentHelper.proceedData(reqData).then(function(res){
                        $state.go("Page.Landing");
                    });*/
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    });
                });
            },
            proceed: function(model, formCtrl, form, $event) {
                var reqData = _.cloneDeep(model);
                if(reqData.customer.id && reqData.customer.currentStage === 'Stage01'){
                    $log.info("Customer id not null, skipping save");
                    EnrollmentHelper.proceedData(reqData).then(function (res) {
                        $state.go("Page.Landing");
                    });
                }
            },
            reload: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'ProfileInformation',
                    pageId: model.customer.id
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("customer360.CustomerProfile"),
["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition",
function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition){

    var branch = SessionStore.getBranch();

    var config = PagesDefinition.getPageConfig("Page/Engine/customer360.CustomerProfile");

    var initData = function(model) {
        model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
        model.customer.fullName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
        model.customer.fatherFullName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
    };

    return {
        "type": "schema-form",
        "title": "PROFILE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Profile Page got initialized");
            initData(model);
        },
        modelPromise: function(pageId, _model) {
            if (!_model || !_model.customer || _model.customer.id != pageId) {
                $log.info("data not there, loading...");

                var deferred = $q.defer();
                PageHelper.showLoader();
                Enrollment.getCustomerById({id:pageId},function(resp,header){
                    var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    model = EnrollmentHelper.fixData(model);
                    if (model.customer.currentStage==='Stage01') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:pageId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                        initData(model);
                        deferred.resolve(model);
                    }
                    PageHelper.hideLoader();
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                });
                return deferred.promise;
            }
        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"],
                item["customer"]["villageName"]
            ]
        },
        form: [{
            "type": "box",
            "title": "CUSTOMER_INFORMATION",
            "items": [
                {
                    key: "customer.idAndBcCustId",
                    title: "Id & BC Id",
                    titleExpr: "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)",
                    readonly: true
                },
                {
                    key: "customer.urnNo",
                    title: "URN_NO",
                    readonly: true
                },
                {
                    key: "customer.fullName",
                    title: "FULL_NAME",
                    readonly: true
                },
                {
                    key:"customer.photoImageId",
                    type:"file",
                    fileType:"image/*",
                    "viewParams": function(modelValue, form, model) {
                        return {
                            customerId: model.customer.id
                        };
                    },
                    readonly: true
                },
                {
                    key:"customer.centreCode",
                    type:"select",
                    filter: {
                        "parentCode as branch": "model.customer.kgfsName"
                    },
                    screenFilter: true
                },
                {
                    key:"customer.enrolledAs",
                    type:"radios",
                    readonly: true
                },
                {
                    key:"customer.gender",
                    type:"radios",
                    readonly: true
                },
                {
                    key:"customer.age",
                    title: "AGE",
                    type:"number",
                    readonly: true
                },
                {
                    key:"customer.dateOfBirth",
                    type:"date",
                    /*onChange: function(modelValue, form, model) {
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    },*/
                    readonly: true
                },
                {
                    key: "customer.fatherFullName",
                    title: "FATHER_FULL_NAME",
                    readonly: true
                },
                {
                    key:"customer.maritalStatus",
                    type:"select"
                },
                {
                    key: "customer.spouseFirstName",
                    title: "SPOUSE_FULL_NAME",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    type:"qrcode",
                    onCapture: function(result, model, form) {
                        $log.info(result); // spouse id proof
                        var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                        $log.info(aadhaarData);
                        model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                        model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                        model.customer.spouseFirstName = aadhaarData.name;
                        if (aadhaarData.yob) {
                            model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key:"customer.spouseAge",
                    title: "SPOUSE_AGE",
                    type:"number",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.spouseAge > 0) {
                            if (model.customer.spouseDateOfBirth) {
                                model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-') + moment(model.customer.spouseDateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                            } else {
                                model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-MM-DD');
                            }
                        }
                    }
                },
                {
                    key:"customer.spouseDateOfBirth",
                    type:"date",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.spouseDateOfBirth) {
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key:"customer.udf.userDefinedFieldValues.udf1",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    title:"SPOUSE_LOAN_CONSENT"
                },
                {
                    key:"customer.isBiometricValidated",
                    title: "Validate Fingerprint",
                    type:"validatebiometric",
                    helper: formHelper,
                    biometricMap: {
                        leftThumb: "model.customer.leftHandThumpImageId",
                        leftIndex: "model.customer.leftHandIndexImageId",
                        leftMiddle: "model.customer.leftHandMiddleImageId",
                        leftRing: "model.customer.leftHandRingImageId",
                        leftLittle: "model.customer.leftHandSmallImageId",
                        rightThumb: "model.customer.rightHandThumpImageId",
                        rightIndex: "model.customer.rightHandIndexImageId",
                        rightMiddle: "model.customer.rightHandMiddleImageId",
                        rightRing: "model.customer.rightHandRingImageId",
                        rightLittle: "model.customer.rightHandSmallImageId"
                    },
                    viewParams: function(modelValue, form, model) {
                        return {
                            customerId: model.customer.id
                        };
                    }
                }
            ]
        },{
            "type": "box",
            "title": "CONTACT_INFORMATION",
            "items":[{
                type: "fieldset",
                title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                items: [

                        "customer.doorNo",
                        "customer.street",
                        "customer.locality",
                        {
                            key:"customer.villageName",
                            type:"select",
                            filter: {
                                'parentCode as branch': 'model.customer.kgfsName'
                            },
                            screenFilter: true
                        },
                        "customer.postOffice",
                        {
                            key:"customer.district",
                            type:"select",
                            screenFilter: true
                        },
                        "customer.pincode",
                        {
                            key:"customer.state",
                            type:"select",
                            screenFilter: true
                        },
                        "customer.stdCode",
                        "customer.landLineNo",
                        {
                            "key": "customer.mobilePhone",
                            "readonly": true
                        },
                        "customer.mailSameAsResidence"
                    ]
                },{
                    type: "fieldset",
                    title: "CUSTOMER_PERMANENT_ADDRESS",
                    condition:"!model.customer.mailSameAsResidence",
                    items: [
                        "customer.mailingDoorNo",
                        "customer.mailingStreet",
                        "customer.mailingLocality",
                        "customer.mailingPostoffice",
                        {
                            key:"customer.mailingDistrict",
                            type:"select",
                            screenFilter: true
                        },
                        "customer.mailingPincode",
                        {
                            key:"customer.mailingState",
                            type:"select",
                            screenFilter: true
                        }
                    ]
                }
            ]
        },{
            type:"box",
            title:"KYC",
            items:[
                {
                    "key": "customer.aadhaarNo",
                    type:"qrcode",
                    onChange:"actions.setProofs(model)",
                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
                },
                {
                    type:"fieldset",
                    title:"IDENTITY_PROOF",
                    items:[
                        {
                            key:"customer.identityProof",
                            type:"select"
                        },
                        {
                            key:"customer.identityProofImageId",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf30",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "offline": true
                        },
                        {
                            key:"customer.identityProofNo",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.identityProofNo = result.text;
                            }
                        },
                        {
                            key:"customer.idProofIssueDate",
                            type:"date"
                        },
                        {
                            key:"customer.idProofValidUptoDate",
                            type:"date"
                        },
                        {
                            key:"customer.addressProofSameAsIdProof"
                        }
                    ]
                },
                {
                    type:"fieldset",
                    title:"SPOUSE_IDENTITY_PROOF",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    items:[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf33",
                            type:"select",
                            onChange: function(modelValue) {
                                $log.info(modelValue);
                            }
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf34",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf35",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf36",
                            condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                            }
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf36",
                            condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                            type:"qrcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob) {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        }
                    ]
                },
                {
                    type:"fieldset",
                    title:"ADDRESS_PROOF",
                    condition:"!model.customer.addressProofSameAsIdProof",
                    items:[
                        {
                            key:"customer.addressProof",
                            type:"select"
                        },
                        {
                            key:"customer.addressProofImageId",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf29",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "offline": true
                        },
                        {
                            key:"customer.addressProofNo",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.addressProofNo = result.text;
                            }
                        },
                        {
                            key:"customer.addressProofIssueDate",
                            type:"date"
                        },
                        {
                            key:"customer.addressProofValidUptoDate",
                            type:"date"
                        },
                    ]
                }

            ]
        },
        {
            "type": "box",
            "title": "T_FAMILY_DETAILS",
            "items": [{
                key:"customer.familyMembers",
                type:"array",
                items: [
                    {
                        key:"customer.familyMembers[].customerId",
                        readonly: true,
                        type:"lov",
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "branchName": {
                                "key": "customer.kgfsName",
                                "type": "select"
                            },
                            "centreCode": {
                                "key": "customer.centreCode",
                                "type": "select"
                            }
                        },
                        "outputMap": {
                            "id": "customer.familyMembers[arrayIndex].customerId",
                            "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"

                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': SessionStore.getBranch() || inputModel.branchName,
                                'firstName': inputModel.first_name,
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' '),
                                data.id
                            ];
                        }
                    },
                    {
                        key:"customer.familyMembers[].familyMemberFirstName",
                        title:"FAMILY_MEMBER_FULL_NAME",
                        readonly: true
                    },
                    {
                        key:"customer.familyMembers[].relationShip",
                        type:"select",
                        title: "T_RELATIONSHIP"
                    },
                    {
                        key: "customer.familyMembers[].gender",
                        type: "radios",
                        title: "T_GENDER",
                        readonly: true
                    },
                    {
                        key:"customer.familyMembers[].age",
                        title: "AGE",
                        type:"number",
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } else {
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                }
                            }
                        },
                        readonly: true
                    },
                    {
                        key: "customer.familyMembers[].dateOfBirth",
                        type:"date",
                        title: "T_DATEOFBIRTH",
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        },
                        readonly: true
                    },
                    {
                        key:"customer.familyMembers[].educationStatus",
                        type:"select",
                        title: "T_EDUCATION_STATUS"
                    },
                    {
                        key:"customer.familyMembers[].maritalStatus",
                        type:"select",
                        title: "T_MARITAL_STATUS"
                    },

                    "customer.familyMembers[].mobilePhone",
                    {
                        key:"customer.familyMembers[].healthStatus",
                        type:"radios",
                        titleMap:{
                            "GOOD":"GOOD",
                            "BAD":"BAD"
                        },

                    },
                    {
                        key:"customer.familyMembers[].incomes",
                        type:"array",
                        items:[
                            {
                                key: "customer.familyMembers[].incomes[].incomeSource",
                                type:"select"
                            },
                            "customer.familyMembers[].incomes[].incomeEarned",
                            {
                                key: "customer.familyMembers[].incomes[].frequency",
                                type: "select"
                            }

                        ]

                    }
                ]
            },
                {
                    "type": "fieldset",
                    "title": "EXPENDITURES",
                    "items": [{
                        key:"customer.expenditures",
                        type:"array",
                        remove: null,
                        view: "fixed",
                        titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                        items:[{
                            type: 'section',
                            htmlClass: 'row',
                            items: [{
                                type: 'section',
                                htmlClass: 'col-xs-6',
                                items: [{
                                    key:"customer.expenditures[].frequency",
                                    type:"select",
                                    notitle: true
                                }]
                            },{
                                type: 'section',
                                htmlClass: 'col-xs-6',
                                items: [{
                                    key: "customer.expenditures[].annualExpenses",
                                    type:"amount",
                                    notitle: true
                                }]
                            }]
                        }]
                    }]
                }]
        },
        {
            "type":"box",
            "title":"BUSINESS_OCCUPATION_DETAILS",
            "items":[
                {
                    key:"customer.udf.userDefinedFieldValues.udf13",
                    type:"select"


                },
                {
                    type:"fieldset",
                    condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                    items:[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf14",
                            type:"select"

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf7"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf22"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf8"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf9"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf10"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf11"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf12"
                        },

                        {
                            key:"customer.udf.userDefinedFieldValues.udf23",
                            type:"radios"
                        },

                        {
                            key:"customer.udf.userDefinedFieldValues.udf17"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf16",
                            type:"select"
                        },

                        {
                            key:"customer.udf.userDefinedFieldValues.udf18",
                            type:"select"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf19",
                            type:"radios"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf20",
                            type:"select"

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf21",
                            condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                        }
                    ]
                },
                {
                    type:"fieldset",
                    condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                    title:"AGRICULTURE_DETAILS",
                    items:[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf24",
                            type:"select"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf25",
                            type:"select"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf15"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf26"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf27",
                            type:"select"

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf28"
                        }
                    ]
                }

            ]
        },
        {
            "type": "box",
            "title": "T_ASSETS",
            "items": [{
                key: "customer.physicalAssets",
                type: "array",
                items: [
                    {
                        key:"customer.physicalAssets[].ownedAssetDetails",
                        type:"select"

                    },
                    "customer.physicalAssets[].numberOfOwnedAsset",
                    {
                        key:"customer.physicalAssets[].ownedAssetValue",
                    }
                ]
            },
                {
                    key: "customer.financialAssets",
                    title:"FINANCIAL_ASSETS",
                    type: "array",
                    items: [
                        {
                            key:"customer.financialAssets[].instrumentType",
                            type:"select"
                        },
                        "customer.financialAssets[].nameOfInstitution",
                        {
                            key:"customer.financialAssets[].instituteType",
                            type:"select"
                        },
                        {
                            key: "customer.financialAssets[].amountInPaisa",
                            type: "amount"
                        },
                        {
                            key:"customer.financialAssets[].frequencyOfDeposite",
                            type:"select"
                        },
                        {
                            key:"customer.financialAssets[].startDate",
                            type:"date"
                        },
                        {
                            key:"customer.financialAssets[].maturityDate",
                            type:"date"
                        }
                    ]
                }]

        },
        {
            type:"box",
            title:"T_LIABILITIES",
            items:[
                {
                    key:"customer.liabilities",
                    type:"array",
                    title:"FINANCIAL_LIABILITIES",
                    items:[
                        {
                            key:"customer.liabilities[].loanType",
                            type:"select"
                        },
                        {
                            key:"customer.liabilities[].loanSource",
                            type:"select"
                        },
                        "customer.liabilities[].instituteName",
                        {
                            key: "customer.liabilities[].loanAmountInPaisa",
                            type: "amount"
                        },
                        {
                            key: "customer.liabilities[].installmentAmountInPaisa",
                            type: "amount"
                        },
                        {
                            key: "customer.liabilities[].startDate",
                            type:"date"
                        },
                        {
                            key:"customer.liabilities[].maturityDate",
                            type:"date"
                        },
                        {
                            key:"customer.liabilities[].frequencyOfInstallment",
                            type:"select"
                        },
                        {
                            key:"customer.liabilities[].liabilityLoanPurpose",
                            type:"select"
                        }

                    ]
                }
            ]
        },
        {
            "type": "box",
            "title": "T_HOUSE_VERIFICATION",
            "items": [
                {
                    "key": "customer.firstName",
                    "title": "CUSTOMER_NAME",
                    "readonly": true
                },
                {
                    key:"customer.nameInLocalLanguage"
                },
                {
                    key:"customer.addressInLocalLanguage",
                    type:"textarea"
                },

                {
                    key:"customer.religion",
                    type:"select"
                },
                {
                    key:"customer.caste",
                    type:"select"
                },
                {
                    key:"customer.language",
                    type:"select"
                },
                {
                    type:"fieldset",
                    title:"HOUSE_DETAILS",
                    items:[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf3",
                            type:"select"

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf2",
                            condition:"model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf4",

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf5",
                            type:"radios"

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf31",
                            "type":"select"
                            
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf32"

                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf6"
                        }
                    ]
                },
                {
                    "key": "customer.latitude",
                    "title": "HOUSE_LOCATION",
                    "type": "geotag",
                    "latitude": "customer.latitude",
                    "longitude": "customer.longitude",
                    "readonly": true
                },
                {
                    "key": "customer.nameOfRo",
                    "readonly": true
                },
                {
                    key:"customer.houseVerificationPhoto",
                    offline: true,
                    type:"file",
                    fileType:"image/*",
                    "viewParams": function(modelValue, form, model) {
                        return {
                            customerId: model.customer.id
                        };
                    },
                    "readonly": true
                },
                {
                    key: "customer.date",
                    type:"date",
                    "readonly": true
                },
                {
                    "key": "customer.place",
                    "readonly": true
                }
            ]
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                Utils.confirm("Update - Are You Sure?", "Customer Profile").then(function() {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('PROFILE', 'Working...');
                    model.enrollmentAction = "SAVE";
                    $log.info(model);
                    var reqData = _.cloneDeep(model);
                    Enrollment.updateEnrollment(reqData, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                    }, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Oops. Some error.', 2000);
                        window.scrollTo(0, 0);
                        PageHelper.showErrors(res);
                    })

                });
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("customer360.RequestRecapture"),
["$log", "$q", "Enrollment", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "irfProgressMessage", "PageHelper", "EnrollmentHelper",
function($log, $q, Enrollment, SessionStore, $state, entityManager, formHelper,
    $stateParams, irfProgressMessage, PageHelper, EnrollmentHelper){
    return {
        "type": "schema-form",
        "title": "REQUEST_RECAPTURE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var ids = $stateParams.pageId.split(':');
            this.subTitle = model.requestRecaptureType = this.form[0].title = ids[1];
            var customerId = Number(ids[0]);
            if (!model || !model.customer || model.customer.id != customerId) {
                $log.info("data not there, loading...");

                PageHelper.showLoader();
                Enrollment.getCustomerById({id:customerId},function(resp,header){
                    model.customer = resp;
                    model = EnrollmentHelper.fixData(model);
                    model._mode = 'EDIT';
                    if (model.customer.currentStage==='Stage01') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:customerId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                    }
                    PageHelper.hideLoader();
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data", 5000);
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                });
            }
            $log.info("I got initialized");
        },
        form: [{
            "type": "box",
            "title": "",
            "items": [
                {
                    key: "customer.firstName",
                    title: "FULL_NAME",
                    readonly: "true"
                },
                {
                    "key":"requestRemarks",
                    "title": "REQUEST_REMARKS",
                    "type": "textarea"
                }
            ]
        },{
            "type": "actionbox",
            // "condition": "model.requestRecaptureType === 'PHOTO'",
            "items": [{
                "type": "submit",
                "title": "REQUEST_RECAPTURE"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {
                $log.debug("REQUEST_TYPE: " + model.requestRecaptureType);
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("customer360.RecaptureQueue"),
	["$log", "formHelper", "Enrollment", "CreditBureau", "SessionStore", "$state", "entityManager",
	function($log, formHelper, Enrollment, CreditBureau, SessionStore, $state, entityManager){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "RECAPTURE_APPROVED_QUEUE",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branchName = branch;
			$log.info("RECAPTURE_APPROVED_QUEUE got initialized");
		},
		definition: {
			autoSearch: true,
			title: "RECAPTURE_APPROVED_QUEUE",
			pageName: "customer360.RecaptureQueue",
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){
				var promise = Enrollment.search({
					'branchName': searchOptions.branchName,
					'firstName': searchOptions.firstName,
					'centreCode': searchOptions.centreCode,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.firstName + " " + (item.lastName!=null?item.lastName:""),
						'Customer ID : ' + item.id,
						null
					]
				},
				getActions: function(){
					return [
						{
							name: "Capture CB check info",
							desc: "",
							fn: function(item, index) {
								$log.info(item.urnNo);
								entityManager.setModel('CBCheckCapture', {_request:item});
								$state.go("Page.Engine", {pageName:"CBCheckCapture", pageId:null});
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

irf.pageCollection.factory(irf.page("customer360.Recapture"),
["$log", "$q", "Enrollment", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "irfProgressMessage", "PageHelper", "EnrollmentHelper", "BiometricService", "Files",
function($log, $q, Enrollment, SessionStore, $state, entityManager, formHelper,
    $stateParams, irfProgressMessage, PageHelper, EnrollmentHelper, BiometricService, Files){

    var submit = function(model) {
        $log.debug("REQUEST_TYPE: " + model.recaptureType);
        PageHelper.showLoader();
        irfProgressMessage.pop('RECAPTURE', 'Working...');
        model.enrollmentAction = "SAVE";
        $log.info(model);
        var reqData = _.cloneDeep(model);
        Enrollment.updateEnrollment(reqData, function (res, headers) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('RECAPTURE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
            $state.go("Page.Customer360", {
                pageId: model.customer.id
            });
        }, function (res, headers) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('RECAPTURE', 'Oops. Some error.', 2000);
            $window.scrollTo(0, 0);
            PageHelper.showErrors(res);
        })
    };

    return {
        "type": "schema-form",
        "title": "RECAPTURE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var ids = $stateParams.pageId.split(':');
            this.subTitle = model.recaptureType = this.form[0].title = ids[1];
            var customerId = Number(ids[0]);
            if (!model || !model.customer || model.customer.id != customerId) {
                $log.info("data not there, redirecting...");

                irfProgressMessage.pop("RECAPTURE","An Error Occurred. Failed to fetch Data", 5000);
                $state.go("Page.Customer360",{
                    pageId:customerId
                });
            } else {
                if (model.recaptureType === 'FINGERPRINT') {
                    /* TODO to be removed */
                    model.isFPEnrolled = function(fingerId){
                        //$log.info("Inside isFPEnrolled: " + BiometricService.getFingerTF(fingerId) + " :"  + fingerId);
                        if (model.customer[BiometricService.getFingerTF(fingerId)]!=null || (typeof(model.customer.$fingerprint)!='undefined' && typeof(model.customer.$fingerprint[fingerId])!='undefined' && model.customer.$fingerprint[fingerId].data!=null )) {
                            //$log.info("Inside isFPEnrolled: :true");
                            return "fa-check text-success";
                        }
                        //$log.info("Inside isFPEnrolled: false");
                        return "fa-close text-danger";
                    }

                    model.getFingerLabel = function(fingerId){
                        return BiometricService.getLabel(fingerId);
                    }
                }
            }
            $log.info("I got initialized");
        },
        form: [{
            "type": "box",
            "title": "",
            "items": [
                {
                    "key": "customer.firstName",
                    "title": "FULL_NAME",
                    "readonly": "true"
                },
                {
                    "key": "customer.latitude",
                    "title": "HOUSE_LOCATION",
                    "type": "geotag",
                    "latitude": "customer.latitude",
                    "longitude": "customer.longitude",
                    "condition": "model.recaptureType === 'GPS'"
                },
                {
                    "key":"customer.photoImageId",
                    "type":"file",
                    "fileType":"image/*",
                    "offline": true,
                    "condition": "model.recaptureType === 'PHOTO'"
                },
                {
                    "condition": "model.recaptureType === 'FINGERPRINT'",
                    type: "button",
                    title: "CAPTURE_FINGERPRINT",
                    notitle: true,
                    fieldHtmlClass: "btn-block",
                    onClick: function(model, form, formName){
                        var promise = BiometricService.capture(model);
                        promise.then(function(data){
                            model.customer.rightHandIndexImageId = null;
                            model.customer.rightHandMiddleImageId = null;
                            model.customer.rightHandRingImageId = null;
                            model.customer.rightHandSmallImageId = null;
                            model.customer.rightHandThumpImageId = null;
                            model.customer.leftHandIndexImageId = null;
                            model.customer.leftHandMiddleImageId = null;
                            model.customer.leftHandRingImageId = null;
                            model.customer.leftHandSmallImageId = null;
                            model.customer.leftHandThumpImageId = null;

                            model.customer.$fingerprint = data;
                        }, function(reason){
                            console.log(reason);
                        })
                    }
                },
                {
                    "condition": "model.recaptureType === 'FINGERPRINT'",
                    "type": "section",
                    "html": '<div class="row"> <div class="col-xs-6">' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftThumb\')"></i> {{ model.getFingerLabel(\'LeftThumb\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftIndex\')"></i> {{ model.getFingerLabel(\'LeftIndex\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftMiddle\')"></i> {{ model.getFingerLabel(\'LeftMiddle\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftRing\')"></i> {{ model.getFingerLabel(\'LeftRing\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftLittle\')"></i> {{ model.getFingerLabel(\'LeftLittle\') }}</span><br>' +
                    '</div> <div class="col-xs-6">' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightThumb\')"></i> {{ model.getFingerLabel(\'RightThumb\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightIndex\')"></i> {{ model.getFingerLabel(\'RightIndex\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
                    '</div></div>'
                }
            ]
        },{
            "type": "actionbox",
            // "condition": "model.requestRecaptureType === 'PHOTO'",
            "items": [{
                "type": "submit",
                "title": "REQUEST_RECAPTURE"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {
                if (model.recaptureType === 'FINGERPRINT') {
                    PageHelper.showLoader();
                    var out = model.customer.$fingerprint;
                    var fpPromisesArr = [];
                    for (var key in out) {
                        if (out.hasOwnProperty(key) && out[key].data!=null) {
                            (function(obj){
                                var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                promise.then(function(data){
                                    model.customer[obj.table_field] = data.fileId;
                                    delete model.customer.$fingerprint[obj.fingerId];
                                });
                                fpPromisesArr.push(promise);
                            })(out[key]);
                        } else {
                            if (out[key].data == null){
                                delete out[key];
                            }
                        }
                    }
                    $q.all(fpPromisesArr).then(function(){
                        submit(model);
                    });
                } else {
                    submit(model);
                }
            }
        }
    };
}]);

irf.commons.factory('groupCommons', ["SessionStore","formHelper","Groups","Pages__CBCheckStatusQueue","Utils",
    "irfModalQueue","$log","PageHelper","irfSimpleModal","irfProgressMessage","Enrollment","LoanProcess","$q","$uibModal",
    function(SessionStore,formHelper,Groups,Pages__CBCheckStatusQueue,Utils,irfModalQueue,$log,PageHelper,irfSimpleModal,
             irfProgressMessage,Enrollment,LoanProcess,$q,$uibModal
    ){

        var branchId = ""+SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        /*Search Page Stuffs*/
        var defaultListOptions = {
            itemCallback: function(item, index) {
            },
            getItems: function(response, headers){
                if (response!=null && response.length && response.length!=0){
                    return response;
                }
                return [];
            },
            getListItem: function(item){
                return [

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [];
            }
        };
        var defaultPaginationOptions= {
            viewMode: "page",
            getItemsPerPage: function(response, headers){
                return 20;
            },
            getTotalItemsCount: function(response, headers){
                try {
                    return headers['x-total-count'];
                }catch(err){
                    return 0;
                }
            }
        };
        
        /*Group CRUD stuffs*/
        function showDscData(dscId){
            PageHelper.showLoader();
            Groups.getDSCData({dscId:dscId},function(resp,headers){
                PageHelper.hideLoader();
                var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";

                dataHtml += "<tr><td>Response : </td><td>"+resp.response+"</td></tr>";
                dataHtml+= "<tr><td>Response Message: </td><td>"+resp.responseMessage+"</td></tr>";
                dataHtml+= "<tr><td>Stop Response: </td><td>"+resp.stopResponse+"</td></tr>";
                dataHtml+="</table>"
                irfSimpleModal('DSC Check Details',dataHtml);
            },function(res){
                PageHelper.showErrors(res);
                PageHelper.hideLoader();
            });
        }
        
        return {
            /*Search Page Stuffs*/
            getDefaultPaginationOptions:function(){
                return defaultPaginationOptions;
            },
            getSearchDefinition:function(stage,listOptions,pageOptions){
                var defaultPartner = 'KGFS';
                var definition= {
                    title: "GROUPS_LIST",
                        searchForm: [
                        "*"
                    ],
                        searchSchema: {
                        "type": 'object',
                            "title": 'SearchOptions',
                            "properties": {
    
                                "partner": {
                                        "title": "PARTNER",
                                        "default":defaultPartner,
                                        "type": "string",
                                        "enumCode":"partner",
                                        "x-schema-form":{
                                        "type":"select"
                                    }
                                }

                        },
                        "required":["partner"]
                    },
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
    
                        var params = {
                            'branchId': branchId,
                            'partner':searchOptions.partner,
                            'groupStatus':true,
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        };
                        if(stage) {
                            params.currentStage = stage
                        }
    
                        var promise = Groups.search(params).$promise;
    
                        return promise;
                    },
                    paginationOptions: pageOptions || defaultPaginationOptions,
                    listOptions: listOptions || defaultListOptions
    
    
                };
    
                return definition;
    
    
            },
            getOfflineDisplayItem: function() {
               return  function (item, index) {
                    return [
                        'Partner : ' + item.partner,
                        'Record Count : ' + item._result.items.length
                    ]
                };
            },
            getOfflinePromise: function(stage){
                return function(searchOptions){      /* Should return the Promise */
                    var promise = Groups.search({
                        'branchId':branchId,
                        'partner':searchOptions.partner,
                        'currentStage':stage,
                        'page': 1,
                        'per_page': 100
                    }).$promise;
    
                    return promise;
                }
            },
            
            /*Group CRUD stuffs*/
            /*
            * modes available = CREATE,DSC_CHECK,VIEW,EDIT(not enabled),DELETE,APP_DWNLD
            * */

            getFormDefinition:function(mode){
                console.info("Generating form definition for "+mode);
                var readonly = true;
                if(mode=='CREATE' || mode=='EDIT'){
                    readonly = false;
                }

                var basicDefinition = [{
                    "key":"group",
                    "type": "box",
                    "title":"GROUP_DETAILS",
                    "items":[
                        {
                            "key":"group.groupName",
                            readonly:readonly
                        },
                        {
                            "key":"group.partnerCode",
                            "type":"select",
                            readonly:readonly
                        },
                        {
                            "key":"group.centreCode",
                            "type":"select",
                            readonly:readonly
                        },
                        {
                            "key":"group.productCode",
                            "type":"select",
                            readonly:readonly,
                            "filter": {
                                "parentCode as partner": "model.group.partnerCode",
                                "field2": "JLG"
                            }
                        },

                        {
                            "key":"group.frequency",
                            "type":"select",
                            readonly:readonly
                        },
                        {
                            "key":"group.tenure",
                            readonly:readonly
                        },
                        {
                            "key":"group.jlgGroupMembers",
                            "type":"array",
                            "title":"GROUP_MEMBERS",
                            "condition":"model.group.jlgGroupMembers.length>0",
                            "add":null,
                            "remove":null,
                            "items":[
                                {
                                    "key":"group.jlgGroupMembers[].urnNo",
                                    "readonly":true

                                },
                                {
                                    "key":"group.jlgGroupMembers[].firstName",
                                    "type":"string",
                                    "readonly":true,
                                    "title":"GROUP_MEMBER_NAME"
                                },
                                {
                                    "key":"group.jlgGroupMembers[].husbandOrFatherFirstName",
                                    "readonly":readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].relation",
                                    "readonly":readonly,
                                    "type":"select",
                                    "titleMap":{
                                        "Father":"Father",
                                        "Husband":"Husband"
                                    }
                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanAmount",
                                    "type":"amount",
                                    readonly:readonly

                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanPurpose1",
                                    "type":"select",
                                    onChange: function(modelValue, form, model) {
                                        $log.info(modelValue);
                                    },
                                    readonly:readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanPurpose2",
                                    "type":"select",
                                    "parentEnumCode": "loan_purpose_1",
                                    /*"filter": {
                                        "parentCode as loan_purpose_1": "model.jlgGroupMembers[arrayIndex].loanPurpose1"
                                    },*/
                                    readonly:readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanPurpose3",
                                    "type":"select",
                                    "parentEnumCode": "loan_purpose_2",
                                    /*"filter": {
                                        "parentCode as loan_purpose_2": "model.jlgGroupMembers[arrayIndex].loanPurpose2"
                                    },*/
                                    readonly:readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].witnessFirstName",
                                    "readonly":readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].witnessRelationship",
                                    "type":"select",
                                    "readonly":readonly
                                }

                            ]
                        }

                    ]
                }];

                if(mode=='VIEW') return basicDefinition;

                var retDefinition = _.clone(basicDefinition);

                if(mode=='CREATE' || mode=='EDIT'){
                    this.addCreateElements(retDefinition);
                }
                else if(mode=='DSC_CHECK'){
                    this.addDSCElements(retDefinition);
                }

                else if(mode=='DELETE'){
                    this.addDeleteElements(retDefinition);
                }
                else if(mode=='APP_DWNLD'){
                    this.addAppDwnldElements(retDefinition);
                }

                return retDefinition;

                
            },
            addCreateElements:function(retDefinition){
                retDefinition[0].items.push({
                    "type": "button",
                    "fieldHtmlClass":"btn-block",
                    "title": "SELECT_MEMBERS",

                    onClick: function(model, form, formName) {
                        var modalQueuedefinition = _.cloneDeep(Pages__CBCheckStatusQueue.definition);
                        modalQueuedefinition.title = "CREDIT_BUREAU_COMPLETED_CUSTOMERS";
                        var modelOutside = model;
                        modalQueuedefinition.initialize = function(model, form, formCtrl){
                            model.branchName = branchName;
                            model.centreCode = modelOutside.group.centreCode;
                        };
                        modalQueuedefinition.listOptions.getItems = function(response, headers){
                            if (response!=null && response.length && response.length!=0){
                                var ret = [];
                                angular.forEach(response,function(value,key){
                                    var isDuplicate = false;
                                    for(var i=0;i<ret.length;i++){
                                        if(ret[i].urnNo === value.urnNo){
                                            isDuplicate = true;
                                            break;
                                        }
                                    }
                                    if(value.urnNo!=null && !isDuplicate) ret.push(value);
                                });
                                console.warn(ret);
                                return ret;
                            }
                            return [];
                        };
                        modalQueuedefinition.listOptions.getListItem = function(item){
                            return [
                                item.firstName,
                                ':' + item.urnNo
                            ];
                        };
                        irfModalQueue.showModalQueue(modalQueuedefinition).then(function(items){
                            $log.info("on return callback of modal queue");
                            $log.info(items);

                            if(items.length>0)
                                PageHelper.showLoader();



                            model.group.jlgGroupMembers = [];
                            angular.forEach(items,function(value,key){
                                var fatherName = "";
                                var familyMembers = [];
                                Enrollment.getCustomerById({id:value.customerId},function(resp,head){

                                    fatherName = resp.fatherFirstName;
                                    familyMembers = resp.familyMembers;
                                },function(resp){}).$promise.finally(function(){

                                    var uname = value.firstName;
                                    try{
                                        if(value.middleName.length>0)
                                            uname+= " "+value.middleName;
                                    }catch(err){

                                    }
                                    try{
                                        if(value.lastName.length>0)
                                            uname+= " "+value.lastName;

                                    }catch(err){

                                    }
                                    model.group.jlgGroupMembers.push({
                                        urnNo:value.urnNo,
                                        firstName:uname,
                                        husbandOrFatherFirstName:fatherName,
                                        relation:"Father",
                                        _familyMembers:familyMembers


                                    });
                                    console.log(key);
                                    if(key >= (items.length-1)){
                                        PageHelper.hideLoader();
                                    }

                                });


                            });
                        });
                    }

                });
                retDefinition[0].items[6].items.push({
                    "type":"button",
                    "key":"group.jlgGroupMembers[].btnChooseWitness",
                    "fieldHtmlClass":"btn-block",
                    "title":"CHOOSE_FAMILY_MEMBER_AS_WITNESS",
                    "onClick":function(model,schemaForm,form,event){
                        //@TODO : Use an irf element for this, if possible
                        var familyMembers = model.group.jlgGroupMembers[form.arrayIndex]._familyMembers;
                        var  html="<div class='modal-header'><button type='button' class='close' ng-click='$close()' aria-label='Close'><span aria-hidden='true'>x</span></button>";
                        html+="<h4 class='modal-title'>Choose</h4></div>";
                        html+="<div class='modal-body'><table class='table table-striped table-bordered table-responsive'>";
                        html+="<th>Name</th><th>Relationship</th><th>Action</th>";
                        for(var i=0;i<familyMembers.length;i++){
                            if(familyMembers[i].relationShip =="Self" || familyMembers[i].relationShip =="self") continue;
                            var name = Utils.getFullName(familyMembers[i].familyMemberFirstName,
                                familyMembers[i].familyMemberMiddleName ,familyMembers[i].familyMemberLastName);
                            html += "<tr>";

                            html += "<td>";
                            html += name;
                            html += "</td>";

                            html += "<td>";
                            html += familyMembers[i].relationShip;
                            html += "</td>";

                            html += "<td>";
                            html += "<button ng-click='returnWitness(\""+name+"\",\""+familyMembers[i].relationShip+"\")' class='btn btn-theme'>Select</button>";
                            html += "</td>";

                            html += "</tr>";
                        }
                        html +="</table></div>";
                        html+="<div class='modal-footer'>";
                        html+="<button type='button' class='btn btn-default pull-left' ng-click='$close()'>Close</button>";
                        html+="</div>";
                        var chooseWin = $uibModal.open({
                            template:html,
                            controller:["$scope",function($scope){
                                $scope.returnWitness = function(name,relationship){
                                    model.group.jlgGroupMembers[form.arrayIndex].witnessFirstName = name;
                                    model.group.jlgGroupMembers[form.arrayIndex].witnessRelationship = relationship;
                                    $scope.$close();
                                }
                            }]
                        });
                        console.warn(chooseWin);

                    }
                });
                retDefinition.push({
                    "type":"actionbox",
                    "items":[
                        {
                            "type":"submit",
                            "style":"btn-primary",
                            "title":"CREATE_GROUP"

                        }
                    ]
                });
            },
            addDSCElements:function(retDefinition){
                retDefinition[0].items[6].items.push({
                        "key":"group.jlgGroupMembers[].dscStatus",
                        "readonly":true,
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus"
                    },
                    {
                        "key":"group.jlgGroupMembers[].requestDSCOverride",
                        "type":"button",
                        "title":"REQUEST_DSC_OVERRIDE",
                        "icon":"fa fa-reply",
                        "onClick":function(model, formCtrl, form, event) {
                            console.log(form);
                            console.warn(event);
                            var i = event['arrayIndex'];

                            PageHelper.clearErrors();
                            var urnNo = model.group.jlgGroupMembers[i].urnNo;
                            PageHelper.showLoader();
                            $log.info("Requesting DSC override for ",urnNo);
                            irfProgressMessage.pop('group-dsc-override-req', 'Requesting DSC Override');
                            Groups.post({
                                service:"dscoverriderequest",
                                urnNo:urnNo,
                                groupCode:model.group.groupCode,
                                productCode:model.group.productCode
                            },{
                            },function(resp,header){
                                $log.warn(resp);
                                irfProgressMessage.pop('group-dsc-override-req', 'Almost Done...');
                                var screenMode = model.group.screenMode;
                                Groups.getGroup({groupId:model.group.id},function(response,headersGetter){
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop('group-dsc-override-req', 'DSC Override Requested',2000);
                                    model.group = _.cloneDeep(response);
                                    model.group.screenMode = screenMode;
                                    fixData(model);
                                },function(resp){
                                    $log.error(resp);
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("group-dsc-override-req","Oops. An error occurred",2000);
                                    PageHelper.showErrors(resp);
                                    fixData(model);
                                });

                            },function(resp,header){
                                $log.error(resp);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-dsc-override-req","Oops. An error occurred",2000);
                                PageHelper.showErrors(resp);
                            });
                        },
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'"
                    },
                    {
                        "key":"group.jlgGroupMembers[].getDSCData",
                        "type":"button",
                        "title":"VIEW_DSC_RESPONSE",
                        "icon":"fa fa-eye",
                        "style": "btn-primary",
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                        "onClick":function(model, formCtrl, form, event){
                            console.log(form);
                            console.warn(event);
                            var i = event['arrayIndex'];
                            console.warn("dscid :"+model.group.jlgGroupMembers[i].dscId);
                            var dscId = model.group.jlgGroupMembers[i].dscId;
                            showDscData(dscId);
                        }
                    },
                    {
                        "key":"group.jlgGroupMembers[].removeMember",
                        "type":"button",
                        "title":"REMOVE_MEMBER",
                        "icon":"fa fa-times",
                        "onClick":function(model, formCtrl, form, event) {
                            console.log(form);
                            console.warn(event);
                            var i = event['arrayIndex'];
                            var urnNo = model.group.jlgGroupMembers[i].urnNo;
                            $log.warn("Remove member from grp ",urnNo);
                            if(window.confirm("Are you sure?")){
                                PageHelper.showLoader();
                                PageHelper.clearErrors();
                                irfProgressMessage.pop('group-dsc-remove-req', 'Removing Group Member...');
                                Groups.get({
                                        service:"process",
                                        action:"removeMember",
                                        groupCode:model.group.groupCode,
                                        urnNo:urnNo

                                    },
                                    function(resp,headers){
                                        var screenMode = model.group.screenMode;
                                        Groups.getGroup({groupId:model.group.id},function(response,headersGetter){
                                            irfProgressMessage.pop('group-dsc-remove-req', 'Group Member Removed',2000);
                                            model.group = _.cloneDeep(response);
                                            model.group.screenMode = screenMode;
                                            fixData(model);
                                            PageHelper.hideLoader();

                                        },function(resp){
                                            $log.error(resp);
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop("group-dsc-remove-req","Oops. An error occurred",2000);
                                            fixData(model);
                                        });
                                    },
                                    function(resp){
                                        $log.error(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("group-dsc-remove-req","Oops. An error occurred",2000);
                                        PageHelper.showErrors(resp);
                                        fixData(model);
                                    });
                            }
                        },
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'"
                    });
                retDefinition.push({
                    "type":"actionbox",
                    "items":[
                        {
                            "style":"btn-primary",
                            "title":"PERFORM_DSC_CHECK",
                            "type":"button",
                            "onClick":"actions.doDSCCheck(model,form)"

                        }
                    ]

                });
            },
            addDeleteElements:function(retDefinition){
                retDefinition.push({
                    "type":"actionbox",
                    "items":[
                        {
                            "type":"button",
                            "style":"btn-theme",
                            "title":"CLOSE_GROUP",
                            "icon":"fa fa-times",
                            "onClick":"actions.closeGroup(model,form)"

                        }
                    ]
                });
            },
            addAppDwnldElements:function(retDefinition){

                retDefinition.push({
                        "type":"actionbox",
                        "condition":"!model._isGroupLoanAccountActivated",
                        "items":[
                            {
                                "type":"button",
                                "icon": "fa fa-check-square",
                                "title":"ACTIVATE_LOAN_ACCOUNT",
                                "onClick":"actions.activateLoanAccount(model,form)",

                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "condition":"model._isGroupLoanAccountActivated",
                        "items":[
                            {
                                "type":"button",
                                "icon": "fa fa-download",
                                "title":"DOWNLOAD_APPLICATION",
                                "onClick":"actions.downloadApplication(model,form)",

                            },
                            {
                                "type":"button",
                                "icon": "fa fa-arrow-right",
                                "title":"PROCEED_TO_DISBURSEMENT",
                                "onClick":"actions.proceedAction(model,form)"

                            }
                        ]
                    });

            },

            /*
            * Common Functionalities
            * */

            showDSCData: function(dscId){
                showDscData(dscId);
            },
            checkGroupLoanActivated: function(model){
                //@TODO: check if model data is valid

                var deferred = $q.defer();
                try {
                    model._isGroupLoanAccountActivated = false;
                    LoanProcess.query({
                        action: 'groupdisbursement',
                        param1: model.group.partnerCode,
                        param2: model.group.groupCode
                    }, function (resp, headers) {
                        $log.info("checkGroupLoanActivated", resp.length);
                        try {
                            if (resp.length > 0) {
                                //for application download endpoint (1st accountId is the param)
                                model._loanAccountId = resp[0].accountId;
                                model._isGroupLoanAccountActivated = true;
                                deferred.resolve(true);

                            }

                        } catch (err) {

                        }

                        deferred.resolve(false);

                    }, function (resp) {
                        deferred.resolve(false);
                    });
                }
                catch(err){
                    deferred.resolve(false);
                }
                return deferred.promise;
            }
    
        }
}]);
irf.pageCollection.factory("Pages__GroupCRUD",
    ["$log","$q",'Enrollment', 'Groups','CreditBureau','LoanProducts','formHelper','PageHelper','$state',
    '$stateParams','irfProgressMessage', "irfModalQueue","SessionStore","Utils",
        "groupCommons","LoanProcess",
    function($log, $q, Enrollment, Groups, CreditBureau, LoanProducts, formHelper, PageHelper, $state,
        $stateParams, irfProgressMessage, irfModalQueue,SessionStore,Utils,groupCommons,LoanProcess) {
        var branch = SessionStore.getBranch();


        var fixData = function(model){
            //fixData from server for Display
            switch(model.group.frequency){
                case 'M': model.group.frequency="Monthly"; break;
                case 'Q': model.group.frequency="Quarterly"; break;
                case 'A': model.group.frequency="Annually"; break;
                case 'D': model.group.frequency="Daily"; break;
                case 'W': model.group.frequency="Weekly"; break;
                case 'F': model.group.frequency="Fortnightly"; break;
                case 'H': model.group.frequency="Half Yearly"; break;
                case 'B': model.group.frequency="Bullet"; break;
            }
            model.group.tenure = parseInt(model.group.tenure);
            //return model;
        };

        var fillNames = function(model){

            var deferred = $q.defer();

            angular.forEach(model.group.jlgGroupMembers,function(member,key){
                Enrollment.get({id:member.customerId},function(resp,headers){
                    model.group.jlgGroupMembers[key].firstName = resp.firstName;
                    try {
                        if (resp.middleName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.middleName;
                        if (resp.lastName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.lastName;
                    }catch(err){

                    }
                    if(key>=model.group.jlgGroupMembers.length-1){
                        deferred.resolve(model);
                    }

                },function(res){
                    deferred.reject(res);
                });
            });
            return deferred.promise;
        };

        var saveData = function(reqData){

            PageHelper.showLoader();
            irfProgressMessage.pop('group-save', 'Working...');

            var deferred = $q.defer();

            if(reqData.group.id){
                deferred.reject(true);
                $log.info("Group id not null, skipping save");

            }
            else {
                reqData.enrollmentAction = 'SAVE';
                reqData.group.groupFormationDate = Utils.getCurrentDate();
                delete reqData.group.screenMode;
                reqData.group.frequency = reqData.group.frequency[0];

                /*for(var i=0; i<reqData.group.jlgGroupMembers.length; i++){
                    reqData.group.jlgGroupMembers[i].loanPurpose2 = reqData.group.jlgGroupMembers[i].loanPurpose1;
                    reqData.group.jlgGroupMembers[i].loanPurpose3 = reqData.group.jlgGroupMembers[i].loanPurpose1;
                }*/

                PageHelper.clearErrors();
                Utils.removeNulls(reqData,true);
                Groups.post(reqData, function (res) {

                    irfProgressMessage.pop('group-save', 'Done.',5000);
                    deferred.resolve(res);

                }, function (res) {
                    PageHelper.hideLoader();
                    PageHelper.showErrors(res);
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    deferred.reject(false);

                });
            }
            return deferred.promise;

        };

        var proceedData = function(res){



            var deferred = $q.defer();
            if(res.group.id===undefined || res.group.id===null){
                $log.info("Group id null, cannot proceed");
                deferred.reject(null);
            }
            else {
                PageHelper.showLoader();
                irfProgressMessage.pop('group-save', 'Working...');
                res.enrollmentAction = "PROCEED";
                try {
                    delete res.group.screenMode;
                }catch(err){

                }
                res.group.frequency = res.group.frequency[0];

                /*for(var i=0; i<res.group.jlgGroupMembers.length; i++){
                    res.group.jlgGroupMembers[i].loanPurpose2 = res.group.jlgGroupMembers[i].loanPurpose1;
                    res.group.jlgGroupMembers[i].loanPurpose3 = res.group.jlgGroupMembers[i].loanPurpose1;
                }*/

                Utils.removeNulls(res,true);
                Groups.update(res, function (res, headers) {
                    $log.info(res);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Done. Group ID: ' + res.group.id, 5000);
                    deferred.resolve(res);



                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(null);
                });
            }
            return deferred.promise;

        };
        var backToDashboard = function(){
            $state.go('Page.GroupDashboard',{
                pageName:"GroupDashboard",
                pageId:null,
                pageData:null
            });
        };
        return {
		"id": "GroupsCRUD",
		"type": "schema-form",
		"name": "GroupCRUD",
		"title": "",
		"subTitle": "",
		"uri": "Groups/Group Details",


		initialize: function (model, form, formCtrl) {
            $log.info($stateParams);
            var screenMode = 'CREATE';
            try {
                if ($stateParams.pageId !== null) {
                    if ($stateParams.pageData.intent !== undefined) {
                        screenMode = $stateParams.pageData.intent;
                    }
                }
            }catch(err){
                $log.error(err);
                backToDashboard();
            }
            this.form = groupCommons.getFormDefinition(screenMode);
			$log.info("Group got initialized");
			model.group = {};
            model.group.jlgGroupMembers = [];
            model.branchName = branch;
            if(screenMode!='CREATE'){
                //Except for create, all modes require to load group data.
                //This code block can be moved to commons in future version
                var groupId = $stateParams.pageId;
                PageHelper.showLoader();
                irfProgressMessage.pop("group-init","Loading, Please Wait...");
                Groups.getGroup({groupId:groupId},function(response,headersGetter){
                    model.group = _.cloneDeep(response);

                    fixData(model);

                   if(model.group.jlgGroupMembers.length>0) {
                       fillNames(model).then(function (m) {
                           model = m;
                           if(screenMode=='APP_DWNLD'){
                               groupCommons.checkGroupLoanActivated(model).then(function(res){
                                   PageHelper.hideLoader();
                                   irfProgressMessage.pop("group-init", "Load Complete.", 2000);
                               },function(res){
                                   PageHelper.hideLoader();
                                   irfProgressMessage.pop("group-init", "Load Complete.", 2000);
                               });
                           }
                           else {
                               PageHelper.hideLoader();
                               irfProgressMessage.pop("group-init", "Load Complete.", 2000);
                           }
                       }, function (m) {
                           PageHelper.showErrors(m);
                           PageHelper.hideLoader();
                           irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                       });
                   }
                    else {
                       PageHelper.hideLoader();
                       irfProgressMessage.pop("group-init", "Load Complete. No Group Members Found", 2000);
                       backToDashboard();
                   }
                },function(resp){

                    PageHelper.hideLoader();
                    irfProgressMessage.pop("group-init","Oops. An error occurred",2000);
                    backToDashboard();
                });
            }

		},
		form: [],
		actions:{

            doDSCCheck:function(model,form){
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('group-dsc-check', 'Performing DSC Check');
                Groups.dscQuery(
                    {
                        groupCode:model.group.groupCode,
                        partnerCode:model.group.partnerCode
                    },
                    {},
                    function(resp){
                        $log.warn(resp);
                        irfProgressMessage.pop('group-dsc-check', 'Almost Done...');
                        var screenMode = model.group.screenMode;
                        Groups.getGroup({groupId:model.group.id},function(response,headersGetter){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('group-dsc-check', 'DSC Check Complete',2000);
                            model.group = _.cloneDeep(response);
                            model.group.screenMode = screenMode;
                            fixData(model);


                            fillNames(model).then(function(m){
                                model = m;
                                PageHelper.hideLoader();

                            },function(m){
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-dsc-check","Oops. An error occurred",2000);
                            });

                            var dscFailedStatuses = ['DSC_OVERRIDE_REQUIRED','DSC_OVERRIDE_REQUESTED'];
                            var allOk = true;
                            var failedMsg = Array();
                            angular.forEach(model.group.jlgGroupMembers,function(member){
                                if(dscFailedStatuses.indexOf(member.dscStatus)>=0){
                                    $log.warn("DSC Failed for",member);
                                    allOk = false;
                                    return;
                                }

                            });
                            $log.info("DSC Check Status :"+allOk);
                            if(allOk===true){
                                if(window.confirm("DSC Check Succeeded for the Group. Proceed to next stage?")){
                                    model.enrollmentAction = 'PROCEED';
                                    PageHelper.showLoader();
                                    irfProgressMessage.pop('dsc-proceed', 'Working...');
                                    PageHelper.clearErrors();
                                    var reqData = _.cloneDeep(model);
                                    delete reqData.screenMode;
                                    reqData.group.frequency = reqData.group.frequency[0];
                                    Groups.update(reqData,function(res){
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop('dsc-proceed', 'Operation Succeeded. Proceeded to CGT 1.', 5000);
                                        backToDashboard();

                                    },function(res){
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop('dsc-proceed', 'Oops. Some error.', 2000);
                                        PageHelper.showErrors(res);

                                    });
                                }
                            }
                            else{
                                var errors = Array();
                                PageHelper.hideLoader();
                                errors.push({message:"DSC Check Failed for some member(s). Please Take required action"});
                                PageHelper.setErrors(errors);
                            }

                        },function(resp){
                            $log.error(resp);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop("group-dsc-check","Oops. An error occurred",2000);

                        });

                    },function(resp){
                        PageHelper.showErrors(resp);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('group-dsc-check', 'Oops... An error occurred. Please try again',2000);
                    });
            },
			submit: function(model, form, formName) {
                if (form.$invalid){
                    irfProgressMessage.pop('group-submit', 'Please fix your form', 5000);
                    return;
                }


				$log.info(model);
                var screenMode = model.group.screenMode;
                var reqData = _.cloneDeep(model);
                saveData(reqData).then(function(res){
                    model.group = _.clone(res.group);
                    reqData = _.cloneDeep(model);
                    fixData(model);
                    model.group.screenMode = screenMode;
                    proceedData(reqData).then(function(res){
                        backToDashboard();
                    });
                },function(doProceed){
                    if(doProceed===true) {
                        proceedData(reqData).then(function (res) {
                            backToDashboard();
                        });
                    }
                    else{
                        fixData(model);
                        model.group.screenMode = screenMode;
                    }
                });

			},
            closeGroup:function(model,form){
                if(window.confirm("Close Group - Are you sure?")){
                    var remarks = window.prompt("Enter Remarks","Test Remarks");
                    if(remarks) {
                        PageHelper.showLoader();
                        irfProgressMessage.pop('close-group', "Working...");
                        Groups.update({service: "close"}, {
                            "groupId": model.group.id,
                            "remarks": remarks
                        }, function (resp, header) {

                            PageHelper.hideLoader();
                            irfProgressMessage.pop('close-group', "Done", 5000);
                            backToDashboard();

                        }, function (res) {
                            $log.error(res);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('close-group', "Oops. An Error Occurred, Please try Again", 5000);
                            PageHelper.showErrors(res);
                            

                        });
                    }
                }
            },

            proceedAction:function(model,form){

                if(window.confirm("Proceed to Next Stage?")){
                    var reqData = _.cloneDeep(model);
                    proceedData(reqData).then(function (res) {
                        backToDashboard();
                    },function(res){
                    });
                }

            },
            downloadApplication:function(model,form){
                PageHelper.showLoader();
                groupCommons.checkGroupLoanActivated(model).then(function(isActivated){
                    PageHelper.hideLoader();
                    if(isActivated){
                        try {
                            var url = irf.FORM_DOWNLOAD_URL+'?form_name=app_loan&record_id=' +  model._loanAccountId;
                            try {
                                cordova.InAppBrowser.open(url, '_system', 'location=yes');
                            } catch (err) {
                                window.open(url, '_blank', 'location=yes');
                            }
                        }catch(err){
                            irfProgressMessage.pop('ap-download', 'An Error Occur during download. Please Try Again',2000);
                        }

                    }
                    else{
                        irfProgressMessage.pop('ap-download', 'An Error Occur during download. Please Try Again',2000);
                    }
                },function(res){
                    PageHelper.hideLoader();
                });


            },
            activateLoanAccount: function (model, form) {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('ap-activate', 'Activating loan account');
                LoanProcess.get({action:'groupLoans',groupCode:model.group.groupCode,partner:model.group.partnerCode},function(resp,header){

                    groupCommons.checkGroupLoanActivated(model).then(function(isActivated){
                        PageHelper.hideLoader();
                        if(isActivated){

                            irfProgressMessage.pop('ap-activate', 'Loan Account Activated',5000);
                        }
                        else{
                            irfProgressMessage.pop('ap-activate', 'An error occurred while activating loan account',2000);
                        }
                    });



                },function(res){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('ap-activate', 'An error occurred while activating loan account',2000);
                    PageHelper.showErrors(res);
                });
            }

		},
		schema: function() {
			return Groups.getSchema().$promise;
		}
	}
}]);

irf.pageCollection.factory("Pages__Cgt1Queue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons){

        var listOptions = {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Cgt1', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Cgt1",
                    pageId:null
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

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){

                return [

                ];
            }
        };

        var definition = groupCommons.getSearchDefinition('Stage04',listOptions);

        return {
        "id": "cgt1queue",
        "type": "search-list",
        "name": "Cgt1Queue",
        "title": "CGT 1 Queue",
        "subTitle": "",
        "uri":"Groups/CGT 1 Queue",
        offline: true,
        getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
        getOfflinePromise: groupCommons.getOfflinePromise('Stage04'),
        initialize: function (model, form, formCtrl) {
            $log.info("CGT 1 Q got initialized");
        },
        definition: definition
    };
}]);

irf.pageCollection.factory("Pages__Cgt2Queue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons){

        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Cgt2', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Cgt2",
                    pageId:null
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

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [

                ];
            }
        };
        var definition = groupCommons.getSearchDefinition('Stage05',listOptions);

        return {
            "id": "cgt2queue",
            "type": "search-list",
            "name": "Cgt2Queue",
            "title": "CGT 2 Queue",
            "subTitle": "",
            "uri":"Groups/CGT 2 Queue",
            offline: true,
            getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
            getOfflinePromise: groupCommons.getOfflinePromise('Stage05'),
            initialize: function (model, form, formCtrl) {
                $log.info("CGT 2 Q got initialized");
            },
            definition: definition
        };
    }]);

irf.pageCollection.factory("Pages__Cgt3Queue", ["$log", "formHelper", "Groups","$state",
    "entityManager","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Cgt3', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Cgt3",
                    pageId:null
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

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [

                ];
            }
        };
        var definition = groupCommons.getSearchDefinition('Stage06',listOptions);
        return {
            "id": "cgt3queue",
            "type": "search-list",
            "name": "Cgt3Queue",
            "title": "CGT 3 Queue",
            "subTitle": "",
            "uri":"Groups/CGT 3 Queue",
            offline: true,
            getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
            getOfflinePromise: groupCommons.getOfflinePromise('Stage06'),
            initialize: function (model, form, formCtrl) {
                $log.info("CGT 3 Q got initialized");
            },
            definition: definition
        };
    }]);

irf.pageCollection.factory("Pages__GrtQueue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Grt', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Grt",
                    pageId:null
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

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [

                ];
            }
        };
        var definition = groupCommons.getSearchDefinition('Stage07',listOptions);
        return {
            "id": "grtqueue",
            "type": "search-list",
            "name": "GrtQueue",
            "title": "GRT Queue",
            "subTitle": "",
            "uri":"Groups/GRT Queue",
            offline: true,
            getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
            getOfflinePromise: groupCommons.getOfflinePromise('Stage07'),
            initialize: function (model, form, formCtrl) {
                $log.info("GRT Q got initialized");
            },
            definition: definition
        };
    }]);

irf.pageCollection.factory("Pages__DscQueue", ["$log", "formHelper", "Groups","$state","groupCommons",
    function($log, formHelper, Groups,$state,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupCRUD",
                    pageId:item.id,
                    pageData:{
                        intent:"DSC_CHECK"
                    }
                },{
                    reload: true, 
                    inherit: false,
                    notify: true
                });
            },
            getItems: function(response, headers){
                $log.error(response);
                if (response!=null && response.length && response.length!=0){
                    return response;
                }
                return [];
            },
            getListItem: function(item){
                return [
                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [

                ];
            }
        };
        var definition = groupCommons.getSearchDefinition('Stage03',listOptions);
        return {
        "id": "cgt1queue",
        "type": "search-list",
        "name": "DscQueue",
        "title": "DSC Queue",
        "subTitle": "",
        "uri":"Groups/DSC Queue",
        initialize: function (model, form, formCtrl) {
            $log.info("DSC Q got initialized");
        },
        definition: definition
    };
}]);

irf.pageCollection.factory("Pages__DscOverrideQueue", ["$log", "formHelper","PageHelper", "Groups","$state","irfProgressMessage",
    "groupCommons",
    function($log, formHelper,PageHelper,Groups,$state,irfProgressMessage,groupCommons){
    return {
        "id": "dscoverridequeue",
        "type": "search-list",
        "name": "DscOverrideQueue",
        "title": "DSC Override Requests",
        "subTitle": "",
        "uri":"Groups/DSC Override Requests",
        initialize: function (model, form, formCtrl) {
            $log.info("DSC Override got initialized");
        },
        definition: {
            title: "GROUPS_LIST",
            
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Groups.getDscOverrideList({

                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    try {
                        return headers['x-total-count'];
                    }catch(err){
                        return 0;
                    }
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    // This will not be called in case of selectable = true in definition
                    $log.info(item);
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [

                        'URN : ' + item.jlgGroupMember.urnNo,
                        'Group ID : '+item.jlgGroup.id,
                        'Group Name : '+item.jlgGroup.groupName,
                        null
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Do DSC Override",
                            desc: "",
                            fn: function(item, index){
                                PageHelper.showLoader();
                                irfProgressMessage.pop("dsc-override","Performing DSC Override");
                                var remarks = window.prompt("Enter Remarks","Test Remark");
                                if(remarks) {
                                    Groups.post({
                                        service: "overridedsc",
                                        urnNo: item.jlgGroupMember.urnNo,
                                        groupCode: item.jlgGroup.groupCode,
                                        productCode: item.jlgGroup.productCode,
                                        remarks: remarks
                                    }, {}, function (resp, headers) {
                                        $log.info(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("dsc-override", "Override Succeeded", 2000);
                                        $state.go('Page.Engine', {
                                            pageName: "DscOverrideQueue"
                                        }, {
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });

                                    }, function (resp) {
                                        $log.error(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("dsc-override", "An error occurred. Please Try Again", 2000);
                                        PageHelper.showErrors(resp);
                                    });
                                }


                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //	return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "View DSC Response",
                            desc: "",
                            fn: function(item, index){

                                groupCommons.showDSCData(item.jlgGroupMember.dscId);

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

/*
* @TODO : 1 CGT page for all CGTs, with CGT# as param
* */
irf.pageCollection.factory("Pages__Cgt1", ["$log","authService","entityManager","Groups","$state","$stateParams",
    "PageHelper","irfProgressMessage",'Utils',
    function($log,authService,entityManager,Groups,$state,$stateParams,PageHelper,irfProgressMessage,Utils) {
    return {
        "id": "cgt1",
        "type": "schema-form",
        "name": "Cgt1",
        "title": "CGT_1",
        "subTitle": "",
        "uri": "Groups/CGT 1",
        "offline":true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Group ID : "+item.group.id,
                "Group Code : "+item.group.groupCode,
                "CGT Date : "+ item.group.cgtDate1
            ]
        },
        initialize: function (model, form, formCtrl) {
            $log.info(model);
            if(model._request==undefined || model._request==null){
                $state.go("Page.Engine", {pageName:"Cgt1Queue", pageId:null});
                return;
            }
            PageHelper.showLoader();
            irfProgressMessage.pop("cgt1-init","Loading... Please Wait...");
            model.group= model.group || {};


            model.group.cgtDate1 = model.group.cgtDate1 || Utils.getCurrentDate();
            model.group.id = model.group.id || model._request.id;
            model.group.groupCode = model.group.groupCode || model._request.groupCode;
            model.group.partnerCode = model.group.groupCode || model._request.partnerCode;
            model.group.productCode = model.group.productCode|| model._request.productCode;

            authService.getUser().then(function(data){
                model.group.cgt1DoneBy = data.login;
                PageHelper.hideLoader();
                $log.info("AfterLoad",model);
                irfProgressMessage.pop("cgt1-init","Load Complete",2000);
            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("cgt1-init","Oops, an error occurred",2000);
            });

            /*var groupId = $stateParams.pageId;
            Groups.getGroup({groupId:groupId},function(response,headersGetter){
                $log.info(response);

                model.group = _.cloneDeep(response);
                var date = new Date();
                var y = date.getFullYear();
                var m = (date.getMonth()+1);
                var d = date.getDate();
                m = (m.toString().length<2)?("0"+m):m;
                d = (d.toString().length<2)?("0"+d):d;

                model.group.cgtDate1 = y+"-"+m+"-"+d;

                var prom = authService.getUser().then(function(data){
                    model.group.cgt1DoneBy = data.login;
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt1-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt1-init","Oops, an error occurred",2000);
                });


            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("cgt1-init","Oops, an error occurred",2000);

            });*/
        },
        form: [
            {
                "type":"box",
                "title":"CGT_1",
                "items":[
                    {
                        "key":"group.cgt1DoneBy",
                        "readonly":true
                    },
                    {
                        "key":"group.cgtDate1",
                        "type":"text",
                        "readonly":true

                    },
                    {
                        "key":"group.cgt1Latitude",
                        "title": "CGT_1_LOCATION",
                        "type":"geotag",
                        "latitude": "group.cgt1Latitude",
                        "longitude": "group.cgt1Longitude"
                    },
                    {
                        "key":"group.cgt1Photo",
                        "type":"file",
                        "fileType":"image/*",
                        "offline":true

                    },
                    {
                        "key":"group.cgt1Remarks",
                        "type":"textarea"
                    }

                ]
            },{
                "type":"actionbox",
                "items":[
                    {
                        "type": "save",
                        "title": "SAVE_OFFLINE",
                    },
                    {
                        "type":"submit",
                        "style":"btn-primary",
                        "title":"SUBMIT_CGT_1"
                    }
                ]
            }
        ],
        actions: {
            submit: function (model, form, formName) {

                model.enrollmentAction = 'PROCEED';
                if (form.$invalid){
                    irfProgressMessage.pop('cgt1-submit', 'Please fix your form', 5000);
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop('cgt1-submit', 'Working...');
                PageHelper.clearErrors();
                //var reqData = _.cloneDeep(model);
                var reqData = {
                    "cgtDate": model.group.cgtDate1,
                    "cgtDoneBy": model.group.cgt1DoneBy,
                    "groupCode": model.group.groupCode,
                    "latitude": model.group.cgt1Latitude,
                    "longitude": model.group.cgt1Longitude,
                    "partnerCode": model.group.partnerCode,
                    "photoId": model.group.cgt1Photo,
                    "productCode": model.group.productCode,
                    "remarks": model.group.cgt1Remarks

                };
                var promise = Groups.post({service:'process',action:'cgt'},reqData,function(res){
                    console.debug(res);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cgt1-submit', 'CGT 1 Updated. Proceed to CGT 2', 5000);
                    $state.go('Page.GroupDashboard',{
                        pageName:"GroupDashboard"
                    });

                },function(res){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cgt1-submit', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);

                });
            }
        },
        schema: function () {
            return Groups.getSchema().$promise;
        }
    }
}]);

irf.pageCollection.factory("Pages__Cgt2", ["$log","authService","Groups","$state","$stateParams","PageHelper",
    "irfProgressMessage",'Utils',
    function($log,authService,Groups,$state,$stateParams,PageHelper,irfProgressMessage,Utils) {
        return {
            "id": "cgt2",
            "type": "schema-form",
            "name": "Cgt2",
            "title": "CGT 2",
            "subTitle": "",
            "uri": "Groups/CGT 2",
            "offline":true,
            getOfflineDisplayItem: function(item, index){
                return [
                    "Group ID : "+item.group.id,
                    "Group Code : "+item.group.groupCode,
                    "CGT Date : "+ item.group.cgtDate2
                ]
            },
            initialize: function (model, form, formCtrl) {
                if(model._request==undefined || model._request==null){
                    $state.go("Page.Engine", {pageName:"Cgt2Queue", pageId:null});
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop("cgt2-init","Loading... Please Wait...");
                model.group= model.group || {};


                model.group.cgtDate2 = model.group.cgtDate2 || Utils.getCurrentDate();
                model.group.id = model.group.id || model._request.id;
                model.group.groupCode = model.group.groupCode || model._request.groupCode;
                model.group.partnerCode = model.group.groupCode || model._request.partnerCode;
                model.group.productCode = model.group.productCode|| model._request.productCode;

                var prom = authService.getUser().then(function(data){
                    model.group.cgt2DoneBy = data.login;
                    PageHelper.hideLoader();
                    $log.info("AfterLoad",model);
                    irfProgressMessage.pop("cgt2-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt2-init","Oops, an error occurred",2000);
                });
                /*var groupId = $stateParams.pageId;
                Groups.getGroup({groupId:groupId},function(response,headersGetter){
                    console.warn(response);
                    /*model.group = {
                     id:response.id,
                     groupCode:response.groupCode,
                     partnerCode:response.partnerCode,
                     productCode:response.productCode

                     };
                    model.group = _.cloneDeep(response);
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = (date.getMonth()+2);
                    var d = date.getDate();
                    m = (m.toString().length<2)?("0"+m):m;
                    d = (d.toString().length<2)?("0"+d):d;

                    model.group.cgtDate2 = y+"-"+m+"-"+d;

                    var prom = authService.getUser().then(function(data){
                        PageHelper.hideLoader();
                        model.group.cgt2DoneBy = data.login;
                        irfProgressMessage.pop("cgt2-init","Load Completed.",2000);
                    },function(resp){
                        PageHelper.hideLoader();
                        $log.error(resp);
                        irfProgressMessage.pop("cgt2-init","Oops, an error occurred",2000);
                    });


                },function(resp){
                    PageHelper.hideLoader();
                    $log.error(resp);
                    irfProgressMessage.pop("cgt2-init","Oops, an error occurred",2000);

                });*/
            },
            form: [
                {
                    "type":"box",
                    "title":"CGT_2",
                    "items":[
                        {
                            "key":"group.cgt2DoneBy",
                            "readonly":true
                        },
                        {
                            "key":"group.cgtDate2",
                            "type":"text",
                            "readonly":true

                        },
                        {
                            "key":"group.cgt2Latitude",
                            "title": "CGT_2_LOCATION",
                            "type":"geotag",
                            "latitude": "group.cgt2Latitude",
                            "longitude": "group.cgt2Longitude"
                        },
                        {
                            "key":"group.cgt2Photo",
                            "type":"file",
                            "fileType":"image/*",
                            "offline":true

                        },
                        {
                            "key":"group.cgt2Remarks",
                            "type":"textarea"
                        }

                    ]
                },{
                    "type":"actionbox",
                    "items":[
                        {
                            "type": "save",
                            "title": "SAVE_OFFLINE",
                        },
                        {
                            "type":"submit",
                            "style":"btn-primary",
                            "title":"SUBMIT_CGT_2"
                        }
                    ]
                }
            ],
            actions: {
                submit: function (model, form, formName) {

                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid){
                        irfProgressMessage.pop('cgt2-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt2-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var reqData = {
                        "cgtDate": model.group.cgtDate2,
                        "cgtDoneBy": model.group.cgt2DoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt2Latitude,
                        "longitude": model.group.cgt2Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt2Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt2Remarks

                    };
                    var promise = Groups.post({service:'process',action:'cgt'},reqData,function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt2-submit', 'CGT 2 Updated. Proceed to CGT 3.', 5000);
                        $state.go('Page.GroupDashboard',{
                            pageName:"GroupDashboard"
                        });

                    },function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt2-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);

                    });
                }
            },
            schema: function () {
                return Groups.getSchema().$promise;
            }
        }
    }]);

irf.pageCollection.factory("Pages__Cgt3", ["$log","authService","Groups","$state","$stateParams",
    "PageHelper","irfProgressMessage",'Utils',
    function($log,authService,Groups,$state,$stateParams,PageHelper,irfProgressMessage,Utils) {
        return {
            "id": "cgt3",
            "type": "schema-form",
            "name": "Cgt3",
            "title": "CGT 3",
            "subTitle": "",
            "uri": "Groups/CGT 3",
            "offline":true,
            getOfflineDisplayItem: function(item, index){
                return [
                    "Group ID : "+item.group.id,
                    "Group Code : "+item.group.groupCode,
                    "CGT Date : "+ item.group.cgtDate3
                ]
            },
            initialize: function (model, form, formCtrl) {
                if(model._request==undefined || model._request==null){
                    $state.go("Page.Engine", {pageName:"Cgt3Queue", pageId:null});
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop("cgt3-init","Loading... Please Wait...");

                model.group= model.group || {};

                model.group.cgtDate3 = model.group.cgtDate3 || Utils.getCurrentDate();
                model.group.id = model.group.id || model._request.id;
                model.group.groupCode = model.group.groupCode || model._request.groupCode;
                model.group.partnerCode = model.group.groupCode || model._request.partnerCode;
                model.group.productCode = model.group.productCode|| model._request.productCode;

                var prom = authService.getUser().then(function(data){
                    model.group.cgt3DoneBy = data.login;
                    PageHelper.hideLoader();
                    $log.info("AfterLoad",model);
                    irfProgressMessage.pop("cgt3-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt3-init","Oops, an error occurred",2000);
                });

                /*Groups.getGroup({groupId:groupId},function(response,headersGetter){
                    console.warn(response);
                    /*model.group = {
                     id:response.id,
                     groupCode:response.groupCode,
                     partnerCode:response.partnerCode,
                     productCode:response.productCode

                     };
                    model.group = _.cloneDeep(response);
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = (date.getMonth()+3);
                    var d = date.getDate();
                    m = (m.toString().length<2)?("0"+m):m;
                    d = (d.toString().length<2)?("0"+d):d;

                    model.group.cgtDate3 = y+"-"+m+"-"+d;

                    var prom = authService.getUser().then(function(data){
                        model.group.cgt3DoneBy = data.login;
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cgt3-init","Load Completed.",2000);
                    },function(resp){
                        $log.error(resp);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cgt3-init","Oops, an error occurred",2000);
                    });


                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt3-init","Oops, an error occurred",2000);

                });*/
            },
            form: [
                {
                    "type":"box",
                    "title":"CGT_3",
                    "items":[
                        {
                            "key":"group.cgt3DoneBy",
                            "readonly":true
                        },
                        {
                            "key":"group.cgtDate3",
                            "type":"text",
                            "readonly":true

                        },
                        {
                            "key":"group.cgt3Latitude",
                            "title": "CGT_3_LOCATION",
                            "type":"geotag",
                            "latitude": "group.cgt3Latitude",
                            "longitude": "group.cgt3Longitude"
                        },
                        {
                            "key":"group.cgt3Photo",
                            "type":"file",
                            "fileType":"image/*",
                            "offline":true

                        },
                        {
                            "key":"group.cgt3Remarks",
                            "type":"textarea"
                        }

                    ]
                },{
                    "type":"actionbox",
                    "items":[
                        {
                            "type": "save",
                            "title": "SAVE_OFFLINE",
                        },
                        {
                            "type":"submit",
                            "style":"btn-primary",
                            "title":"SUBMIT_CGT_3"
                        }
                    ]
                }
            ],
            actions: {
                submit: function (model, form, formName) {

                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid){
                        irfProgressMessage.pop('cgt3-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt3-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var reqData = {
                        "cgtDate": model.group.cgtDate3,
                        "cgtDoneBy": model.group.cgt3DoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt3Latitude,
                        "longitude": model.group.cgt3Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt3Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt3Remarks

                    };

                    var promise = Groups.post({service:'process',action:'cgt'},reqData,function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt3-submit', 'CGT 3 Updated. Proceed to GRT.', 5000);
                        $state.go('Page.GroupDashboard',{
                            pageName:"GroupDashboard"
                        });

                    },function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt3-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);

                    });
                }
            },
            schema: function () {
                return Groups.getSchema().$promise;
            }
        }
    }]);

/*
 * @TODO : 1 CGT page for all CGTs, with CGT# as param
 * */
irf.pageCollection.factory("Pages__Grt", ["$log","authService","Groups","LoanProcess","$state","$stateParams",
    "PageHelper","irfProgressMessage",'Utils',
    function($log,authService,Groups,LoanProcess,$state,$stateParams,PageHelper,irfProgressMessage,Utils) {
        return {
            "id": "grt",
            "type": "schema-form",
            "name": "Grt",
            "title": "GRT",
            "subTitle": "",
            "uri": "Groups/GRT",
            "offline":true,
            getOfflineDisplayItem: function(item, index){
                return [
                    "Group ID : "+item.group.id,
                    "Group Code : "+item.group.groupCode,
                    "GRT Date : "+ item.group.grtDate
                ]
            },
            initialize: function (model, form, formCtrl) {
                $log.info("I got initialized");
                if(model._request==undefined || model._request==null){
                    $state.go("Page.Engine", {pageName:"GrtQueue", pageId:null});
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop("grt-init","Loading... Please Wait...");
                model.group= model.group || {};


                model.group.grtDate = model.group.grtDate || Utils.getCurrentDate();
                model.group.id = model.group.id || model._request.id;
                model.group.groupCode = model.group.groupCode || model._request.groupCode;
                model.group.partnerCode = model.group.partnerCode || model._request.partnerCode;
                model.group.productCode = model.group.productCode|| model._request.productCode;
                for(var i=1;i<18;i++){
                    model.group["udf"+i] = model.group["udf"+i] || false;
                }
                model.group.udfDate1 = model.group.udfDate1 || "";
                var prom = authService.getUser().then(function(data){
                    model.group.grtDoneBy = data.login;
                    PageHelper.hideLoader();
                    $log.info("AfterLoad",model);
                    irfProgressMessage.pop("grt-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("grt-init","Oops, an error occurred",2000);
                });
                /*Groups.getGroup({groupId:groupId},function(response,headersGetter){

                    /*model.group = {
                     id:response.id,
                     groupCode:response.groupCode,
                     partnerCode:response.partnerCode,
                     productCode:response.productCode

                     };
                    model.group = _.cloneDeep(response);
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = (date.getMonth()+1);
                    var d = date.getDate();
                    m = (m.toString().length<2)?("0"+m):m;
                    d = (d.toString().length<2)?("0"+d):d;

                    model.group.grtDate = y+"-"+m+"-"+d;

                    var prom = authService.getUser().then(function(data){
                        model.group.grtDoneBy = data.login;
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("grt-init","Load Completed.",2000);
                    },function(resp){
                        $log.error(resp);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("grt-init","Oops, an error occurred",2000);
                    });


                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("grt-init","Oops, an error occurred",2000);

                });*/
            },
            form: [
                {
                    "type":"box",
                    "title":"GRT",
                    "items":[
                        {
                            "key":"group.grtDoneBy",
                            "readonly":true
                        },
                        {
                            "key":"group.grtDate",
                            "type":"text",
                            "readonly":true

                        },
                        {
                            "key":"group.grtLatitude",
                            "title": "GRT_LOCATION",
                            "type":"geotag",
                            "latitude": "group.grtLatitude",
                            "longitude": "group.grtLongitude"
                        },
                        {
                            "key":"group.grtPhoto",
                            "type":"file",
                            "fileType":"image/*",
                            "offline":true

                        },
                        {
                            "key":"group.grtRemarks",
                            "type":"textarea"
                        },
                        {
                            "key":"group.udfDate1",
                            "type":"date"
                        },
                        {
                            "key":"group.udf1"
                        },
                        {
                            "key":"group.udf2"
                        },
                        {
                            "key":"group.udf3"
                        },
                        {
                            "key":"group.udf4"
                        },
                        {
                            "key":"group.udf5"
                        },
                        {
                            "key":"group.udf6"
                        }


                    ]
                },{
                    "type":"actionbox",
                    "items":[
                        {
                            "type": "save",
                            "title": "SAVE_OFFLINE",
                        },
                        {
                            "type":"submit",
                            "style":"btn-primary",
                            "title":"SUBMIT_GRT"
                        }
                    ]
                }
            ],
            actions: {
                submit: function (model, form, formName) {

                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid){
                        irfProgressMessage.pop('grt-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('grt-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var reqData = {
                        "grtDate": model.group.grtDate,
                        "grtDoneBy": model.group.grtDoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.grtLatitude,
                        "longitude": model.group.grtLongitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.grtPhoto,
                        "productCode": model.group.productCode,
                        "remarks": model.group.grtRemarks,
                        "udfDate1":model.group.udfDate1,
                        "udf1":model.group.udf1,
                        "udf2":model.group.udf2,
                        "udf3":model.group.udf3,
                        "udf4":model.group.udf4,
                        "udf5":model.group.udf5,
                        "udf6":model.group.udf6,
                        

                    };

                    var promise = Groups.post({service:'process',action:'grt'},reqData,function(res){

                        irfProgressMessage.pop('grt-submit', 'GRT Updated, activating loan account');
                        
                        LoanProcess.get({action:'groupLoans',groupCode:model.group.groupCode,partner:model.group.partnerCode},function(resp,header){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('grt-submit', 'GRT Updated, Loan Account Activated. Proceed to Applications Pending screen.',5000);
                            $state.go('Page.GroupDashboard',{
                                pageName:"GroupDashboard"
                            });

                        },function(res){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('grt-submit', 'An error occurred while activating loan account. Please Try from Applications Pending Screen',2000);
                            var data = res.data;
                            var errors = [];
                            if (data.errors){
                                _.forOwn(data.errors, function(keyErrors, key){
                                    var keyErrorsLength = keyErrors.length;
                                    for (var i=0;i<keyErrorsLength; i++){
                                        var error  = {"message": "<strong>" + key  + "</strong>: " + keyErrors[i]};
                                        errors.push(error);
                                    }
                                })
                                PageHelper.setErrors(errors);
                            }
                            $state.go('Page.GroupDashboard',{
                                pageName:"GroupDashboard"
                            });

                        });



                    },function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('grt-submit', 'Oops. Some error.');
                        PageHelper.showErrors(res);


                    });
                }
            },
            schema: function () {
                return Groups.getSchema().$promise;
            }
        }
    }]);

irf.pageCollection.factory("Pages__ApplicationPendingQueue", ["$log", "formHelper", "Groups","$state",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,SessionStore,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupCRUD",
                    pageId:item.id,
                    pageData:{
                        intent:"APP_DWNLD"
                    }
                },{
                    reload: true,
                    inherit: false,
                    notify: true
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

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){

                return [

                ];
            }
        };

        var definition = groupCommons.getSearchDefinition('StageAP',listOptions);
        return {
            "id": "applicationpendingqueue",
            "type": "search-list",
            "name": "ApplicationPendingQueue",
            "title": "Application Pending Queue",
            "subTitle": "",
            "uri":"Groups/Application Pending Queue",
            initialize: function (model, form, formCtrl) {
                $log.info("AP Q got initialized");
            },
            definition: definition
        };
    }]);

irf.pageCollection.factory("Pages__JLGDisbursementQueue", ["$log", "formHelper", "Groups","$state","groupCommons",
    function($log, formHelper, Groups,$state,groupCommons){
        var listOptions={
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupDisbursement",
                    pageId:item.partnerCode+"."+item.groupCode
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

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [

                ];
            }
        };
        var definition = groupCommons.getSearchDefinition('Stage08',listOptions);
        return {
            "id": "JLGDisbursementQueue",
            "type": "search-list",
            "name": "JLGDisbursementQueue",
            "title": "GROUP_LOAN_DISBURSEMENT_QUEUE",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("JLGDisbursementQueue got initialized");
            },
            definition: definition
        };
    }]);

irf.pageCollection.factory("Pages__CentrePaymentCollection",
["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService",
"$filter", "elementsUtils", "Utils","authService", "$rootScope",
function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper,
	$stateParams, LoanProcess, PM, PageHelper, StorageService,
	$filter, elementsUtils, Utils,authService, $rootScope){

	return {
		"id": "CentrePaymentCollection",
		"type": "schema-form",
		"name": "CentrePaymentCollection",
		"title": "CENTRE_PAYMENT_COLLECTION",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model._offlineKey = formCtrl.$name + "__" + SessionStore.getBranch();
			model._storedData = StorageService.retrieveJSON(model._offlineKey);
			if (!model.$$STORAGE_KEY$$) {
				model.collected = 0;
				$timeout(function() {
					model.groupCollectionDemand = [];
				});
			} else {
				formCtrl.disabled = true;
				model._mode = 'VIEW';
			}
			if (model._storedData && model._storedData.collectionDate) {
				var cDate = moment(model._storedData.collectionDate);
				model._storedData.formatedCollectionDate = SessionStore.getFormatedDate(cDate);
				if (!cDate.startOf('day').isSame(moment(new Date()).startOf('day')))
					model._storedData.expired = true;
				if (!model.$$STORAGE_KEY$$) {
					model.collectionDemandSummary.demandDate = model._storedData.collectionDate;
				}
			}
			$log.info("I got initialized");
		},
		offline: true,
		getOfflineDisplayItem: function(item, index){
			return [
				'Centre: '+item["collectionDemandSummary"]["centre"] + ' - ' + item["collectionDemandSummary"]["demandDate"],
				'Total: '+item["totalToBeCollected"],
				'Collected: '+item["collected"]
			]
		},
		form: [{
			"type": "box",
			"title": "CENTRE",
			//"readonly": true,
			"items": [
				{
					"type": "help",
					"helpExpr": "!model._storedData"
					+"?('SAVE_DATA_UNAVAILABLE'|translate)"
					+":(model._storedData.expired"
						+"?('SAVED_DATA_EXPIRED'|translate)"
						+":(model._storedData.collectionBranch + ' ' + ('COLLECTION_INFO_DOWNLOADED'|translate))"
					+")"
				},
				{
					"type": "button",
					"notitle": true,
					"fieldHtmlClass": "btn-block",
					"title": "DL_SAVE_BRANCH_COLLECTION",
					"condition": "!model._storedData || model._storedData.expired",
					"onClick": function(model, form, formName){
						$log.info("Downloading branch Collection data..");
						PageHelper.showLoader();
						PM.pop('collection-demand', "Downloading Collection Demands...", 2000);
						var collectionBranch = SessionStore.getBranch();
						var collectionDate = moment(new Date()).format('YYYY-MM-DD');
						authService.getUser().then(function(data){
							LoanProcess.collectionDemandSearch(
								{branch:collectionBranch,userId:data.login, demandDate:collectionDate},
								function(response){
									model._storedData = {
										collectionDemands: response.body,
										collectionBranch: collectionBranch,
										collectionDate: collectionDate

									};
									model.collectionDemandSummary.centre = null;
									$log.info(model._storedData);
									setTimeout(function() {
										model.groupCollectionDemand = [];
									});
									StorageService.storeJSON(model._offlineKey, model._storedData);
									PageHelper.hideLoader();
									PM.pop('collection-demand', "Collection Demands Saved Successfully", 2000);
								},
								function(errorResponse){
									PageHelper.hideLoader();
									PM.pop('collection-demand', "Couldn't fetch branch Collection Demands", 5000);
								}
							);

						},function(resp){
							PageHelper.hideLoader();
							PM.pop('collection-demand', "Couldn't fetch branch Collection Demands", 5000);
						});

					}
				},
				{
					"type": "fieldset",
					"title": "CHOOSE_CENTRE",
					"condition": "model._storedData && !model._storedData.expired",
					"items": [
						{
							"key":"collectionDemandSummary.demandDate",
							"type": "date",
							"readonly": true
						},
						{
							"key":"collectionDemandSummary.centre",
							"type":"select",
							"enumCode":"centre",
							"filter": {
								"field1 as branch": "model._storedData.collectionBranch"
							},
							"condition": "model._mode!=='VIEW'",
							"onChange": function(modelValue, form, model) {
								model.totalToBeCollected = 0;
								model.collected = 0;
								model.groupCollectionDemand = [];
								var collectionDemands = model._storedData.collectionDemands;
								var centreName = $filter('filter')(form.titleMap, {value:modelValue}, true)[0].name;
								model._centreName = centreName;
								var centreDemands = $filter('filter')(collectionDemands, {centre:centreName}, true);
								var totalToBeCollected = 0;
								var groups = {};
								_.each(centreDemands, function(v,k){
									v.amountPaid = v.installmentAmount;
									totalToBeCollected += v.installmentAmount;
									if (!groups[v.groupCode]) groups[v.groupCode] = [];
									groups[v.groupCode].push(v);
								});
								_.each(groups, function(v,k){
									var d = {groupCode:k, collectiondemand:v};
									model.groupCollectionDemand.push(d);
								});
								model.totalToBeCollected = model.collected = totalToBeCollected;
							}
						},
						{
							"key":"collectionDemandSummary.centre",
							"type":"select",
							"enumCode":"centre",
							"filter": {
								"field1 as branch": "model._storedData.collectionBranch"
							},
							"condition": "model._mode==='VIEW'",
							"readonly": true
						},
						{
							"key": "collectionDemandSummary.photoOfCentre",
							"type": "file",
							"fileType": "image/*",
							"offline": true
						},
						{
							"key": "collectionDemandSummary.latitude",
							"title": "CENTRE_LOCATION",
							"type": "geotag",
							"latitude": "collectionDemandSummary.latitude",
							"longitude": "collectionDemandSummary.longitude",
							"condition": "model._mode!=='VIEW'"
						},
						{
							"key": "collectionDemandSummary.latitude",
							"title": "CENTRE_LOCATION",
							"type": "geotag",
							"latitude": "collectionDemandSummary.latitude",
							"longitude": "collectionDemandSummary.longitude",
							"condition": "model._mode==='VIEW'",
							"readonly": true
						}
					]
				}
			]
		},{
			"type": "box",
			"title": "GROUPS",
			"condition": "model._mode!=='VIEW' && model._storedData && !model._storedData.expired && model.collectionDemandSummary.centre",
			"items": [{
				"key":"collectionDemandSummary.allAttendance",
				"fullwidth": true,
				"onChange": function(modelValue, form, model) {
					_.each(model.groupCollectionDemand, function(value, key){
						_.each(value.collectiondemand, function(v,k){
							v.attendance = modelValue;
						});
					});
				}
			},
			{
				"key": "groupCollectionDemand",
				"add": null,
				"remove": null,
				"titleExpr": "form.title + ' - ' + model.groupCollectionDemand[arrayIndex].groupCode",
				"items": [
					{
						"key": "groupCollectionDemand[].collectiondemand",
						"add": null,
						"remove": null,
						"view": "fixed",
						"fieldHtmlClass": "no-border",
						"items": [
							{
								"type": "section",
								"htmlClass": "row",
								"items": [{
									"type": "section",
									"htmlClass": "col-xs-5",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].customerName",
										"readonly": true,
										"notitle": true
									}]
								},{
									"type": "section",
									"htmlClass": "col-xs-5",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].amountPaid",
										"type": "amount",
										"notitle": true,
										"onChange": function(modelValue, form, model){
											var collected = 0;
											var l1 = model.groupCollectionDemand.length;
											for(i=0;i<l1;i++){
												var l2=model.groupCollectionDemand[i].collectiondemand.length;
												for(j=0;j<l2;j++){
													collected += Number(model.groupCollectionDemand[i].collectiondemand[j].amountPaid);
												}
											}
											model.collected = collected;
										}
									}]
								},{
									"type": "section",
									"htmlClass": "col-xs-2",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].attendance",
										"notitle": true
									}]
								}]
							}
						]
					}
				]
			}]
		},{
			"type": "box",
			"title": "GROUPS",
			"condition": "model._mode==='VIEW'",
			"readonly": true,
			"items": [{
				"key":"collectionDemandSummary.allAttendance",
				"fullwidth": true
			},
			{
				"key": "groupCollectionDemand",
				"add": null,
				"remove": null,
				"titleExpr": "form.title + ' - ' + model.groupCollectionDemand[arrayIndex].groupCode",
				"items": [
					{
						"key": "groupCollectionDemand[].collectiondemand",
						"add": null,
						"remove": null,
						"view": "fixed",
						"fieldHtmlClass": "no-border",
						"items": [
							{
								"type": "section",
								"htmlClass": "row",
								"items": [{
									"type": "section",
									"htmlClass": "col-xs-5",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].customerName",
										"readonly": true,
										"notitle": true
									}]
								},{
									"type": "section",
									"htmlClass": "col-xs-5",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].amountPaid",
										"type": "amount",
										"notitle": true,
										"onChange": function(modelValue, form, model){
											var collected = 0;
											var l1 = model.groupCollectionDemand.length;
											for(i=0;i<l1;i++){
												var l2=model.groupCollectionDemand[i].collectiondemand.length;
												for(j=0;j<l2;j++){
													collected += Number(model.groupCollectionDemand[i].collectiondemand[j].amountPaid);
												}
											}
											model.collected = collected;
										}
									}]
								},{
									"type": "section",
									"htmlClass": "col-xs-2",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].attendance",
										"notitle": true
									}]
								}]
							}
						]
					}
				]
			}]
		},{
			"type": "box",
			"title": "COLLECTION",
			"condition": "model._storedData && !model._storedData.expired && model.collectionDemandSummary.centre",
			"items": [
				{
					"key": "totalToBeCollected",
					"title": "TO_COLLECT",
					"type": "amount",
					"readonly": true
				},
				{
					"key": "collected",
					"title": "COLLECTED",
					"type": "amount",
					"readonly": true
				},
				{
					"type": "fieldset",
					"title": "DENOMINATIONS",
					"condition": "model._mode!=='VIEW'",
					"items": [{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationThousand",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFiveHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFifty",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwenty",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTen",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFive",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwo",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationOne",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},
					{
						key:"collectionDemandSummary._denominationTotal",
						title:"TOTAL",
						"type": "amount",
						readonly:true
					}]
				},
				{
					"type": "fieldset",
					"title": "DENOMINATIONS",
					"condition": "model._mode==='VIEW'",
					"readonly": true,
					"items": [{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationThousand",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFiveHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFifty",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwenty",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTen",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFive",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwo",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationOne",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},
					{
						key:"collectionDemandSummary._denominationTotal",
						title:"TOTAL",
						"type": "amount",
						readonly:true
					}]
				}
			]
		},{
			"type": "actionbox",
			"items": [{
				"type": "save",
				"title": "SAVE_CENTRE_COLLECTION"
			},{
				"type": "submit",
				"title": "SUBMIT"
			}]
		}],
		actions: {

			valueOfDenoms : function(model,form){

				var thousands = 1000*parseInt(model.collectionDemandSummary.denominationThousand,10);
				var fivehundreds = 500*parseInt(model.collectionDemandSummary.denominationFiveHundred,10);
				var hundreds = 100*parseInt(model.collectionDemandSummary.denominationHundred,10);

				var fifties = 50*parseInt(model.collectionDemandSummary.denominationFifty,10);
				var twenties = 20*parseInt(model.collectionDemandSummary.denominationTwenty,10);
				var tens = 10*parseInt(model.collectionDemandSummary.denominationTen,10);

				var fives = 5*parseInt(model.collectionDemandSummary.denominationFive,10);
				var twos = 2*parseInt(model.collectionDemandSummary.denominationTwo,10);
				var ones = parseInt(model.collectionDemandSummary.denominationOne,10);

				var denominationTotal = 0;

				if(!isNaN(thousands)) denominationTotal+=thousands;
				if(!isNaN(fivehundreds)) denominationTotal+=fivehundreds;
				if(!isNaN(hundreds)) denominationTotal+=hundreds;

				if(!isNaN(fifties)) denominationTotal+=fifties;
				if(!isNaN(twenties)) denominationTotal+=twenties;
				if(!isNaN(tens)) denominationTotal+=tens;

				if(!isNaN(fives)) denominationTotal+=fives;
				if(!isNaN(twos)) denominationTotal+=twos;
				if(!isNaN(ones)) denominationTotal+=ones;
				model.collectionDemandSummary._denominationTotal = denominationTotal;
				return (denominationTotal===model.collected);
			},
			print: function(model){
				console.log(model);
				var groupDemand = model.groupCollectionDemand;
				var summary = model.collectionDemandSummary;
				var printData = [
					{
						"bFont": 2,
						"text": "SAIJA FINANCE PVT. LTD",
						"style": {
							center: true
						}
					},
					{
						"bFont": 1,
						"text": "RECIEPT",
						"style": {
							"center": true
						}
					},
					{
						"bFont": 3,
						"text": "No: <Receipt No here>"
					},
					{
						"bFont": 3,
						"text": "Mr/Mrs. <Group Leader Name Here>"
					},
					{
						"bFont": 3,
						"text": "Group No: <Group No here>"
					},
					{
						"bFont": 3,
						"text": "Group Name: <Group Name here>"
					},
					{
						"bFont": 3,
						"text": ""
					},
					{
						"bFont": 4,
						"text": "Received " + model.collected + " as Loan Installment."
					},
					{
						"bFont": 1,
						"text": ""
					},
					{
						"bFont": 1,
						"text": "1000  x" + summary.denominationThousand
					},
					{
						"bFont": 1,
						"text": "500   x" + summary.denominationFiveHundred
					},
					{
						"bFont": 1,
						"text": "100   x" + summary.denominationHundred
					},
					{
						"bFont": 2,
						"text": "Total Rs. " + summary._denominationTotal
					},
					{
						"bFont": 2,
						"text": ""
					},
					{
						"bFont": 2,
						"text": ""
					},
					{
						"bFont": 3,
						"text": "Group Head Sign  Local Representative Sign"
					}

				]
				var printObj = {
					"data": printData
				};

				return;
			},
			preSave: function(model, formCtrl) {
				/*$rootScope.$broadcast('schemaFormValidate');
				if (formCtrl && formCtrl.$invalid) {
					irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
					return;
				}*/
				if (!(model._storedData && !model._storedData.expired && model.collectionDemandSummary.centre)) {
					PM.pop('collection-demand', 'Demand not avilable / Centre is mandatory', 5000);
					return;
				}
				if (!model.collectionDemandSummary.latitude) {
					PM.pop('collection-demand', 'Centre location is mandatory', 5000);
					return;
				}
				if (!(model.collectionDemandSummary.photoOfCentre || model.$$OFFLINE_FILES$$.collectionDemandSummary$photoOfCentre.data)) {
					PM.pop('collection-demand', 'Centre Photo is mandatory', 5000);
					return;
				}
				if(!this.valueOfDenoms(model)) {
					PM.pop('collection-demand', 'Denomination Sum Does not Match Collected Amount',5000);
					return;
				}

				var deferred = $q.defer();
				var fdate = moment(model.collectionDemandSummary.demandDate).format('YYYY-MM-DD');
				var skey = model.collectionDemandSummary.centre + fdate;
				var off = StorageService.getJSON('CentrePaymentCollection', skey);
				if (!model.$$STORAGE_KEY$$ && _.isObject(off) && !_.isEmpty(off)) {
					PM.pop('collection-demand', 'Collection already saved. Cannot process again.', 5000);
					return;
				}
				if (_.isObject(off) && !_.isEmpty(off)) {
					Utils.confirm(model.collectionDemandSummary.centre+' Demand for '+fdate+' already saved. Do you want to overwrite?', 'Demand overwrite!').then(function(){
						model._storedData = null;
						model.$$STORAGE_KEY$$ = skey;
						deferred.resolve();
					});
				} else {
					model._storedData = null;
					model.$$STORAGE_KEY$$ = skey;
					deferred.resolve();
				}
				return deferred.promise;
			},
			submit: function(model, formCtrl, formName) {
				$log.info("formCtrl.$valid: " + formCtrl.$valid);

				console.warn(model);
				if(!this.valueOfDenoms(model)) {
					PM.pop('collection-demand', 'Denomination Sum Does not Match Collected Amount',5000);
					return;
				}
				if (formCtrl.$valid) {

					var cds = model.collectionDemandSummary;
					var gcd = model.groupCollectionDemand;
					var cd = [];
					if (cds && gcd && gcd.length) {
						cds.demandDate = moment(cds.demandDate).format('YYYY-MM-DD') + "T00:00:00Z";
						_.each(gcd, function(group, gk){
							_.each(group.collectiondemand, function(v,k){
								cd.push(v);
							});
						});

						var requestObj = {
							collectionDemandSummary: _.clone(cds),
							collectionDemands: _.clone(cd)
						};
						requestObj.collectionDemandSummary.centre = model._centreName;
						$log.info(requestObj);
						PM.pop('collection-demand', 'Submitting...');
						LoanProcess.collectionDemandUpdate(requestObj,
							function(response){
								$log.info(response);
								PM.pop('collection-demand', 'Collection Submitted Successfully', 3000);
							},
							function(errorResponse){
								$log.error(errorResponse);
								PM.pop('collection-demand', 'Oops. Some error.', 2000);
								PageHelper.showErrors(errorResponse);
							});
					} else {
						PM.pop('collection-demand', 'Collection demand missing...');
					}
				}
			}
		},
		schema: {
			"type": "object",
			"properties": {
				"collectionDemandSummary": {
					"type": "object",
					"required": ["centre", "latitude", "longitude", "photoOfCentre"],
					"properties": {
						"centre": {
							"title": "CENTRE",
							"type": "string"
						},
						"allAttendance": {
							"title": "ALL_ATTENDANCE",
							"type": "boolean"
						},
						"demandDate": {
							"title": "DEMAND_DATE",
							"type": "string"
						},
						"latitude": {
							"type": "string"
						},
						"langitude": {
							"type": "string"
						},
						"photoOfCentre": {
							"type": "string",
							"title": "CENTRE_PHOTO",
							"category": "Collection",
							"subCategory": "PHOTOOFCENTRE"
						},
						"denominationThousand": {
							"type": "integer",
							"title": "1000 x"
						},
						"denominationFiveHundred": {
							"type": "integer",
							"title": "500 x"
						},
						"denominationHundred": {
							"type": "integer",
							"title": "100 x"
						},
						"denominationFifty": {
							"type": "integer",
							"title": "50 x"
						},
						"denominationTwenty": {
							"type": "integer",
							"title": "20 x"
						},
						"denominationTen": {
							"type": "integer",
							"title": "10 x"
						},
						"denominationFive": {
							"type": "integer",
							"title": "5 x"
						},
						"denominationTwo": {
							"type": "integer",
							"title": "2 x"
						},
						"denominationOne": {
							"type": "integer",
							"title": "1 x"
						}
					}
				},
				"groupCollectionDemand": {
					"type": "array",
					"title": "Group",
					"items": {
						"type": "object",
						"properties": {
							"groupCode": {
								"type": "string",
								"title": "GROUP_CODE"
							},
							"collectiondemand": {
								"type": "array",
								"title": "MEMBER",
								"items": {
									"type": "object",
									"properties": {
										"customerId": {
											"type": "string"
										},
										"branch": {
											"type": "string",
											"title": "BRANCH"
										},
										"accountNumber": {
											"type": "string",
											"title": "ACCOUNT_NO"
										},
										"customerName": {
											"type": "string",
											"title": "CUSTOMER_NAME"
										},
										"groupCode": {
											"type": "string",
											"title": "GROUP_CODE"
										},
										"demandDate": {
											"type": "string",
											"title": "DEMAND_DATE"
										},
										"installmentAmount": {
											"type": "number",
											"title": "INSTALLMENT_AMOUNT"
										},
										"fees": {
											"type": "number",
											"title": "FEES"
										},
										"totalToBeCollected": {
											"type": "number",
											"title": "TOTAL_TO_BE_COLLECTED"
										},
										"amountPaid": {
											"type": "number",
											"title": "AMOUNT_PAID"
										},
										"attendance": {
											"type": "boolean",
											"title": "ATTENDANCE"
										},
										"mode": {
											"type": "string",
											"title": "PAYMENT_MODE"
										},
										"centre": {
											"type": "string",
											"title": "CENTRE"
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
}]);

irf.pageCollection.factory("Pages__GroupDisbursement",
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter","Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {
            return {
                "id": "GroupDisbursement",
                "type": "schema-form",
                "name": "GroupDisbursement",
                "title": "GROUP_LOAN_DISBURSEMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    $log.info("I got initialized");
                    PageHelper.showLoader();
                    irfProgressMessage.pop('group-disbursement', 'Loading Disbursement Details');
                    //PageHelper
                    var groupInfo = $stateParams.pageId.split('.');
                    var partnerCode = groupInfo[0];
                    var groupCode = groupInfo[1];
                    $log.info("Group Code ::" + groupCode + "\nPartner Code::" + partnerCode);
                    var promise = Groups.getDisbursementDetails({partnerCode: partnerCode, groupCode: groupCode}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                            /* Loop data to derive final disbursement amounts */
                            for (var i = 0; i < data.length; i++) {
                                var account = data[i];
                                var totalFeeAmount = 0;
                                if (account && account['fees']) {
                                    for (var j = 0; j < account['fees'].length; j++) {
                                        var fee = parseFloat(account['fees'][j]['amount1']);
                                        totalFeeAmount = totalFeeAmount + fee;
                                    }
                                }
                                var disburseAmount = parseFloat(account['amount']);
                                account['totalFeeAmount'] = AccountingUtils.formatMoney(totalFeeAmount);
                                account['finalDisbursementAmount'] = AccountingUtils.formatMoney(disburseAmount - totalFeeAmount);
                            }
                            model.disbursements = data;

                            irfProgressMessage.pop('group-disbursement', 'Loading Group Details');
                            Groups.search({groupCode: groupCode, partner: partnerCode},
                                function (res) {
                                    if (res.body.length > 0) {
                                        group = res.body[0];
                                        model.group = group;
                                    }
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop('group-disbursement', 'Done.', 2000);
                                },
                                function(res){
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop('group-disbursement', 'Error loading group details.', 2000);
                                }
                            )
                        }, function (resData) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('group-disbursement', 'Error loading disbursement details.', 2000);
                        })

                },
                offline: false,
                form: [
                    {
                        "type":"box",
                        "title":"ACCOUNTS",
                        "items":[
                            {
                                "type": "fieldset",
                                "title": "ACCOUNTS",
                                "items": [
                                    {
                                        key: "disbursements",
                                        type: "array",
                                        titleExpr: "'URN: ' + model.disbursements[arrayIndex].urnNo",
                                        remove:null,
                                        add:null,
                                        items: [
                                            {
                                                condition: "model.disbursements[arrayIndex].disbursementDate!=null",
                                                type: "text",
                                                title: "DISBURSED_AT",
                                                key: "disbursements[].disbursementDate"
                                            },
                                            {
                                                type: "fieldset",
                                                title: "DISBURSEMENT_DETAILS",
                                                condition: "model.disbursements[arrayIndex].disbursementDate==null",
                                                items: [
                                                    {
                                                        "key":"disbursements[].accountId",
                                                        "readonly": true
                                                    },
                                                    {
                                                        "key":"disbursements[].amount",
                                                        "readonly": true
                                                    },
                                                    {
                                                        "type": "fieldset",
                                                        "title": "FEES",
                                                        "items": [
                                                            {
                                                                "key": "disbursements[].fees",
                                                                "type": "array",
                                                                "title": "FEE",
                                                                "add": null,
                                                                "remove": null,
                                                                "items": [
                                                                    {
                                                                        key: "disbursements[].fees[].description",
                                                                        "readonly": true,
                                                                    },
                                                                    {
                                                                        key: "disbursements[].fees[].amount1"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "disbursements[].totalFeeAmount",
                                                        "readonly": true
                                                    },
                                                    {
                                                        "key":"disbursements[].finalDisbursementAmount",
                                                        "readonly": true
                                                    },
                                                    {
                                                        "key":"disbursements[].modeOfDisbursement",
                                                        "type": "select",
                                                        "titleMap":[
                                                            { value: "CASH", name: "Cash" }
                                                        ]
                                                    },
                                                    {
                                                        type: "fieldset",
                                                        title: "ACTIONS",
                                                        items: [
                                                            {
                                                                "key": "disbursements[].validate_fp",
                                                                "type": "button",
                                                                "style": "btn-default",
                                                                "notitle": true,
                                                                "title": "VALIDATE_FINGERPRINT",
                                                                "onClick": function(model, formCtrl, form, event){
                                                                    $log.info(model);
                                                                    $log.info(form);
                                                                    $log.info(event);
                                                                    var ds = model.disbursements;
                                                                    var i = event['arrayIndex'];
                                                                    var d = ds[i];
                                                                    PageHelper.showLoader();

                                                                    Enrollment.getCustomerById({id: d.customerId},
                                                                        function(res){
                                                                            if (res.leftHandThumpImageId) {
                                                                                Files.stream({fileId: res.leftHandThumpImageId},
                                                                                    function (res) {
                                                                                        $log.info(res);
                                                                                        cordova.plugins.irfBluetooth.validate(
                                                                                            function(data){
                                                                                                console.log(data);

                                                                                            }, function(){}, res.data);
                                                                                    },
                                                                                    function () {
                                                                                    }).$promise.finally(
                                                                                    function () {
                                                                                        PageHelper.hideLoader();
                                                                                    })
                                                                            } else {
                                                                                PageHelper.showProgress('disbursement', "Fingerprint data not available", 2000);
                                                                                PageHelper.hideLoader();
                                                                            }

                                                                        },
                                                                        function(){
                                                                            PageHelper.hideLoader();
                                                                        }
                                                                    ).$promise.finally(function(){

                                                                    })

                                                                }
                                                            },
                                                            {
                                                                "key": "disbursements[].override_fp",
                                                                title: "OVERRIDE_FINGERPRINT",
                                                                "onChange": function(modelValue, form, model) {
                                                                    console.log(modelValue);
                                                                    console.log(form);
                                                                    console.log(model);
                                                                }
                                                            },
                                                            {
                                                                "key": "disbursements[].disburse",
                                                                "type": "button",
                                                                "notitle": true,
                                                                "style": "btn-primary btn-block",
                                                                "title": "DISBURSE",
                                                                "onClick": function(model, formCtrl, form, event){
                                                                    $log.info("Inside disburse()");
                                                                    $log.info(model);
                                                                    $log.info(form);
                                                                    $log.info(event);
                                                                    PageHelper.clearErrors();
                                                                    var d = model.disbursements;
                                                                    var i = event['arrayIndex'];
                                                                    var accountId = d[i].accountId;

                                                                    /* Transformations */

                                                                    /* TODO: Validations here */
                                                                    if (!_.has(d[i], 'fp_verified') || d[i].fp_verified!=true){
                                                                        if (!_.has(d[i], 'override_fp') || d[i].override_fp!=true){
                                                                            elementsUtils.alert('Fingerprint not verified.');
                                                                            return;
                                                                        }
                                                                    }

                                                                    PageHelper.showLoader();
                                                                    PageHelper.showProgress('disbursement', 'Disbursing ' + accountId + '. Please wait.')
                                                                    LoanAccount.activateLoan({"accountId": accountId},
                                                                        function(data){
                                                                            $log.info("Inside success of activateLoan");
                                                                            var currDate = moment(new Date()).format("YYYY-MM-DD");
                                                                            var toSendData = _.cloneDeep(d[i]);
                                                                            toSendData.disbursementDate = currDate;
                                                                            LoanAccount.disburse(toSendData,
                                                                                function(data){
                                                                                    PageHelper.showProgress('disbursement', 'Disbursement done', 2000);
                                                                                    d[i] = toSendData;
                                                                                },
                                                                                function(res){
                                                                                    PageHelper.showErrors(res);
                                                                                    PageHelper.showProgress('disbursement', 'Disbursement failed', 2000);
                                                                                }).$promise.finally(function() {
                                                                                    PageHelper.hideLoader();
                                                                                }
                                                                            );
                                                                        },
                                                                        function(res){
                                                                            PageHelper.hideLoader();
                                                                            PageHelper.showErrors(res);
                                                                            PageHelper.showProgress('disbursement', 'Error while activating loan.', 2000);
                                                                        })
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"button",
                                "style":"btn-theme",
                                "title":"PROCEED",
                                "onClick": function(model,formCtrl, form){
                                    $log.info("inside proceed");
                                    PageHelper.clearErrors();
                                    PageHelper.showLoader();
                                    PageHelper.showProgress("disbursement-proceed","Proceeding..");
                                    $log.info(model.group);

                                    Groups.getGroup({groupId: model.group.id},
                                        function(res){ /* SUCCESS */
                                            $log.info(res);

                                            var data = {
                                                "enrollmentAction": "PROCEED",
                                                "group": res
                                            }
                                            Groups.update({}, data,
                                                function(res){
                                                    PageHelper.showProgress("disbursement-proceed", "Done", 2000);
                                                    PageHelper.hideLoader();
                                                    $state.go('Page.GroupDashboard',{
                                                        pageName:"GroupDashboard"
                                                    });
                                                },
                                                function(res){
                                                    PageHelper.hideLoader();
                                                    PageHelper.showProgress("disbursement-proceed", "Error", 2000);
                                                    PageHelper.showErrors(res);
                                                }
                                            )
                                        },
                                        function(res){ /* FAILURE */
                                            PageHelper.hideLoader();
                                        }
                                    ).$promise.finally(function(){

                                    })
                                }
                            }
                        ]
                    }
                ],
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                    }
                },
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "title": "Root",
                    "properties": {
                        "disbursements": {
                            "type": "array",
                            "title": "ACCOUNTS",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "accountId": {
                                        "type": "string",
                                        "title": "ACCOUNT_NUMBER"
                                    },
                                    "amount": {
                                        "type": "string",
                                        "title": "DISBURSEMENT_AMOUNT"
                                    },
                                    "finalDisbursementAmount": {
                                        "type": "string",
                                        "title": "GROSS_DISBURSEMENT_AMOUNT"
                                    },
                                    "modeOfDisbursement": {
                                        "type": "string",
                                        "title": "MODE_OF_DISBURSEMENT"
                                    },
                                    "totalFeeAmount": {
                                        "type": "string",
                                        "title": "TOTAL_FEE_AMOUNT"
                                    },
                                    "validate_fp": {
                                        "type": "string",
                                        "title": "VALIDATE_FINGERPRINT"
                                    },
                                    "override_fp": {
                                        "type": "boolean",
                                        "title": "OVERRIDE_FINGERPRINT"
                                    },
                                    "fees": {
                                        "type": "array",
                                        "title": "FEE",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "description": {
                                                    "type": "string",
                                                    "title": "DESCRIPTION"
                                                },
                                                "amount1": {
                                                    "type": "string",
                                                    "title": "CASH"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }]);

/*
* @TODO : 1 CGT page for all CGTs, with CGT# as param
* */
irf.pageCollection.factory("Pages__Luc", ["$log","authService","LoanProcess","$state","$stateParams","PageHelper","irfProgressMessage",
    function($log,authService,LoanProcess,$state,$stateParams,PageHelper,irfProgressMessage) {
    return {
        "id": "luc",
        "type": "schema-form",
        "name": "Luc",
        "title": "Loan Utility Check",
        "subTitle": "",
        "uri": "Groups/Loan Utility Check",
        initialize: function (model, form, formCtrl) {
            PageHelper.showLoader();
            irfProgressMessage.pop("luc-init","Loading... Please Wait...");
            try {
                $log.info("Account Number :" + $stateParams.pageId);
                var accountNumber = $stateParams.pageId;
            }catch(err){

            }

            var date = new Date();
            var y = date.getFullYear();
            var m = (date.getMonth()+1);
            var d = date.getDate();
            m = (m.toString().length<2)?("0"+m):m;
            d = (d.toString().length<2)?("0"+d):d;

            model.pldcDto = Array();
            authService.getUser().then(function(data){
                var date=y+"-"+m+"-"+d

                model.pldcDto.push({
                    accountNumber:accountNumber,
                    pldcDate:date,
                    pldcDoneBy:data.login
                });
                PageHelper.hideLoader();
                irfProgressMessage.pop("luc-init","Load Complete",2000);
            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("luc-init","Oops, an error occurred",2000);
            });

        },
        form: [
            {
                "type":"box",
                "title":"LOAN_UTILITY_CHECK",
                "items":[
                    {
                        "key":"pldcDto",
                        "title":"",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                "key": "pldcDto[].accountNumber",
                                "title":"ACCOUNT_NUMBER"

                            },
                            {
                                "key":"pldcDto[].pldcDoneBy",
                                "readonly":true,
                                "title":"PLDC_DONE_BY"
                            },
                            {
                                "key": "pldcDto[].pldcDate",
                                "type": "date",
                                "title":"DATE"
                            },
                            {
                                "key": "latitude",
                                "title": "PLDC_LOCATION",
                                "type": "geotag",
                                "latitude": "pldcDto[arrayIndex].latitude",
                                "longitude": "pldcDto[arrayIndex].longitude"
                            },
                            {
                                "key": "pldcDto[].photoId",
                                "title":"PLDC_DOCUMENT",
                                "type": "file",
                                "fileType": "image/*"


                            },
                            {
                                "key": "pldcDto[].pldcComments",
                                "type": "textarea",
                                "title":"COMMENTS"
                            }
                        ]
                    }

                ]
            },{
                "type":"actionbox",
                "items":[
                    {
                        "type":"submit",
                        "style":"btn-primary",
                        "title":"Submit LUC"
                    }
                ]
            }
        ],
        actions: {
            submit: function (model, form, formName) {

                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('luc-submit',"Submitting Data, Please Wait...");
                $log.info("Submitting LUC",model);
                
                var reqData = _.cloneDeep(model.pldcDto);
                
                LoanProcess.postArray({action:'pldc'},reqData,function (resp,headers) {
                    PageHelper.hideLoader();
                    $log.info("submit result",resp);
                    irfProgressMessage.pop('luc-submit',"Saved Successfully",5000);
                },function (res) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-submit',"Oops. An Error Occurred",2000);
                    PageHelper.showErrors(res);
                });
            }
        },
        schema: function () {
            return LoanProcess.getPldcSchema().$promise;
        }
    }
}]);

irf.pageCollection.factory("Pages__CloseGroup", ["$log", "formHelper", "Groups","$state","PageHelper",
    "irfProgressMessage","SessionStore","groupCommons",

    function($log, formHelper, Groups,$state,PageHelper,irfProgressMessage,SessionStore,groupCommons){

        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupCRUD",
                    pageId:item.id,
                    pageData:{
                        intent:"DELETE"
                    }
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });

            },
            getItems: function(response, headers){
                $log.error(response);
                if (response!=null && response.length && response.length!=0){
                    return response;
                }
                return [];
            },
            getListItem: function(item){
                return [
                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    'Group Code : '+item.groupCode
                ]
            },
            getActions: function(){
                return [];
            }
        };
        var definition = groupCommons.getSearchDefinition(null,listOptions);

    return {
        "id": "closegroup",
        "type": "search-list",
        "name": "CloseGroup",
        "title": "VIEW_OR_CLOSE_GROUP",
        "subTitle": "",
        "uri":"Groups/View or Close Group",
        initialize: function (model, form, formCtrl) {
            $log.info("CloseGrp Q got initialized");
        },
        definition: definition
    };
}]);

irf.pageCollection.factory("Pages__CustomerFormDownloads",
["$log", "formHelper", "Enrollment","$state", "SessionStore",
function($log, formHelper, Enrollment,$state, SessionStore){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerFormDownloads",
		"type": "search-list",
		"name": "CustomerFormDownloads",
		"title": "Customer Form Downloads",
		"subTitle": "",
		"uri":"Customer Form Downloads",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Customers",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"first_name": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kyc_no": {
						"title": "KYC_NO",
						"type": "string"
					},
					"branch": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"default": branch,
						"x-schema-form": {
							"type": "select"
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select"
						}
					}

				},
				"required":["branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Enrollment.search({
					'branchName': searchOptions.branch,
					'firstName': searchOptions.first_name,
					'centreCode': searchOptions.centre,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
                    'kycNumber': searchOptions.kyc_no,
                    'lastName': searchOptions.lastName
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);

				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
                        var ret = [];
                        angular.forEach(response,function(value,key){

                            if(value.urnNo!=null) ret.push(value);
                        });
                        console.warn(ret);
                        return ret;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.firstName + " " + (item.lastName!=null?item.lastName:""),
						'Customer ID : ' + item.id,
						'URN : '+item.urnNo,
						null
					]
				},
				getActions: function(){
					return [
                        {
                            name: "Download Personal Information Form",
                            desc: "",
                            icon: "fa fa-user",
                            fn: function(item, index){
                                if(window.confirm("Start Download?")){
                                    var url = irf.FORM_DOWNLOAD_URL+'?form_name=personal_information&record_id='+item.urnNo;
                                    try {
                                        cordova.InAppBrowser.open(url, '_system', 'location=yes');
                                    }catch(err){
                                        window.open(url, '_blank', 'location=yes');
                                    }
                                }

                            },
                            isApplicable: function(item, index){
                                if(item.urnNo)
                                    return true;
                                else
                                    return false;

                            }
                        },
                        {
                            name: "Download Appraisal and Verification Form",
                            desc: "",
                            icon: "fa fa-check-circle-o",
                            fn: function(item, index){
                                if(window.confirm("Start Download?")){
                                    var url = irf.FORM_DOWNLOAD_URL+'?form_name=appraisal_and_verification&record_id='+item.urnNo;
                                    try {
                                        cordova.InAppBrowser.open(url, '_system', 'location=yes');
                                    }catch(err){
                                        window.open(url, '_blank', 'location=yes');
                                    }
                                }

                            },
                            isApplicable: function(item, index){
                                if(item.urnNo)
                                    return true;
                                else
                                    return false;

                            }
                        }
					];
				}
			}


		}
	};
}]);

irf.pageCollection.factory(irf.page('customer360.loans.View'),
    ["$log", "formHelper", "LoanAccount", "$state", "SessionStore", "LoanAccount", "$stateParams",
        function($log, formHelper, LoanAccount, $state, SessionStore, LoanAccount, $stateParams){
            return {
                "id": "ViewLoans",
                "type": "search-list",
                "name": "View Loans",
                "title": "VIEW_LOANS",
                "subTitle": "VIEW_LOANS_SUB",
                "uri":"Loans/View Loans",
                initialize: function (model, form, formCtrl) {
                    $log.info("ViewLoans initialiized");
                },
                offline: false,
                definition: {
                    title: "Loans",
                    autoSearch:true,
                    searchForm: [
                        "*"
                    ],
                    searchSchema: {
                        "type": 'object',
                        "title": 'SearchOptions',
                        "properties": {
                            "show_closed": {
                                "title": "SHOW_CLOSED_LOANS",
                                "type": "boolean",
                                "default": false
                            }
                        },
                        "required":["branch"]
                    },
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                        var promise = LoanAccount.viewLoans({urn: $stateParams.pageId}).$promise;
                        //var urnNo = $stateParams.pageId;
                        return promise;
                    },
                    paginationOptions: {
                        "viewMode": "page",
                        "getItemsPerPage": function(response, headers){
                            return 20;
                        },
                        "getTotalItemsCount": function(response, headers){
                            return response.length;
                        }
                    },
                    listOptions: {
                        itemCallback: function(item, index) {

                        },
                        getItems: function(response, headers){
                            if (response!=null && response.length && response.length!=0){
                                return response;
                            }
                            return [];
                        },
                        getListItem: function(item){
                            return [
                                item.accountNumber,
                                'Type: ' + item.loanType + ', Partner: ' + item.partner + ', Product: ' + item.productCode,
                                'Application Status: ' + item.applicationStatus
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "View Details",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: irf.page('loans.ViewLoanDetails'),
                                            pageId: item.accountNumber
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        //if (index%2==0){
                                        //	return false;
                                        //}
                                        return true;
                                    }
                                },
                                {
                                    name: "Repay",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.LoanRepay',
                                            pageId: [item.accountNumber,item.urnNo].join(".")
                                        })
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

irf.pageCollection.factory(irf.page('loans.LoanRepay'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {

            function backToLoansList(){
                try {
                    var urnNo = ($stateParams.pageId.split("."))[1];
                    $state.go("Page.Engine", {
                        pageName: "customer360.loans.View",
                        pageId: urnNo
                    });
                }catch(err){
                    console.log(err);
                    //@TODO : Where to redirect if no page params present
                }
            }

            return {
                "id": "LoanRepay",
                "type": "schema-form",
                "name": "LoanRepay",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                    //PageHelper
                    var loanAccountNo = ($stateParams.pageId.split("."))[0];
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        console.log(data);
                        model.repayment = {};
                        model.repayment.accountId = data.accountId;
                        model.repayment.amount = data.totalDemandDue;

                        var currDate = moment(new Date()).format("YYYY-MM-DD");
                        model.repayment.repaymentDate = currDate;
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    })
                    .finally(function () {
                        PageHelper.hideLoader();
                    })

                },
                offline: false,
                form: [
                    {
                        "type": "box",
                        "title": "REPAY",
                        "items": [
                            {
                                key:"repayment.accountId",
                                readonly:true
                            },
                            "repayment.amount",
                            "repayment.repaymentDate",
                            "repayment.cashCollectionRemark",
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "titleMap":{
                                    "Advance Repayment":"Advance Repayment",
                                    "Scheduled Demand":"Scheduled Demand",
                                    "Fee Payment":"Fee Payment",
                                    "Pre-closure":"Pre-closure",
                                    "Prepayment":"Prepayment"
                                }
                            },
                            "additional.override_fp",
                            {
                                "key": "repayment.authorizationRemark",
                                "condition": "model.additional.override_fp==true"
                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SUBMIT"

                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "repayment": {
                            "type": "object",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "title":"ACCOUNT_ID"
                                },
                                "amount": {
                                    "type": "string",
                                    "title":"AMOUNT"

                                },
                                "authorizationRemark": {
                                    "type": "string",
                                    "title":"AUTHORIZATION_REMARK"
                                },
                                "authorizationUsing": {
                                    "type": "string",
                                    "title":"AUTHORIZATION_USING"
                                },
                                "cashCollectionRemark": {
                                    "type": "string",
                                    "title":"CASH_COLLECTION_REMARK"
                                },
                                "groupCode": {
                                    "type": "string",
                                    "title":"GROUP_CODE"
                                },
                                "productCode": {
                                    "type": "string",
                                    "title":"PRODUCT_CODE"
                                },
                                "remarks": {
                                    "type": "string",
                                    "title":"REMARKS"
                                },
                                "repaymentDate": {
                                    "type": "string",
                                    "title":"REPAYMENT_DATE",
                                    "x-schema-form": {
                                        "type": "date"
                                    }
                                },
                                "transactionId": {
                                    "type": "string",
                                    "title":"TRANSACTION_ID"
                                },
                                "transactionName": {
                                    "type": "string",
                                    "title":"TRANSACTION_NAME"

                                },
                                "urnNo": {
                                    "type": "string",
                                    "title":"URN_NO"
                                }
                            },
                        },
                        "additional": {
                            "type": "object",
                            "properties": {
                                "override_fp": {
                                    "type": "boolean",
                                    "title":"OVERRIDE_FINGERPRINT",
                                    "default": false
                                }
                            }
                        }
                    },
                    "required": [
                        "accountId",
                        "amount",
                        "authorizationRemark",
                        "authorizationUsing",
                        "cashCollectionRemark",
                        "groupCode",
                        "productCode",
                        "remarks",
                        "repaymentDate",
                        "transactionId",
                        "transactionName",
                        "urnNo"
                    ]
                },
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                        if(window.confirm("Are you Sure?")){
                            PageHelper.showLoader();
                            var postData = _.cloneDeep(model.repayment);
                            postData.amount = parseInt(Number(postData.amount))+"";
                            LoanAccount.repay(postData,function(resp,header){
                                $log.info(resp);
                                try{
                                    alert(resp.response);
                                }catch(err){

                                }
                            },function(resp){
                                try{
                                    PageHelper.showErrors(resp);
                                }catch(err){
                                    console.error(err);
                                }
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });

                        }
                    }
                }
            }
        }]);

/**
 * Created by Sachin.M on 22-07-2016.
 */
irf.pageCollection.factory(irf.page('loans.groups.GroupLoanRepaymentQueue'), ["$log", "formHelper", "LoanAccount",
    "$state","groupCommons","searchResource",
    function($log, formHelper, LoanAccount,$state,groupCommons,searchResource){
        //isLegacy :: single loan prdt (true) or others (false)

        return {
            "id": "GroupRepaymentQueue",
            "type": "schema-form",
            "name": "GroupRepaymentQueue",
            "title": "GROUP_LOAN_REPAYMENT_QUEUE",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("GroupRepaymentQueue got initialized");
            },
            form:[
                {
                    "type":"box",
                    "title":"SEARCH",
                    "items":[
                        {
                            key:"isLegacy",
                            "type":"radios",
                            "titleMap":{
                                "false":"Single Loan Product",
                                "true":"Others"
                            }

                        },
                        "partner",
                        "groupCode"
                    ]
                },
                {
                    "type":"actionbox",
                    "items": [
                        {
                            "type":"submit",
                            "style":"btn-theme",
                            "title":"SEARCH"

                        }
                    ]
                }
            ],
            schema:{
                "type": 'object',
                "title": 'SearchOptions',
                "properties": {
                    "isLegacy":{
                        "title":"PRODUCT_TYPE",
                        "type":"boolean",
                        "default":"false"

                    },
                    "partner": {
                        "title": "PARTNER",
                        "type": "string",
                        "enumCode":"partner",
                        "x-schema-form":{
                            "type":"select"
                        }
                    },
                    "groupCode":{
                        "title":"GROUP_CODE",
                        "type":"integer"
                    }


                },
                "required":["partner","groupCode","isLegacy"]
            },
            actions:{
                submit:function(model, formCtrl, formName){
                    console.log(model);
                    $state.go("Page.Engine",{
                        pageName:'loans.groups.GroupLoanRepay',
                        pageId:[model.partner,model.groupCode,model.isLegacy].join(".")
                    });
                }
            }
        };
    }]);


irf.pageCollection.factory(irf.page('loans.groups.GroupLoanRepay'),
    ["$log","SessionStore", "$state",  "formHelper",
        "$stateParams", "LoanAccount", "LoanProcess", "PageHelper",
        "Groups", "Utils","elementsUtils",
        function ($log,SessionStore, $state, formHelper, $stateParams,
                  LoanAccount, LoanProcess,  PageHelper,
                  Groups, Utils) {

            function backToQueue(){
                $state.go("Page.Engine",{
                    pageName:"loans.groups.GroupLoanRepaymentQueue",
                    pageId:null
                });
            }

            var cashCollectionRemarks = {
                "Cash received at the branch":"Cash received at the branch",
                "Cash collected at field by WM":"Cash collected at field by WM",
                "Cash collected at field through CSP":"Cash collected at field through CSP",
                "Receipt Number":"Receipt Number"
            };

            return {
                "type": "schema-form",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    PageHelper.showLoader();

                    //pageId = PartnerCode.GroupCode.isLegacy
                    var groupParams = $stateParams.pageId.toString().split(".");
                    var isLegacy = false;
                    try{
                        isLegacy = groupParams[2]=="true";
                    }
                    catch (err){
                        isLegacy = false;
                    }

                    var promise = LoanAccount.getGroupRepaymentDetails({
                        partnerCode: groupParams[0],
                        groupCode:groupParams[1],
                        isLegacy:isLegacy
                    }).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        delete data.$promise;
                        delete data.$resolved;

                        console.warn(data);
                        model.ui = { submissionDone: false};

                        model.repayments = Array();
                        model.total=0;
                        model.groupCode = groupParams[1];
                        for(var i=0;i<data.length;i++){

                            var repData = data[i];

                            var totalDemandDue = Number(repData.totalDemandDue);
                            var txName = (totalDemandDue==0)?"Advance Repayment":"Scheduled Demand";
                            model.repayments.push({

                                accountId:repData.accountId,
                                amount:parseInt(Number(repData.equatedInstallment)),
                                demandAmount: parseInt(Number(repData.equatedInstallment)),
                                payOffAmount: repData.payOffAmount,
                                accountName: repData.accountName,
                                numSatisifiedDemands: repData.numSatisifiedDemands,
                                numDemands: repData.numDemands,
                                groupCode:repData.groupCode,
                                productCode:repData.productCode,
                                urnNo:repData.urnNo,
                                transactionName:txName,
                                repaymentDate:Utils.getCurrentDate(),
                                additional:{
                                    name:Utils.getFullName(repData.firstName,repData.middleName,repData.lastName),
                                    accountBalance:Number(repData.accountBalance)
                                }

                            });
                            model.total += parseInt(Number(repData.equatedInstallment));


                        }
                        if(model.repayments.length<1){
                            PageHelper.showProgress("group-repayment","No Records",3000);
                            backToQueue();
                        }


                        }, function (resData) {
                            PageHelper.showProgress("group-repayment","No Records",3000);
                            backToQueue();
                        })
                        .finally(function () {
                            PageHelper.hideLoader();
                        });

                },
                offline: false,
                form: [
                    {
                        "type": "box",
                        "title": "GROUP_LOAN_REPAYMENT",
                        "items": [
                            {
                                "key":"groupCode",
                                "title":"GROUP_CODE",
                                "readonly":true

                            },
                            {
                                "key":"_cashCollectionRemark",
                                "title":"CASH_COLLECTION_REMARK",
                                "titleMap":cashCollectionRemarks,
                                "type":"select",
                                "onChange":function(value,form,model){
                                    for(var i=0;i<model.repayments.length;i++){
                                        var repayment = model.repayments[i];
                                        repayment.cashCollectionRemark  = value;
                                    }
                                }
                            },
                            {
                                "key":"_remarks",
                                "title":"REMARKS",
                                "onChange":function(value,form,model){
                                    console.warn(model);
                                    console.warn(value);
                                    for(var i=0;i<model.repayments.length;i++){
                                        var repayment = model.repayments[i];
                                        repayment.remarks  = value;
                                    }
                                }
                            },
                            {
                                key:"repayments",
                                add:null,
                                remove:null,
                                titleExpr:"model.repayments[arrayIndex].urnNo + ' : ' + model.repayments[arrayIndex].name",
                                items:[
                                    {
                                        key:"repayments[].accountId",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].additional.name",
                                        readonly:true,
                                        title:"NAME",
                                        condition:"model.repayments[arrayIndex].name!=null"

                                    },
                                    {
                                        key:"repayments[].urnNo",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].additional.accountBalance",
                                        title:"ACCOUNT_BALANCE",
                                        type:"amount",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].amount",
                                        type:"amount",
                                        validationMessage: {
                                            'invalidAmount': 'Should be Less than Account Balance'
                                        },
                                        onChange:function(value,form,model,schemaForm){

                                            try {
                                                var i = form["arrayIndex"];
                                                if (value > model.repayments[i].additional.accountBalance) {
                                                    Utils.alert("Amount should be Less than Account Balance");
                                                }
                                                model.total=0;
                                                for(var i=0;i<model.repayments.length;i++){
                                                    model.total +=  model.repayments[i].amount;
                                                }

                                            }catch(err){
                                                console.error(err);
                                            }

                                        }


                                    },
                                    {
                                        key:"repayments[].cashCollectionRemark",
                                        "type":"select",
                                        "titleMap":cashCollectionRemarks

                                    },
                                    "repayments[].remarks",
                                    {
                                        key:"repayments[].repaymentDate",
                                        type:"date"
                                    },
                                    {
                                        key:"repayments[].transactionName",
                                        "type":"select",
                                        "titleMap":{
                                            "Advance Repayment":"Advance Repayment",
                                            "Scheduled Demand":"Scheduled Demand",
                                            "Fee Payment":"Fee Payment",
                                            "Pre-closure":"Pre-closure",
                                            "Prepayment":"Prepayment"
                                        }
                                    }


                                ]
                            },
                            {
                                "key":"total",
                                "type":"amount",
                                "title":"TOTAL",
                                readonly:true
                            }

                        ]
                    },
                    {
                        "type":"actionbox",
                        "condition": "model.ui.submissionDone==false",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SUBMIT"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        "condition": "model.ui.submissionDone==true",
                        "items": [
                            {
                                "type": "button",
                                "style": "btn-theme",
                                "title": "BACK",
                                "onClick": function(model, formCtrl, formName){
                                    backToQueue();
                                }
                            },
                            {
                                "type": "button",
                                "style": "btn-theme",
                                "title": "PRINT",
                                "onClick": function(model, formCtrl, formName){
                                    function PrinterConstants(){

                                    }
                                    PrinterConstants.FONT_LARGE_BOLD = 2;
                                    PrinterConstants.FONT_LARGE_NORMAL = 1;
                                    PrinterConstants.FONT_SMALL_NORMAL = 3;
                                    PrinterConstants.FONT_SMALL_BOLD = 4;

                                    function PrinterData(){
                                        this.lines = [];
                                    }

                                    PrinterData.prototype.getLineLength = function(font){
                                        if (font == PrinterConstants.FONT_LARGE_BOLD || font == PrinterConstants.FONT_LARGE_NORMAL){
                                            return 24;
                                        } else {
                                            return 42;
                                        }
                                    }

                                    PrinterData.prototype.addLine = function(text, opts){
                                        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                        opts['center'] = _.has(opts,'center') && _.isBoolean(opts['center'])? opts['center']: false;
                                        var obj = {
                                            "bFont": opts['font'],
                                            "text": text,
                                            "style": {
                                                "center": opts['center']
                                            }
                                        };
                                        this.lines.push(obj);
                                        return this;
                                    }

                                    PrinterData.prototype.addKeyValueLine = function(key, value, opts){
                                        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                        var keyLength = parseInt(this.getLineLength(opts['font'])/2)-1;
                                        var line = _.padEnd(key, keyLength, ' ') + ': ' + value;
                                        var obj = {
                                            "bFont": opts['font'],
                                            "text": line,
                                            "style": {
                                                "center": false
                                            }
                                        };
                                        this.lines.push(obj);
                                        return this;
                                    }

                                    PrinterData.prototype.addStrRepeatingLine = function(str, opts){
                                        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                        var lineLength = this.getLineLength(opts['font']);
                                        var line = _.padEnd("", lineLength, '-')
                                        var obj = {
                                            "bFont": opts['font'],
                                            "text": line,
                                            "style": {
                                                "center": false
                                            }
                                        };
                                        this.lines.push(obj);
                                        return this;
                                    }



                                    PrinterData.prototype.addLines = function(lines){
                                        this.lines = this.lines.concat(lines);
                                    }

                                    PrinterData.prototype.getLines = function(){
                                        return this.lines;
                                    }

                                    var getPrintReceipt = function(repaymentInfo, opts){
                                        opts['duplicate'] = opts['duplicate'] || false;
                                        var pData = new PrinterData();
                                        if(opts['duplicate']){
                                            pData.addLine('DUPLICATE', {'center': true, font: PrinterConstants.FONT_SMALL_BOLD});
                                        } else {
                                            pData.addLine('RECEIPT', {'center': true, font: PrinterConstants.FONT_SMALL_BOLD});
                                        }

                                        var curTime = moment();
                                        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
                                        pData.addLine(opts['entity_name'], {'center': true, font: PrinterConstants.FONT_SMALL_BOLD})
                                            .addLine(opts['branch'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("Date : " + curTimeStr, {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            //.addLine("Customer ID : " + repaymentInfo['customerId'], {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("LOAN REPAYMENT", {'center': true, font: PrinterConstants.FONT_LARGE_BOLD})
                                            .addLine("", {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(repaymentInfo['accountName'], {'center': true, font: PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            //.addKeyValueLine("Customer Name", repaymentInfo['customerName'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Loan A/C No", repaymentInfo['accountNumber'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Transaction Type", repaymentInfo['transactionType'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Transaction ID", repaymentInfo['transactionID'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Amount Paid", repaymentInfo['amountPaid'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Total Payoff Amount", repaymentInfo['payOffAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Demands Paid/Pending", repaymentInfo['demandsPaidAndPending'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addStrRepeatingLine("-", {font: PrinterConstants.FONT_LARGE_BOLD})
                                            .addLine(opts['company_name'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("CIN :" + opts['cin'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(opts['address1'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(opts['address2'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(opts['address3'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("Website :" + opts['website'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("Helpline No :" + opts['helpline'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("", {})
                                            .addLine("", {})
                                            .addLine("Signature not required as this is an", {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("electronically generated receipt.", {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL});

                                        return pData;
                                    }

                                    var fullPrintData = new PrinterData();

                                    for (var i=0; i<model.repayments.length; i++){
                                        var r = model.repayments[i];
                                        var repaymentInfo = {
                                            'repaymentDate': r.repaymentDate,
                                            'customerURN': r.urnNo,
                                            'accountNumber': r.accountId,
                                            'transactionType': r.transactionName,
                                            'transactionID': 1,
                                            'demandAmount': r.demandAmount,
                                            'amountPaid': r.demandAmount,
                                            'payOffAmount': r.payOffAmount,
                                            'accountName': r.accountName,
                                            'demandsPaidAndPending': (1 + r.numSatisifiedDemands) + " / " + parseInt(r.numDemands - r.numSatisifiedDemands)
                                        };
                                        var opts = {
                                            'entity_name': "Pudhuaaru KGFS",
                                            'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                            'cin': 'U74990TN2011PTC081729',
                                            'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                            'address2': 'Kanagam Village, Taramani',
                                            'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                            'website': "http://ruralchannels.kgfs.co.in",
                                            'helpline': '18001029370'
                                        }

                                        var pData = getPrintReceipt(repaymentInfo, opts);
                                        pData.addLine("", {});
                                        pData.addLine("", {});
                                        fullPrintData.addLines(pData.getLines());
                                    }

                                    cordova.plugins.irfBluetooth.print(function(){
                                        console.log("succc callback");
                                    }, function(err){
                                        console.error(err);
                                        console.log("errr collback");
                                    }, fullPrintData.getLines());
                                }
                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "advanceRepayment": {
                            "title":"ADVANCE_REPAYMENT",
                            "type": "boolean"
                        },
                        "repayments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {

                                    "accountId": {
                                        "type": "string",
                                        "title":"ACCOUNT_ID"
                                    },
                                    "amount": {
                                        "type": "integer",
                                        "title":"AMOUNT"
                                    },
                                    "authorizationRemark": {
                                        "type": "string",
                                        "title":"AUTHORIZATION_REMARK"
                                    },
                                    "authorizationUsing": {
                                        "type": "string",
                                        "title":"AUTHORIZATION_USING"
                                    },
                                    "cashCollectionRemark": {
                                        "type": "string",
                                        "title":"CASH_COLLECTION_REMARK"
                                    },
                                    "groupCode": {
                                        "type": "string",
                                        "title":"GROUP_CODE"
                                    },
                                    "productCode": {
                                        "type": "string",
                                        "title":"PRODUCT_CODE"
                                    },
                                    "remarks": {
                                        "type": "string",
                                        "title":"REMARKS"
                                    },
                                    "repaymentDate": {
                                        "type": "string",
                                        "title":"REPAYMENT_DATE"
                                    },
                                    "transactionId": {
                                        "type": "string",
                                        "title":"TRANSACTION_ID"
                                    },
                                    "transactionName": {
                                        "type": "string",
                                        "title":"TRANSACTION_NAME"


                                    },
                                    "urnNo": {
                                        "type": "string",
                                        "title":"URN_NO"
                                    }
                                },
                                "required": [
                                    "accountId",
                                    "amount",
                                    "cashCollectionRemark",
                                    "groupCode",
                                    "productCode",
                                    "repaymentDate",
                                    "transactionName",
                                    "urnNo"
                                ]
                            }
                        }
                    },
                    "required": [
                        "repayments"
                    ]
                },
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                        console.log(formCtrl);
                        var reqData = _.cloneDeep(model);
                        var msg="";
                        for(var i=0;i<reqData.repayments.length;i++) {

                            //Check for advance repayments
                            if(reqData.repayments[i].transactionName=="Advance Repayment") {
                                reqData.advanceRepayment = true;
                                msg = "There are Advance Repayments - ";
                            }

                            //check for larger amounts
                            if(Number(reqData.repayments[i].amount)>reqData.repayments[i].additional.accountBalance) {
                                msg = "For URN "+reqData.repayments[i].urnNo;
                                msg+=" Payable amount is larger than account balance."
                                Utils.alert(msg);
                                return;
                            }
                        }

                        if(window.confirm(msg+"Are you Sure?")){
                            PageHelper.showLoader();


                            LoanAccount.groupRepayment(reqData, function(resp, headers){
                                console.log(resp);
                                try {
                                    alert(resp.response);
                                    model.repaymentResponse = resp;
                                    model.ui.submissionDone = true;
                                }catch(err){
                                    console.error(err);
                                    PageHelper.showProgress("group-repay","Oops. An Error Occurred",3000);
                                }

                            },function(resp){
                                console.error(resp);
                                try{
                                    PageHelper.showErrors(resp);
                                }catch(err){
                                    console.error(err);
                                }

                                PageHelper.showProgress("group-repay","Oops. An Error Occurred",3000);
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                    }
                }
            }
        }]);

irf.pageCollection.factory(irf.page("loans.individual.LoanBookingQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore",
function($log, formHelper, Enrollment, $state, SessionStore){
    return {
        "id": "LoanBookingQueue",
        "type": "search-list",
        "name": "Pending for Loan Booking Queue",
        "title": "Pending for Loan Booking Queue",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "Search Loans pending for Booking",
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "Loan Account Number",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    "kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.firstName + " " + (item.lastName!=null?item.lastName:""),
                        'Customer ID : ' + item.id,
                        null
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Do House Verification",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.Queue"),
["$log", "formHelper","entityManager", "IndividualLoan","$state", "SessionStore", "Utils",
function($log, formHelper,EntityManager, IndividualLoan,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerSearch",
		"type": "search-list",
		"name": "CustomerSearch",
		"title": "CUSTOMER_SEARCH",
		"subTitle": "",
		"uri":"Customer Search",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Customers",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"stage": {
						"title": "STAGE",
						"type": "string"
					},
					"branchName": {
						"title": "BRANCH_ID",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"centreCode": {
						"title": "CENTRE_CODE",
						"type": "string"
					},
					"customerId": {
						"title": "CUSTOMER_ID",
						"type": "number"
					},
					"accountNumber": {
						"title": "ACCOUNT_NUMBER",
						"type": "number"
					}
				},
				"required":["branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = IndividualLoan.search({
					'stage': searchOptions.stage,
					'branchName': searchOptions.branchName,
					'centreCode': searchOptions.centreCode,
					'customerId': searchOptions.customerId,
					'accountNumber': searchOptions.accountNumber
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				expandable: true,
				itemCallback: function(item, index) {
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						
						"{{'ACCOUNT_NUMBER'|translate}} : " + item.accountNumber,
						"{{'CUSTOMER_NAME'|translate}} : " + item.customerName,
						"{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount
					]
				},
				getActions: function(){
					return [
						{
							name: "Update",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.achpdc.ACHRegistration",{_ach:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.ACHRegistration",
									pageId:item.accountNumber
								});
							},
							isApplicable: function(item, index){
								
								return true;
							}
						},
						{
							name: "Do House Verification",
							desc: "",
							icon: "fa fa-house",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"AssetsLiabilitiesAndHealth",
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage02')
									return true;
								return false;
							}
						},
						{
							name: "Customer 360",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index){
								$state.go("Page.Customer360",{
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Completed')
									return true;
								return false;
							}
						}
					];
				}
			}
		}
	};
}]);

irf.pageCollection.factory("Pages__MultiTrancheQueue",
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "LoanBookingQueue",
        "type": "search-list",
        "name": "MultiTranche Queue",
        "title": "Multi Tranche Queue",
        "subTitle": "",
        "uri":"Customer Enrollment/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'Stage02';
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "Choose Loan Type",
            autoSearch: true,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    /*
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }
                        }
                    },
                    */
                    "customer_name": {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "Centre Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                            "name": "Ajay Karthik | GKB Industries Ltd.",
                            "loan_amount": "7,50,000",
                            "Tranche": "2 | Belgaum branch",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S | Key Metals Pvt. Ltd.",
                            "loan_amount": "20,00,00",
                            "Tranche": "3 | Hubli branch",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G | HPL",
                            "loan_amount": "30,00,000",
                            "Tranche": "2 | Trichy branch",
                            "sanction_date": "01/07/2016"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }
                }
                return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.Tranche                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory("Pages__PendingFROQueue",
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "PendingFROQueue",
        "type": "search-list",
        "name": "FRO Queue",
        "title": "FRO Queue",
        "subTitle": "",
        "uri":"Customer Enrollment/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'Stage02';
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "Choose Loan Type",
            autoSearch: true,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    /*
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }
                        }
                    },
                    */
                    "customer_name": {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "Centre Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                            "name": "Ajay Karthik | GKB Industries Ltd.",
                            "loan_amount": "7,50,000",
                            "Tranche": "2 | Belgaum branch",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S | Key Metals Pvt. Ltd.",
                            "loan_amount": "20,00,00",
                            "Tranche": "3 | Hubli branch",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G | HPL",
                            "loan_amount": "30,00,000",
                            "Tranche": "2 | Trichy branch",
                            "sanction_date": "01/07/2016"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }
                }
                return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.Tranche                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Update Status",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'PendingFRO', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory("Pages__PendingCROQueue",
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "PendingCROQueue",
        "type": "search-list",
        "name": "CRO Queue",
        "title": "CRO Queue",
        "subTitle": "",
        "uri":"Customer Enrollment/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'Stage02';
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "Choose Loan Type",
            autoSearch: true,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    /*
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }
                        }
                    },
                    */
                    "customer_name": {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "Centre Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                            "name": "Ajay Karthik | GKB Industries Ltd.",
                            "loan_amount": "7,50,000",
                            "Tranche": "2 | Belgaum branch",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S | Key Metals Pvt. Ltd.",
                            "loan_amount": "20,00,00",
                            "Tranche": "3 | Hubli branch",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G | HPL",
                            "loan_amount": "30,00,000",
                            "Tranche": "2 | Trichy branch",
                            "sanction_date": "01/07/2016"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }
                }
                return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'PendingCRO', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.Tranche                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Update Status",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'PendingCRO', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory("Pages__EMIScheduleGenQueue",
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "EMIScheduleGenQueue",
        "type": "search-list",
        "name": "EMI Schedule Generation Queue",
        "title": "EMI Schedule Generation Queue",
        "subTitle": "",
        "uri":"Customer Enrollment/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'Stage02';
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "Choose Loan Type",
            autoSearch: true,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    /*
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }
                        }
                    },
                    */
                    "customer_name": {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "Centre Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                            "name": "Ajay Karthik | GKB Industries Ltd.",
                            "loan_amount": "7,50,000",
                            "Tranche": "2 | Belgaum branch",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S | Key Metals Pvt. Ltd.",
                            "loan_amount": "20,00,00",
                            "Tranche": "3 | Hubli branch",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G | HPL",
                            "loan_amount": "30,00,000",
                            "Tranche": "2 | Trichy branch",
                            "sanction_date": "01/07/2016"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }
                }
                return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'GenerateEMISchedule', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.Tranche                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Generate EMI",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'GenerateEMISchedule', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.PendingClearingQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "PendingClearingQueue",
        "type": "search-list",
        "name": "Pending for Clearing",
        "title": "Pending for Clearing",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "Search Loans pending for Clearing",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "Loan Account Number",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 8
                    },
                    body:[
                        {
                            custname:"Simran Kuppusamy",
                            loanacno:"508640101345",
                            paymenttype:"PDC",
                            amountdue:"2489",
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Swapnil",
                            loanacno:"508640108976",
                            paymenttype:"PDC",
                            amountdue:"1176",
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"Suseela Gandhi",
                            loanacno:"508651508976",
                            paymenttype:"ACH",
                            amountdue:"3683",
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                /*itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },*/
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        'Loan Number : ' + item.loanacno,
                        'Amount Due: ' + item.amountdue
                    ]
                },
                getActions: function(){
                    return [
                        /*{
                            name: "Do House Verification",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }*/
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.PendingCashQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "PendingCashQueue",
        "type": "search-list",
        "name": "Pending for Cash Payment",
        "title": "Pending for Cash Payment",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "Search Loans pending for Cash Payment",
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "Loan Account Number",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 8
                    },
                    body:[
                        {
                            custname:"Anjalidevi",
                            loanacno:"508640108845",
                            amountdue:"1167",
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"Banumathi",
                            loanacno:"508640108549",
                            amountdue:"2020",
                            installmentdate:"03-03-2016",
                            p2pdate:"26-03-2016"
                        },
                        {
                            custname:"Dhanalakshmi",
                            loanacno:"508651508098",
                            amountdue:"1345",
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                /*itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },*/
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        'Loan Number : ' + item.loanacno,
                        'Amount Due: ' + item.amountdue
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Pay Cash",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'Repayment', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.BouncePromiseQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 5
                    },
                    body:[
                        {
                            custname:"GeeKay Industries",
                            applicant: "Kanimozhi",
                            coApplicant: "Raja",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue: 19548,
                            principal: 14872.36,
                            interest: 4235.64,
                            penalInterest: 200,
                            charges: 200,
                            fees: 40,
                            numberOfDues: 2,
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Manjunatha Hydroflexibles",
                            applicant: "Sudha",
                            coApplicant: "Ragunath",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue: 19397,
                            principal: 14844.7,
                            interest: 4262.3,
                            penalInterest: 150,
                            charges: 100,
                            fees: 40,
                            numberOfDues: 1,
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"VSR Engineering",
                            applicant: "Rajesh",
                            coApplicant: "Selvam",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue: 49816,
                            principal: 37110.26,
                            interest: 10655.74,
                            penalInterest: 1200,
                            charges: 750,
                            fees: 100,
                            numberOfDues: 1,
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                expandable: true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.loanacno,
                        "{{'Total Amount Due'|translate}}: " + item.amountdue,
                        "{{'PRINCIPAL'|translate}}: " + item.principal,
                        "{{'INTEREST'|translate}}: " + item.interest,
                        "{{'Penal interest'|translate}}: " + item.penalInterest,
                        "{{'Charges'|translate}}: " + item.charges,
                        "{{'FEES'|translate}}: " + item.fees,
                        "{{'Number of dues'|translate}}: " + item.numberOfDues
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "ASIGN_TO_RECOVERY_AGENT",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.CollectPayment', {_bounce:item});
                               $state.go('Page.Engine', {pageName: 'loans.individual.collections.CollectPayment', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "ASIGN_TO_LOAN_OFFICER",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.BounceRecoveryQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 5
                    },
                    body:[
                        {
                            custname:"GeeKay Industries",
                            applicant: "Kanimozhi",
                            coApplicant: "Raja",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue:"19548",
                            principal: "14872.36",
                            interest: "4235.64",
                            penalInterest: "200",
                            charges: "200",
                            fees: "40",
                            numberOfDues: "2",
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Manjunatha Hydroflexibles",
                            applicant: "Sudha",
                            coApplicant: "Ragunath",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue:"19397",
                            principal: "14844.7",
                            interest: "4262.3",
                            penalInterest: "150",
                            charges: "100",
                            fees: "40",
                            numberOfDues: "1",
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"VSR Engineering",
                            applicant: "Rajesh",
                            coApplicant: "Selvam",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue:"49816",
                            principal: "37110.26",
                            interest: "10655.74",
                            penalInterest: "1200",
                            charges: "750",
                            fees: "100",
                            numberOfDues: "1",
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                /*itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },*/
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.loanacno,
                        "{{'Total Amount Due'|translate}}: " + item.amountdue,
                        "{{'PRINCIPAL'|translate}}: " + item.principal,
                        "{{'INTEREST'|translate}}: " + item.interest,
                        "{{'Penal interest'|translate}}: " + item.penalInterest,
                        "{{'Charges'|translate}}: " + item.charges,
                        "{{'FEES'|translate}}: " + item.fees,
                        "{{'Number of dues'|translate}}: " + item.numberOfDues
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.CollectPayment', {_bounce:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CollectPayment', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "PROMISE_TO_PAY",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.BounceQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, Enrollment, $state, SessionStore,$q, entityManager){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 3
                    },
                    body:[
                        {
                            custname:"GeeKay Industries",
                            applicant: "Kanimozhi",
                            coApplicant: "Raja",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue: 19548,
                            principal: 14872.36,
                            interest: 4235.64,
                            penalInterest: 200,
                            charges: 200,
                            fees: 40,
                            numberOfDues: 2,
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Manjunatha Hydroflexibles",
                            applicant: "Sudha",
                            coApplicant: "Ragunath",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue: 19397,
                            principal: 14844.7,
                            interest: 4262.3,
                            penalInterest: 150,
                            charges: 100,
                            fees: 40,
                            numberOfDues: 1,
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"VSR Engineering",
                            applicant: "Rajesh",
                            coApplicant: "Selvam",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue: 49816,
                            principal: 37110.26,
                            interest: 10655.74,
                            penalInterest: 1200,
                            charges: 750,
                            fees: 100,
                            numberOfDues: 1,
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                expandable: true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.loanacno,
                        "{{'Total Amount Due'|translate}}: " + item.amountdue,
                        "{{'PRINCIPAL'|translate}}: " + item.principal,
                        "{{'INTEREST'|translate}}: " + item.interest,
                        "{{'Penal interest'|translate}}: " + item.penalInterest,
                        "{{'Charges'|translate}}: " + item.charges,
                        "{{'FEES'|translate}}: " + item.fees,
                        "{{'Number of dues'|translate}}: " + item.numberOfDues
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.collections.CollectPayment', {_bounce:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CollectPayment', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "PROMISE_TO_PAY",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidation"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "Payment Details for loan : " + $stateParams.pageId,
		initialize: function (model, form, formCtrl) {
            $log.info("Credit Validation Page got initialized");
            if (model._credit) {
                model.creditValidation = model.creditValidation || {};
                model.creditValidation.enterprise_name = model._credit.custname;
                model.creditValidation.applicant_name = model._credit.applicant;
                model.creditValidation.co_applicant_name = model._credit.coApplicant;
                model.creditValidation.principal = model._credit.principal;
                model.creditValidation.interest = model._credit.interest;
                model.creditValidation.fee = model._credit.fees;
                model.creditValidation.penal_interest = model._credit.penalInterest;
                model.creditValidation.amountDue = model._credit.amountdue;
                model.creditValidation.amountCollected = 10000;
            } else {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidationQueue', pageId: null});
            }/*
            model.creditValidation.customer_name = "Suresh";
            model.creditValidation.principal = 1000;
            model.creditValidation.interest = 90;
            model.creditValidation.fee = 50;
            model.creditValidation.penal_interest = 15;
            model.creditValidation.amountDue = 1155;
            model.creditValidation.amountCollected = 1155;*/
        },
		
		form: [
			{
				"type":"box",
				"title":"Payment",
				"items":[
                    {
                        key:"creditValidation.enterprise_name",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"creditValidation.applicant_name",
                        title:"APPLICANT",
                        readonly:true,
                    },
                    {
                        key:"creditValidation.co_applicant_name",
                        title:"CO_APPLICANT",
                        readonly:true,
                    },
                    {
                        key:"creditValidation.principal",
                        title:"PRINCIPAL",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.interest",
                        title:"INTEREST",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.penal_interest",
                        title:"PENAL_INTEREST",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.fee",
                        title:"FEES_AND_OTHER_CHARGES",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.amountDue",
                        title:"TOTAL_AMOUNT_DUE",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.amountCollected",
                        title:"AMOUNT_COLLECTED",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.status",
                        title:"",
                        type:"radios",
                        titleMap:{
                            "1":"Fully Paid",
                            "2":"Partially Paid",
                            "3":"Not Paid"
                        }
                    },
                    {
                        key:"creditValidation.reject_reason",
                        title:"REJECT_REASON",
                        type:"select",
                        titleMap: [{
                            "name":"Amount not creditted in account",
                            "value":"1"
                        }],
                        condition:"model.creditValidation.status=='3'"
                    },
                    {
                        key:"creditValidation.reject_remarks",
                        title:"REJECT_REMARKS",
                        readonly:false,
                        type: "textarea",
                        condition:"model.creditValidation.status=='3'"
                    }
				]
			},
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SUBMIT"
			}]
		}],
		schema: function() {
			return ManagementHelper.getVillageSchemaPromise();
		},
		actions: {
			submit: function(model, form, formName){
				$log.info("Inside submit()");
				console.warn(model);
				if (window.confirm("Save?") && model.village) {
					PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
				}
			}
		}
	};
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.CollectPayment"),
["$log","$q", 'LoanProcess','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, LoanProcess, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "REPAYMENT_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            model.repayment = model.repayment || {};
            if (!model._bounce) {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});
            }
            model.repayment.repaymentType = "Cash";
        },
		form: [
			{
				"type":"box",
				"title":"Repayment",
				"items":[
                    {
                        key:"_bounce.custname",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"_bounce.applicant",
                        title:"APPLICANT",
                        readonly:true
                    },
                    {
                        key:"_bounce.coApplicant",
                        title:"CO_APPLICANT",
                        readonly:true
                    },
                    {
                        key: "_bounce.loanacno",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true
                    },
                    {
                        key:"_bounce.amountdue",
                        title:"AMOUNT_DUE",
                        type:"amount",
                        readonly:true
                    },
                    {
                        key:"repayment.repaymentType",
                        title:"REPAYMENT_MODE",
                        type:"select",
                        titleMap: [{
                            "name":"Cash",
                            "value":"Cash"
                        },
                        {
                            "name":"Cheque",
                            "value":"Cheque"
                        },
                        {
                            "name":"NEFT",
                            "value":"NEFT"
                        },
                        {
                            "name":"RTGS",
                            "value":"RTGS"
                        }]
                    },
                    {
                        key:"repayment.amount",
                        title:"AMOUNT_PAID",
                        readonly:false,
                        required:true,
                        type:"amount"
                    },
					{
						key:"repayment.checqueNumber",
                        title:"CHEQUE_NUMBER",
						type:"text",
                        required:true,
                        condition:"model.repayment.repaymentType=='Cheque'"
					},
                    {
                        key:"repayment.chequeDate",
                        title:"CHEQUE_DATE",
                        type:"date",
                        required:true,
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"repayment.chequeBank",
                        title:"ISSUING_BANK",
                        type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"repayment.chequeBranch",
                        title:"ISSUING_BRANCH",
                        type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key: "repayment.chequePhoto",
                        title: "CHEQUE_PHOTO",
                        condition:"model.repayment.repaymentType=='Cheque'",
                        type: "file",
                        fileType: "image/*",
                        category: "noidea",
                        subCategory: "absolutlynoidea"
                    },
                    {
                        key:"repayment.NEFTReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        required: true,
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.RTGSReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.remarks",
                        title:"Remarks",
                        type:"textarea"
                    }
				]
			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SUBMIT"
			}]
		}],
		schema: {
            type: "object",
            properties: {
                "repayment": {
                    type: "object",
                    properties: {
                        "repaymentType": {
                            type: "string",
                            enum: ["Cash","Cheque","NEFT","RTGS"]
                        }
                    }
                }
            }
        },
		actions: {
			submit: function(model, form, formName){
				$log.info("Inside submit()");
                PageHelper.showLoader();

                LoanProcess.repay(model.repayment, function(response){
                    PageHelper.hideLoader();

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
			}
		}
	};
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.P2PUpdate"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "PROMISE_TO_PAY_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            model.promise = model._bounce;
            if (!model._bounce) {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});
            }
        },
		form: [
			{
				"type":"box",
				"title":"PROMISE_TO_PAY",
				"items":[
                    {
                        key:"promise.custname",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"promise.applicant",
                        title:"APPLICANT",
                        readonly:true
                    },
                    {
                        key:"promise.coApplicant",
                        title:"CO_APPLICANT",
                        readonly:true
                    },
                    {
                        key: "promise.loanacno",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true
                    },
                    {
                        key:"promise.amountdue",
                        title:"AMOUNT_DUE",
                        type:"amount",
                        readonly:true
                    },
                    {
                        key: "promise.customerNotAvailable",
                        title: "CUSTOMER_NOT_AVAILABLE",
                        type: "checkbox",
                        schema: {
                            default: false
                        }
                    },
                    {
                        key:"promise.Promise2PayDate",
                        title:"PROMISE_TO_PAY_DATE",
                        readonly:false,
                        type:"date",
                    },
                    {
                        key: "promise.customerCategory",
                        title: "CUSTOMER_CATEGORY",
                        type: "select",
                        titleMap: {
                            "A": "A",
                            "B": "B",
                            "C": "C",
                            "D": "D"
                        }
                    },
                    {
                        key:"promise.reason",
                        title:"REASON",
                        type:"select",
                        titleMap: [{
                            "name":"Wilful default",
                            "value":"Wilfuldefault"
                        },
                        {
                            "name":"Hardship",
                            "value":"Hardship"
                        },
                        {
                            "name":"Able to Pay",
                            "value":"AbletoPay"
                        },
                        {
                            "name":"Others",
                            "value":"Others"
                        }]
                    },
					{
						key:"promise.reasonforOthers",
                        title:"OTHER_REASON",
						type:"textarea",
                        condition:"model.Reason=='Others'"
					},
                    {
                        key:"promise.remarks",
                        title:"REMARKS",
                        type:"textarea"
                    }
				]
			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SUBMIT"
			}]
		}],
		schema: function() {
			return ManagementHelper.getVillageSchemaPromise();
		},
		actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
			submit: function(model, form, formName){
				$log.info("Inside submit()");
				console.warn(model);
				if (window.confirm("Save?") && model.village) {
					PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
				}
			}
		}
	};
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, Enrollment, $state, SessionStore, $q, entityManager){
    return {
        "type": "search-list",
        "title": "Credit Validation Queue",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "Search Payments",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "Loan Account Number",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },*/
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 5
                    },
                    body:[
                        {
                            custname:"GeeKay Industries",
                            applicant: "Kanimozhi",
                            coApplicant: "Raja",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue: 19548,
                            principal: 14872.36,
                            interest: 4235.64,
                            penalInterest: 200,
                            charges: 200,
                            fees: 40,
                            numberOfDues: 2,
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Manjunatha Hydroflexibles",
                            applicant: "Sudha",
                            coApplicant: "Ragunath",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue: 19397,
                            principal: 14844.7,
                            interest: 4262.3,
                            penalInterest: 150,
                            charges: 100,
                            fees: 40,
                            numberOfDues: 1,
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"VSR Engineering",
                            applicant: "Rajesh",
                            coApplicant: "Selvam",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue: 49816,
                            principal: 37110.26,
                            interest: 10655.74,
                            penalInterest: 1200,
                            charges: 750,
                            fees: 100,
                            numberOfDues: 1,
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                expandable:true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        'Loan Number: ' + item.loanacno,
                        'Amount Due: ' + item.amountdue,
                        'Payment Type:' + item.paymenttype
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Credit Validation",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.collections.CreditValidation', {_credit:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidation', pageId: item.loanacno});
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

irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHPDCRegistration"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "ach_pdc",
        "type": "schema-form",
        "name": "ach_pdc",
        "title": "ACH/PDC REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH / PDC selection Page got initialized");
            model.customer.urnNo="1234567890";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "colClass":"col-xs-12",
            // sample label code
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [{
                "type": "fieldset",
                "items": [{
                    "type": "tabs", 
                    "tabs": [{
                        "title": "ACH Registration",
                        "items": [{
                            "key": "ach.accountHolderName",
                            "title": "Account Holder Name"
                        },
                        {
                            "key": "ach.accountType",
                            "title": "Account Type"
                        },
                        {
                            "key": "ach.amount",
                            "title": "Amount",
                            "type": "Number"
                          
                        },
                        {
                            "key": "ach.consumerReferenceNumber",
                            "title": "Consumer Reference Number"
                        },
                        {
                            "key": "ach.customerAdditionalInformation",
                            "title": "Customer Additional Information"
                       },
                        {
                            "key": "ach.debitAmtOF",
                            "title": "Debit Amount OF"
                        },
                        {
                            "key": "ach.emailId",
                            "title": "E-mail Id"
                        },
                        {
                            "key": "ach.endDate",
                            "title": "End Date",
                            "type": "date"
                        },
                        {
                            "key": "ach.frequency",
                            "title": "Cheque Date"
                        },
                        {
                            "key": "ach.id",
                            "title": "Id",
                            "type":"Number"
                        },
                        {
                            "key": "ach.ifscCode",
                            "title": "IFSC Code"
                        },
                        {
                            "key": "ach.initialRejectReason",
                            "title": "Initial Reject Reason"
                        },
                        {
                            "key": "ach.legalAccountNumber",
                            "title": "Legal Account Number"
                        },
                        {
                            "key": "ach.loanAccountNumber",
                            "title": "Loan Account Number"
                        },
                        {
                            "key": "ach.mandateDate",
                            "title": "Mandate Date"
                        },
                        {
                            "key": "ach.micrCode",
                            "title": "Micro Code"
                        },
                        {
                            "key": "ach.mobilNumber",
                            "title": "Mobil Number"
                        },
                        {
                            "key": "ach.nameOfTheDestinationBankWithBranch",
                            "title": "Name Of The Destination Bank With Branch"
                        },
                        {
                            "key": "ach.nameOfUtilityBillerBankCompany",
                            "title": "Name Of Utility Biller Bank Company"
                        },
                        {
                            "key": "ach.processedOnWithUmrn",
                            "title": "Processed On With UMRN"
                        },
                        {
                            "key": "ach.rejectionCode",
                            "title": "Rejection Code"
                        },
                        {
                            "key": "ach.rejectionReason",
                            "title": "Rejection Reason"
                        },
                        {
                            "key": "ach.schemPlanReferenceNo",
                            "title": "Scheme Plan Reference Number"
                        },
                        {
                            "key": "ach.sponsorBankCode",
                            "title": "Sponsor Bank Code"
                        },
                        {
                            "key": "ach.startDate",
                            "title": "Start Data",
                            "type":"date"
                        },
                        {
                            "key": "ach.telephoneNo",
                            "title": "Telephone Number"
                        },
                        {
                            "key": "ach.umnrNo",
                            "title": "UMNR Number"
                        },
                        {
                            "key": "ach.uptoMaximumAmt",
                            "title": "Upto Maximum Amount",
                            "type": "Number"
                        },
                        {
                            "key": "ach.utilityCode",
                            "title": "Utility Code"
                        },
                        {
                            "key": "ach.version",
                            "title": "Version",
                            "type": "Number"
                        }]
                },
                
                {
                    
                    "title": "PDC Registration",
                     
                    "items": [{
                            "key": "branch_id",
                            "title": "Branch ID"
                        },
                        {
                            "key": "frequency",
                            "title": "Account ID"
                        },
                        {
                            "key": "customer.name",
                            "title": "Savings Account Details"
                        },
                        {
                            "key": "entity.name",
                            "title": "Bank/Account ID"
                        },
                        {
                            "key": "customer.urnNo",
                            "title": "Account Type",
                            "type": "select"
                        },
                        {
                            "key": "loan.repayment",
                            "title": "Account Number"
                        },
                        {
                            "key": "customer.firstName",
                            "title": "Full Name"
                        },
                        {
                            "key": "customer.lastName",
                            "title": "Loan account Number"
                        },
                        {
                            "key": "loan.amount",
                            "title": "Instalment Number"
                        },
                        {
                            "key": "loan_purpose",
                            "title": "ACH Registered Date",
                            "type": "date"
                        },
                        {
                            "key": "loan_purpose2",
                            "title": "ACH Submitted date",
                            "type": "date"
                        },
                        {
                            "key": "center.name",
                            "title": "Max ECS Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Repayment Frequency",
                            "type": "select"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Instalment Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "First Instalment Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Last Instalment Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "First Instalment Date",
                            "type": "date"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Last Instalment Date",
                            "type": "date"
                        }]
                }
                
            ]
        }]
    }]
        },
     
        {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Save Details",
                    }]
                }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory(irf.page("loans.individual.collections.TransactionAuthorizationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "TransactionAuthorizationQueue",
        "type": "search-list",
        "name": "TransactionAuthorizationQueue",
        "title": "TRANSACTION_AUTHORIZATION_QUEUE",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "SEARCH_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "title": 'SEARCH_OPTIONS',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },*/
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 5
                    },
                    body:[
                        {
                            custname:"Kanimozhi",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue:"1232",
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Sudha",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue:"1176",
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"Rajesh",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue:"3683",
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                /*itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },*/
                expandable:true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        'Loan Number: ' + item.loanacno,
                        'Amount Due: ' + item.amountdue,
                        'Payment Type:' + item.paymenttype
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Verify",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.TransactionAuthorization', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);



irf.pageCollection.factory(irf.page("loans.individual.collections.TransactionAuthorization"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
    SessionStore,$state,$stateParams,Masters,authService){

    return {
        "type": "schema-form",
        "title": "Payment Details for Loan : " + $stateParams.pageId,
        initialize: function (model, form, formCtrl) {
            $log.info("Transaction Authorization Page got initialized");

            model.customer_name = "GeeKay Industries";
            model.applicant_name = "Kanimozhi";
            model.co_applicant_name = "Raja";
            model.principal = 14872.36;
            model.interest = 4235.64;
            model.fee = 40;
            model.penal_interest = 200;
            model.amountDue = 19548;
            model.amountCollected = 10000;
        },
        
        form: [
            {
                "type":"box",
                "title":"Payment",
                "items":[
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"customer_name",
                                        title:"ENTERPRISE_NAME",
                                        readonly:true
                                    },
                                    {
                                        key:"applicant_name",
                                        title:"APPLICANT",
                                        readonly:true,
                                    },
                                    {
                                        key:"co_applicant_name",
                                        title:"CO_APPLICANT",
                                        readonly:true,
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"principal",
                                        title:"Principal",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"interest",
                                        title:"Interest",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "int_waived_off",
                                        title: "Waived",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"penal_interest",
                                        title:"Penal Interest",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "p_int_waived_off",
                                        title: "Waived",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"fee",
                                        title:"Fees & Other Charges",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "fee_waived_off",
                                        title: "Waived",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"amountDue",
                                        title:"Amount due",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"amountCollected",
                                        title:"Amount Collected",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"status",
                                        title:"",
                                        type:"radios",
                                        titleMap:{
                                            "1":"Approve",
                                            "2":"Reject"
                                        }
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        key:"reject_reason",
                        title:"Reject Reason",
                        type:"select",
                        titleMap: [{
                            "name":"Amount not creditted in account",
                            "value":"1"
                        }],
                        condition:"model.status=='2'"
                    },
                    {
                        key:"reject_remarks",
                        title:"Reject Remarks",
                        readonly:false,
                        condition:"model.status=='2'"
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return ManagementHelper.getVillageSchemaPromise();
        },
        actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                console.warn(model);
                if (window.confirm("Save?") && model.village) {
                    PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.collections.DepositStage"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "irfElementsConfig", function($log, Enrollment, SessionStore,$state,$stateParams,irfElementsConfig){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "DEPOSIT_STAGE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.loggedInUser = SessionStore.getUsername();

            model.pendingCashDeposits = [{
                "loan_ac_no":"508640101335",
                "customer_name":"GeeKay Industries",
                "amount_collected": 10000
            },
            {
                "loan_ac_no":"508640108276",
                "customer_name":"Manjunatha Hydroflexibles",
                "amount_collected":6000
            },
            {
                "loan_ac_no":"5010001229347869",
                "customer_name":"VSR Engineering",
                "amount_collected":49816
            }];
            model.depositBank = "HDFC Bank";
            model.depositBranch = "Nungambakkam";

            model.totalAmount=0;
            for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
                model.totalAmount+=model.pendingCashDeposits[i].amount_collected;
            }
            model.amountDeposited = model.totalAmount;
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr": "'Cash to be deposited by '+ model.loggedInUser", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
            {
                "type":"array",
                "key":"pendingCashDeposits",
                "add":null,
                "remove":null,
                "view": "fixed",
                "readonly":true,
                "notitle":true,
                "items":[{
                    "type":"section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-xs-8 col-md-8",
                        "items": [{
                            "key":"pendingCashDeposits[].customer_name",
                            "titleExpr":"model.pendingCashDeposits[arrayIndex].loan_ac_no",
                            "title":" "
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-4 col-md-4",
                        "items": [{
                            "key": "pendingCashDeposits[].amount_collected",
                            "type":"amount",
                            "title": " "
                        }]
                    }]
                }]
            },
            {
                "type":"section",
                "html":"<hr>"
            },
            {
                "type":"section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-12",
                    "items": [{
                        "type": "amount",
                        "key": "totalAmount",
                        "title":"TOTAL_TO_BE_DEPOSITED",
                        "readonly":true
                    }]
                }]
            },
            {
                "key":"amountDeposited",
                "type":"amount",
                "title":"AMOUNT_DEPOSITED"
            },
            {
                "key":"depositBank",
                "title":"DEPOSITED_BANK"
            },
            {
                "key":"depositBranch",
                "title":"DEPOSITED_BRANCH"
            }
            ]
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory(irf.page("loans.individual.collections.DepositQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, Enrollment, $state, SessionStore,$q, entityManager){
    return {
        "type": "search-list",
        "title": "DEPOSIT_QUEUE",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "SEARCH_DEPOSITS",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    },
                   /* "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },*/
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 3
                    },
                    body:[
                        {
                            loanofficer:"Karthikeyan",
                            custname:"GeeKay Industries",
                            applicant: "Kanimozhi",
                            coApplicant: "Raja",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue: 19548,
                            principal: 14872.36,
                            interest: 4235.64,
                            penalInterest: 200,
                            charges: 200,
                            fees: 40,
                            numberOfDues: 2,
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            loanofficer:"Krithika",
                            custname:"Manjunatha Hydroflexibles",
                            applicant: "Sudha",
                            coApplicant: "Ragunath",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue: 19397,
                            principal: 14844.7,
                            interest: 4262.3,
                            penalInterest: 150,
                            charges: 100,
                            fees: 40,
                            numberOfDues: 1,
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            loanofficer:"Manoj",
                            custname:"VSR Engineering",
                            applicant: "Rajesh",
                            coApplicant: "Selvam",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue: 49816,
                            principal: 37110.26,
                            interest: 10655.74,
                            penalInterest: 1200,
                            charges: 750,
                            fees: 100,
                            numberOfDues: 1,
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                expandable: true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_OFFICER'|translate}}: " + item.loanofficer,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.loanacno,
                        "{{'Amount Paid'|translate}}: " + item.amountdue
                    ]
                },
                getActions: function(){
                    return [
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHClearingCollection"),
["$log", "SessionStore",'Utils', function($log, SessionStore, Utils) {
    return {
        "type": "schema-form",
        "title": "ACH Collections",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Ajay Karthik | GKB Industries Ltd. | 5607891 | Belgaum branch",
                "Ravi S | Key Metals Pvt. Ltd. | 8725678 | Hubli branch"
            ];

            for(var i=0;i<docsTitles.length;i++){


                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }
        },
        
        form: [

                {
                    "type":"box",
                    "title":"Daily Collections",
                    "items":[
                                    
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"EMI",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"UMRN",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Record Repayment",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-money",
                                                        "type":"button",
                                                        "readonly":false
                                                    }


                                                   ]
                                    }
                            ]

                }
           
              ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("ACHSubmission"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "ACHSubmission",
        "type": "schema-form",
        "name": "ACHSubmission",
        "title": "ACH SUBMISSION",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Submit to Bank",
                "Update Status"

            ];

            for(var i=0;i<docsTitles.length;i++){
                var download=false;
                var upload=true;
                if (i==0) download = true;
                if (i==0) upload = false;

                model.loanDocs[i]= {
                    "title":docsTitles[i],
                    "download": download,
                    "upload": upload
                }

            }
        },
        
        form: [

                {
                    "type":"box",
                    "title":"ACH Submission and Status Update",
                    
                                        "htmlClass": "text-danger",
                    "items":[
                                    
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"Download",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        "type":"button",
                                                        "readonly":false,
                                                        "condition": "model.loanDocs[arrayIndex].download"
                                                    },
                                                
                                                   
                                                    {
                                                        "key": "image1",
                                                        "type": "file",
                                                        "title": "Upload ACH Status",
                                                        "condition": "model.loanDocs[arrayIndex].upload"
                                                        

                                                    }


                                                   ]
                                    }
                            ]

                }
           
              ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("Collections"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "Collections",
        "type": "schema-form",
        "name": "Collections",
        "title": "ACH Clearing - Collection",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "ACH Demand",
                "PDC Demand",
                "Combined (Daily) Demand"
            ];

            for(var i=0;i<docsTitles.length;i++){


                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }
        },
        
        form: [

                {
                    "type":"box",
                    "title":"Daily Collections",
                    "items":[
                                    
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"Download",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        "type":"button",
                                                        "readonly":false
                                                    }


                                                   ]
                                    }
                            ]

                }
           
              ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("PDCCollections"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "PDCCollections",
        "type": "schema-form",
        "name": "PDCCollections",
        "title": "PDC Collections",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Kaushik G | HPL | 9057328 | Trichy branch",
                "Bala R | GKMB Cotton Exports Pvt. Ltd. | 3562678 | Dindigul branch"
            ];

            for(var i=0;i<docsTitles.length;i++){


                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }
        },
        
        form: [

                {
                    "type":"box",
                    "title":"Daily Collections",
                    "items":[
                                    
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"EMI",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Cheque Number",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Bank Name",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Record Repayment",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-money",
                                                        "type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"PDC Lost Reason",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"PDC Returned Reason",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"PDC Error Action",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Record PDC Non-payment",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-money",
                                                        "type":"button",
                                                        "readonly":false
                                                    }


                                                   ]
                                    }
                            ]

                }
           
              ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"),
["$log", "ACHPDC","PageHelper","irfProgressMessage", "SessionStore","$state","Utils", "$stateParams", function($log, ACHPDC,PageHelper,irfProgressMessage, SessionStore,$state,Utils,$stateParams){

	var branch = SessionStore.getBranch();

	return {
		"id": "ach",
		"type": "schema-form",
		"name": "ach_pdc",
		"title": "ACH REGISTRATION",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			$log.info("ACH selection Page got initialized");
			 model.ach = model.ach||{};
			 if (model._ach.accountNumber) {
				model.ach.loanAccountNumber=model._ach.accountNumber;
			 } else if ($stateParams.pageId) {
			  model.ach.loanAccountNumber=$stateParams.pageId;
			 } else {
			  $state.go("Page.Engine",{
									pageName:"loans.individual.Queue",
									pageId:null
								});
			 }
		 //   model.customer.urnNo="1234567890";
		},
		modelPromise: function(pageId,model){

		},
		offline: false,
		getOfflineDisplayItem: function(item, index){
			
		},
		form: [{
			"type": "box",
			"title": "ACH REGISTRATION",
			// sample label code
			//"readonly": false, // default-false, optional, this & everything under items becomes readonly
				 "items": [{
								"key": "ach.accountHolderName",
								"title": "ACCOUNT_HOLDER_NAME"
							},
							{
								"key": "ach.accountType",
								"title": "ACCOUNT_TYPE"
							},
							{
								"key": "ach.amount",
								"title": "AMOUNT",
								"type": "Number"
							  
							},
							{
								"key": "ach.consumerReferenceNumber",
								"title": "CONSUMER_REFERENCE_NUMBER"
							},
							{
								"key": "ach.customerAdditionalInformation",
								"title": "CUSTOMER_ADDITIONAL_INFORMATION"
							},
							{
								"key": "ach.debitAmtOF",
								"title": "DEBIT_AMOUNT_OF"
							},
							{
								"key": "ach.emailId",
								"title": "E-mail_Id"
							},
							{
								"key": "ach.endDate",
								"title": "END_DATE",
								"type": "date"
							},
							{
								"key": "ach.frequency",
								"title": "frequency"
							},
							{
								"key": "ach.ifscCode",
								"title": "IFSC_Code"
							},
							{
								"key": "ach.initialRejectReason",
								"title": "INITIAL_REJECT_REASON"
							},
							{
								"key": "ach.legalAccountNumber",
								"title": "LEGAL_ACCOUNT_NUMBER"
							},
							{
								"key": "ach.loanAccountNumber",
								"title": "LOAN_ACCOUNT_NUMBER"
							},
							{
								"key": "ach.mandateDate",
								"title": "MANDATE_DATE",
								"type":"date"
							},
							{
								"key": "ach.micrCode",
								"title": "MICRO_CODE"
							},
							{
								"key": "ach.mobilNumber",
								"title": "MOBIL_NUMBER"
							},
							{
								"key": "ach.nameOfTheDestinationBankWithBranch",
								"title": "NAME_OF_THE_DESTINATION_BANK_WITH_BRANCH"
							},
							{
								"key": "ach.nameOfUtilityBillerBankCompany",
								"title": "NAME_OF_UTILITY_BILLER_BANK_COMPANY"
							},
							{
								"key": "ach.processedOnWithUmrn",
								"title": "PROCESSED_ON_WITH_UMRN"
							},
							{
								"key": "ach.rejectionCode",
								"title": "REJECTION_CODE"
							},
							{
								"key": "ach.rejectionReason",
								"title": "REJECTION_REASON"
							},
							{
								"key": "ach.schemPlanReferenceNo",
								"title": "SCHEME_PLAN_REFERENCE_NUMBER"
							},
							{
								"key": "ach.sponsorBankCode",
								"title": "SPONSOR_BANK_CODE"
							},
							{
								"key": "ach.startDate",
								"title": "START_DATA",
								"type":"date"
							},
							{
								"key": "ach.telephoneNo",
								"title": "TELEPHONE_NUMBER"
							},
							{
								"key": "ach.umnrNo",
								"title": "UMNR_NUMBER"
							},
							{
								"key": "ach.uptoMaximumAmt",
								"title": "UPTO_MAXIMUM_AMOUNT",
								"type": "Number"
							},
							{
								"key": "ach.utilityCode",
								"title": "UTILITY_CODE"
							}
						]
					   
				},
			 
				{
					"type": "actionbox",
					"condition":"!model.ach.id",
					"items": [{
						"type": "submit",
						"title": "Submit",
							  }]
				},
				{
					"type": "actionbox",
					"condition":"model.ach.id",
					"items": [{
						"type": "submit",
						"title": "Update",
							  }]
				}],
			schema: function() {
            return ACHPDC.getSchema().$promise;
       		 },
			actions: {
				submit: function(model, form, formName){

					$log.info("Inside submit()");
					PageHelper.showLoader();
					if (model.ach.id) {
						ACHPDC.update(model.ach, function(response){
							PageHelper.hideLoader();
							model.ach=Utils.removeNulls(model.ach,true);
						}, function(errorResponse){
							PageHelper.hideLoader();
							PageHelper.showErrors(errorResponse);
						});
					} else {
						ACHPDC.create(model.ach, function(response){
							PageHelper.hideLoader();
							model.ach=response;
						}, function(errorResponse){
							PageHelper.hideLoader();
							PageHelper.showErrors(errorResponse);
						});
					}
						// $state.go("Page.Engine", {
						//     pageName: 'IndividualLoanBookingConfirmation',
						//     pageId: model.customer.id
						// });
				}
			}
	};
}]);
irf.pageCollection.factory('Pages_ManagementHelper', ["$state", "$q",function($state, $q){
    return {
        backToDashboard : function(){
            $state.go('Page.ManagementDashboard',{
                pageName:"ManagementDashboard",
                pageId:null,
                pageData:null
            });
        },
        getCentreSchemaPromise: function(){
            return $q.resolve({
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "required":["centre"],
                "properties": {
                    "centre":{
                        "type":"object",
                        "required": [
                            "version",
                            "centre_name",
                            "centre_code",
                            "centre_address",
                            "branch_id",
                            "status",
                            "language_code",
                            "centre_name_in_local"
                        ],
                        "properties":{
                            "version":{
                                "title":"VERSION",
                                "type":"number",
                                "default":0,
                                "minimum":0
                            },
                            "centre_name":{
                                "title":"CENTRE_NAME",
                                "type":"string",
                                "minLength":2
                            },
                            "centre_code":{
                                "title":"CENTER_CODE",
                                "type":"string",
                                "minLength":1
                            },
                            "centre_address":{
                                "title":"ADDRESS",
                                "type":"string"
                            },
                            "branch_id":{
                                "title":"BRANCH_ID",
                                "type":"number",
                                "minimum":0
                            },
                            "status":{
                                "title":"STATUS",
                                "type":"string",
                                "enum":["ACTIVE","INACTIVE"],
                                "default":"ACTIVE"
                            },
                            "employee":{
                                "title":"EMPLOYEE_CODE",
                                "type":"string"
                            },
                            "centre_leader_urn":{
                                "title":"CENTRE_LEADER_URN",
                                "type":"string"
                            },
                            "weekly_meeting_day":{
                                "type":"string",
                                "title":"WEEKLY_MEETING_DAY",
                                "enum":["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]
                            },
                            "weekly_meeting_time":{
                                "title":"WEEKLY_MEETING_TIME",
                                "type":"string"
                            },
                            "monthly_meeting_date":{
                                "type":"string",
                                "title":"MONTHLY_MEETING_DATE"
                            },
                            "monthly_meeting_day":{
                                "type":"string",
                                "title":"MONTHLY_MEETING_DAY"
                            },
                            "monthly_meeting_time":{
                                "type":"string",
                                "title":"MONTHLY_MEETING_TIME"
                            },
                            "created_by":{
                                "type":"string",
                                "readonly":true
                            },
                            "field3":{
                                "title":"FIELD3",
                                "type":"string"
                            },
                            "field4":{
                                "title":"FIELD4",
                                "type":"string"
                            },
                            "field5":{
                                "title":"FIELD5",
                                "type":"string"
                            },
                            "language_code":{

                                "type":"string",
                                "minLength":2,
                                "maxLength":2,
                                "default": "hi",
                                "title": "LANGUAGE_CODE",
                                "enum":["hi","en"]
                            },
                            "centre_name_in_local":{
                                "type":"string",
                                "title":"CENTRE_NAME_IN_LOCAL"
                            }
                        }
                    }
                }
            });
        },
        getVillageSchemaPromise: function() {
            return $q.resolve({
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "required":["village"],
                "properties": {
                    "village": {
                        "required": [
                            "version",
                            "village_name",
                            "village_name_in_local",
                            "language_code",
                            "pincode",
                            "fregcode"
                        ],
                        "type": "object",
                        "properties": {
                            "version": {
                                "type": "number",
                                "title": "VERSION",
                                "default":0,
                                "minimum":0
                            },
                            "village_name": {
                                "type": "string",
                                "title": "VILLAGE_NAME"
                            },
                            "village_name_in_local": {
                                "type": "string",
                                "title": "VILLAGE_NAME_IN_LOCAL"
                            },
                            "language_code": {
                                "type": "string",
                                "default": "hi",
                                "title": "LANGUAGE_CODE",
                                "enum":["hi","en"]
                            },
                            "branch_id": {
                                "type": "number",
                                "enumCode":"branch",
                                "title": "BRANCH"
                            },
                            "pincode": {
                                "type": "number",
                                "title": "PIN_CODE",
                                "minimum": 100000,
                                "maximum": 999999
                            },
                            "fregcode": {
                                "type": "number",
                                "title": "FREGCODE"
                            },
                            "created_by": {
                                "type": "string",
                                "title": "CREATED_BY"
                            },
                            "field1": {
                                "type": "string",
                                "title": "FIELD1"
                            },
                            "field2": {
                                "type": "string",
                                "title": "FIELD2"
                            },
                            "field3": {
                                "type": "string",
                                "title": "FIELD3"
                            },
                            "field4": {
                                "type": "string",
                                "title": "FIELD4"
                            },
                            "field5": {
                                "type": "string",
                                "title": "FIELD5"
                            }
                        }
                    }
                }
            });
        }
    };
}]);



irf.pageCollection.factory("Pages__Management_VillageCRU",
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	var branch = SessionStore.getBranch();
	var branchId = SessionStore.getBranchId();
    var populateData = function(model){
        PageHelper.showLoader();
        Masters.get({action:'village',id:model.village.id},function(resp,header){

            var village = model.village;
            var vm = resp.village_master;
            var rc = resp.reference_code;
            var ts = resp.translation;

            village.id = vm.id;
            village.village_name = vm.village_name;
            village.version = Number(rc.version);
            village.pincode = Number(vm.pincode);
            village.fregcode = Number(vm.fregcode);
            village.village_name_in_local = ts.t_value;
            village.language_code = ts.language_code;
            village.created_by = vm.created_by;
            village.field1 = rc.field1 || "";
            village.field2 = rc.field2 || "";
            village.field3 = rc.field3 || "";
            village.field4 = rc.field4 || "";
            village.field5 = rc.field5 || "";

            PageHelper.hideLoader();
        },function(resp){
            ManagementHelper.backToDashboard();
            PageHelper.showProgress('error',"Oops an error occurred",2000);
            PageHelper.showErrors(resp);
            PageHelper.hideLoader();
        });

    };

	return {
		"id": "Management_VillageCRU",
        "name":"Management_VillageCRU",
		"type": "schema-form",
		"title": $stateParams.pageId ? "EDIT_VILLAGE" : "ADD_VILLAGE",
		"subTitle": branch,
		initialize: function (model, form, formCtrl) {
			$log.info("Management VillageCRU page got initialized");
			model.branch = branch;
            model.village.branch_id = branchId;

            if(!$stateParams.pageId) {
                PageHelper.showLoader();
                authService.getUser().then(function (data) {
                    PageHelper.hideLoader();
                    model.village.created_by = data.login;

                }, function (resp) {
                    PageHelper.hideLoader();
                });
            }
			else{
				model.village.id = $stateParams.pageId;
				populateData(model);
			}

		},
		
		form: [
			{
				"type":"box",
				"title":"VILLAGE",
				"items":[

					"village.village_name",
					"village.village_name_in_local",
					"village.language_code",
                    {
                        key:"village.pincode",
                        onChange:"actions.generateFregCode(model,form)"
                    },
                    {
                        key:"village.fregcode",
                        readonly:true
                    },
					{
						key:"village.created_by",
						readonly:true

					}



				]


			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SAVE"
			}]
		}],
		schema: function() {
			return ManagementHelper.getVillageSchemaPromise();
		},
		actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
			submit: function(model, form, formName){
				$log.info("Inside submit()");
				console.warn(model);
				if (window.confirm("Save?") && model.village) {
					PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
				}
			}
		}
	};
}]);



irf.pageCollection.factory("Pages__Management_CentreCRU",
    ["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
        'SessionStore',"$state","$stateParams","Masters","authService",
        function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
                 SessionStore,$state,$stateParams,Masters,authService){

            var branch = SessionStore.getBranch();
            var branchId = SessionStore.getBranchId();

            var populateData = function(model){
                PageHelper.showLoader();
                Masters.get({action:'centre',id:model.centre.id},function(resp,header){
                    
                    var centre = model.centre;
                    var cm = resp.centre_master;
                    var rc = resp.reference_code;
                    var ts = resp.translation;

                    centre.id = cm.id;
                    centre.centre_name = cm.centre_name;
                    centre.version = Number(cm.version);
                    centre.centre_code = cm.centre_code;
                    centre.centre_address = cm.centre_address;
                    centre.status = cm.status;
                    centre.weekly_meeting_day = cm.weekly_meeting_day || "";
                    centre.monthly_meeting_date = cm.monthly_meeting_date || "";
                    centre.monthly_meeting_day = cm.monthly_meeting_day || "";
                    centre.monthly_meeting_time = cm.monthly_meeting_time || "";
                    centre.centre_name_in_local = ts.t_value;
                    centre.language_code = ts.language_code;
                    centre.created_by = cm.created_by;
                    centre.field3 = rc.field3 || "";
                    centre.field4 = rc.field4 || "";
                    centre.field5 = rc.field5 || "" ;


                    PageHelper.hideLoader();
                },function(resp){
                    ManagementHelper.backToDashboard();
                    PageHelper.showProgress('error',"Oops an error occurred",2000);
                    PageHelper.showErrors(resp);
                    PageHelper.hideLoader();
                });

            };
            return {
                "id": "Management_CentreCRU",
                "name":"Management_CentreCRU",
                "type": "schema-form",
                "title": $stateParams.pageId ? "EDIT_CENTRE" : "ADD_CENTRE",
                "subTitle": branch,
                initialize: function (model, form, formCtrl) {
                    $log.info("Management CentreCRU page got initialized");
                    model.branch = branch;

                    model.centre.branch_id = branchId;

                    if(!$stateParams.pageId) {

                        PageHelper.showLoader();
                        authService.getUser().then(function (data) {
                            PageHelper.hideLoader();
                            model.centre.created_by = data.login;

                        }, function (resp) {
                            PageHelper.hideLoader();
                        });
                    }
                    else{
                        model.centre.id = $stateParams.pageId;
                        populateData(model);
                    }

                },

                form: [
                    {
                        "type":"box",
                        "title":"CENTRE",
                        "items":[
                            "centre.centre_name",
                            "centre.centre_name_in_local",
                            "centre.language_code",
                            "centre.centre_code",
                            {
                                key:"branch",
                                readonly:true,
                                title:"BRANCH"

                            },
                            {
                                key:"centre.centre_address",
                                type:"textarea"
                            },
                            {
                                key:"centre.status",
                                type:"select"

                            },
                            "centre.weekly_meeting_day",
                            "centre.weekly_meeting_time",
                            "centre.monthly_meeting_date",
                            "centre.monthly_meeting_day",
                            "centre.monthly_meeting_time",
                            "centre.created_by"
                        ]


                    }
                    ,
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        }]
                    }],
                schema: function() {
                    return ManagementHelper.getCentreSchemaPromise();
                },
                actions: {
                    submit: function(model, form, formName){
                        $log.info("Inside submit()");
                        console.warn(model);
                        if (window.confirm("Save?") && model.centre) {
                            PageHelper.showLoader();
                            if(isNaN(model.centre.version)) model.centre.version=0;
                            model.centre.version = Number(model.centre.version)+1;
                            Masters.post({
                                action:"AddCentre",
                                data:model.centre
                            },function(resp,head){
                                PageHelper.hideLoader();
                                PageHelper.showProgress("add-centre","Done. Centre ID :"+resp.id,2000);
                                ManagementHelper.backToDashboard();
                                console.log(resp);
                            },function(resp){
                                PageHelper.hideLoader();
                                PageHelper.showErrors(resp);
                            });
                        }
                    }
                }
            };
        }]);

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

						
					];
				}
			}


		}
	};
}]);

irf.pageCollection.factory("Pages__CentreSearch",
["$log", "formHelper", "Masters","$state", "SessionStore",
function($log, formHelper, Masters,$state, SessionStore){
	var branchId = SessionStore.getBranchId();
	return {
		"id": "CentreSearch",
		"type": "search-list",
		"name": "CentreSearch",
		"title": "CENTRE_SEARCH",
		"subTitle": "",
		"uri":"Centre Search",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Centres",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"centreName": {
						"title": "CENTRE_NAME",
						"type": "string"
					}

				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Masters.query({
					'action':'listCentres',
					'branchId': branchId,
					'centre_name': searchOptions.centreName,
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 100;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
                    $state.go("Page.Engine",{
                        pageName:"Management_CentreCRU",
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
						item.centre_name,
						'Code : ' + item.centre_code,
						null
					]
				},
				getActions: function(){
					return [

					];
				}
			}


		}
	};
}]);

irf.pageCollection.factory("Pages__IndividualLoanBooking",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "SchemaResource", function($log, Enrollment, SessionStore,$state,$stateParams, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "id": "IndividualLoanBooking",
        "type": "schema-form",
        "name": "IndividualLoanBookingPage",
        "title": "Loan Booking Page",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            //$log.info("Individual Loan Booking Page got initialized");
            //model.customer.urnNo="1234567890";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "title": "LOAN ACCOUNT DETAILS", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items":[
            {
                "type": "fieldset",
                "title": "Product Details",


            "items": [
                {
                    "key": "partner.name",
                    "title": "Partner Name",
                    "type": "select"
                },
                {
                    "key": "loan.type",
                    "title": "Loan Type",
                    "type": "select"
                },
                {
                    "key": "frequency",
                    "title": "Frequency",
                    "type": "select"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Customer Details",
                "items": [
                {
                    "key": "customer.name",
                    "title": "Customer Name"
                },
                {
                    "key": "entity.name",
                    "title": "Entity Name"
                },
                {
                    "key": "customer.urnNo",
                    "title": "Customer URN",
                    "readonly": true
                }
                ]
            },
                {
                    "key": "loan.repayment",
                    "title": "Loan/Repayment Tenure"
                },
            {
                "type": "fieldset",
                "title": "Account Details",
                "items": [
                {
                    "key": "loanAccount.loanAmount"
                },
                {
                    "key": "customer.lastName",
                    "title": "Loan Application date"
                },
                {
                    "key": "loan.amount",
                    "title": "Loan purpose Level 1"
                },
                {
                    "key": "loan_purpose",
                    "title": "Loan purpose Level 2"
                },
                {
                    "key": "loan_purpose2",
                    "title": "Loan purpose Level 3"
                },
                {
                    "key": "center.name",
                    "title": "Centre Name"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Insurance Details",
                "items": [
                {
                    "key": "customer.lastName",
                    "title": "Customer Insurance Selection",
                    "type": "select"
                },
                {
                    "key": "customer.lastName",
                    "title": "Nominee Details"
                },
                {
                    "key": "customer.lastName",
                    "title": "Guardian Details"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Guarantor Details",
                "items": [
                {
                    "key": "loan_tenure",
                    "title": "Guarantor URN"
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor DSC Override"
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor DSC Remarks"
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor Liabilities"
                }
                ]
            }
                ]
            },{
                "type": "box",
                "title": "",
                "items":[
                {
                    "key": "loan_tenure",
                    "title": "First name"
                },
                {
                    "key": "loan_tenure",
                    "title": "Middle name"
                },
                {
                    "key": "loan_tenure",
                    "title": "Date of Birth"
                },
                {
                    "key": "loan_tenure",
                    "title": "Address"
                },
                {
                    "key": "loan_tenure",
                    "title": "Assets"
                },
                {
                    "key": "loan_tenure",
                    "title": "Liabilities"
                },
                {
                "type": "fieldset",
                "title": "Collateral Details",
                "items": [
                {
                    "key": "loan_tenure",
                    "title": "Collateral Type"
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Description"
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Value"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Document 1"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Document 2"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Document 3"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Photo"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Sanction Details",
                "items": [
                {
                    "key": "loan_tenure",
                    "title": "Interest Rate"
                },
                {
                    "key": "loan_tenure",
                    "title": "Processing Fees"
                },
                {
                    "key": "loan_tenure",
                    "title": "CIBIL Charges"
                },
                {
                    "key": "loan_tenure",
                    "title": "Repayment mode"
                },
                {
                    "key": "loan_tenure",
                    "title": "Sanction Amount"
                },
                {
                    "key": "loan_tenure",
                    "title": "Sanction Date"
                },
                {
                    "key": "loan_tenure",
                    "title": "Multi Tranche",
                    "type": "radios",
                    "titleMap": {
                                "1": "Yes",
                                "2": "No"
                            }
                },
                {
                    "key": "tranche_details",
                    "title": "Tranche Details",
                    "type": "textarea"
                }
                ]
            }
                ]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Create Loan Account",
                    }
                ]
        }],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);

irf.pageCollection.factory("Pages__IndividualLoanBookingConfirmation",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "IndividualLoanBookingConfirmation",
        "type": "schema-form",
        "name": "IndividualLoanBookingConfirmationPage",
        "title": "Confirm Loan Booking",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.customer.urnNo="1234567890";
            model.interest_rate="25%";
            model.processing_fees="0.5%";
            model.cibil_charges="Rs. 100";
            model.repayment_mode="PDC";
            model.sanction_amount="Rs. 5,00,000";
            model.sanction_date="04/08/2016";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN ACCOUNT DETAILS", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "partner.name",
                    "title": "Partner Name",
                    "readonly": true
                },
                {
                    "key": "loan.type",
                    "title": "Loan Type",
                    "readonly": true
                },
                {
                    "key": "frequency",
                    "title": "Frequency",
                    "readonly": true
                },
                {
                    "key": "customer.name",
                    "title": "Customer Name",
                    "readonly": true
                },
                {
                    "key": "entity.name",
                    "title": "Entity Name",
                    "readonly": true
                },
                {
                    "key": "customer.urnNo",
                    "title": "Customer URN",
                    "readonly": true
                },
                {
                    "key": "loan.repayment",
                    "title": "Loan/Repayment Tenure",
                    "readonly": true
                },
                {
                    "key": "customer.firstName",
                    "title": "Loan Amount",
                    "readonly": true
                },
                {
                    "key": "customer.lastName",
                    "title": "Loan Application date",
                    "readonly": true
                },
                {
                    "key": "loan.amount",
                    "title": "Loan purpose Level 1",
                    "readonly": true
                },
                {
                    "key": "loan_purpose",
                    "title": "Loan purpose Level 2",
                    "readonly": true
                },
                {
                    "key": "loan_purpose2",
                    "title": "Loan purpose Level 3",
                    "readonly": true
                },
                {
                    "key": "center.name",
                    "title": "Centre Name",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor URN",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "First name",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Middle name",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Date of Birth",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Address",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Assets",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Liabilities",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Type",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Description",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Value",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Document 1",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Document 2",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Document 3",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Photo",
                    "readonly": true
                },
                {
                    "key": "interest_rate",
                    "title": "Interest Rate",
                    "readonly": true
                },
                {
                    "key": "processing_fees",
                    "title": "Processing Fees",
                    "readonly": true
                },
                {
                    "key": "cibil_charges",
                    "title": "CIBIL Charges",
                    "readonly": true
                },
                {
                    "key": "repayment_mode",
                    "title": "Repayment mode",
                    "readonly": true
                },
                {
                    "key": "sanction_amount",
                    "title": "Sanction amount",
                    "readonly": true
                },
                {
                    "key": "sanction_date",
                    "title": "Sanction date",
                    "readonly": true
                },
                {
                    "key": "customer_sign_date",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "disbursement_date",
                    "title": "Disbursement Date",
                    "type": "date"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "Back",
                        "onClick": "actions.reenter(model, formCtrl, form, $event)"
                    },{
                        "type": "submit",
                        "title": "Confirm Loan Creation"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'ViewIndividualLoan',
                        pageId: model.customer.id
                    });
            },
            reenter: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'IndividualLoanBooking',
                    pageId: model.customer.id
                });
            }
        }
    };
}]);
irf.pageCollection.factory("Pages__GenerateEMISchedule",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "GenerateEMISchedule",
        "type": "schema-form",
        "name": "GenerateEMISchedule",
        "title": "Generate EMI Schedule",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");

            model.customer_sign_date="05-Aug-2016";
            model.expected_disbursement_date="08-Aug-2016";
            model.fro_remarks="New Machinery arrived and verified";
            model.cro_remarks="verified and approved";

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Tranche #3 | Disbursement Details | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                
                {
                    "key": "customer_sign_date",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "expected_disbursement_date",
                    "title": "Expected Disbursement Date",
                    "type": "date"
                },
                {
                    "key": "fro_remarks",
                    "title": "FRO Approve Remarks"
                },
                {
                    "key": "cro_remarks",
                    "title": "CRO Approve Remarks"
                },
                {
                    "title":"EMI Schedule",
                    "htmlClass":"btn-block",
                    "icon":"fa fa-download",
                    "type":"button",
                    "readonly":false

                },
                {
                    title:"Upload",
                    key:"fileid",
                    type:"file",
                    fileType:"*/*",
                    category: "Loan",
                    subCategory: "DOC1"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory("Pages__PendingCRO",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "PendingCRO",
        "type": "schema-form",
        "name": "PendingCRO",
        "title": "CRO Approval",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("CRO Approval Page got initialized");

            model.tranche_no = "3";
            model.cro_requested_date="08-Aug-2016";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Tranche #3 | Disbursement Details | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "tranche_no",
                    "title": "Tranche Details"
                },
                {
                    "key": "FRO_remarks",
                    "title": "Remarks"
                },
                {
                    "key": "CRO_remarks",
                    "title": "Remarks"
                },
                {
                    "key": "cro_requested_date",
                    "title": "Hub Manager Requested Date",
                    "type": "date"
                },
                {
                    "key": "cro_status",
                    "title": "Status",
                    "type": "radios",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "cro_reject_reason",
                    "title": "CRO Approve Remarks",
                    "type": "select"
                },
                {
                    "key": "cro_reject_remarks",
                    "title": "CRO Rejection Remarks",
                    "type": "select"
                },
                {
                    "key": "latitude",
                    "title": "Location",
                    "type": "geotag",
                    "latitude": "fro.latitude",
                    "longitude": "fro.longitude"
                },
                {
                    key:"FROVerificationPhoto",
                    "title":"Photo",
                    "category":"customer",
                    "subCategory":"customer",
                    offline: false,
                    type:"file",
                    fileType:"image/*"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory("Pages__PendingFRO",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "PendingFRO",
        "type": "schema-form",
        "name": "PendingFRO",
        "title": "FRO Approval",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("FRO Approval Page got initialized");

            model.tranche_no = "3";
            model.fro_requested_date="08-Aug-2016";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Tranche #3 | Disbursement Details | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "tranche_no",
                    "title": "Tranche Details"
                },
                {
                    "key": "FRO_remarks",
                    "title": "Remarks"
                },
                {
                    "key": "fro_requested_date",
                    "title": "Hub Manager Requested Date",
                    "type": "date"
                },
                {
                    "key": "fro_status",
                    "title": "Status",
                    "type": "radios",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "fro_reject_reason",
                    "title": "FRO Approve Remarks",
                    "type": "select"
                },
                {
                    "key": "fro_reject_remarks",
                    "title": "FRO Rejection Remarks",
                    "type": "select"
                },
                {
                    "key": "latitude",
                    "title": "Location",
                    "type": "geotag",
                    "latitude": "latitude",
                    "longitude": "longitude"
                },
                {
                    key:"FROVerificationPhoto",
                    "title":"Photo",
                    "category":"customer",
                    "subCategory":"customer",
                    offline: false,
                    type:"file",
                    fileType:"image/*"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory("Pages__MultiTranche",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "MultiTranche",
        "type": "schema-form",
        "name": "MultiTranche",
        "title": "SUBSEQUENT TRANCHE DISBURSEMENT",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "TRANCHE 3 | DISBURSEMENT DETAILS | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "bank_name",
                    "title": "Tranche Details",
                    "type": "textarea"
                },
                {
                    "key": "branch_name",
                    "title": "Disbursement Date",
                    "type": "date"
                },
                {
                    "key": "branch_name",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "branch_name",
                    "title": "Remarks For Tranche Disbursement"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Send For FRO Verification"
                    },{
                        "type": "submit",
                        "title": "Reset"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory("Pages__DisbursementConfirmQueue",
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "DisbursementConfirmQueue",
        "type": "search-list",
        "name": "DisbursementConfirmQueue",
        "title": "Disbursement Confirmation Queue",
        "subTitle": "",
        //"uri":"Customer Enrollment/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'Stage02';
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "Filter Loan List",
            autoSearch: true,
            sorting:true,
            sortByColumns:{
                "sanction_date":"Sanction Date",
                "disbursement_date":"Disbursement Date",
                "branch":"Branch",
                "centre":"Centre"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    /*
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }
                        }
                    },
                    */
                    "customer_name": {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                            "name": "Ajay Karthik | GKB Industries Ltd.",
                            "loan_amount": "7,50,000",
                            "cycle": "5607891 | Belgaum branch",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S | Key Metals Pvt. Ltd.",
                            "loan_amount": "20,00,00",
                            "cycle": "8725678 | Hubli branch",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G | HPL",
                            "loan_amount": "30,00,000",
                            "cycle": "9057328 | Trichy branch",
                            "sanction_date": "01/07/2016"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }
                }
                return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Update confirmation Status",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);

irf.pageCollection.factory("Pages__RejectConfirmQueue",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "RejectConfirmQueue",
        "type": "schema-form",
        "name": "RejectConfirmQueue",
        "title": "REJECT CONFIRMATION QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Select Loans To Disburse OR Upload File", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "loan_acc_1",
                    "title": "Ajay Karthik | GKB Industries Ltd.",
                    "type": "checkbox",
                    "schema": {
                        "default": false
                    }
                },
                {
                    "key": "loan_acc_2",
                    "title": "Ravi S | Key Metals Pvt. Ltd.",
                    "type": "checkbox",
                    "schema": {
                        "default": false
                    }
                },
                {
                    "key": "loan_acc_3",
                    "title": "Kaushik G | HPL",
                    "type": "checkbox",
                    "schema": {
                        "default": false
                    }
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Reject Selected Accounts"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory(irf.page("loans.individual.booking.PendingQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "LOAN_BOOKING_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "LOAN_TYPE",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            /*"titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }*/
                            "enumCode": "loan_product"
                        }
                    },
                    
                    "customer_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "ENTITY_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "centre"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
                    'customerId': searchOptions.customerId
                }).$promise;
                //var out = {
                //    body: [
                //        {
                //            "name": "Ajay Karthik | GKB Industries Ltd.",
                //            "loan_amount": "7,50,000",
                //            "cycle": "5607891 | Belgaum branch",
                //            "sanction_date": "12/07/2016"
                //        },
                //        {
                //            "name":"Ravi S | Key Metals Pvt. Ltd.",
                //            "loan_amount": "20,00,00",
                //            "cycle": "8725678 | Hubli branch",
                //            "sanction_date": "17/07/2016"
                //        },
                //        {
                //            "name":"Kaushik G | HPL",
                //            "loan_amount": "30,00,000",
                //            "cycle": "9057328 | Trichy branch",
                //            "sanction_date": "01/07/2016"
                //        }
                //    ],
                //    headers: {
                //        "method": "GET",
                //        "x-total-count": 20
                //    }
                //}
                //return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
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

irf.pageCollection.factory(irf.page("loans.individual.booking.CaptureDisbursement"),
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", function($log, Enrollment, SessionStore, $state, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "LOAN_BOOKING_SCREEN",
        initialize: function (model, form, formCtrl) {
            $log.info("Loan Booking Screen got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "title": "LOAN_ACCOUNT", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional

            "items": [
                {
                    "key": "loanAccount.accountNumber",
                    
                    "readonly": true,
                    "type": "number"
                },
                {
                    "key": "loanAccount.disbursementSchedules.customerSignatureDate",
                    
                    "type": "date",
                    "required": true,
                    "onChange": function(modelValue, form, model, formCtrl, event) {
                        model.loanAccount.scheduledDisbursementDate = moment(modelValue).add(2,"days");
                    }
                },
                {
                    "key": "loanAccount.disbursementSchedules.scheduledDisbursementDate",
                    
                    "type": "date"
                },
                {
                    "type": "submit",
                    "title": "SUBMIT"
                }
            ]
        }],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                // Disbursement Date should be >= Sanction Date + 30 days
                // if (model.loanAccount.sanctionDate <= model.loanAccount.scheduledDisbursementDate-30)
                {
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
                }
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentUpload"),
["$log", "Enrollment", "SessionStore", "$state", function($log, Enrollment, SessionStore, $state){

    return {
        "type": "schema-form",
        "title": "DOCUMENT_EXECUTION",
        "subTitle": " ",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            var docsTitles = [
                "Loan Application",
                "Legal Agreements ",
                "Legal Schedule",
                "Loan sanction documents",
                "PDC/ACH",
                "PHS",
                "Supporting documents"

            ];
            for(var i=0;i<docsTitles.length;i++){
                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }
            /*
            // Test reject remarks
            model.loanDocs[4].status = "Rejected";
            model.loanDocs[4].rejectReason = "Overwriting on Cheque";
            */
        },
        
        form: [

                {
                    "type":"box",
                    "colClass": "col-sm-12",
                    "title":"DOCUMENT_EXECUTION",
                    "htmlClass": "text-danger",
                    "items":[
                        {
                            "type":"array",
                            "notitle": true,
                            "view": "fixed",
                            "key":"loanDocs",
                            "add":null,
                            "remove":null,
                            "items":[
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "loanDocs[].title",
                                            "notitle":true,
                                            "title": " ",
                                            "readonly": true
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-4",
                                        "items": [{
                                            "title":"STATUS",
                                            "titleExpr": "model.loanDocs[arrayIndex].status",
                                            "key": "loanDocs[].rejectReason",
                                            "readonly": true
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "items": [{
                                            "title":"DOWNLOAD",
                                            "htmlClass":"btn-block",
                                            "icon":"fa fa-download",
                                            "type":"button",
                                            "readonly":false
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            title:"Upload",
                                            key:"loanDocs[].fileid",
                                            type:"file",
                                            fileType:"*/*",
                                            category: "Loan",
                                            subCategory: "DOC1",
                                            "notitle": true
                                        }]
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
            "type": "actionbox",
            "items": [{
                    "type": "submit",
                    "title": "Submit"
                }]
            }
            ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Redirecting");
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentVerification"),
["$log", "Enrollment", "SessionStore", "$state", function($log, Enrollment, SessionStore, $state){

    return {
        "type": "schema-form",
        "title": "DOCUMENT_VERIFICATION",
        "subTitle": " ",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            var docsTitles = [
                "Loan Application",
                "Legal Agreements ",
                "Legal Schedule",
                "Loan sanction documents",
                "PDC/ACH",
                "PHS",
                "Supporting documents"

            ];
            for(var i=0;i<docsTitles.length;i++){
                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }

            /*
            // Test rejection remarks
            model.loanDocs[4].status = "Rejected";
            model.loanDocs[4].rejectReason = "Overwriting on Cheque";
            */
        },
        
        form: [

                {
                    "type":"box",
                    "colClass": "col-sm-12",
                    "htmlClass": "text-danger",
                    "items":[
                        {
                            "type":"array",
                            "notitle": true,
                            "view": "fixed",
                            "key":"loanDocs",
                            "add":null,
                            "remove":null,
                            "items":[
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "loanDocs[].title",
                                            "notitle":true,
                                            "title": " ",
                                            "readonly": true
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "items": [{
                                            "title":"REJECTION_REASON",
                                            "notitle": true,
                                            "type": "select",
                                            "key": "loanDocs[].rejectReason"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title":"REMARKS",
                                            "key": "loanDocs[].rejectReason"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title":"ACTION",
                                            "notitle": true,
                                            "htmlClass":"btn-block",
                                            "type":"radios",
                                            "readonly":false,
                                            "enumCode": "action_approval",
                                            /*
                                            "titleMap": {
                                                    "1": "Approve",
                                                    "2": "Reject"
                                                },
                                            */
                                            "key": "loanDocs[].docStatus"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-1",
                                        "items": [{
                                            "title":"View",
                                            "htmlClass":"btn-block",
                                            "icon":"fa fa-download",
                                            "type":"button",
                                            "readonly":false
                                        }]
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
            "type": "actionbox",
            "items": [{
                    "type": "submit",
                    "title": "Submit"
                }]
            }
            ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Redirecting");
                $state.go('Page.Engine', {pageName: 'PendingDocumentVerification', pageId: ''});
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.booking.PendingVerificationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "PENDING_VERIFICATION_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "LOAN_TYPE",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            /*"titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }*/
                            "enumCode": "loan_product"
                        }
                    },
                    
                    "customer_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "ENTITY_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "centre"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
                    'customerId': searchOptions.customerId
                }).$promise;
                //var out = {
                //    body: [
                //        {
                //            "name": "Ajay Karthik | GKB Industries Ltd.",
                //            "loan_amount": "7,50,000",
                //            "cycle": "5607891 | Belgaum branch",
                //            "sanction_date": "12/07/2016"
                //        },
                //        {
                //            "name":"Ravi S | Key Metals Pvt. Ltd.",
                //            "loan_amount": "20,00,00",
                //            "cycle": "8725678 | Hubli branch",
                //            "sanction_date": "17/07/2016"
                //        },
                //        {
                //            "name":"Kaushik G | HPL",
                //            "loan_amount": "30,00,000",
                //            "cycle": "9057328 | Trichy branch",
                //            "sanction_date": "01/07/2016"
                //        }
                //    ],
                //    headers: {
                //        "method": "GET",
                //        "x-total-count": 20
                //    }
                //}
                //return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
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

irf.pageCollection.factory(irf.page("loans.individual.booking.RejectedDisbursementsQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "REJECTED_DISBURSEMENTS_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "LOAN_TYPE",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            /*"titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }*/
                            "enumCode": "loan_product"
                        }
                    },
                    
                    "customer_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "ENTITY_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "centre"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
                    'customerId': searchOptions.customerId
                }).$promise;
                //var out = {
                //    body: [
                //        {
                //            "name": "Ajay Karthik | GKB Industries Ltd.",
                //            "loan_amount": "7,50,000",
                //            "cycle": "5607891 | Belgaum branch",
                //            "sanction_date": "12/07/2016"
                //        },
                //        {
                //            "name":"Ravi S | Key Metals Pvt. Ltd.",
                //            "loan_amount": "20,00,00",
                //            "cycle": "8725678 | Hubli branch",
                //            "sanction_date": "17/07/2016"
                //        },
                //        {
                //            "name":"Kaushik G | HPL",
                //            "loan_amount": "30,00,000",
                //            "cycle": "9057328 | Trichy branch",
                //            "sanction_date": "01/07/2016"
                //        }
                //    ],
                //    headers: {
                //        "method": "GET",
                //        "x-total-count": 20
                //    }
                //}
                //return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
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

irf.pageCollection.factory(irf.page("loans.individual.booking.ReadyDisbursementsQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "READY_DISBURSEMENTS_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "LOAN_TYPE",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            /*"titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }*/
                            "enumCode": "loan_product"
                        }
                    },
                    
                    "customer_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "ENTITY_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "centre"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
                    'customerId': searchOptions.customerId
                }).$promise;
                //var out = {
                //    body: [
                //        {
                //            "name": "Ajay Karthik | GKB Industries Ltd.",
                //            "loan_amount": "7,50,000",
                //            "cycle": "5607891 | Belgaum branch",
                //            "sanction_date": "12/07/2016"
                //        },
                //        {
                //            "name":"Ravi S | Key Metals Pvt. Ltd.",
                //            "loan_amount": "20,00,00",
                //            "cycle": "8725678 | Hubli branch",
                //            "sanction_date": "17/07/2016"
                //        },
                //        {
                //            "name":"Kaushik G | HPL",
                //            "loan_amount": "30,00,000",
                //            "cycle": "9057328 | Trichy branch",
                //            "sanction_date": "01/07/2016"
                //        }
                //    ],
                //    headers: {
                //        "method": "GET",
                //        "x-total-count": 20
                //    }
                //}
                //return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
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

irf.pageCollection.factory(irf.page("loans.individual.booking.PendingDisbursementsConfirmationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "PENDING_DISBURSEMENTS_CONFIRMATION_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
        definition: {
            title: "LOAN_TYPE",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "enumCode": "loan_product"
                            /*
                            "titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }*/
                        }
                    },
                    
                    "customer_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "ENTITY_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "centre"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
                    'customerId': searchOptions.customerId
                }).$promise;
                //var out = {
                //    body: [
                //        {
                //            "name": "Ajay Karthik | GKB Industries Ltd.",
                //            "loan_amount": "7,50,000",
                //            "cycle": "5607891 | Belgaum branch",
                //            "sanction_date": "12/07/2016"
                //        },
                //        {
                //            "name":"Ravi S | Key Metals Pvt. Ltd.",
                //            "loan_amount": "20,00,00",
                //            "cycle": "8725678 | Hubli branch",
                //            "sanction_date": "17/07/2016"
                //        },
                //        {
                //            "name":"Kaushik G | HPL",
                //            "loan_amount": "30,00,000",
                //            "cycle": "9057328 | Trichy branch",
                //            "sanction_date": "01/07/2016"
                //        }
                //    ],
                //    headers: {
                //        "method": "GET",
                //        "x-total-count": 20
                //    }
                //}
                //return $q.resolve(out)
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
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

irf.pageCollection.factory(irf.page("loans.individual.booking.Disburse"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "DISBURSE_LOAN",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "DISBURSEMENT_DETAILS", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    
                    "title": "BANK_NAME",
                    "key": "loanAccount.bank_name",
                    "type": "select",
                    "enumCode": "bank"
                    /*"titleMap": {
                                "1": "ICICI Bank",
                                "2": "Kotak Mahindra Bank"
                            }*/
                },
                {
                    "key": "loanAccount.customerBranch"
                },
                {

                    "key": "loanAccount.accountNumber"
                },
                {

                    
                    "key": "loanAccount.applicationStatus",
                    "type": "select",
                    "enumCode": "status"
                    /*"titleMap": {
                                "1": "Sent To Bank",
                                "2": "Reject"
                            }*/
                },
                {

                    "key": "loanAccount.reject_reason",
                    "title": "REJECTED_REASON",
                    "type": "select",
                    "enumCode": "reject_reason"
                },
                {

                    "key": "loanAccount.reject_remarks",
                    "title": "REJECT_REMARKS"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Disburse"
                    },{
                        "type": "submit",
                        "title": "Reject"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);
irf.pageCollection.factory(irf.page("loans.individual.booking.DisburseConfirmation"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "CONFIRM_LOAN_BOOKING",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN ACCOUNT DETAILS", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "loanAccount.disbursementSchedules.customerSignatureDate",
                    
                    "type": "date"
                },
                {
                    "key": "loanAccount.disbursementSchedules.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                },
                {
                    "key": "loanAccount.partnerName",
                    "title": "PARTNER_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanType",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.frequency",
                    
                    "readonly": true,
                    "type": "select",
                    "enumCode": "frequency"
                },
                {
                    "key": "loanAccount.customer.name",
                    "title": "CUSTOMER_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.entity.name",
                    "title": "ENTITY_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.urnNo",
                    "title": "CUSTOMER_URN",
                    "readonly": true
                },
                {
                    "key": "loanAccount.repayment",
                    "title": "REPAYMENT_TENURE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.firstName",
                    "title": "LOAN_AMOUNT",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.lastName",
                    "title": "LOAN_APPLICATION_DATE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanPurpose1",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanPurpose2",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanPurpose3",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanCentre",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaUrnNo",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaFirstName",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaMiddleName",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaDob",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.address",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.assetDetails",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.totalLiabilities",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral.collateralType",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral.collateralDescription",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral.collateralValue",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanDocuments[1].document",
                    "title": "DOCUMENT_1",
                    "readonly": true
                },
                {
                    "title": "DOCUMENT_2",
                    "key": "loanAccount.loanDocuments[2].document",
                    "readonly": true
                },
                {
                    "title": "DOCUMENT_3",
                    "key": "loanAccount.loanDocuments[3].document",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanDocuments.photo",
                    "title": "PHOTO",
                    "readonly": true
                },
                {
                    "key": "loanAccount.interestRate",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.processingFeeInPaisa",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.cibilCharges",
                    "title": "CIBIL_CHARGES",
                    "readonly": true
                },
                {
                    "key": "loanAccount.repayment",
                    "title": "REPAYMENT_MODE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.sanction_amount",
                    "title": "SANCTION_AMOUNT",
                    "readonly": true
                },
                {
                    "key": "loanAccount.sanctionDate",
                    
                    "readonly": true
                },
                
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "BACK",
                        "onClick": "actions.reenter(model, formCtrl, form, $event)"
                    },{
                        "type": "submit",
                        "title": "CONFIRM_LOAN_CREATION"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'ViewIndividualLoan',
                        pageId: model.customer.id
                    });
            },
            reenter: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'IndividualLoanBooking',
                    pageId: model.customer.id
                });
            }
        }
    };
}]);