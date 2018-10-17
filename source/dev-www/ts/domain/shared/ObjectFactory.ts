import {UserSession} from "./Session";
import {FormHelper} from "./FormHelper";

export class ObjectFactory {

    static getInstance(type: string): any {
        if (type == 'Session') {
            return UserSession.getInstance();
        }

        switch(type) {
        	case 'Session':
        		return UserSession.getInstance();
        	case 'FormHelper':
        		return FormHelper.getInstance();
        	default:
        		return null;
        }
    }
}
