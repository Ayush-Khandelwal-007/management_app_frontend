import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useRef, useState } from 'react';
import styles from "./styles.module.css"
import "./styles.css"

function FileUpload({ setSelectedFile, setEnabled, selectedFile, enabled }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnack, setOpenSnack] = useState(false);

    const fileInputRef = useRef();

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    const dragOver = (e) => {
        e.preventDefault();
    }

    const dragEnter = (e) => {
        e.preventDefault();
    }

    const dragLeave = (e) => {
        e.preventDefault();
    }

    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length === 1) {
            if (fileType(files[0].name) === "pdf" || fileType(files[0].name) === "doc" || fileType(files[0].name) === "docx") {
                setSelectedFile(files[0]);
                setEnabled(true);
            }
            else {
                setSelectedFile(null);
                setErrorMessage('Please select either a Doc or a PDF')
                setOpenSnack(true)
            }
        }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = () => {
        setEnabled(false);
        setSelectedFile(null);
    }

    return (
        <div className="content">
            <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleCloseSnack}>
                <Alert className={styles.snackbarDiv} severity="error">
                    <strong>{errorMessage}</strong>
                </Alert>
            </Snackbar>
            {
                !enabled && (
                    <div className="drop-container"
                        onDragOver={dragOver}
                        onDragEnter={dragEnter}
                        onDragLeave={dragLeave}
                        onDrop={fileDrop}
                    >
                        <div className="drop-message">
                            {/* <div className="upload-icon"></div> */}
                        Drag a file here<br></br><br></br>
                            <small>Or, if you prefer...</small><br />
                            <button onClick={fileInputClicked} className="uploadButton">Select a file from device</button>
                        </div>
                        <input
                            ref={fileInputRef}
                            className="file-input"
                            type="file"
                            multiple
                            onChange={(e) => {
                                if (fileType(e.target.files[0].name) === "pdf" || fileType(e.target.files[0].name) === "doc" || fileType(e.target.files[0].name) === "docx") {
                                    setSelectedFile(e.target.files[0]);
                                    setEnabled(true);
                                }
                                else {
                                    setSelectedFile(null);
                                    setErrorMessage('Please select either a Doc or a PDF')
                                    setOpenSnack(true)
                                }
                            }}
                        />
                    </div>
                )
            }
            <div className="file-display-container">
                {enabled && <div className="file-status-bar">
                    <div>
                        <div className="file-type-logo"></div>
                        <div className="file-type">{fileType(selectedFile.name)}</div>
                        <span className="file-name">{selectedFile.name}</span>
                        <span className="file-size">({fileSize(selectedFile.size)})</span> {!enabled && <span className='file-error-message'>(File type not permitted)</span>}
                    </div>
                    <div onClick={() => removeFile()} className="file-remove">X</div>
                </div>}
            </div>
        </div>
    )
}

export default FileUpload
