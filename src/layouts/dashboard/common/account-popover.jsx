import { useContext, useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";

import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Providers/AuthDataProvider";

// const MENU_OPTIONS = [
// 	{
// 		label: "Home",
// 		icon: "eva:home-fill",
// 	},
// 	{
// 		label: "Profile",
// 		icon: "eva:person-fill",
// 	},
// 	// {
// 	//   label: "Settings",
// 	//   icon: "eva:settings-2-fill",
// 	// },
// ];

const SlideTransition = (props) => {
	return <Slide {...props} direction="up" />;
};

export default function AccountPopover() {
	const { currentUser, dbUser } = useContext(AuthContext);
	const [open, setOpen] = useState(null);
	const navigate = useNavigate();
	const [account, setAccount] = useState({
		displayName: "Jake Sully",
		email: "admin@tempmonitor.app",
		photoURL: "/assets/icons/users/user_icon.png",
	});

	// useEffect(() => {
	//   if (Object.keys(currentUser).length === 0) {
	//     // console.log(currentUser)
	//     // console.log(Object.keys(currentUser).length)
	//     const currUser = JSON.parse(localStorage.getItem("userInfo")) || {};
	//     if (Object.keys(currUser).length > 0)
	//       setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
	//   } else {
	//     console.log(currentUser);
	//   }
	// }, []);

	useEffect(() => {
		if (Object.keys(dbUser).length > 0) {
			const userInfo = dbUser;
			const email = userInfo.email;
			const role = userInfo.role;
			setAccount((prev) => {
				return { ...prev, email, displayName: userInfo.displayName, photoURL: role === 'admin'? '/assets/icons/users/admin_icon.png' : '/assets/icons/users/user_icon.png'  };
			});
		}
	}, [currentUser, dbUser]);

	// Snackbar
	const [state, setState] = useState({
		open: false,
		Transition: Fade,
	});

	const handleOpen = (event) => {
		setOpen(event.currentTarget);
	};

	const handleClose = () => {
		setOpen(null);
	};

	/* Snackbar methods */
	const handleSnackbarOpen = (Transition) => () => {
		setState({
			open: true,
			Transition,
		});
	};

	const handleSnackbarClose = () => {
		setState({
			...state,
			open: false,
		});
	};

	const handleSignOut = () => {
		signOut(auth)
			.then(() => {
				// Sign-out successful
				handleSnackbarOpen(SlideTransition);
				navigate("/auth/login");
				localStorage.removeItem("userInfo");
				localStorage.removeItem("dbuser");
			})
			.catch((error) => {
				// An error happened
				console.log(error);
			});
		setOpen(null);
	};

	// const handleMenuItemClick = (label) => {
	// 	if (label === "Home") {
	// 		navigate("/dashboard/home");
	// 		handleClose();
	// 	} else if (label === "Profile") {
	// 		navigate("/dashboard/profile");
	// 		handleClose();
	// 	}
	// };

	return (
		<>
			{/* <pre>{JSON.stringify(currentUser)}</pre> */}
			<IconButton
				onClick={handleOpen}
				sx={{
					width: 50,
					height: 50,
					background: (theme) => alpha(theme.palette.grey[500], 0.08),
					...(open && {
						background: (theme) =>
							`linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
					}),
				}}
			>
				<Avatar
					src={account.photoURL}
					alt={account.displayName}
					sx={{
						width: 46,
						height: 46,
						border: (theme) =>
							`solid 2px ${theme.palette.background.default}`,
						textTransform: "capitalize",
					}}
				>
					{account.displayName}
				</Avatar>
			</IconButton>

			<Popover
				open={!!open}
				anchorEl={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				PaperProps={{
					sx: {
						p: 0,
						mt: 1,
						ml: 0.75,
						width: 200,
					},
				}}
			>
				<Box sx={{ my: 1.5, px: 2 }}>
					<Typography variant="subtitle2" noWrap>
						{account.displayName}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "text.secondary" }}
						noWrap
					>
						{account.email}
					</Typography>
				</Box>

				<Divider sx={{ borderStyle: "dashed" }} />

				{/* {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleMenuItemClick(option.label)}>
            {option.label}
          </MenuItem>
        ))} */}

				<Divider sx={{ borderStyle: "dashed", m: 0 }} />

				<MenuItem
					disableRipple
					disableTouchRipple
					onClick={handleSignOut}
					sx={{ typography: "body2", color: "error.main", py: 1.5 }}
				>
					Logout
				</MenuItem>
			</Popover>

			<Snackbar
				open={state.open}
				onClose={handleSnackbarClose}
				TransitionComponent={state.Transition}
				message="Logged Out Successfully"
				key={state.Transition.name}
				autoHideDuration={1200}
				color="success"
			/>
		</>
	);
}
