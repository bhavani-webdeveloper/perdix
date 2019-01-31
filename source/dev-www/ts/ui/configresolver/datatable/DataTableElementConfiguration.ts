import {UIElementConfiguration} from '../UIElementConfiguration';
import {Utils} from "../../../domain/shared/Utils";

export abstract class DataTableElementConfiguration extends UIElementConfiguration{
    protected elementType: string = 'datatable';
    protected abstract dtlConfig: Object;
}
