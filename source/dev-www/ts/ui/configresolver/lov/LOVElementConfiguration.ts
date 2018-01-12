import {UIElementConfiguration} from '../UIElementConfiguration';
import {Utils} from "../../../domain/shared/Utils";

export abstract class LOVElementConfiguration extends UIElementConfiguration{
    protected elementType: string = 'lov';
    protected abstract outputMap: Object;
    protected searchHelper: any = Utils.getFormHelper();
    protected abstract search: Function;
    protected abstract getListDisplayItem: Function;
    protected abstract onSelect: Function;
    protected abstract lovonly: boolean;
    protected abstract autolov: boolean;

}
