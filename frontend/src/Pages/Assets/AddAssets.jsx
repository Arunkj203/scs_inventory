import React from 'react'

function AddAssets() {
  return (
    <div className="w-11/12 mx-auto overflow-x-auto">
    <table className="w-full">
        <thead className="w-full" >
            <tr className="w-full">
                <th className="min-w-fit px-2">Asset ID</th>
                <th className="min-w-fit px-2">State</th>
                <th className="min-w-fit px-2">Location</th>
                <th className="min-w-fit px-2">Customer</th>
                <th className="min-w-fit px-2">Asset</th>
                <th className="min-w-fit px-2">Type</th>
                <th className="min-w-fit px-2">Category</th>
                <th className="min-w-fit px-2">Make Model</th>
                <th className="min-w-fit px-2">Asset Serial No</th>
                <th className="min-w-fit px-2">Working Status</th>
                <th className="min-w-fit px-2">Usable Stock Status</th>
                <th className="min-w-fit px-2">Remarks</th>
                <th className="min-w-fit px-2">Date</th>
                <th className="min-w-fit px-2">Name of Audit Person</th>
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
                        <td className="min-w-fit px-2">{data.asset}</td>
                        <td className="min-w-fit px-2">{data.type}</td>
                        <td className="min-w-fit px-2">{data.category}</td>
                        <td className="min-w-fit px-2">{data.make_model}</td>
                        <td className="min-w-fit px-2">{data.asset_serial_no}</td>
                        <td className="min-w-fit px-2">{data.working_status}</td>
                        <td className="min-w-fit px-2">{data.usable_stock_status}</td>
                        <td className="min-w-fit px-2">{data.remarks}</td>
                        <td className="min-w-fit px-2">{data.date}</td>
                        <td className="min-w-fit px-2">{data.name_of_audit_person}</td>


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
  )
}

export default AddAssets