import {SIGNED_IN} from '../constants';

export function logUser(aadhaar){
    const action = {
        type: SIGNED_IN,
        aadhaar
    }
    return action;
}