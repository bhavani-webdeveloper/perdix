/**
 * Created by shahalpk on 21/11/17.
 */


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
}

export = Utils;