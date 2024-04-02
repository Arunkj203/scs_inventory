import axios from 'axios'
import { InputAdornment, Alert, LinearProgress } from "@mui/material";
import React, { useEffect } from 'react'

function Callback() {

    useEffect(() => {
        handlecallback()
    }, [])


    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [type, setType] = useState("");
    const [progress, setProgress] = useState(100);


    const handlecallback = async () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const response = await axios.get(`https://scs-inventory-1.onrender.com/ibob/callback/?code=${code}`); // Assuming this URL is provided by your Django backend
            const accessToken = response.data.access_token;
            // Store access token securely (e.g., in local storage)
            localStorage.setItem("access_token", JSON.stringify(accessToken));

            window.location.pathname = "/dashboard/po";

            // console.log("accessToken" + accessToken);

        } catch (error) {
            setAlertContent(error.response.data.detail);
            setType("warning");

            timebar();
            setOpen(false);
            setOpenAlert(true);
        }
        return (
            <div>        {openAlert ? (
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
            </div>
        )
    }

}


export default Callback;