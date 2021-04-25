import React from 'react'
import styles from './styling.module.css'
import WelcomeImage from '../../assets/Untitled.svg'
import logo from '../../assets/logo.jpeg'
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"

function Landing() {
    let history = useHistory();

    const goToLoginPage = () => {
        history.push('/Login');
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <motion.img
                    initial={{ opacity:0}}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={logo}
                    alt='loading...'
                />
                EasyManage
            </div>
            <div className={styles.actionDiv}>
                <motion.img
                    initial={{ x: "-90vw" }}
                    whileHover={{ height: "52vh" }}
                    animate={{ x: "0vh" }}
                    transition={{ duration: 0.5 }}
                    style={{
                        height: "50vh"
                    }}
                    src={WelcomeImage}
                    alt='loading...'
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ opacity: 0 }}
                    onClick={goToLoginPage}
                    initial={{ x: "90vw" }}
                    animate={{ x: "0vh" }}
                    transition={{ duration: 0.2 }}
                >
                    GO TO LOGIN PAGE
            </motion.button>
            </div>
        </div>
    )
}

export default Landing
