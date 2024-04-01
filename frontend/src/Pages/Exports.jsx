import React, { useEffect, useState } from "react";
import "./Exports.css";
import {
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function Exports({
  url,
  data,
  search,
  disabled,
  setSearch,
  selected,
  setSelected,
  total,
  setTotal,
  CGSTAmount,
  setCGSTAmount,
  SGSTAmount,
  setSGSTAmount,
  totalCost,
  setTotalCost,
  GSTAmount,
  setGSTAmount,
  generatePDF,
}) {
  const [matches, setMatches] = useState([]);
  const [done, SetDone] = useState(true);

  const [isClicked, setIsClicked] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [type, setType] = useState("");

  const options = {
    // style: "currency",
    // currency: "INR",
    maximumFractionDigits: 2,
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(validate);
  };

  const validate = () => {
    setTimeout(() => {
      setIsClicked(false);
      setIsValidated(true);
      generatePDF();
      setTimeout(() => {
        setIsValidated(false);
      }, 2250);
    }, 1250);
  };

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

  useEffect(() => {
    const addMatches = () => {
      setMatches([]);
      data?.map((item) => {
        if (
          item.product_name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >=
          0
        ) {
          setMatches((matches) => [...matches, item]);
        }
      });
    };

    if (search.length > 0) {
      addMatches();
    }
    if (search.length === 0) {
      setMatches([]);
    }
  }, [search]);
  const addItems = (item) => {
    setSearch("");

    var tmp = {};
    // // const index = selected.indexOf(item);
    // // if (index === -1) {
    tmp.pid = item.product_id;
    tmp.pname = item.product_name;

    tmp.available_qty = item.quantity_in_stock;

    tmp.Quantity = 1;

    tmp.UnitPrice = item.unit_price;
    tmp.Amount = 1;

    setSelected((selected) => [...selected, tmp]);
    // setuno(uno + 1);
    // // returnSelected();

    // console.log("Selected",[...selected, tmp]);

    // }
    // if (index >= 0) {
    //   selected[index].Count += 1;
    //   setSelected(selected);
    // }
  };

  // const updateItemCount = (e, item) => {
  //   const index = selected.indexOf(item);
  //   selected[index].UnitPrice = Number(e);
  //   selected[index].Amount =
  //     selected[index].Size *
  //     selected[index].Quantity *
  //     selected[index].UnitPrice;
  //   const temp = selected;
  //   setSelected(temp);
  // };

  // const updateItemPrice = (e, item) => {
  //   const index = selected.indexOf(item);
  //   selected[index].Quantity = Number(e);
  //   selected[index].Amount =
  //     selected[index].Size *
  //     selected[index].Quantity *
  //     selected[index].UnitPrice;
  //   const temp = selected;
  //   setSelected(temp);
  // };

  // const updateItemSizeLength = async (e, item) => {
  //   const index = selected.indexOf(item);
  //   selected[index].Length = await Number(e);
  //   selected[index].Size = selected[index].Length * selected[index].Breadth;
  //   selected[index].Amount =
  //     selected[index].Size *
  //     selected[index].Quantity *
  //     selected[index].UnitPrice;
  //   const temp = selected;
  //   setSelected(temp);
  // };

  // const updateItemSizeBreadth = async (e, item) => {
  //   const index = selected.indexOf(item);
  //   selected[index].Breadth = await Number(e);
  //   selected[index].Size = selected[index].Length * selected[index].Breadth;
  //   selected[index].Amount =
  //     selected[index].Size *
  //     selected[index].Quantity *
  //     selected[index].UnitPrice;
  //   const temp = selected;
  //   setSelected(temp);
  // };

  const generateBill = async () => {
    var temptotal = 0;
    selected.map((item) => {


      const amt = item.Quantity * item.UnitPrice;

      const temp = selected;
      setSelected(temp);
      temptotal += amt;

      item.Amount = Intl.NumberFormat("en-IN", options).format(amt);
    });

    await setTotal(Intl.NumberFormat("en-IN", options).format(temptotal));
    await setSGSTAmount(
      Intl.NumberFormat("en-IN", options).format(
        Math.round(temptotal * 0.09 * 100) / 100
      )
    );
    await setCGSTAmount(
      Intl.NumberFormat("en-IN", options).format(
        Math.round(temptotal * 0.09 * 100) / 100
      )
    );
    await setGSTAmount(
      Intl.NumberFormat("en-IN", options).format(
        Math.round(temptotal * 0.18 * 100) / 100
      )
    );
    await setTotalCost(
      Intl.NumberFormat("en-IN", options).format(
        Math.round(temptotal * 1.18 * 100) / 100
      )
    );
  };

  const deleteSelected = (item) => {
    const temp = [...selected];
    temp.splice(selected.indexOf(item), 1);
    setSelected(temp);
  };

  const addEntry = () => {
    const newItem = { id: data.length + 1};
        setData([...data, newItem]);
  };

  const returnSelected = () => {
    if (selected?.length > 0) {
      if (done) {
        return (
          <table className="w-full text-xs lg:text-sm">
            <thead className="w-full">
              <tr className="w-full">
                <td className="min-w-fit px-4" rowSpan={2}>
                  S.No
                </td>
                <td className="min-w-fit px-4" rowSpan={2}>
                  HCN Code
                </td>
                <td className="min-w-fit px-4" rowSpan={2}>
                  Product Name
                </td>
                <td className="min-w-fit px-4" rowSpan={2}>
                  Stock Available(delete)
                </td>
                <td className="min-w-fit px-4" rowSpan={2}>
                  Quantity
                </td>
                <td className="min-w-fit px-4" rowSpan={2}>
                  Unit Price
                </td>
                <td className="min-w-fit px-4" rowSpan={2}>
                  Delete
                </td>
              </tr>

            </thead>
            <tbody>
              {selected.map((item) => {
                return (
                  <tr className="w-full" key={id}>
                    {/* <tr key={item.no}>  */}
                    <td className="min-w-fit px-4">
                      {selected.indexOf(item) + 1}
                    </td>
                    <td className="min-w-fit px-4">{item.pid}</td>
                    <td width="500px" className=" min-w-fit px-4">{item.pname}</td>
                    <td width="350px" className=" min-w-fit px-4">{item.available_qty}</td>
                    <td width="80px">
                      <TextField
                        type="number"
                        defaultValue={selected[selected.indexOf(item)].Quantity}
                        inputProps={{ min: 1 }}
                        onChange={(e) => {
                          const index = selected.indexOf(item);

                          selected[index].Quantity = e.target.value;
                          const temp = selected;
                          setSelected(temp);
                        }}
                      />
                    </td>
                    <td width="80px" className=" min-w-fit px-4">{item.available_qty}</td>
                    <td>
                      <IconButton>
                        <DeleteIcon
                          onClick={() => {
                            deleteSelected(item);
                          }}
                        />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }
      if (!done) {
        return (
          <table className="w-full text-xs lg:text-sm" id="pdftable">
            <thead className="w-full">
              <tr className="w-full">
                <td className="min-w-fit px-4">S.No</td>
                <td className="min-w-fit px-4">HCN Code</td>
                <td className="min-w-fit px-4">Product Name</td>
                <td className="min-w-fit px-4">Qty</td>
                <td className="min-w-fit px-4">Unit Price</td>
                <td className="min-w-fit px-4">Amount</td>
              </tr>
            </thead>
            <tbody className="w-full">
              {selected.map((item) => {
                return (
                  <tr className="w-full" key={selected.indexOf(item)}>
                    <td className="min-w-fit px-4">
                      {selected.indexOf(item) + 1}
                    </td>
                    <td className="min-w-fit px-4">{item.pid}</td>
                    <td className="min-w-fit px-4">{item.pname}</td>
                    <td className="min-w-fit px-4">{item.Quantity}</td>
                    <td className="min-w-fit px-4">{item.UnitPrice}</td>
                    <td className="min-w-fit px-4"> ₹{item.Amount}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={5} className="text-right pr-8">
                  Total:
                </td>
                <td> ₹{total}</td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right pr-8">
                  CGST(9%):
                </td>
                <td> ₹{CGSTAmount}</td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right pr-8">
                  SGST(9%):
                </td>
                <td> ₹{SGSTAmount}</td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right pr-8">
                  Total GST(18%):
                </td>
                <td> ₹{GSTAmount}</td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right pr-8">
                  Total Cost:
                </td>
                <td> ₹{totalCost}</td>
              </tr>
            </tbody>
          </table>
        );
      }
    } else {
      return <div></div>;
    }
  };

  // useEffect(() => {
  //   returnSelected();
  // }, [selected]);

  useEffect(() => {
    returnSelected();
  }, [done]);

  return (
    <div className="h-full w-full">
      <div className="h-fit w-full flex flex-col">
        <div className="h-fit w-full grid grid-cols-2 lg:grid-cols-4 px-5 place-items-center">
          <Button
            className="w-full col-span-2"
            disabled={!done || disabled}
            variant="contained"
            color="primary"
            onClick={addEntry}
          >
            Add Entry
          </Button>
          {done ? (
            <div className="generate-button flex items-center justify-center col-span-2">
              <button
                className="text-[#1ecd97]"
                onClick={() => {
                  if (selected?.length > 0) {
                    SetDone(false);
                    generateBill();
                  } else {
                    setAlertContent("Please select atleast one item");
                    setType("error");
                    setOpenAlert(true);
                    timebar();
                  }
                }}
              >
                Generate
                <ArrowCircleRightOutlinedIcon
                  color="primary"
                  fontSize="small"
                ></ArrowCircleRightOutlinedIcon>
              </button>
            </div>
          ) : (
            <div className=" flex items-center justify-center col-span-2">
              <div className="generate-button ">
                <button
                  onClick={() => {
                    generateBill();
                    SetDone(true);
                  }}
                >
                  <span>EDIT</span>
                  <EditIcon color="primary"></EditIcon>
                </button>
              </div>
              <div className="generate-button">
                <button
                  onClick={() => {
                    handleClick();
                  }}
                >
                  <PictureAsPdfIcon color="primary"></PictureAsPdfIcon>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* <div className="list-items">{returnSearches()}</div> */}
      </div>
      <div className="selected-items w-11/12 mx-auto py-5 overflow-x-auto">
        {returnSelected()}
      </div>
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
    </div>
  );
}

export default Exports;
