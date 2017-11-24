///<amd-dependency path="moment" name="moment"/>
/**
 * Created by shahalpk on 21/11/17.
 */

declare var moment: any;
class Utils {
    static evalInContext(context: any, str: string): any{
        let out = function(str: string){
            return eval(str);
        }.call(context, str);
        return out;
    }

    static toJSObj(data: any): Object {
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

}

export = Utils;
