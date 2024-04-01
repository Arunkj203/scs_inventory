import { Route, Routes } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Login from "../Pages/Login/Login";
import Callback from "../Pages/Login/Callback";
import PO from "../Pages/PO/PO";
import Assets from "../Pages/Assets/Assets";

// export const router = createBrowserRouter([
// 	{
// 		path: "/",
// 		element: <MainLayout></MainLayout>,
// 		children: [
// 			{
// 				path: "/",
// 				element: <Home />,
// 			},
// 			{
// 				path: "/aboutus",
// 				element: <AboutUs />,
// 			},
// 		],
// 	},
// ]);



const Routers = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={<Login />}
			/>
			<Route
				path="/login"
				element={<Callback />}
			/>

			<Route
				path="/dashboard"
				element={<MainLayout></MainLayout>}
			>
				<Route
					path="/dashboard/po"
					element={<PO />}
				/>
				<Route
					path="/dashboard/aboutus"
					element={<AboutUs />}
				/>
				<Route
					path="/dashboard/assets"
					element={<Assets />}
				/>
			</Route>
		</Routes>
	);
};

export default Routers;
