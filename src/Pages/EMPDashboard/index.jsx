import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import logo from '../../assets/logo.jpeg'
import Card from './Card'
import { AppBar, Avatar, Button, Dialog, Divider, IconButton, Menu, MenuItem, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useUser } from '../../contexts/user'
import axios from 'axios'
import CloseIcon from '@material-ui/icons/Close';
import {url} from '../../constants'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PMDashboard() {
    const history = useHistory();
    const [state, dispatch] = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const [teams, setTeams] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState({});
    const [selectedTeamInfo, setSelectedTeamInfo] = useState({});

    const fetch = () => {
        axios.get(`${url}api/view_Employee_to_team`, {
            params: {
                EmpUserName: state.user.username
            }
        }).then((res) => {
            setTeams(res.data);
            console.log(res.data)
        }).catch((err) => {
            console.error(err);
        })
    }

    const fetchTeamData=(team)=>{
        axios.get(`${url}api/team`, {
            params: {
                TeamName:team
            }
        }).then((res) => {
            setSelectedTeamInfo(res.data);
            console.log(res.data)
        }).catch((err) => {
            console.error(err);
        })
    }

    const arrangeDialog = (team) => {
        fetchTeamData(team.TeamName);
        setOpenTeamDialog(true);
        setSelectedTeam(team);
        axios.get(`${url}api/view_t_Employee`, {
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

    const handleCloseTeamDialog = () => {
        arrangeDialog(selectedTeam);
        openTeamDialog(false);
        setSelectedTeam({});
    }

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



    useEffect(() => {
        fetch();
        // eslint-disable-next-line
    }, [])

    return (
        <div className={styles.rootDiv}>
            <Dialog className={styles.dialogPaper} fullScreen open={openTeamDialog} onClose={handleCloseTeamDialog} TransitionComponent={Transition}>
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
                    {selectedTeam.TeamName} <small className={styles.prodname}>{"  -  "+selectedTeamInfo.ProdUserName}</small>
                </div>
                <TableContainer component={Paper} className={styles.table} >
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">Username</TableCell>
                                <TableCell align="left">Name</TableCell>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider style={{ background: "white" }} />

                <div className={styles.FileDiv}>
                    {
                        selectedTeamInfo.Project ? (
                            <>
                                <div>Project Assigned On: <u><strong>{selectedTeam.Date}</strong></u></div>
                                <div className={styles.buttonBox}>
                                    <Button className={styles.ReplaceButton}><a rel="noreferrer" target="_blank" href={selectedTeamInfo.Project}>See Project</a></Button>
                                </div>
                            </>
                        ) : (
                            <div>No Project Assigned Yet</div>
                        )
                    }


                </div>
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
                        onClick={(e) => handleClick(e)}
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
