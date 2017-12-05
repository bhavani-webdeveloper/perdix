///<amd-dependency path="moment" name="moment"/>
import AngularResourceService = require("../../infra/api/AngularResourceService");
/**
 * Created by shahalpk on 21/11/17.
 */

declare var moment: Function;
class Utils {
    static evalInContext(context: any, str: string): any{
        let out = function(str: string){
            return eval(str);
        }.call(context, str);
        return out;
    }

    static toJSObj(data: any): any {
        return JSON.parse(JSON.stringify(data));
    }

    static applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }

    static getCurrentDate():string {
        return moment().format('YYYY-MM-DD');
    }

    static getFormHelper():any {
        return AngularResourceService.getInstance().getNGService("formHelper");
    }

}

export = Utils;
