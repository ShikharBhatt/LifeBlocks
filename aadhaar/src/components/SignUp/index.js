import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    aadhaar : '',
    error : null,
};

class SignUpForm extends Component{
    constructor(props){
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {

    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            aadhaar,
            error,
          } = this.state;

        const IsInvalid =
            aadhaar === '';

        return (
            <form onSubmit = {this.onSubmit}>
            
            <input
                name = "aadhaar"
                value = {aadhaar}
                onChange = {this.onChange}
                type = "text"
                placeholder = "Enter Aadhaar No."
            />
            
            <button disabled = {IsInvalid} type="submit">Sign Up</button>

            {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Haven't yet linked your aadhaar card ? <Link to={ROUTES.SIGN_UP}>Link Aadhaar</Link>
    </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink }; 