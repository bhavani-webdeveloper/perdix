
import {IPolicy} from "./IPolicy";
export interface IPolicyFactory {
    fromPolicyName(name: string): IPolicy<any>;
}
