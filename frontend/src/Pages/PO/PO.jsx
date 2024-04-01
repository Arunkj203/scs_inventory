import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";


import Exports from "../Exports";
import api from "@/axios";
import MenuItem from "@mui/material/MenuItem";
import { Alert } from "@mui/material";



function PO({ url }) {

  const title = "PURCHASE ORDER";

  const [data, setData] = useState([]);

  // const [shipadd, setshipadd] = useState("");
  const [sAddr, setshipaddst] = useState("");
  const [sState, setshipaddstate] = useState("");
  const [sCity, setshipaddcity] = useState("");

  const [bstreet, setbilladdst] = useState("");
  const [bstate, setbilladdstate] = useState("");
  const [bcity, setbilladdcity] = useState("");
  const [bpin, setbilladdpin] = useState("");

  const [_date, setDate] = useState();
  const [cid, setCid] = useState();


  const [ino, setIno] = useState();

  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(0);
  const [CGSTAmount, setCGSTAmount] = useState(0);
  const [SGSTAmount, setSGSTAmount] = useState(0);
  const [GSTAmount, setGSTAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [user, setuser] = useState("");
  const [name, setname] = useState("");
  const [company, setCompany] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [type, setType] = useState("");
  const [reload, setReload] = useState(false);

  function showalert() {
    setAlertContent("Select company");
    setType("info");
    setOpenAlert(true);
    timebar();
  }

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

  // eslint-disable-next-line no-redeclare
  function showalert() {
    if (disabled) {
      setAlertContent("Select company");
      setType("info");
      setOpenAlert(true);
      timebar();
    }
  }

  // useEffect(() => {
  //   getdata()
  // }, [])



  // let getdata = async () => {
  //   try {
  //     const res = await api
  //       .get("files/")
  //       .then((res) => {
  //         setData(res.data["products"]);
  //         // setIno(JSON.stringify(res.data["ino"]));
  //         console.log("Data loaded successfully");
  //         // console.log(res.data["products"]);
  //       });
  //   } catch (error) {
  //     setAlertContent(error.response.data.detail);
  //     setType("warning");
  //     setOpenAlert(true);
  //     timebar();
  //   }
  // };



  const [search, setSearch] = useState("");

  let savepdf = async () => {
    if (
      _date &&
      selected &&
      cid &&
      sAddr &&
      sState &&
      sCity &&
      bstate &&
      bstreet &&
      bcity
    ) {
      try {
        const res = await api.post(
          "staff/report/",
          {
            ino: ino,
            date: _date,
            total: Number(total.replace(/₹|,/g, "")),
            gst: Number(GSTAmount.replace(/₹|,/g, "")),
            created_by: name,
          }
        );
        // generatePDF(JSON.stringify(res.data));
        setIno(JSON.stringify(res.data));

        setAlertContent("GENERATED SUCCESSFULLY");
        setType("success");
        setOpenAlert(true);
        setReload(true);
      } catch (error) {
        setAlertContent(error.response.data.detail ? error.response.data.detail : error.response);
        setType("error");
        setOpenAlert(true);
      }
    } else {
      setAlertContent("All Fields are Mandatory");
      setType("info");
      setOpenAlert(true);
      timebar();
    }
  };

  //   let cmp = () => {
  //     if (user === "admin") {
  //       return (
  //         <div className="w-full grid grid-cols-1 place-items-start col-span-1 gap-2 text-xl">
  //           <p>COMPANY:</p>
  //           <TextField
  //             className="w-full"
  //             select
  //             focused
  //             value={company}
  //             onChange={(e) => {
  //               setCompany(e.target.value);
  //               getdata(e.target.value);
  //               setOpenAlert(false);
  //               setDisabled(false);
  //             }}
  //           >
  //             {companies.map((option) => (
  //               <MenuItem key={option.value} value={option.value}>
  //                 {option.label}
  //               </MenuItem>
  //             ))}
  //           </TextField>
  //         </div>
  //       );
  //     }
  //   };

  return (
    <div className="h-full w-full">
      <div className="h-24 grid place-items-center">
        <p className="text-[#4c4844] text-3xl md:text-4xl lg:text-5xl">
          Purchase
          <span className="text-[#57c9c9] text-4xl md:text-5xl lg:text-6xl">
            Order
          </span>
        </p>
      </div>
      <div className="h-screen w-full grid grid-cols-1 gap-5 px-5 lg:grid-cols-7">
        <div className="grid grid-cols-1 bg-white lg:col-span-3">
          <div className="flex flex-col items-center gap-5 border-[#1a73e8] border p-5 rounded-xl">
            <div className="h-12 w-full text-center">
              <h2 className="text-[#565656] underline text-2xl md:text-4xl">
                Purchase Order Details
              </h2>
            </div>
            <div className="w-full grid grid-cols-1 place-items-stretch py-5 md:grid-cols-2 gap-10">
              {/* {cmp()} */}
              <div className="w-full grid grid-cols-1 place-items-start col-span-1 gap-2 text-xl">
                <p>Purchase Order No:</p>
                <h1 className="text-4xl">{ino ? ino : "-----"}</h1>
              </div>
              <div className="w-full grid grid-cols-1 place-items-start col-span-1 gap-5 text-xl md:col-span-2">
                <p className="col-span-1">Company Name:</p>
                <TextField
                  className="w-full"
                  type="text"
                  disabled={disabled}
                  placeholder="Name"
                  onClick={() => {
                    showalert();
                  }}
                  // variant="standard"
                  onChange={(e) => {
                    setCid(e.target.value);
                  }}
                />
              </div>
              <div className="w-full grid grid-cols-1 place-items-start col-span-1 gap-2 text-xl">
                <p>Date:</p>
                <TextField
                  className="w-full"
                  type="date"
                  disabled={disabled}
                  value={_date}
                  onClick={() => {
                    showalert();
                  }}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>

              {/* <div className="input-fields multifields">
                <p>Shipping Address:</p>
                <TextField
                className="w-full"
                  variant="standard"
                  placeholder="Street Address"
                  onChange={(e) => {
                    setshipaddst(e.target.value);
                  }}
                />
                <TextField
                className="w-full"
                  variant="standard"
                  placeholder="City"
                  onChange={(e) => {
                    setshipaddcity(e.target.value);
                  }}
                />
                <TextField
                className="w-full"
                  variant="standard"
                  placeholder="State/Province"
                  onChange={(e) => {
                    setshipaddstate(e.target.value);
                  }}
                />
                {/* <TextField
                className="w-full"
                  variant="standard"
                  placeholder="PIN Code"
                  onChange={(e) => {
                    setshipaddpin(e.target.value);
                  }}
                /> */}
              {/* </div>  */}

              <div className="w-full grid grid-cols-1 place-items-start col-span-1 gap-5 text-xl md:grid-cols-2 md:col-span-2">
                <p className="col-span-1 md:col-span-2">Billing Address:</p>
                <TextField
                  className="w-full"
                  // variant="standard"
                  placeholder="Street Address"
                  disabled={disabled}
                  onChange={(e) => {
                    setbilladdst(e.target.value);
                  }}
                />
                <TextField
                  className="w-full"
                  // variant="standard"
                  placeholder="City & Pin"
                  disabled={disabled}
                  onChange={(e) => {
                    setbilladdcity(e.target.value);
                  }}
                />
                <TextField
                  className="w-full"
                  // variant="standard"
                  placeholder="State"
                  disabled={disabled}
                  onChange={(e) => {
                    setbilladdstate(e.target.value);
                  }}
                />
              </div>
              <div className="w-full grid grid-cols-1 place-items-start col-span-1 gap-5 text-xl md:grid-cols-2 md:col-span-2">
                <p className="col-span-1 md:col-span-2">Shipping Address:</p>
                <TextField
                  className="w-full"
                  // variant="standard"
                  placeholder="Street Address"
                  disabled={disabled}
                  onChange={(e) => {
                    setshipaddst(e.target.value);
                  }}
                />
                <TextField
                  className="w-full"
                  // variant="standard"
                  placeholder="City & Pin"
                  disabled={disabled}
                  onChange={(e) => {
                    setshipaddcity(e.target.value);
                  }}
                />
                <TextField
                  className="w-full"
                  // variant="standard"
                  placeholder="State"
                  disabled={disabled}
                  onChange={(e) => {
                    setshipaddstate(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="search">
            {openAlert ? (
              <Alert
                variant="filled"
                severity={type}
                sx={{
                  top: "20px",
                  width: "auto",
                  position: "absolute",
                  zIndex: 100,
                }}
                onClose={() => {
                  if (reload) {
                    window.location.reload();
                  }
                  setOpenAlert(false);
                }}
              >
                {alertContent}
              </Alert>
            ) : (
              <></>
            )}
            {/* {openAlert ? (
           <Alert
           severity={type}
            sx={{
              top:"152px",
              left:"950px",
              width:"auto",
               position: "absolute",
               zIndex:100,
                    }}
            onClose={() => {
              setOpenAlert(false);
            }}
          >
        {alertContent}
          </Alert>
        ) : (
          <></>
        )}  */}
            <Exports
              download
              urldownload={url}
              data={data}
              disabled={disabled}
              search={search}
              setSearch={setSearch}
              selected={selected}
              setSelected={setSelected}
              total={total}
              setTotal={setTotal}
              CGSTAmount={CGSTAmount}
              setCGSTAmount={setCGSTAmount}
              SGSTAmount={SGSTAmount}
              setSGSTAmount={setSGSTAmount}
              GSTAmount={GSTAmount}
              setGSTAmount={setGSTAmount}
              totalCost={totalCost}
              setTotalCost={setTotalCost}
              generatePDF={savepdf}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default PO;

{
  /* <div className="input-fields multifields">
                <p>Shipping Address:</p>
                <TextField
                  variant="standard"
                  placeholder="Street Address"
                  onChange={(e) => {
                    setshipaddst(e.target.value);
                  }}
                />
                <TextField
                  variant="standard"
                  placeholder="City"
                  onChange={(e) => {
                    setshipaddcity(e.target.value);
                  }}
                />
                <TextField
                  variant="standard"
                  placeholder="State/Province"
                  onChange={(e) => {
                    setshipaddstate(e.target.value);
                  }}
                />
                 <TextField
                  variant="standard"
                  placeholder="PIN Code"
                  onChange={(e) => {
                    setshipaddpin(e.target.value);
                  }}
                /> 
                </div>   */
}
