import React, { useState } from 'react';
import './styling.scss'
import palm from '../../assets/hand.svg'
import { motion } from "framer-motion";
import { Input, Snackbar, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import logo from '../../assets/logo.jpeg'
import Axios from 'axios'
import { useHistory } from 'react-router';
import { Alert } from '@material-ui/lab';
import { useUser } from '../../contexts/user';

function LoginPage() {
    const history = useHistory();
    // eslint-disable-next-line
    const [state, dispatch] = useUser();
    const [closeEyes, setCloseEyes] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [username, setUsename] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('manager');
    const [anchorEl, setAnchorEl] = useState(null);
    const [formType, setFormType] = useState('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const [openSnack, setOpenSnack] = useState(false);

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
            }).catch((err) => {
                setError('This Username is already in use ,try something else!')
                setOpenSnack(true);
                setLoading(false);
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
            }).catch((err) => {
                setError('This Username is already in usetry something else!')
                setOpenSnack(true);
                setLoading(false);
                console.log(err);
            })
        }

    }

    const handelLogin = (e) => {
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
                if (parseInt(res.data.result) === 1) {
                    console.log("success");
                    dispatch({
                        type: "SET_USER",
                        user: {
                            name: res.data.name,
                            username: res.data.username
                        },
                        userType: type,
                    });
                    localStorage.setItem("type", type.toString());
                    localStorage.setItem("user", JSON.stringify({
                        name: res.data.name,
                        username: res.data.username
                    }));
                    history.push('/PMDashboard');
                }
                if (parseInt(res.data.result) === 2) {
                    setError('Wrong Password Entered!')
                    setOpenSnack(true);
                    setLoading(false);
                }
            }).catch((err) => {
                setError('No account with this username exist!')
                setOpenSnack(true);
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
                if (parseInt(res.data.result) === 1) {
                    console.log("success");
                    dispatch({
                        type: "SET_USER",
                        user: {
                            name: res.data.name,
                            username: res.data.username
                        },
                        userType: type,
                    });
                    localStorage.setItem("type", type.toString());
                    localStorage.setItem("user", JSON.stringify({
                        name: res.data.name,
                        username: res.data.username
                    }));
                    history.push('/EMPDashboard');
                }
                if (parseInt(res.data.result) === 2) {
                    setError('Wrong Password Entered!')
                    setOpenSnack(true);
                    setLoading(false);
                }
            })
                .catch((err) => {
                    setError('No account with this username exist!')
                    setOpenSnack(true);
                    setLoading(false);
                    console.log(err);
                })
        }

    }
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };

    return (
        <div className='rootDiv'>
            <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleCloseSnack}>
                <Alert className='snackbarDiv' severity="error">
                    <strong>{error}</strong>
                </Alert>
            </Snackbar>
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
                            <TextField label="USERNAME" className="text" value={username} onChange={(e) => setUsename(e.target.value)} />
                        </label>
                        {
                            formType === 'login' ? (
                                null
                            ) : (
                                <label className="label-username">
                                    <TextField label="NAME" className="text" value={name} onChange={(e) => setName(e.target.value)} />
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
                            <TextField type={seePassword ? ("text") : ("password")} label="PASSWORD" className="text" alue={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onBlur={() => setCloseEyes(false)} onFocus={() => setCloseEyes(true)}/>
                        </label>
                    </div>
                    {
                        formType === 'login' ? (
                            <button type='submit' disabled={loading} onClick={handelLogin} >Log In</button>

                        ) : (
                            <button type='submit' disabled={loading} onClick={handelRegister}>Register</button>
                        )
                    }
                    <figure aria-hidden="true">
                        <div className="person-body"></div>
                        {
                            closeEyes ? (
                                <>
                                    <motion.div className="left-hand" animate={{ rotate: 25 }}><img src={palm} alt='palm' /></motion.div>
                                    <motion.div className="right-hand" animate={{ rotate: -25 }}><img src={palm} alt='palm' /></motion.div>
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