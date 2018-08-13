import {UIElementConfiguration} from "../UIElementConfiguration";
/**
 * Created by shahalpk on 29/12/17.
 */

export abstract class RadioElementConfiguration extends UIElementConfiguration {
    protected elementType:string = 'radio';
    protected abstract onChange: Function;
}
