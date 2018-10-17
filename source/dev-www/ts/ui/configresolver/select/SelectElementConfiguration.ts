import {UIElementConfiguration} from "../UIElementConfiguration";
/**
 * Created by shahalpk on 29/12/17.
 */

export abstract class SelectElementConfiguration extends UIElementConfiguration {
    protected elementType:string = 'select';
    protected enumCode:string;
}
