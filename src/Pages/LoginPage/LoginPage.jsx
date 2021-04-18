import React, { useEffect, useState } from 'react';
import './styling.scss'
import palm from '../../assets/hand.svg'
import { motion } from "framer-motion";
import { Input } from '@material-ui/core';

function LoginPage() {

    const [closeEyes, setCloseEyes] = useState(false);
    const [username, setUsename] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');

    return (
        <div>
            <form method="get" id="login-form" className="login-form" autoComplete="on" role="main">
                <h1 className="a11y-hidden">Login Form</h1>
                <div>
                    <label className="label-username">
                        <input type="text" className="text" name="Username" placeholder="Username" tabIndex="1" required />
                        <span className="required">Username</span>
                    </label>
                </div>
                <input type="checkbox" name="show-password" className="show-password a11y-hidden" id="show-password" tabIndex="3" />
                <label className="label-show-password" htmlFor="show-password">
                    <span>Show Password</span>
                </label>
                <div>
                    <label className="label-password">
                        <input type="text" className="text" name="password" placeholder="Password" onBlur={() => setCloseEyes(false)} onFocus={() => setCloseEyes(true)} tabIndex="2" required />
                        <span className="required">Password</span>
                    </label>
                </div>
                <Input type="submit" value="Log In" />
                <figure aria-hidden="true">
                    <div className="person-body"></div>
                    {
                        closeEyes ? (
                            <>
                                <motion.div className="left-hand" animate={{ rotate: 25 }}><img src={palm} /></motion.div>
                                <motion.div className="right-hand" animate={{ rotate: -25 }}><img src={palm} /></motion.div>
                            </>
                        ):(null)
                    }
                    <div className="neck skin"></div>
                    <div className="head skin">
                        <div className="eyes">
                            <div className="pupil"></div>
                        </div>
                        <div className="mouth"></div>
                    </div>
                    <div className="hair"></div>
                    <div className="ears"></div>
                    <div className="shirt-1"></div>
                    <div className="shirt-2"></div>
                </figure>
            </form>
        </div>
    )
}

export default LoginPage
