import React, { useState } from 'react'
import styles from './styles.module.css'
import CloseIcon from '@material-ui/icons/Close';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import FileUpload from './FileUpload';
import { storage } from "../../firebase"
import axios from 'axios';
import { useHistory } from 'react-router';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ChapterDialogBox({ handleCloseTeamDialog, teamMembers, otherEmployees, deleteFromTeam, DeleteTeam, addInTeam, openTeamDialog, employeeListDialog, setEmployeeListDialog, setOtherEmployees, setOpenTeamDialog, setSelectedTeam, setTeamMembers, selectedTeam, openEmployeeList, fetch, teams }) {

    const history = useHistory();
    const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [enabled, setEnabled] = useState(false)
    const [openDeleteTeam,setOpenDeleteTeam]=useState(false);

    const TodaysDate = () => {
        var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '-' + mm + '-' + yyyy;
        return today;
    }

    const upload = () => {
        const uploadTask = storage.ref(`projects/${selectedFile.name}`).put(selectedFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("projects")
                    .child(selectedFile.name)
                    .getDownloadURL()
                    .then((url) => {
                        axios.put('http://localhost:4000/api/assign_project', {
                            Project: url,
                            Date: TodaysDate(),
                            TeamName: selectedTeam.TeamName,
                        })
                        setEnabled(false);
                        setOpenAddProjectDialog(false);
                        setSelectedFile(null);
                        fetch();
                        setSelectedTeam({ ...selectedTeam, Date: TodaysDate(), Project: url })
                    });
            }
        );
    }

    return (
        <Dialog className={styles.dialogPaper} fullScreen open={openTeamDialog} onClose={handleCloseTeamDialog} TransitionComponent={Transition}>
            <Dialog
                open={openDeleteTeam}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this team?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This step cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpenDeleteTeam(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={() => DeleteTeam()} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


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


            <Dialog open={openAddProjectDialog}>
                <DialogTitle id="form-dialog-title">Select the project file</DialogTitle>
                <Divider />
                <DialogContent>
                    <FileUpload setSelectedFile={setSelectedFile} setEnabled={setEnabled} selectedFile={selectedFile} enabled={enabled} />
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={() => { setOpenAddProjectDialog(false) }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { upload() }} disabled={!enabled} color="primary">
                        Upload
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
                                <TableCell align="right" onClick={() => deleteFromTeam(row)}><DeleteTwoToneIcon className={styles.deleteIcon} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.buttonBox}>
                <Button className={styles.AddButton} onClick={() => openEmployeeList()}>Add Members</Button>
                <Button className={styles.DeleteButton} onClick={()=>setOpenDeleteTeam(true)} >Delete Team</Button>


            </div>
            <Divider style={{ background: "white" }} />
            <div className={styles.FileDiv}>
                {
                    selectedTeam.Project ? (
                        <>
                            <div>Project Assigned On: <u><strong>{selectedTeam.Date}</strong></u></div>
                            <div className={styles.buttonBox}>
                                <Button className={styles.ReplaceButton} onClick={() => { setOpenAddProjectDialog(true) }}>Replace Project File</Button>
                                {
                                    selectedTeam.Project === "" ? (null) : (<Button className={styles.ReplaceButton}><a target="_blank" href={selectedTeam.Project}>See Project</a></Button>)
                                }
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ flexDirection: "column", gap: "3vh", display: "flex" }}>
                                <div>No Project Assigned Yet</div>
                                <Button className={styles.ReplaceButton} style={{ width: "20vw" }} onClick={() => { setOpenAddProjectDialog(true) }}>Add Project File</Button>
                            </div>
                        </>
                    )
                }


            </div>
        </Dialog>
    )
}

export default ChapterDialogBox
