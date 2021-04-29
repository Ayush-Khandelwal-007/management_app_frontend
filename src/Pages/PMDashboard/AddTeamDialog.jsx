import React from 'react'
import axios from 'axios'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core'
import { useUser } from '../../contexts/user';
import {url} from '../../constants';

function AddTeamDialog({teamName,setTeamName,setOpenAddNew,setOpenSnack,setError,openAddNew,fetch}) {
    // eslint-disable-next-line
    const [state, dispatch] = useUser();
    const addTeam = () => {
        axios.post(`${url}api/insertt`, { ProdUserName: state.user.username, TeamName: teamName })
            .then(() => {
                setTeamName('');
                fetch();
                setOpenAddNew(false);
            }).catch((err) => {
                setOpenSnack(true);
                setError('This Team Name is already in use ,try something else!')
                console.error(err);
            })
    }
    return (
        <Dialog open={openAddNew} onClose={()=>setOpenAddNew(false)} aria-labelledby="form-dialog-title">
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
                    <Button onClick={()=>setOpenAddNew(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>addTeam()} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
    )
}

export default AddTeamDialog
