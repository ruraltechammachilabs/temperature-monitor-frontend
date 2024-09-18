/* eslint-disable react/no-unescaped-entities */
/* React */
// import { useContext } from "react";
import { useState, useEffect } from "react";

/* MUI */
import {
	Card,
	CardContent,
	Grid,
	CardHeader,
	Avatar,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	CardActions,
	Fab,
	Modal,
	Stack,
	Snackbar,
	// Box,
	// TextField,
} from "@mui/material";
// import { LoadingButton } from "@mui/lab";

/* MUI Icons */
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
// import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

/* Components */
import QuickBanner from "../../../sections/banner/QuickBanner";
import TemperatureGraph from "../../../sections/graphs/dashboard/TemperatureGraph";
import HumidityGraph from "../../../sections/graphs/dashboard/HumidityGraph";
import SmokeGraph from "../../../sections/graphs/dashboard/SmokeGraph";
import AddAlertUser from "../../../sections/alert-users/AddAlertUser";

import {
	fetchData,
	listenForDocumentChanges,
} from "../../../firebase/operations";
import CurrentTime from "../../../components/current-time/CurrentTime";

/* Hooks */
import { useResponsive } from "../../../hooks/use-responsive";

/* Styles */
import "../../../global.css";
import "../../../styles/dashboard.css";

/* Components */
import { grey } from "../../../theme/palette";
// import { setRealtimeValues } from "../../../firebase/operations";
import TelegramBotConfig from "../Telegram/telegram-bot-config";
import {
	rebootSystem,
	shutdownSystem,
} from "../../../firebase/SensorSettingsOperations";

const DashboardTab = () => {
	const mdUp = useResponsive("up", "md");
	const mdDown = useResponsive("down", "md");

	const [action, setAction] = useState("");

	/* snackbar alert */
	const [state, setState] = useState({
		alertOpen: false,
		vertical: "bottom",
		horizontal: "center",
		msg: " System Successful !",
	});
	const { vertical, horizontal, alertOpen } = state;

	const handleSnackbarClose = () => {
		setState({ ...state, alertOpen: false });
	};

	/* Data */
	const [data, setData] = useState({
		Temperature: 0,
		Humidity: 0,
		Smoke: 0,
	});

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

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const handleModalClose = () => {
		setOpen(false);
	};

	/* Read Firestore Data */
	useEffect(() => {
		const fetchDataAndUpdateState = async () => {
			const data = await fetchData("Data_reads");
			setData(data);
		};

		fetchDataAndUpdateState();

		const unsubscribe = listenForDocumentChanges((newData) => {
			setData(newData);

			/* Add data to realtime DB */
			/* setRealtimeValues(newData) */
		});

		return () => unsubscribe();
	}, []);

	/* System Actions */

	const shutdownDevice = () => {
		shutdownSystem().then(() => {
			setAction("Shutdown");
			setState({ ...state, alertOpen: true });
		});
	};

	const rebootDevice = () => {
		rebootSystem().then(() => {
			setAction("Reboot");
			setState({ ...state, alertOpen: true });
		});
	};

	return (
		<>
			<Grid
				container
				spacing={2}
				sx={{
					pr: mdUp ? 25 : 0,
					pl: mdUp ? 25 : 0,
					pt: 2,
					display: "flex",
					position: "relative",
					zIndex: 1,
				}}
			>
				<Grid item xs={12}>
					<Stack
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "end",
							width: "100%",
							mb: 2,
						}}
					>
						<IconButton
							aria-label="Power Button"
							className="power-button"
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
							}}
							onClick={shutdownDevice}
						>
							<PowerSettingsNewRoundedIcon
								sx={{ width: 35, height: 35 }}
							/>
							<span
								style={{
									marginTop: "5px",
									fontSize: "small",
									letterSpacing: 1,
								}}
							>
								Shutdown
							</span>
							{/* <Typography sx={{ m: 1 }}>
                shutdown
              </Typography> */}
						</IconButton>
						<IconButton
							aria-label="Reboot Button"
							className="reboot-button"
							sx={{
								ml: 2,
								p: 2,
								display: "flex",
								flexDirection: "column",
							}}
							onClick={rebootDevice}
						>
							<RestartAltRoundedIcon
								sx={{ width: 35, height: 35 }}
							/>
							<span
								style={{
									marginTop: "5px",
									fontSize: "small",
									letterSpacing: 1,
								}}
							>
								Restart
							</span>
						</IconButton>
					</Stack>
				</Grid>
				<CurrentTime />
				<Grid
					item
					xs={12}
					md={4}
					alignItems="center"
					justifyContent="center"
				>
					<Card sx={{ minWidth: 50 }} className="custom-card">
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Grid container spacing={2}>
								<Grid
									item
									xs={12}
									sx={{
										display: "flex",
										justifyContent: "center",
									}}
								>
									<QuickBanner
										percent={data.Temperature / 100}
										value={data.Temperature}
										// value={28}
										name="Temperature"
									/>
								</Grid>
								<Grid item xs={12}>
									{/* <TemperatureGraph
                    title="Live Temperature Monitor"
                    chart={{
                      labels: [
                        "01/01/2024",
                        "02/01/2024",
                        "03/01/2024",
                        "04/01/2024",
                        "05/01/2024",
                        "06/01/2024",
                        "07/01/2024",
                        "08/01/2024",
                        "09/01/2024",
                        "10/01/2024",
                        "11/01/2024",
                      ],
                      series: [
                        {
                          name: "Temperature",
                          type: "area",
                          fill: "gradient",
                          data: [44.5, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                        },
                      ],
                    }}
                  /> */}
									<TemperatureGraph title="Live Temperature Monitor" />
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}
					alignItems="center"
					justifyContent="center"
				>
					<Card sx={{ minWidth: 50 }} className="custom-card">
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Grid container spacing={2}>
								<Grid
									item
									xs={12}
									sx={{
										display: "flex",
										justifyContent: "center",
									}}
								>
									<QuickBanner
										percent={data.Humidity / 100}
										value={data.Humidity}
										name="Humidity"
									/>
								</Grid>
								<Grid item xs={12}>
									<HumidityGraph
										title="Live Humidity Monitor"
										chart={{
											labels: [
												"01/01/2024",
												"02/01/2024",
												"03/01/2024",
												"04/01/2024",
												"05/01/2024",
												"06/01/2024",
												"07/01/2024",
												"08/01/2024",
												"09/01/2024",
												"10/01/2024",
												"11/01/2024",
											],
											series: [
												{
													name: "Humidity",
													type: "area",
													fill: "gradient",
													data: [
														44.5, 55, 41, 67, 22,
														43, 21, 41, 56, 27, 43,
													],
												},
											],
										}}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}
					alignItems="center"
					justifyContent="center"
				>
					{/* <QuickBanner percent={0.45} name="Smoke" /> */}
					<Card sx={{ minWidth: 50 }} className="custom-card">
						{/* <CardHeader
              action={
                <IconButton aria-label="settings">
                  <MoreHorizIcon />
                </IconButton>
              }
            /> */}
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<QuickBanner
										value={data.Smoke}
										name="Smoke"
									/>
								</Grid>
								<Grid item xs={12}>
									<SmokeGraph
									// title="Live Smoke Detection Monitor"
									// chart={{
									//   labels: [
									//     "01/01/2024",
									//     "02/01/2024",
									//     "03/01/2024",
									//     "04/01/2024",
									//     "05/01/2024",
									//     "06/01/2024",
									//     "07/01/2024",
									//     "08/01/2024",
									//     "09/01/2024",
									//     "10/01/2024",
									//     "11/01/2024",
									//     "12/01/2024",
									//     "12/02/2024",
									//   ],
									//   series: [
									//     {
									//       name: "Smoke",
									//       type: "area",
									//       fill: "gradient",
									//       data: [
									//         44.5, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 50,
									//         33,
									//       ],
									//     },
									//   ],
									// }}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>

				{/* Telegram Bot */}
				<Grid item xs={12} md={8}>
					<Card
						sx={{
							minWidth: 50,
							borderRadius: 5,
							backgroundColor: "#4E4AA6",
							color: "#fff",
						}}
						className="custom-card"
					>
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								m: 2,
							}}
						>
							<TelegramBotConfig />
						</CardContent>
					</Card>
				</Grid>

				{/* Add User */}
				<Grid item xs={12} md={4}>
					<Card
						sx={{
							minWidth: 100,
							borderRadius: 5,
							p: 3,
						}}
						className="custom-card"
					>
						<CardHeader
							avatar={
								<Avatar
									sx={{
										bgcolor: grey[500],
									}}
									aria-label="User"
								/>
							}
							action={
								<IconButton aria-label="settings">
									{/* <MoreVertIcon /> */}
									<ArrowForwardIosIcon />
								</IconButton>
							}
							title="Users"
							// subheader="September 14, 2016"
						/>
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<List
								sx={{
									width: "100%",
									background: "transparent",
									color: "#fff",
									// bgcolor: "#4E4AA6",
								}}
								className="poppins-regular"
							>
								<ListItem
									alignItems="center"
									secondaryAction={
										<IconButton
											edge="end"
											aria-label="delete"
										>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemAvatar>
										<Avatar src="/assets/images/avatars/avatar_12.jpg" />
									</ListItemAvatar>
									<ListItemText
										className="list-item-text"
										primary={
											<>
												<Typography
													sx={{
														fontWeight: 700,
														textTransform:
															"uppercase",
													}}
													component="span"
													// color="#e0e0e0"
													color="#aaa7c3"
												>
													Gokul Dev
												</Typography>
											</>
										}
										secondary={
											<>
												<Typography
													sx={{
														display: "inline",
														fontWeight: 500,
													}}
													component="span"
													variant="body2"
													// color="#e0e0e0"
													color="#A7A4D2"
													// color="#C8C6F0"
												>
													+91 8848433125
												</Typography>
											</>
										}
									/>
								</ListItem>
								<ListItem
									alignItems="center"
									secondaryAction={
										<IconButton
											edge="end"
											aria-label="delete"
										>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemAvatar>
										<Avatar src="/assets/images/avatars/avatar_12.jpg" />
									</ListItemAvatar>
									<ListItemText
										className="list-item-text"
										primary={
											<>
												<Typography
													sx={{
														fontWeight: 700,
														textTransform:
															"uppercase",
													}}
													component="span"
													// color="#e0e0e0"
													color="#aaa7c3"
												>
													Rajesh
												</Typography>
											</>
										}
										secondary={
											<>
												<Typography
													sx={{
														display: "inline",
														fontWeight: 500,
													}}
													component="span"
													variant="body2"
													// color="#e0e0e0"
													color="#A7A4D2"
													// color="#C8C6F0"
												>
													+91 9047254320
												</Typography>
											</>
										}
									/>
								</ListItem>

								{/* <Divider variant="inset" component="li" /> */}
							</List>
						</CardContent>
						<CardActions
							sx={{
								display: "flex",
								justifyContent: "end",
							}}
						>
							<Fab
								size="small"
								aria-label="add"
								onClick={handleOpen}
								sx={{
									background: "#4E4AA6",
									color: "white",
									"&:hover": {
										backgroundColor:
											"#666AA6" /* Lighter shade */,
										color: "#e0e0e0",
									},
								}}
								// color="secondary"
							>
								<AddIcon />
							</Fab>
						</CardActions>
					</Card>
				</Grid>
			</Grid>

			{/* Add Alert User Modal */}

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
						width: mdDown ? "85%" : "30%",
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
					/>
					<CardContent
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 0,
						}}
					>
						<AddAlertUser />
					</CardContent>
				</Card>
			</Modal>
			<Snackbar
				anchorOrigin={{
					vertical: state.vertical,
					horizontal: state.horizontal,
				}}
				color="success"
				open={alertOpen}
				onClose={handleSnackbarClose}
				message={action + state.msg}
				key={vertical + horizontal}
				autoHideDuration={4000}
			/>
		</>
	);
};

export default DashboardTab;
