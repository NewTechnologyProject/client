import { Grid } from '@material-ui/core';
import React, { useEffect, useState, useRef } from "react";
import * as actions from "../../actions/contact.action";
import { Card, CardActions, CardContent, CardMedia, Button, Typography, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import userAvatar from 'src/access/UserImage/user.png';
import { Search } from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import { io } from "socket.io-client";
// ----------------------------------------------------------------------
//Socket
import { URL } from "src/services/api.service"

export default function AllReceive() {
    const dispatch = useDispatch();
    const socket = useRef();
    socket.current = io(URL);
    const allReceive = useSelector(state => state.contact.listReceive);
    const user = useSelector(state => state.customer.userAuth);
    const [receiveContact, setReceiveContact] = useState([])
    const [open, setOpen] = React.useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [openToast, setOpenToast] = React.useState(false);
    const [openToast1, setOpenToast1] = React.useState(false);

    const [search, setSearch] = useState("")
    //User
    const userpro = useSelector(state => state.contact.userQR);
    const [userPr, setUserProfile] = useState(null);
    useEffect(() => {
        dispatch(actions.findUserById(user))
    }, [user])
    useEffect(() => {
        if (userpro !== null) {
            setUserProfile(userpro)
        }
    }, [userpro])

    const handleClick = () => {
        setOpenToast(true);
    };
    const handleClick1 = () => {
        setOpenToast1(true);
    };
    const handleClickOpen = (id) => {
        setOpen(true);
        setIdDelete(id)
    };

    const handleCloseToast1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast1(false);
    };
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        dispatch(actions.fetchReceiveContact(user))
    }, [])


    useEffect(() => {
        if (allReceive) {
            setReceiveContact(
                allReceive.filter((c) =>
                    c.lastname.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, allReceive]);
    const genderListReceiveContact = () => {
        if (!receiveContact.length) {
            return (
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Search fontSize="large" />
                    <Typography variant="h5">
                        Kh??ng t??m th???y l???i m???i k???t b???n n??o ???? nh???n
                    </Typography>
                </div>
            )
        }
        else {
            return (
                <Grid container style={{ display: 'flex', position: 'inherit' }}>
                    {receiveContact.map((record, index) =>
                        <Grid item xs={6} sm={12} md={3} style={{ padding: 10 }} key={index}>
                            <Card >
                                <CardMedia
                                    component="img"
                                    alt="green iguana"
                                    height="250"
                                    image={record.avartar}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {record.firstname + " " + record.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    </Typography>
                                </CardContent>
                                <CardActions style={{ justifyContent: 'center' }}>
                                    <Button
                                        size="medium"
                                        color="success"
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => {
                                            dispatch(actions.acceptContact(record.id, user))
                                            socket.current.emit("acceptUser", {
                                                userReceive: userPr ? userPr.firstname + " " + userPr.lastname : "M???t ng?????i ",
                                                userSend: record.id
                                            });
                                            handleClick1()
                                        }}
                                    >?????ng ??</Button>
                                    <Button
                                        size="medium"
                                        color="error"
                                        variant="outlined"
                                        fullWidth
                                        onClick={(ev) => {
                                            handleClickOpen(record.id);
                                        }}
                                    >T??? ch???i</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )
        }
    }
    return (
        <div style={{ height: '100%', padding: '20px', width: '100%', display: 'block', position: 'inherit' }}>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} style={{ padding: 10, textAlign: 'right' }}>
                    <TextField
                        id="outlined-basic"
                        label="Nh???p t??n c???n t??m"
                        name="search"
                        variant="outlined"
                        size="small"
                        onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
            {genderListReceiveContact()}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{""}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        T??? ch???i l???i m???i k???t b???n n??y
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        style={{ fontSize: 10, backgroundColor: 'rgb(180, 0, 0)', color: 'white' }}
                        color="primary"
                        onClick={() => {
                            dispatch(actions.deleteReceiveContact(user, idDelete))
                            handleClick()
                            handleClose()
                        }}
                    >
                        T??? ch???i
                    </Button>
                    <Button style={{ fontSize: 10, backgroundColor: '#C67732 ', color: 'white' }} onClick={handleClose} color="primary" autoFocus>
                        H???y
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openToast}
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                onClose={handleCloseToast}

                message="???? t??? ch???i l???i ????? ngh??? k???t b???n"
            />
            <Snackbar
                open={openToast1}
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                onClose={handleCloseToast1}

                message="C??c b???n ???? tr??? th??nh b???n b??"
            />
        </div >
    );
}
