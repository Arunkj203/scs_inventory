import React, { useEffect, useRef, useState } from "react";
import api from "@/axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import {
    Alert,
    Button,
    IconButton,
    InputAdornment,
    Modal,
    TextField,
} from "@mui/material";
import "./Assets.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import AddAssets from "./AddAssets";
import ShowAssets from "./ShowAssets";

import userslist from "./data.json";

function Assets() {




    const [users, setUsers] = useState();
    const [user, setUser] = useState();


    const [open, setOpen] = useState(false);
    const [ciropen, setcirOpen] = useState(false);
    const [show, setShow] = useState(true);



    const [data, setData] = useState();



    const [selectedOption, setSelectedOption] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [Alerttype, setAlerttype] = useState("");

    let timebar = () => {
        let progressTimeout;
        let dismissTimeout;

        const startDismissTimer = () => {
            dismissTimeout = setTimeout(() => {
                setOpenAlert(false);
            }, 3000);
        };

        startDismissTimer();

        return () => {
            clearInterval(progressTimeout);
            clearTimeout(dismissTimeout);
        };
    };

    let load_data = async () => {
        setcirOpen(true);
        try {
            const res = await api.get("assets/");
            setUsers(res.data["Assets_list"]);
            setAId(res.data["id"])
            setAssetId(res.data["id"])
            setcirOpen(false);
        } catch (error) {
            setcirOpen(false);
            setAlertContent(error.response.data.detail);
            setType("warning");
            setOpenAlert(true);
            timebar();
        }
    };

    // let add = async (e) => {
    //     e.preventDefault();
    //     // var t_eid = cmps[cmp] + eid;
    //     if (state && location && customer && asset && type && category && makeModel && assetSerialNo && workingStatus && usableStockStatus && remarks && date && auditPersonName) {
    //         try {
    //             const res = await api.post("assets/", {
    //                 "asset_id": assetId,
    //                 "state": state,
    //                 "location": location,
    //                 "customer": customer,
    //             
    //                 "asset_type": type,
    //                 "category": category,
    //                 "make_model": makeModel,
    //                 "asset_serial_no": assetSerialNo,
    //                 "working_status": workingStatus,
    //                 "usable_stock_status": usableStockStatus,
    //                 "remarks": remarks,
    //                 "date": date,
    //                 "name_of_audit_person": auditPersonName
    //             });
    //             setAlertContent("Asset Added Successfully");
    //             setType("success");
    //             setOpenAlert(true);
    //             load_data();
    //             setOpen(false);

    //             if (formRef.current) {
    //                 formRef.current.reset();
    //             }
    //         } catch (error) {
    //             setAlertContent(error.response.data.detail);
    //             setType("warning");
    //             setOpenAlert(true);
    //             timebar();
    //         }
    //     } else {
    //         setAlertContent("Enter all Values");
    //         setType("info");
    //         setOpenAlert(true);
    //         timebar();
    //     }
    // };


    let update = async () => {
        if (user) {

            try {
                const res = await api.put("assets/" + user.asset_id + "/", user);
                setAlertContent("Asset updated successfully");
                setType("info");
                setOpenAlert(true);
                timebar();
                load_data();
                setOpen(false);
            } catch (error) {
                setAlertContent(error.response.data.detail);
                setType("warning");
                setOpenAlert(true);
                timebar();
            }
        } else {
            setAlertContent("Enter the value");
            setType("info");
            setOpenAlert(true);
            timebar();
        }
    };









    return (
        <div className="h-full w-full">
            {openAlert ? (
                <Alert
                    variant="filled"
                    severity={Alerttype}
                    sx={{
                        top: "20px",
                        left: "639px",
                        width: "auto",
                        position: "absolute",
                        zIndex: 10000,
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
            <div className="h-24 grid place-items-center">
                <p className="text-[#4c4844] text-3xl md:text-4xl lg:text-5xl">
                    Assets
                    <span className="text-[#57c9c9] text-4xl md:text-5xl lg:text-6xl">
                        Update
                    </span>
                </p>
            </div>
            <div className="h-full w-full">


                {
                    show ?
                        <ShowAssets load_data={load_data} setShow={setShow} />
                        :
                        <AddAssets setShow={setShow} />
                }





            </div>

            <div>
                <Backdrop
                    sx={{
                        color: "rgb(255,0,0)",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={ciropen}
                >
                    <CircularProgress color="primary" />
                </Backdrop>
            </div>
        </div>
    )
}

export default Assets