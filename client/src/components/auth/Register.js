// import axios from 'axios';
import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types'

const Register = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });
    const {name, email, password, password2} = formData;
    const onChange = e => {
        setFormData({...formData, [e.target.name]:e.target.value});
        // console.log(e, e.target.value);
    }
    const onsubmit = async e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('Password do not match', 'danger');
        } else {
            register({name,email,password});
            // Api call using axios
            // const newUser = {
            //     name,
            //     email,
            //     password
            // };
            // const config = {
            //     headers:{ 
            //        'Content-Type':'application/json'
            //     }
            // };
            // try {
            //     const body = JSON.stringify(newUser);
            //     console.log(newUser)
            //     const response = await axios.post('/api/users', body, config);
            //     console.log("response", response.data);
            // } catch (error) {
            //     console.log(error);
            // }
        }
    }
    if(isAuthenticated) {
        return <Redirect to="/dashboard"></Redirect>
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fa fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit ={ e => onsubmit(e)}>
                <div className="form-group">
                <input 
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange ={ e => onChange(e)}
                    // required
                />
                </div>
                <div className="form-group">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email"
                    value={email} 
                    onChange ={ e => onChange(e)}
                    // required
                />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    // minLength="6"
                    value={password}
                    onChange ={ e => onChange(e)}
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    // minLength="6"
                    value={password2}
                    onChange ={ e => onChange(e)}
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.prototype = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect
(mapStateToProps, 
{ setAlert, register }
)(Register);

