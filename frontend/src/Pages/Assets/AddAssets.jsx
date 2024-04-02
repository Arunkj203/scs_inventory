import React, { useEffect, useRef, useState } from "react";

import {
    Alert,
    Button,
    IconButton,
    InputAdornment,
    Modal,
    TextField,
} from "@mui/material";

function AddAssets({ setShow }) {

    const [newAssets, setnewAssets] = useState([]);

    const [aid, setAId] = useState("001");
    const [assetId, setAssetId] = useState("");
    const [state, setState] = useState("");
    const [location, setLocation] = useState("");
    const [customer, setCustomer] = useState("");
    const [asset, setAsset] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [makeModel, setMakeModel] = useState("");
    const [assetSerialNo, setAssetSerialNo] = useState("");
    const [workingStatus, setWorkingStatus] = useState("");
    const [usableStockStatus, setUsableStockStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [date, setDate] = useState("");
    const [auditPersonName, setAuditPersonName] = useState("");


    const addEntry = () => {
        const newItem = {};
        setnewAssets([...newAssets, newItem]);
    };

    const modifyEntry = (index, keylabel, value) => {

        const newData = [...newAssets];
        // Add the new key-value pairs to the dictionary at the specified index
        newData[index] = { ...newData[index], ...{ [keylabel]: value } };
        setnewAssets(newData)
    };


    return (
        <div className="h-full w-full flex flex-col gap-5 py-5">
            <div className=' px-9 flex justify-between'>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {

                        addEntry();
                    }}
                >
                    <p className="text-[10px] md:text-base lg:text-xl">Add Asset</p>
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        // setShow(true);

                        console.table(newAssets)
                    }}
                // setUsers(userslist);
                >
                    <p className="text-[10px] md:text-base lg:text-xl">Save Assets</p>
                </Button>
            </div>

            <div className="w-11/12 mx-auto overflow-x-auto">
                <table className="w-full">
                    <thead className="w-full" >
                        <tr className="w-full" >
                            <th className="min-w-fit px-2">S.NO</th>
                            {/* <th className="min-w-fit px-2">Asset ID</th> */}
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
                        {newAssets?.map((data) => {
                            return (
                                <tr className="w-full" key={newAssets.indexOf(data)}>
                                    <td className="min-w-fit px-2">{newAssets.indexOf(data) + 1}</td>


                                    {/* <td className="min-w-fit px-2">
                                        <TextField
                                            disabled
                                            type="text"
                                            label="Asset ID"
                                            value={assetId + aid}
                                        /></td> */}

                                    <td className="min-w-fit px-2">  <TextField
                                        type="text"
                                        label="State"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "state", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2"> <TextField
                                        type="text"
                                        label="Location"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "location", e.target.value);
                                        }}
                                    /></td>

                                    <td className="min-w-fit px-2">
                                        <TextField
                                            type="text"
                                            label="Customer"

                                            onChange={(e) => {
                                                modifyEntry(newAssets.indexOf(data), "customer", e.target.value);
                                            }}
                                        /></td>


                                    <td className="min-w-fit px-2"><TextField
                                        type="text"
                                        label="Asset Type"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "asset_type", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2">   
                                    <TextField
                                        type="text"
                                        label="Category"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "category", e.target.value);
                                            // modifyEntry(newAssets.indexOf(data), "asset_id", e.target.value.slice(0, 3) + aid);
                                            setAssetId(e.target.value.slice(0, 3))
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2"> <TextField
                                        type="text"
                                        label="Make Model"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "make_model", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2">   <TextField
                                        type="text"
                                        label="Asset Serial No"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "asset_serial_no", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2"> <TextField
                                        type="text"
                                        label="Working Status"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "working_status", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2">  <TextField
                                        type="text"
                                        label="Usable Stock Status"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "usable_stock_status", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2">   <TextField
                                        type="text"
                                        label="Remarks"

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "remarks", e.target.value);
                                        }}
                                    /></td>
                                    <td className="min-w-fit px-2"> <TextField
                                        type="date"
                                        label="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}

                                        onChange={(e) => {
                                            modifyEntry(newAssets.indexOf(data), "date", e.target.value);
                                        }}
                                    /></td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AddAssets