import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Search } from "@material-ui/icons";
import scanner from "src/access/ImageIcon/scanner.jpg";
import ButtonBase from "@material-ui/core/ButtonBase";
import {
  Avatar,
  AppBar,
  TextField,
  Tab,
  Tabs,
  Button,
  Card,
  CardContent,
  Icon,
  Toolbar,
  Typography,
  Box,
  Grid,
} from "@material-ui/core";
// ----------------------------------------------------------------------
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { display, flexbox, height } from "@material-ui/system";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/contact.action";
import Scrollbar from "src/components/Scrollbar";
import Label from "src/components/Label";
import Snackbar from "@material-ui/core/Snackbar";
import QRCode from "qrcode";
import QrReader from "react-qr-reader";

import { io } from "socket.io-client";


// ----------------------------------------------------------------------
import { URL } from "src/services/api.service"

export default function SearchContact() {
  const qrRef = useRef(null);
  const socket = useRef();
  const [imageUrl, setImageUrl] = useState("");
  const [textsearch, setTextSearch] = useState("");
  const dispatch = useDispatch();
  const listSearch = useSelector((state) => state.contact.listSearchContact);
  const user = useSelector((state) => state.customer.userAuth);
  const detail = useSelector((state) => state.contact.detailContact);
  const userQR = useSelector((state) => state.contact.userQR);
  const [userQRCode, setUserQRCode] = React.useState(null);
  // const friendQR = useSelector(state => state.friend.findId)
  const [listSearchFriend, setListSearch] = useState([]);
  const [detailContact, setDetailContact] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [messageToast, setMessageToast] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [openToast, setOpenToast] = React.useState(false);
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

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }
  const handleClick = () => {
    setOpenToast(true);
  };
  socket.current = io(URL);
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleClickOpen3 = () => {
    setOpen3(true);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };
  const handleClickOpen4 = () => {
    dispatch(actions.findUserByPhone("null", user));
    setOpen4(true);
  };
  const handleClose4 = () => {
    setOpen4(false);
  };
  useEffect(() => {
    dispatch(actions.searchContact(""));
  }, []);

  useEffect(() => {
    setListSearch(listSearch);
  }, [listSearch]);
  useEffect(() => {
    if (detail !== undefined) {
      setDetailContact(detail);
    }
  }, [detail]);
  useEffect(() => {
    if (userQR !== undefined) {
      setUserQRCode(userQR);
    }
  }, [userQR]);
  useEffect(() => {
    dispatch(actions.findUserById(user));
  }, [user]);
  useEffect(() => {
    if (userQRCode !== null) {
      const generateQrCode = async () => {
        try {
          const response = await QRCode.toDataURL(userQRCode.phone);
          console.log("id" + userQRCode.id);
          setImageUrl(response);
        } catch (error) {
          console.log(error);
        }
      };
      generateQrCode();
    }
  }, [userQRCode]);
  const handleErrorFile = (error) => {
    console.log(error);
  };
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  };
  const handleScanFile = (result) => {
    if (result) {
      dispatch(actions.findUserByPhone(result, user));
    }
  };
  const renderRelationShip = () => {
    if (detailContact == null) {
      return <div></div>;
    } else {
      if (detailContact.status === "friend") {
        return (
          <Label variant="ghost" color={"success"}>
            B???n b??
          </Label>
        );
      } else if (detailContact.status === "send") {
        return (
          <Label variant="ghost" color={"success"}>
            Ng?????i n??y ???? g???i l???i m???i k???t b???n cho b???n
          </Label>
        );
      } else if (detailContact.status === "receive") {
        return (
          <Label variant="ghost" color={"success"}>
            L???i m???i k???t b???n ???? g???i cho ng?????i n??y
          </Label>
        );
      } else if (detailContact.status === "you") {
        return (
          <Label variant="ghost" color={"success"}>
            T??i kho???n c?? nh??n c???a b???n
          </Label>
        );
      } else if (detailContact.status === "none") {
        return (
          <Label variant="ghost" color={"success"}>
            C??c b???n ch??a l?? b???n b??
          </Label>
        );
      }
    }
  };
  const renderButton = () => {
    if (detailContact == null) {
      return <div></div>;
    } else {
      if (detailContact.status === "friend") {
        return (
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "rgb(180, 0, 0)",
              color: "white",
              marginLeft: 50,
              marginRight: 50,
            }}
            onClick={() => {
              setIdDelete(detailContact.id);
              handleClickOpen1();
            }}
            fullWidth
            color="primary"
          >
            H???y k???t b???n
          </Button>
        );
      } else if (detailContact.status === "send") {
        return (
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "#3c4454",
              color: "white",
              marginLeft: 50,
              marginRight: 50,
            }}
            onClick={() => {
              setIdDelete(detailContact.id);
              handleClickOpen2();
            }}
            fullWidth
            color="primary"
          >
            T??? ch???i
          </Button>
        );
      } else if (detailContact.status === "receive") {
        return (
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "rgb(180, 0, 0)",
              color: "white",
              marginLeft: 50,
              marginRight: 50,
            }}
            onClick={() => {
              setIdDelete(detailContact.id);
              handleClickOpen3();
            }}
            fullWidth
            color="primary"
          >
            H???y l???i m???i
          </Button>
        );
      } else if (detailContact.status === "none") {
        return (
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "#3c4454",
              color: "white",
              marginLeft: 50,
              marginRight: 50,
            }}
            onClick={() => {
              dispatch(actions.addContact(user, detailContact.id));
              setMessageToast("L???i m???i k???t b???n ???? ???????c g???i");
              handleClick();
              setOpen4(false);
              handleClose();
              socket.current.emit("sendUser", {
                userReceive: detailContact.id,
                userSend: userPr ? userPr.firstname + " " + userPr.lastname : "M???t ng?????i "
              });
            }}
            fullWidth
            color="primary"
          >
            G???i l???i m???i
          </Button>
        );
      } else if (detailContact.status === "you") {
        return <div></div>;
      }
    }
  };
  const renderListSearch = () => {
    if (!listSearchFriend.length) {
      return (
        <div>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Search fontSize="large" />
            <Typography variant="h5">
              Kh??ng t??m th???y li??n h??? n??o
            </Typography>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ width: "100%" }}>
          {listSearchFriend.map((record, index) => {
            return (
              <Scrollbar key={index}>
                <div style={{ width: "100%", paddingTop: 20 }}>
                  <Paper>
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase>
                          <Avatar style={{ height: 70, width: 70 }}>
                            <img src={record.avartar} />
                          </Avatar>
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography gutterBottom variant="subtitle1">
                              {record.firstname + " " + record.lastname}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              Ng?????i d??ng
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            style={{
                              float: "right",
                              fontSize: "10px",
                              marginTop: "30px",
                            }}
                            onClick={() => {
                              handleClickOpen();
                              dispatch(actions.detailContact(user, record.id));
                            }}
                          >
                            Chi ti???t
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              </Scrollbar>
            );
          })}
        </div>
      );
    }
  };
  const renderQR = () => {
    if (detailContact !== null) {
      return (
        <Paper
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            style={{ paddingTop: 10, height: 200 }}
          >
            {console.log(detailContact)}
            <Avatar style={{ height: 100, width: 100, marginTop: 50 }}>
              <img
                src={
                  detailContact
                    ? detailContact.avartar
                    : "https://file-upload-weeallo-02937.s3.ap-southeast-1.amazonaws.com/1639117409210-user.png"
                }
              />
            </Avatar>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            style={{ paddingTop: 20 }}
          >
            <h3>
              {detailContact
                ? detailContact.firstname + " " + detailContact.lastname
                : "Kh??ng t??m th???y"}
            </h3>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            style={{ paddingTop: 20 }}
          >
            {renderRelationShip()}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            style={{ paddingTop: 20 }}
          >
            S??? ??i???n tho???i :{" "}
            {detailContact ? detailContact.phone : "Kh??ng t??m th???y"}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            style={{ paddingTop: 30 }}
          >
            {renderButton()}
          </Box>
        </Paper>
      );
    } else {
      return (
        <Paper
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            style={{ paddingTop: 10 }}
          >
            Kh??ng t??m th???y b???n n??o
          </Box>
        </Paper>
      );
    }
  };
  return (
    <div
      style={{
        height: "100%",
        padding: "20px",
        width: "100%",
        position: "inherit",
      }}
    >
      <Grid container style={{ display: "flex", position: "inherit" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ paddingTop: 10, paddingBottom: 30, display: "flex" }}
        >
          <FormControl style={{ width: "100%" }}>
            <TextField
              id="input-with-icon-textfield"
              size="medium"
              fullWidth
              onChange={(e) => {
                dispatch(actions.searchContact(e.target.value));
                setTextSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <IconButton
            onClick={() => {
              handleClickOpen4();
            }}
          >
            <img src={scanner} height={40} />
          </IconButton>
        </Grid>
      </Grid>
      {renderListSearch()}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"xs"}
        size="medium"
      >
        <DialogTitle id="alert-dialog-title">{"Th??m b???n"}</DialogTitle>
        <DialogContent>
          <Paper
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              style={{ paddingTop: 10, height: 200 }}
            >
              <Avatar style={{ height: 100, width: 100, marginTop: 50 }}>
                <img
                  src={
                    detailContact
                      ? detailContact.avartar
                      : "https://file-upload-weeallo-02937.s3.ap-southeast-1.amazonaws.com/1635056501152-user.png"
                  }
                />
              </Avatar>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              style={{ paddingTop: 20 }}
            >
              <h3>
                {detailContact
                  ? detailContact.firstname + " " + detailContact.lastname
                  : "Not Found"}
              </h3>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              style={{ paddingTop: 20 }}
            >
              {renderRelationShip()}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              style={{ paddingTop: 20 }}
            >
              S??? ??i???n tho???i :{" "}
              {detailContact ? detailContact.phone : "Not Found"}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              style={{ paddingTop: 30 }}
            >
              {renderButton()}
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" autoFocus>
            ????ng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open1}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ng?????i n??y s??? kh??ng c??n li??n h??? <br /> v???i b???n
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "rgb(180, 0, 0)",
              color: "white",
            }}
            onClick={() => {
              setMessageToast("???? h???y k???t b???n v???i ng?????i n??y");
              handleClose1();
              handleClick();
              handleClose();
              setOpen4(false);
              dispatch(actions.deleteAllContact(user, idDelete));
            }}
            color="primary"
          >
            X??a k???t b???n
          </Button>
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "#C67732 ",
              color: "white",
            }}
            onClick={handleClose1}
            color="primary"
            autoFocus
          >
            H???y
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
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
            style={{
              fontSize: 10,
              backgroundColor: "rgb(180, 0, 0)",
              color: "white",
            }}
            color="primary"
            onClick={() => {
              setMessageToast("???? t??? ch???i l???i m???i k???t b???n c???a ng?????i n??y");
              dispatch(actions.deleteReceiveContact(user, idDelete));
              handleClick();
              handleClose();
              handleClose2();
              setOpen4(false);
            }}
          >
            T??? ch???i
          </Button>
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "#C67732 ",
              color: "white",
            }}
            onClick={handleClose2}
            color="primary"
            autoFocus
          >
            H???y
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open3}
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            X??a l???i m???i k???t b???n v???i ng?????i n??y
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "rgb(180, 0, 0)",
              color: "white",
            }}
            onClick={() => {
              setMessageToast("???? x??a l???i m???i k???t b???n v???i ng?????i n??y");
              dispatch(actions.deleteSendContact(user, idDelete));
              handleClick();
              handleClose();
              handleClose3();
              setOpen4(false);
            }}
            color="primary"
          >
            X??a l???i m???i
          </Button>
          <Button
            style={{
              fontSize: 10,
              backgroundColor: "#C67732 ",
              color: "white",
            }}
            onClick={handleClose3}
            color="primary"
            autoFocus
          >
            H???y
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open4}
        onClose={handleClose4}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle id="alert-dialog-title">
          {"Th??m b???n b???ng QR Code"}
        </DialogTitle>
        <DialogContent style={{ width: "100%" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              classes={{
                root: "h-64",
              }}
              label="Qu??t m?? QR"
            />
            <Tab
              classes={{
                root: "h-64",
              }}
              label="M?? QR c???a t??i"
            />
          </Tabs>
          {selectedTab === 0 && (
            <div>
              <Button
                style={{
                  fontSize: 10,
                  backgroundColor: "#006600",
                  color: "white",
                  marginBottom: 5,
                  marginTop: 5,
                }}
                onClick={onScanFile}
              >
                T???i l??n m?? QR
              </Button>
              <Grid container component="span" spacing={1}>
                <Grid item xs={6}>
                  <QrReader
                    ref={qrRef}
                    delay={300}
                    style={{ width: "100%" }}
                    onError={handleErrorFile}
                    onScan={handleScanFile}
                    legacyMode
                  />
                </Grid>
                <Grid item xs={6}>
                  {renderQR()}
                </Grid>
              </Grid>
            </div>
          )}
          {selectedTab === 1 && (
            <div>
              <Grid
                container
                component="span"
                spacing={1}
                style={{
                  paddingTop: 39,
                  width: "100%",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {imageUrl ? (
                  <a
                    href={imageUrl}
                    download
                    style={{
                      width: "100%",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <img src={imageUrl} alt="img" style={{ width: "50%" }} />
                  </a>
                ) : null}
              </Grid>
              {/* {genderQR()} */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose4} color="primary">
            ????ng
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openToast}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleCloseToast}
        message={messageToast}
      />
    </div>
  );
}
