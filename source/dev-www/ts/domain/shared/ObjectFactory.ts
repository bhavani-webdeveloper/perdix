import {UserSession} from "./Session";
export class ObjectFactory {

    static getInstance(type: string): any {
        if (type == 'Session') {
            return UserSession.getInstance();
        }
    }
}
