import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import logo from '../../assets/logo.jpeg'
import Card from './Card'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, Snackbar, TextField } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useUser } from '../../contexts/user'
import axios from 'axios'
import { Alert } from '@material-ui/lab'

function PMDashboard() {
    const history = useHistory();
    // eslint-disable-next-line
    const [state, dispatch] = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAddNew, setOpenAddNew] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [openSnack, setOpenSnack] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState([])

    const handleClickOpen = () => {
        setOpenAddNew(true);
    };
  
    const handleCloseDialog = () => {
        setOpenAddNew(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goLogout = () => {
        dispatch({
            type: "UNSET_USER",
        });
        history.push("/Login");
        localStorage.clear();
    };

    const addTeam=()=>{
        console.log(teamName)
        console.log(state.user.username)
        axios.post('http://localhost:4000/api/insertt',{ProdUserName:state.user.username,TeamName:teamName})
        .then(()=>{
            setTeamName('');
            handleCloseDialog();
        }).catch((err)=>{
            setOpenSnack(true);
            setError('This Team Name is already in use ,try something else!')
            console.error(err);
        })
    }
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };

    useEffect(() => {
        axios.get('http://localhost:4000/api/view_teams',{
            params:{
                ProdUserName:state.user.username
            }
        }).then((res)=>{
            setTeams(res.data);
            console.log(res.data)
        }).catch((err)=>{
            console.error(err);
        })
    }, [])

    return (
        <div className={styles.rootDiv}>
            <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleCloseSnack}>
                <Alert className={styles.snackbarDiv} severity="error">
                    <strong>{error}</strong>
                </Alert>
            </Snackbar>
            <Dialog open={openAddNew} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for the new team to be added.
                    </DialogContentText>
                    <TextField
                        value={teamName}
                        onChange={(e)=>{setTeamName(e.target.value)}}
                        autoFocus
                        margin="dense"
                        id="TeamName"
                        label="Team Name"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
          </Button>
                    <Button onClick={addTeam} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
            <div className={styles.header}>
                <div>
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
                <div>
                    <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <Avatar />
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={goLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
            <div className={styles.screen}>
                <h1> Your Teams list</h1>
                <div className={styles.cardContainer}>
                    <div><Card addNew={true} clickHandel={handleClickOpen}/></div>
                    {
                        teams.map((team,index)=><div key={index}><Card team={team} /></div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default PMDashboard
