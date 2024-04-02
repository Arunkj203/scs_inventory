import React, { useEffect, useState } from "react";
import "./Login.css"

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import TextField from "@mui/material/TextField";
import PersonIcon from "@mui/icons-material/Person";
import { InputAdornment, Alert, LinearProgress } from "@mui/material";
import Lock from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import api from "@/axios";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const mailreg = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");

  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [type, setType] = useState("");
  const [progress, setProgress] = useState(100);

  const [open, setOpen] = useState(false);

  
  const handleClose = () => {
    setOpen(false);
  };

  let timebar = () => {
    let progressTimeout;
    let dismissTimeout;

    const startProgress = () => {
      progressTimeout = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 10);
      }, 300);
    };

    const startDismissTimer = () => {
      dismissTimeout = setTimeout(() => {
        setOpenAlert(false);
      }, 3000);
    };

    startProgress();
    startDismissTimer();

    return () => {
      clearInterval(progressTimeout);
      clearTimeout(dismissTimeout);
    };
  };

  let login = async (e) => {

    try {
      let res = await api.get("view/");
      window.location.href = res.data.redirect_url;
      // console.log(res)
      // window.location.pathname = "/dashboard/po";
      
    } catch (error) {
      console.log(error)
      setAlertContent("Error");
      setType("warning");

      timebar();
      setOpen(false);
      setOpenAlert(true);
    }

  }


  return (
    <div className="login">

      <div className="container min-h-screen flex items-center justify-center ">
        {openAlert ? (
          <Alert
            variant="filled"
            severity={type}
            sx={{
              top: "20px",
              right: "650px",
              width: "auto",
              position: "absolute",
              zIndex: 100,
            }}
            onClose={() => {
              setOpenAlert(false);
            }}
          >
            {alertContent}
          </Alert>
        ) : (
          <></>
        )}

        <LinearProgress
          variant="determinate"
          color="secondary"
          value={progress}
        />
        <div className="cont p-6 border-6 border-lightgrey rounded-lg shadow-md bg-white relative">

          <div className="log flex items-center justify-center text-center text-4xl">Login</div>
          <div className="form p-5 flex flex-col items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}

            >
              <div class="mb-4">
                <TextField
                  id="user"
                  label="Username"
                  variant="outlined"
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div class="mb-4">
                <TextField
                  id="pass"
                  label="Password"
                  variant="outlined"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div class="mb-4 text-center">
                <Button type="submit">Login</Button>
              </div>
            </form>

          </div>
          <Backdrop
            sx={{
              color: "rgb(255,0,0)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        </div>
      </div>
    </div>
  );
}

export default Login;
















// let login = async () => {
//   setOpen(true);

//   if (id && password) {
//     if (mailreg.test(id)) {
//       try {
//         const res = await api.post("admin/login/", {
//           email: id,
//           password: password,
//           refresh_token: "None",
//         });

//         sessionStorage.setItem("uid", JSON.stringify(res.data["localId"]));
//         sessionStorage.setItem("user", JSON.stringify("admin"));
//         sessionStorage.setItem("token", JSON.stringify(res.data["idToken"]));
//         sessionStorage.setItem(
//           "refresh_token",
//           JSON.stringify(res.data["refreshToken"])
//         );

//         window.location.pathname = "/admin/dashboard";
//       } catch (error) {
//         setAlertContent(error.response.data.detail);
//         setType("warning");

//         timebar();
//         setOpen(false);
//         setOpenAlert(true);
//       }
//     } else {
//       try {
//         const res = await api.post("staff/login/", {
//           eid: id,
//           password: password,
//         });

//         sessionStorage.setItem("eid", JSON.stringify(res.data["eid"]));
//         sessionStorage.setItem("ename", JSON.stringify(res.data["ename"]));
//         sessionStorage.setItem(
//           "company",
//           JSON.stringify(company[res.data["company"]])
//         );
//         sessionStorage.setItem("user", JSON.stringify("staff"));
//         sessionStorage.setItem("token", JSON.stringify(res.data["token"]));

//         window.location.pathname = "/employee/dashboard";
//       } catch (error) {
//         console.log(error);
//         setAlertContent(error.response.data.detail);
//         setType("warning");

//         timebar();
//         setOpen(false);
//         setOpenAlert(true);
//       }
//     }
//   } else {
//     setAlertContent("Enter Credentials");
//     setType("warning");

//     timebar();
//     setOpen(false);
//     setOpenAlert(true);
//   }
// };