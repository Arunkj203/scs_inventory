import { Link } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import {

	Button,
	Divider,
	Drawer,
	SwipeableDrawer,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ibob from "../../images/ibob-logo.jpeg"
import sf from "../../images/sf-logo.jpeg"

const Header = () => {
	return (
		<header className="w-full h-36 flex flex-col  bg-blue-800">
			<nav className="flex  space-x-10">
				<MenuIcon

					onClick={() => {
						setOpen(true);
					}}
					sx={{

						fontSize: "80px",
						marginTop: "30px",
						paddingLeft: "10px"
					}}
				/>
				<div className="flex flex-col mt-1">
					<img className="h-10 lg:h-16 aspect-auto" src={ibob} alt="logo" />
					<img className="h-10 lg:h-16 aspect-auto" src={sf} alt="logo" />
				</div>

				<div className="flex items-center font-serif font-bold">
					<span className=" text-8xl text-slate-100 pl-40">IBOB</span>
					<span className=" text-6xl text-slate-100 px-2">SCS</span>
				</div>



			</nav>
		</header>
	);
};

export default Header;
