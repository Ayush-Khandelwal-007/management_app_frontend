import React from 'react'
import styles from './styles.module.css'
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import FilePresent from '../../assets/FileSettings.svg'
import FileNotPresent from '../../assets/FileDelete.svg'
import { motion } from 'framer-motion';

function Card({ addNew, clickHandel, team }) {
    if (addNew) {
        return (
            <div className={styles.card} onClick={clickHandel}>
                <AddCircleTwoToneIcon style={{ color: "#008069", fontSize: "8vw" }} />
            </div>
        )
    }
    return (
        <div className={styles.card} onClick={clickHandel}>
            <div className={styles.cardHeader}>
                {team.TeamName}
            </div>
            <div>
                {team.Project==="" ? (
                    <motion.img src={FileNotPresent} initial={{opacity:0}} animate={{opacity:1}}/>
                ) : (
                    <motion.img src={FilePresent} initial={{opacity:0}} animate={{opacity:1}}/>
                )}
            </div>
        </div>
    )
}

export default Card
