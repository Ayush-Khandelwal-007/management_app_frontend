import React from 'react'
import styles from './styles.module.css'
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';

function Card({ addNew ,clickHandel,team}) {
    if (addNew) {
        return (
            <div className={styles.card} onClick={clickHandel}>
                <AddCircleTwoToneIcon style={{color:"#008069",fontSize:"8vw"}}/>
            </div>
        )
    }
    return (
        <div className={styles.card} >
            <div className={styles.cardHeader}>
                {team.TeamName}
            </div>
            <div>
                wisdfghjk
            </div>
        </div>
    )
}

export default Card
