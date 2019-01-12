import {SIGNED_IN} from '../constants';

let user = {
    aadhaar: null
}

export default (state = user, action) => {
    switch(action.type) {
        case SIGNED_IN:
            const {aadhaar} = action;
            user = {
                aadhaar
            }
            return user;
        default:
            return state;
    }
}