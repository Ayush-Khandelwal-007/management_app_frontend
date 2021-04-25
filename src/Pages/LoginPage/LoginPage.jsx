import React, { useState } from 'react';
import './styling.scss'
import palm from '../../assets/hand.svg'
import { motion } from "framer-motion";
import { Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import logo from '../../assets/logo.jpeg'
import Axios from 'axios'
import { useHistory } from 'react-router';

function LoginPage() {

    const history=useHistory();
    const [closeEyes, setCloseEyes] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [username, setUsename] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('manager');
    const [anchorEl, setAnchorEl] = useState(null);
    const [formType, setFormType] = useState('login')
    const [loading ,setLoading] =useState(false)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handelRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        if (type === 'manager') {
            Axios.post('http://localhost:4000/api/insertp', {
                ProdUserName: username,
                ProdName: name,
                ProdPass: password,
            }).then((res) => {
                if (res.data === 'success') {
                    setName('');
                    setUsename('');
                    setPassword('');
                    setFormType('login');
                    setLoading(false);
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
        else {
            Axios.post('http://localhost:4000/api/inserte', {
                EmpUserName: username,
                EmpName: name,
                EmpPass: password,
            }).then((res) => {
                if (res.data === 'success') {
                    setName('');
                    setUsename('');
                    setPassword('');
                    setFormType('login');
                    setLoading(false);
                }
            }).catch((err)=>{
                console.log(err);
            })
        }

    }

    const handelLogin =(e)=>{
        e.preventDefault();
        setLoading(true);
        if (type === 'manager') {
            Axios.get('http://localhost:4000/api/authp', {
                params: {
                    ProdUserName: username,
                    ProdPass: password,
                }
            }).then((res) => {
                setLoading(false);
                if(parseInt(res.data)===1){
                    console.log("success");
                    history.push('/PMDashboard');
                }
            }).catch((err)=>{
                setLoading(false);
                console.log(err);
            })
        }
        else {
            Axios.get('http://localhost:4000/api/authe', {
                params: {
                    EmpUserName: username,
                    EmpPass: password,
                }
            }).then((res) => {
                setLoading(false);
                if(parseInt(res.data)===1){
                    console.log("success");
                    history.push('/EMPDashboard');
                }
            })
            .catch((err)=>{
                setLoading(false);
                console.log(err);
            })
        }

    }

    return (
        <div className='rootDiv'>
            <div className="header">
                <div
                    style={{
                        height: "6vh",
                        width: "4.5vw",
                        backgroundImage: `url(${logo})`,
                    }}
                >

                </div>
                EasyManage
            </div>
            <div className='screen'>
                <form method="get" id="login-form" className="login-form" autoComplete="off" role="main">
                    <div className='selectTypeMenu'>
                        <label>
                            <span>{formType === 'login' ? ('Login') : ('Register')} as:</span>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                {type}
                            </Button>
                        </label>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {
                                setType('manager');
                                handleClose()
                            }}>MANAGER</MenuItem>
                            <MenuItem onClick={() => {
                                setType('employee')
                                handleClose()
                            }}>EMPLOYEE</MenuItem>
                        </Menu>
                        <label className="label-username">
                            <span>USERNAME:</span>
                            <Input type="text" className="text" placeholder="Username" tabIndex="1" required value={username} onChange={(e) => setUsename(e.target.value)} />
                        </label>
                        {
                            formType === 'login' ? (
                                null
                            ) : (
                                <label className="label-username">
                                    <span>NAME:</span>
                                    <Input type="text" className="text" placeholder="Name" tabIndex="1" required value={name} onChange={(e) => setName(e.target.value)} />
                                </label>
                            )
                        }
                    </div>
                    <input type="checkbox" name="show-password" className="show-password a11y-hidden" id="show-password" tabIndex="3" />
                    <label className="label-show-password" htmlFor="show-password">
                        <span onClick={() => {
                            seePassword ? (setSeePassword(false)) : (setSeePassword(true))
                        }}>Show Password</span>
                    </label>
                    <div>
                        <label className="label-password">
                            <span>PASSWORD:</span>
                            <Input type={seePassword ? ("text") : ("password")} className="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onBlur={() => setCloseEyes(false)} onFocus={() => setCloseEyes(true)} tabIndex="2" required />
                        </label>
                    </div>
                    {
                        formType === 'login' ? (
                            <button disabled={loading} onClick={handelLogin} >Log In</button>

                        ) : (
                            <button disabled={loading} onClick={handelRegister}>Register</button>
                        )
                    }
                    <figure aria-hidden="true">
                        <div className="person-body"></div>
                        {
                            closeEyes ? (
                                <>
                                    <motion.div className="left-hand" animate={{ rotate: 25 }}><img src={palm} /></motion.div>
                                    <motion.div className="right-hand" animate={{ rotate: -25 }}><img src={palm} /></motion.div>
                                </>
                            ) : (null)
                        }
                        <div className="neck skin"></div>
                        <div className={seePassword ? ("head skin see") : ("head skin")}>
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
                {
                    formType === 'login' ? (
                        <div>New to the System? Want to <span className='changeForm' onClick={() => { setFormType('signup') }}>Register</span></div>
                    ) : (
                        <div>Already Registered? Want to <span className='changeForm' onClick={() => { setFormType('login') }}>Login In</span></div>
                    )
                }
            </div>
        </div>
    )
}

export default LoginPage
