import * as Yup from "yup";
import React from "react";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { useNavigate } from "react-router-dom";
//import { useDispatch } from "react-redux";
import * as actions from "src/actions/customer.action";
import useForm from "./useForm";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";

// import firebase from "./firebase";

// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Container,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { isAfter } from "date-fns";
import firebase from "./firebase";
import { database } from "faker";
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState("");
  const [disable, setDisable] = React.useState(false);
  const [registerComponent, setRegisterComponent] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [openF, setOpenF] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [user, setUser] = useState([]);
  const [errorOtp, setErrorOtp] = React.useState("");
  useEffect(() => {
    dispatch(actions.fecthAllPhone());
  }, []);
  let check = useSelector((state) => state.customer.listphone);
  useEffect(() => {
    if (check !== undefined) setUser(check);
  }, [check]);
  console.log(user);
  const initialFieldValues = {
    firstname: "",
    lastname: "",
    email: null,
    phone: "",
    password: "",
    isActive: "false",
    createAt: null,
    updateAt: null,
    avartar:
      "https://file-upload-weeallo-02937.s3.ap-southeast-1.amazonaws.com/1639117409210-user.png",
    coverImage: null,
    status: null,
    contactList: null,
    contactList1: null,
    toDoUserList: null,
    messageList: null,
    userGroupList: null,
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("firstname" in fieldValues) {
      temp.firstname =
        /^[A-Za-z???????????????????????????????????????????????????????????????????????????????????????????-???]*$/.test(
          fieldValues.firstname
        )
          ? ""
          : "H??? kh??ng ???????c ????? r???ng v?? b???t ?????u l?? ch??? in hoa."; //to??n t??? 3 ng??i
      setErrors({
        ...temp,
      });
    }

    if ("lastname" in fieldValues) {
      temp.lastname =
        /^[A-Za-z???????????????????????????????????????????????????????????????????????????????????????????-???]*$/.test(
          fieldValues.lastname
        )
          ? ""
          : "T??n kh??ng ???????c ????? r???ng v?? b???t ?????u l?? ch??? in hoa.";
      setErrors({
        ...temp,
      });
    }
    if ("phone" in fieldValues) {
      let err = 0;
      user.map((user) => {
        if (user.phone.toLowerCase() === fieldValues.phone.toLowerCase()) {
          err = err + 1;
        }
      });
      if (fieldValues.phone === "") {
        temp.phone = fieldValues.phone
          ? ""
          : "S??? ??i???n tho???i kh??ng ???????c ????? tr???ng";
      }
      if (fieldValues.phone !== "") {
        temp.phone = /^[0]{1}\d{9}$/.test(fieldValues.phone)
          ? ""
          : "S??? ??i???n tho???i kh??ng ???????c ????? r???ng v?? g???m 10 k?? t??? s???.";
      }
      if (err >= 1) {
        err < 1 ? (temp.phone = "") : (temp.phone = "S??? ??i???n tho???i ???? t???n t???i");
      }
      console.log(err);
      setErrors({
        ...temp,
      });
    }

    if ("password" in fieldValues) {
      temp.password = /^\w{6,200}$/.test(fieldValues.password)
        ? ""
        : "M???t kh???u kh??ng ???????c ????? tr???ng v?? ph???i t??? 6 k?? t??? tr??? l??n";
      setErrors({
        ...temp,
      });
    }

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFieldValues, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSignInSubmit(e);
      setDisable(true);
      setTimeout(() => {
        setRegisterComponent(false);
      }, 8000);
      // }, 2000);
    }
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
          console.log("Recaptca varified");
        },
        defaultCountry: "IN",
      }
    );
  };
  const onSignInSubmit = (e) => {
    e.preventDefault();
    configureCaptcha();
    const phoneNumber = "+84" + values.phone;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP ???? g???i");
      })
      .catch((error) => {
        console.log(error)
        console.log("SMS kh??ng ???????c g???i");
        navigate("/register", { replace: true });
      });
  };
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const code = otp;
    console.log(code);

    window.confirmationResult
      .confirm(code)
      .then((result) => {
        const user = result.user;
        console.log(JSON.stringify(user));
        dispatch(actions.register(values));
        setErrorOtp("");
        handleOpenRegister();
      })
      .catch((error) => {
        handleClickOpen();
      });
    const handleClick = () => {
      setOpen(true);
    };
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const comeBack = () => {
    navigate("/register", { replace: true });
  };

  const handleClickOpen = () => {
    setOpenF(true);
  };

  const handleClickClose = () => {
    setOpenF(false);
    comeBack();
  };

  const handleOpenRegister = () => {
    setOpen(true);
  };

  const handleCloseRegister = () => {
    navigate("/login", { replace: true });
    setOpen(false);
    //  comeBack();
  };
  return registerComponent ? (
    <form id="otp" autoComplete="off" noValidate>
      <div id="sign-in-button"></div>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="H???"
            name="firstname"
            value={values.firstname}
            onChange={handleInputChange}
            {...(errors.firstname && {
              error: true,
              helperText: errors.firstname,
            })}
          />

          <TextField
            fullWidth
            label="T??n"
            name="lastname"
            value={values.lastname}
            onChange={handleInputChange}
            {...(errors.lastname && {
              error: true,
              helperText: errors.lastname,
            })}
          />
        </Stack>
        <TextField
          fullWidth
          label="S??? ??i???n tho???i"
          name="phone"
          value={values.phone}
          onChange={handleInputChange}
          {...(errors.phone && {
            error: true,
            helperText: errors.phone,
          })}
        />

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="M???t kh???u"
          name="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={values.password}
          onChange={handleInputChange}
          {...(errors.password && {
            error: true,
            helperText: errors.password,
          })}
        />

        <LoadingButton
          disabled={disable}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          ????ng k??
        </LoadingButton>

        <Dialog
          open={open}
          keepMounted
          onClose={handleClickClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"C???nh b??o"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              L???i
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickClose} color="primary">
              ?????ng ??
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </form>
  ) : (
    <div>
      <Alert severity="warning" style={{ marginBottom: 10 }}>
        <AlertTitle>C???nh b??o</AlertTitle>
        <strong>Vui l??ng nh???p m?? x??c th???c!</strong>
      </Alert>
      <form autoComplete="off" noValidate onSubmit={onSubmitOTP}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="OTP"
              name="maOTP"
              onChange={(e) => setOTP(e.target.value)}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            X??c nh???n
          </LoadingButton>
          <Dialog
            open={open}
            keepMounted
            onClose={handleCloseRegister}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"C???nh b??o"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                ????ng k?? th??nh c??ng!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRegister} color="primary">
                ?????ng ??
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openF}
            keepMounted
            onClose={handleClickClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"C???nh b??o"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                M?? OTP kh??ng ph?? h???p!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose} color="primary">
                ?????ng ??
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </form>
    </div>
  );
}
