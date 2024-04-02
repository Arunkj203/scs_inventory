import React, { useEffect, useRef, useState } from "react";
import api from "@/axios";

import {
    Alert,
    Button,
    IconButton,
    InputAdornment,
    Modal,
    TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";


function ShowAssets({ load_data, setShow }) {

    const [action, setAction] = useState("");

    const [search, setSearch] = useState("");
    const [user, setUser] = useState();
    const [users, setUsers] = useState();

    const [open, setOpen] = useState(false);

    const [dialogopen, setDialogopen] = useState(false);

    let deleteut = async () => {
        try {
            const res = await api.delete("assets/" + assetId + "/");
            setAlertContent("Asset deleted successfully");
            setType("success");
            setOpenAlert(true);
            timebar();
            load_data();
        } catch (error) {
            setAlertContent(error.response.data.detail);
            setType("warning");
            setOpenAlert(true);
            timebar();
        }
    };


    const returnForm = () => {
        if (action === "") {
            return <div></div>;
        }
      
        if (action === "edit-emp") {
            return (
                <div className="form-user ">
                    <div className="header">
                        <h1>UPDATE ASSET</h1>
                    </div>

                    <div className="form-field">
                        <TextField
                            disabled
                            type="text"
                            label="Asset ID"
                            value={user.asset_id}

                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="State"
                            value={user.state}
                            onChange={(e) => {
                                setUser({ ...user, state: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Location"
                            value={user.location}
                            onChange={(e) => {
                                setUser({ ...user, location: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Customer"
                            value={user.customer}
                            onChange={(e) => {
                                setUser({ ...user, customer: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Asset"
                            value={user.asset}
                            onChange={(e) => {
                                setUser({ ...user, asset: e.target.value });
                                setAssetId(e.target.value.slice(0, 3) + aid)
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Type"
                            value={user.type}
                            onChange={(e) => {
                                setUser({ ...user, type: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Category"
                            value={user.category}
                            onChange={(e) => {
                                setUser({ ...user, category: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Make Model"
                            value={user.make_model}
                            onChange={(e) => {
                                setUser({ ...user, make_model: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Asset Serial No"
                            value={user.asset_serial_no}
                            onChange={(e) => {
                                setUser({ ...user, asset_serial_no: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Working Status"
                            value={user.working_status}
                            onChange={(e) => {
                                setUser({ ...user, working_status: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Usable Stock Status"
                            value={user.usable_stock_status}
                            onChange={(e) => {
                                setUser({ ...user, usable_stock_status: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Remarks"
                            value={user.remarks}
                            onChange={(e) => {
                                setUser({ ...user, remarks: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="date"
                            label="Date"
                            value={user.date}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => {
                                setUser({ ...user, date: e.target.value });
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextField
                            type="text"
                            label="Name of Audit Person"
                            value={user.name_of_audit_person}
                            onChange={(e) => {
                                setUser({ ...user, name_of_audit_person: e.target.value });
                            }}
                        />
                    </div>


                    <div className="form-field-btn">
                        <Button onClick={update}>Update</Button>
                        <Button
                            onClick={() => {
                                setOpen(false);
                                setAssetId(aid)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            );
        }
    };


    useEffect(() => {
        returnForm();
    }, [action, user]);

    return (
        <div className="h-full w-full flex flex-col gap-5 py-5">
            <div className="w-full max-w-4xl grid grid-cols-3 place-items-center px-2">
                <TextField
                    className="w-full"
                    select
                    label="Asset"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                >

                </TextField>
                <Button
                    variant="contained"
                    color="success"
                    onClick={load_data}
                // setUsers(userslist);
                >
                    <p className="text-[10px] md:text-base lg:text-xl">Search</p>
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {

                        setShow(false);
                    }}
                >
                    <p className="text-[10px] md:text-base lg:text-xl">Add Asset</p>
                </Button>
            </div>
            <div className="w-11/12 mx-auto overflow-x-auto">
                <table className="w-full">
                    <thead className="w-full" >
                        <tr className="w-full">
                            <th className="min-w-fit px-2">Asset ID</th>
                            <th className="min-w-fit px-2">State</th>
                            <th className="min-w-fit px-2">Location</th>
                            <th className="min-w-fit px-2">Customer</th>                       
                            <th className="min-w-fit px-2">Asset Type</th>
                            <th className="min-w-fit px-2">Category</th>
                            <th className="min-w-fit px-2">Make Model</th>
                            <th className="min-w-fit px-2">Asset Serial No</th>
                            <th className="min-w-fit px-2">Working Status</th>
                            <th className="min-w-fit px-2">Usable Stock Status</th>
                            <th className="min-w-fit px-2">Remarks</th>
                            <th className="min-w-fit px-2">Date</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((data) => {
                            return (
                                <tr className="w-full" key={data.asset_id}>
                                    <td className="min-w-fit px-2">{data.asset_id}</td>
                                    <td className="min-w-fit px-2">{data.state}</td>
                                    <td className="min-w-fit px-2">{data.location}</td>
                                    <td className="min-w-fit px-2">{data.customer}</td>
                                    <td className="min-w-fit px-2">{data.asset_type}</td>
                                    <td className="min-w-fit px-2">{data.category}</td>
                                    <td className="min-w-fit px-2">{data.make_model}</td>
                                    <td className="min-w-fit px-2">{data.asset_serial_no}</td>
                                    <td className="min-w-fit px-2">{data.working_status}</td>
                                    <td className="min-w-fit px-2">{data.usable_stock_status}</td>
                                    <td className="min-w-fit px-2">{data.remarks}</td>
                                    <td className="min-w-fit px-2">{data.date}</td>
                                  


                                    <td className="min-w-fit px-2">
                                        <IconButton
                                            onClick={() => {
                                                setAction("edit-emp");

                                                setUser(data);

                                                setOpen(true);

                                                // setData({});
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setAssetId(data.asset_id);
                                                setDialogopen(true);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                placement="bottom"
            >
                <div>{returnForm()}</div>
            </Modal>

            <div>
                <Dialog
                    open={dialogopen}
                    onClose={() => {
                        setDialogopen(false);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure want to delete?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDialogopen(false);
                            }}
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                deleteut();
                                setDialogopen(false);
                            }}
                            autoFocus
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        </div>
    )
}

export default ShowAssets