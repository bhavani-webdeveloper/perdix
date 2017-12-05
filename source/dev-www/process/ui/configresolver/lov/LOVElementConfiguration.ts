abstract class LOVElementConfiguration extends UIElementConfiguration{
    protected elementType: string = 'lov';
    protected abstract outputMap: Object;
    protected abstract searchHelper: any;
    protected abstract search: Function;
    protected abstract getListDisplayItem: Function;
    protected abstract onSelect: Function;
    protected abstract lovOnly: string;
}
