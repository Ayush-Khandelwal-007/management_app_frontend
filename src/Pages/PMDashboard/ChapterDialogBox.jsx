import React from 'react'
import styles from './styles.module.css'
import CloseIcon from '@material-ui/icons/Close';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ChapterDialogBox({handleCloseTeamDialog,teamMembers,otherEmployees,deleteFromTeam,DeleteTeam,addInTeam,openTeamDialog,employeeListDialog,setEmployeeListDialog,setOtherEmployees,setOpenTeamDialog,setSelectedTeam,setTeamMembers,selectedTeam,openEmployeeList}) {
    return (
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
                                    <TableCell align="right" onClick={()=>deleteFromTeam(row)}><DeleteTwoToneIcon className={styles.deleteIcon} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={styles.buttonBox}>
                    <Button className={styles.AddButton} onClick={()=>openEmployeeList()}>Add Members</Button>
                    <Button className={styles.DeleteButton}  onClick={()=>DeleteTeam()}>Delete Team</Button>
                </div>
            </Dialog>
    )
}

export default ChapterDialogBox
