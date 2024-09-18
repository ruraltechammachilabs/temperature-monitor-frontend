import { useState } from "react";
import PropTypes from "prop-types";


// import Nav from "./nav";
import Main from "./main";
import Header from "./header";
import Box from "@mui/material/Box";


export default function DashboardLayout({ children }) {
	const [openNav, setOpenNav] = useState(false);

	return (
		<>
			<Header onOpenNav={() => setOpenNav(true)} />

			<Box
				sx={{
					minHeight: 1,
					display: "flex",
					flexDirection: { xs: "column", lg: "row" },
				}}
			>
				{/* uncomment this line to add Nav to header */}
				{/* <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} /> */}

				<Main>{children}</Main>
			</Box>
		</>
	);
}

DashboardLayout.propTypes = {
	children: PropTypes.node,
};
