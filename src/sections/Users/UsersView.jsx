/* React */
import { useContext, useState, useEffect } from "react";

/* MUI */
import {
	Grid,
	Card,
	CardContent,
	CardActionArea,
	Typography,
	Avatar,
	Stack,
	CardHeader,
	IconButton,
	Modal,
	// Fab,
	// CardActions,
	// Box,
	// List,
	// ListItem,
	// ListItemText,
	// ListItemButton,
	// ListItemAvatar,
} from "@mui/material";

/* Hooks */
import { useResponsive } from "../../hooks/use-responsive";

/* MUI Icons */
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

/* Styles */
import "../../styles/dashboard.css";

/* Components */
import AddUser from "./AddUser";
import UserView from "./User/UserView";
import { grey } from "../../theme/palette";
import { GlobalDataContext } from "../../Providers/GlobalDataProvider";
import { listAllUsers } from "../../firebase/UserOperations";
import { AuthContext } from "../../Providers/AuthDataProvider";
// import { updateProfile } from "firebase/auth";

const UsersView = () => {
	const { users, setUsers } = useContext(GlobalDataContext);
	const { isNewUser } = useContext(AuthContext)
	// const [users, setUsers] = useState([
	//   {
	//     name: "Gokul Dev",
	//     role: "Admin",
	//     email: "gokul.devb@ammachilabs.org",
	//   },
	//   {
	//     name: "Nayana",
	//     role: "User",
	//     email: "nayana@gmail.com",
	//   },
	//   {
	//     name: "Jason",
	//     role: "User",
	//     email: "jasonstatic@gmail.com",
	//   },
	//   {
	//     name: "Jake Sully",
	//     role: "User",
	//     email: "jakesully@gmail.com",
	//   },
	// ]);

	const mdDown = useResponsive("down", "md");
	const lgUp = useResponsive("up", "lg");
	// const mdUp = useResponsive("up", "md");

	/* Modal */
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: "background.paper",
		boxShadow: 24,
	};

	const [open, setOpen] = useState(false);
	const [isAdded, setIsAdded] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const handleModalClose = () => {
		setOpen(false);
	};

	/* User Data */
	useEffect(() => {
		const fetchDataAndUpdateState = async () => {
			const data = await listAllUsers();
			setUsers(data);
		};

		fetchDataAndUpdateState();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			handleModalClose();

			const data = await listAllUsers();
			setUsers(data);
		};

		fetchData();
	}, [isNewUser]);

	/* UI */

	const handleAddUserClick = () => {
		handleOpen();
	};

	const handleUserAdded = () => {
		handleModalClose();
	};

	return (
		<>
			<Grid
				container
				spacing={2}
				sx={{
					p: lgUp ? 10 : 2,
				}}
			>
				<Grid item xs={12} md={3}>
					<Card
						sx={{
							minHeight: "27dvh",
							background: "transparent",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							border: (theme) =>
								`dashed 2px ${theme.palette.divider}`,
						}}
						className="custom-card"
					>
						<CardActionArea
							onClick={handleAddUserClick}
							// sx={{ minHeight: "100%" }}
						>
							<CardContent
								sx={{
									p: 1,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: 600,
									height: "100%",
									minHeight: "27dvh",
								}}
							>
								<Stack>
									<Avatar
										sx={{
											bgcolor: grey[400],
										}}
									>
										<AddIcon />
									</Avatar>
									<Typography
										sx={{
											display: "flex",
											justifyContent: "center",
											fontWeight: 600,
											color: grey[500],
											mt: 1,
										}}
									>
										Add
									</Typography>
								</Stack>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				{users &&
					users.length > 0 &&
					users.map((user, index) => {
						return <UserView user={user} key={index} />;
					})}
			</Grid>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="add-user-modal"
				aria-describedby="add-user-modal"
			>
				<Card
					sx={{
						minWidth: 50,
						borderRadius: 5,
						p: 3,
						width: mdDown ? "85%" : "40%",
						...style,
					}}
					className="custom-card"
				>
					<CardHeader
						sx={{ p: 0 }}
						action={
							<IconButton
								aria-label="close"
								color="secondary"
								onClick={handleModalClose}
							>
								<CloseIcon />
							</IconButton>
						}
					></CardHeader>
					<CardContent
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 0,
						}}
					>
						<AddUser handleAddUserModalClose={handleUserAdded} />
					</CardContent>
				</Card>
			</Modal>
		</>
	);
};

export default UsersView;
