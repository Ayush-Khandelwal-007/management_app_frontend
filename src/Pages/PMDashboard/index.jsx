import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import logo from '../../assets/logo.jpeg'
import Card from './Card'
import { AppBar, Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Paper, Slide, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useUser } from '../../contexts/user'
import axios from 'axios'
import { Alert } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PMDashboard() {
    const history = useHistory();
    // eslint-disable-next-line
    const [state, dispatch] = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAddNew, setOpenAddNew] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [openSnack, setOpenSnack] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [otherEmployees, setOtherEmployees] = useState([]);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [employeeListDialog, setEmployeeListDialog] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState({});


    const deleteFromTeam=(emp)=>{
        axios.delete('http://localhost:4000/api/remove_employee_from_team',{
            params:{
                TeamName:selectedTeam.TeamName,
                EmpUserName:emp.EmpUserName
            }
        }).then((result)=>{
            console.log(result)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const DeleteTeam = () => {
        axios.delete('http://localhost:4000/api/delete_team_from_emp', {
            params: {
                TeamName: selectedTeam.TeamName,
            }
        }).then((result) => {
            console.log(result)
            setOpenTeamDialog(false)
            fetch();
        }
        ).catch((err) => { console.log(err) })
    }

    const addInTeam = (emp) => {
        console.log(emp)
        axios.put('http://localhost:4000/api/assign_team', {
            TeamName: selectedTeam.TeamName,
            EmpUserName: emp.EmpUserName
        }).then((res) => {
            console.log(res)
            arrangeDialog(selectedTeam);
        }).catch((err) => {
            console.log(err)
        })
    }

    const openEmployeeList = () => {
        setEmployeeListDialog(true)
        axios.get('http://localhost:4000/api/view_nit_Employee', {
            params: {
                TName: selectedTeam.TeamName
            }
        }).then((res) => {
            console.log(res.data)
            setOtherEmployees(res.data)
        }).catch((err) => {
            console.error(err);
        })
    }

    const fetch = () => {
        axios.get('http://localhost:4000/api/view_teams', {
            params: {
                ProdUserName: state.user.username
            }
        }).then((res) => {
            setTeams(res.data);
            console.log(res.data)
        }).catch((err) => {
            console.error(err);
        })
    }

    const arrangeDialog = (team) => {
        setOpenTeamDialog(true);
        setSelectedTeam(team);
        axios.get('http://localhost:4000/api/view_t_Employee', {
            params: {
                TName: team.TeamName
            }
        }).then((res) => {
            setTeamMembers(res.data);
            console.log(res.data)
        }).catch((err) => {
            console.error(err);
        })
    }

    const handleClickOpen = () => {
        setOpenAddNew(true);
    };

    const handleCloseTeamDialog = () => {
        arrangeDialog(selectedTeam);
        openTeamDialog(false);
        setSelectedTeam({});
    }

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

    const addTeam = () => {
        console.log(teamName)
        console.log(state.user.username)
        axios.post('http://localhost:4000/api/insertt', { ProdUserName: state.user.username, TeamName: teamName })
            .then(() => {
                setTeamName('');
                fetch();
                handleCloseDialog();
            }).catch((err) => {
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
        fetch();
        // eslint-disable-next-line
    }, [])

    return (
        <div className={styles.rootDiv}>
            <Dialog className={styles.dialogPaper} fullScreen open={openTeamDialog} onClose={handleCloseTeamDialog} TransitionComponent={Transition}>


                <Dialog open={employeeListDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Select Member To be Added</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <List className={styles.employeeList}>
                            {
                                otherEmployees.map((emp, index) => {
                                    return (
                                        <ListItem button onClick={() => addInTeam(emp)} key={index}>
                                            <ListItemText secondary={emp.EmpName}>
                                                {emp.EmpUserName}
                                            </ListItemText>
                                        </ListItem>)
                                })
                            }
                        </List>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={() => { setEmployeeListDialog(false); setOtherEmployees([]) }} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>


                <AppBar className={styles.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => { setOpenTeamDialog(false); setSelectedTeam({}); setTeamMembers([]) }} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={styles.title}>
                            EasyManage
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={styles.dialogHeading}>
                    {selectedTeam.TeamName}
                </div>
                <TableContainer component={Paper} className={styles.table} >
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">Username</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teamMembers.map((row, index) => (
                                <TableRow key={row.EmpUserName}>
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell component="th" scope="row" align='left'>
                                        {row.EmpUserName}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left">{row.EmpName}</TableCell>
                                    <TableCell align="right" onClick={()=>deleteFromTeam(row)}><DeleteTwoToneIcon /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={styles.buttonBox}>
                    <Button onClick={()=>openEmployeeList()}>Add Members</Button>
                    <Button onClick={()=>DeleteTeam()}>Delete Team</Button>
                </div>
            </Dialog>
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
                        onChange={(e) => { setTeamName(e.target.value) }}
                        autoFocus
                        margin="dense"
                        id="TeamName"
                        label="Team Name"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>handleCloseDialog()} color="primary">
                        Cancel
          </Button>
                    <Button onClick={()=>addTeam()} color="primary">
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
                        onClick={(e)=>handleClick(e)}
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
                    <div><Card addNew={true} clickHandel={handleClickOpen} /></div>
                    {
                        teams.map((team, index) => <div key={index}><Card team={team} clickHandel={() => {
                            arrangeDialog(team);
                        }} /></div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default PMDashboard
