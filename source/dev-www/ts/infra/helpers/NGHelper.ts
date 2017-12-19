/**
 * Created by shahalpk on 20/12/17.
 */

declare let angular: any;

export class NGHelper {

    public static refreshUI():void {
        /* Calls $apply() method on the rootScope */
        let elem = angular.element(document.querySelector('[ng-controller]'));
        elem.scope().$root.$apply();
    }
}
