import PropTypes from "prop-types";
import { memo, forwardRef } from "react";


import { StyledScrollbar, StyledRootScrollbar } from "./styles";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const Scrollbar = forwardRef(({ children, sx, ...other }, ref) => {
	Scrollbar.displayName = "Scrollbar";
	const userAgent =
		typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

	const mobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			userAgent
		);

	if (mobile) {
		return (
			<Box ref={ref} sx={{ overflow: "auto", ...sx }} {...other}>
				{children}
			</Box>
		);
	}

	return (
		<StyledRootScrollbar>
			<StyledScrollbar
				scrollableNodeProps={{
					ref,
				}}
				clickOnTrack={false}
				sx={sx}
				{...other}
			>
				{children}
			</StyledScrollbar>
		</StyledRootScrollbar>
	);
});

Scrollbar.propTypes = {
	children: PropTypes.node,
	sx: PropTypes.object,
};

const CustomScrollBar = memo(Scrollbar);
export default CustomScrollBar;
