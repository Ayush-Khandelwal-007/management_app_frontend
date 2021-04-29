import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import logo from '../../assets/logo.jpeg'
import Card from './Card'
import { Avatar, Button, Menu, MenuItem, Snackbar } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useUser } from '../../contexts/user'
import axios from 'axios'
import { Alert } from '@material-ui/lab'
import ChapterDialogBox from './ChapterDialogBox'
import AddTeamDialog from './AddTeamDialog'
import { url } from '../../constants'

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
        axios.delete(`${url}api/remove_employee_from_team`,{
            params:{
                TeamName:selectedTeam.TeamName,
                EmpUserName:emp.EmpUserName
            }
        }).then((result)=>{
            fetchTeamMembers(selectedTeam);
        }).catch((err)=>{
            console.log(err)
        })
    }

    const DeleteTeam = () => {
        axios.delete(`${url}api/delete_team_from_emp`, {
            params: {
                TeamName: selectedTeam.TeamName,
            }
        }).then((result) => {
            setOpenTeamDialog(false)
            fetch();
        }
        ).catch((err) => { console.log(err) })
    }

    const addInTeam = (emp) => {
        console.log(emp)
        axios.put(`${url}api/assign_team`, {
            TeamName: selectedTeam.TeamName,
            EmpUserName: emp.EmpUserName
        }).then((res) => {
            fetch();
            fetchTeamMembers(selectedTeam);
            openEmployeeList();
        }).catch((err) => {
            console.log(err)
        })
    }

    const openEmployeeList = () => {
        axios.get(`${url}api/view_nit_Employee`, {
            params: {
                TName: selectedTeam.TeamName
            }
        }).then((res) => {
            setOtherEmployees(res.data)
            setEmployeeListDialog(true)
        }).catch((err) => {
            console.error(err);
        })
    }

    const fetchTeamMembers = (team) =>{
        axios.get(`${url}api/view_t_Employee`, {
            params: {
                TName: team.TeamName
            }
        }).then((res) => {
            setTeamMembers(res.data);
            setOpenTeamDialog(true);
        }).catch((err) => {
            console.error(err);
        })
    }

    const fetch = () => {
        axios.get(`${url}api/view_teams`, {
            params: {
                ProdUserName: state.user.username
            }
        }).then((res) => {
            setTeams(res.data);
        }).catch((err) => {
            console.error(err);
        })
    }

    const arrangeDialog = (team) => {
        setSelectedTeam(team);
        fetchTeamMembers(team);
    }

    const handleCloseTeamDialog = () => {
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
            <ChapterDialogBox
                handleCloseTeamDialog={handleCloseTeamDialog}
                teamMembers={teamMembers}
                openTeamDialog={openTeamDialog}
                employeeListDialog={employeeListDialog}
                setEmployeeListDialog={setEmployeeListDialog}
                setOtherEmployees={setOtherEmployees}
                otherEmployees={otherEmployees}
                deleteFromTeam={deleteFromTeam}
                DeleteTeam={DeleteTeam}
                addInTeam={addInTeam}
                setOpenTeamDialog={setOpenTeamDialog}
                setSelectedTeam={setSelectedTeam}
                setTeamMembers={setTeamMembers}
                selectedTeam={selectedTeam}
                openEmployeeList={openEmployeeList}
                fetch={fetch}
                teams={teams}
            />
            <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleCloseSnack}>
                <Alert className={styles.snackbarDiv} severity="error">
                    <strong>{error}</strong>
                </Alert>
            </Snackbar>
            <AddTeamDialog
                teamName={teamName}
                setTeamName={setTeamName}
                setOpenAddNew={setOpenAddNew}
                setOpenSnack={setOpenSnack}
                setError={setError}
                openAddNew={openAddNew}
                fetch={fetch}
            />
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
                <h1>Teams</h1>
                <div className={styles.cardContainer}>
                    <div><Card addNew={true} clickHandel={()=>setOpenAddNew(true)} /></div>
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
