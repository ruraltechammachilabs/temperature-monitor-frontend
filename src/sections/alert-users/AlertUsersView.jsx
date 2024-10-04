/* React */
import { useContext, useState, useEffect } from "react";

/* MUI */
import {
	Grid,
	Fab,
	Card,
	CardContent,
	CardActionArea,
	Typography,
	Avatar,
	Stack,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	ListItemAvatar,
	Box,
} from "@mui/material";

/* MUI Icons */
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SmsIcon from '@mui/icons-material/Sms';

/* Styles */
import "../../styles/dashboard.css";

/* Components */
import { GlobalDataContext } from "../../Providers/GlobalDataProvider";
import { grey } from "../../theme/palette";
import { getAllAlertUsers, deleteAlertUser } from "../../firebase/AlertUserOperations";
import { useResponsive } from "../../hooks/use-responsive";

const AlertUsersView = ({ addAlertUserEvent }) => {
	const { isNewAlertUserAdded, setIsAlertUserRemoved, isAlertUserRemoved } = useContext(GlobalDataContext);
	const [alertUsers, setAlertUsers] = useState([
		// {
		// 	name: "Gokul Dev",
		// 	phone: "8848433125",
		// 	updates: [0, 1, 2],
		// },
	]);

	const mdUp = useResponsive("up", "md")
	const xlDown = useResponsive("down", "xl")

	const items = [
		{
			label: "Regular updates",
			icon: <RestoreIcon />,
		},
		{
			label: "Stage updates",
			icon: <EventNoteIcon />,
		},
		{
			label: "Power up updates",
			icon: <PowerSettingsNewIcon />,
		},
		{
			label: "Calls",
			icon: <PhoneForwardedIcon />,
		}
	];

	useEffect(() => {
		const fetchData = async () => {
			const  alertusers = await getAllAlertUsers()
			if(alertusers.length > 0 && alertusers !== undefined) {
				setAlertUsers(alertusers)
			}
		};

		fetchData();
	}, []);

	/* Fetch new Alert Users Data When Alert User */
	useEffect(() => {

		if(isNewAlertUserAdded || isAlertUserRemoved) {
			console.log("users changed !")
			const fetchData = async () => {
				await getAllAlertUsers()
				.then((alertusers => {
					setAlertUsers(alertusers)
				}))
			};
	
			fetchData();
		}
		
	}, [isNewAlertUserAdded, isAlertUserRemoved])

	const handleAddUserClick = () => {
		addAlertUserEvent();
	};

	const handleDeleteAlertUser = async (alertUser) => {
		const deleteuser = await deleteAlertUser(alertUser)
		if(deleteuser) {
			setIsAlertUserRemoved(true)

			setTimeout(() => {
				setIsAlertUserRemoved(false)
			}, 1000);
		}

	}

	return (
		<>
			<Grid
				container
				spacing={2}
				sx={{
					p: 3,
				}}
			>
				<Grid item xs={12} md={3}>
					<Card
						sx={{
							minHeight: "37dvh",
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
							sx={{
								height: "100%",
								minHeight: (mdUp && xlDown) ? "58dvh" : "37dvh",
							}}
						>
							<CardContent
								sx={{
									p: 1,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: 600,
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
				{alertUsers &&
					alertUsers.map((user, index) => {
						return (
							<Grid item xs={12} md={3} key={index}>
								<Card
									sx={{
										minHeight: "25dvh",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										borderRadius: 2,
									}}
									className="custom-card"
								>
									<Stack
										sx={{
											pt: 3,
											pb: 2,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											width: "100%",
											background:
												"linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 35%, rgba(255,40,107,0.7) 70%, rgba(174,0,94,0.6) 100%)",
										}}
									>
										{/* Picture */}
										<Avatar
											sx={{
												// bgcolor: secondary.light
												// bgcolor: grey[400],
												bgcolor: "transparent",
											}}
											src="/assets/icons/dashboard/bell-icon.png"
										/>

										{/* User Name */}
										<Typography
											sx={{
												display: "flex",
												// alignItems: 'center',
												justifyContent: "center",
												fontWeight: 600,
												color: grey[100],
												letterSpacing: 2,
												mt: 1,
											}}
										>
											{user.name}
										</Typography>

										{/* Phone Number */}
										<Typography
											sx={{
												display: "flex",
												// alignItems: 'center',
												justifyContent: "center",
												fontWeight: 500,
												color: grey[100],
												letterSpacing: 2,
												mt: 1,
											}}
										>
											{user.phone}
										</Typography>
									</Stack>
									<Box
										sx={{
											// p: 1,
											display: "flex",
											justifyContent: "end",
											alignItems: "end",
											width: "100%",
											background:
												"linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 35%, rgba(255,40,107,0.7) 70%, rgba(174,0,94,0.6) 100%)",
											m: 0,
											position: "relative",
										}}
									>
										<Fab
											size="small"
											sx={{
												position: "absolute",
												right: 40,
												bottom: -20,
											}}
											onClick={() => handleDeleteAlertUser(user)}
										>
											<DeleteRoundedIcon />
										</Fab>
									</Box>

									<CardContent>
										<Stack
											sx={{
												p: 1,
												display: "flex",
												justifyContent: "center",

												alignItems: "center",
											}}
										>
											{/* Picture */}
											{/* <Avatar
                        sx={{
                          // bgcolor: secondary.light
                          bgcolor: grey[400],
                        }}
                      ></Avatar> */}

											{/* User Name */}
											{/* <Typography
                        sx={{
                          display: "flex",
                          // alignItems: 'center',
                          justifyContent: "center",
                          fontWeight: 600,
                          color: grey[500],
                          mt: 1,
                        }}
                      >
                        {user.name}
                      </Typography> */}

											{/* Phone Number */}
											{/* <Typography
                        sx={{
                          display: "flex",
                          // alignItems: 'center',
                          justifyContent: "center",
                          fontWeight: 500,
                          color: grey[500],
                          mt: 1,
                        }}
                      >
                        {user.phone}
                      </Typography> */}
											<List
												dense
												sx={{
													bgcolor: "transparent",
												}}
											>
												{items.map(
													(updateItem, index) => {
														const labelId = `checkbox-list-secondary-label-${index}`;
														return (
															<ListItem
																key={index}
																disablePadding
																sx={{
																	bgcolor:
																		"transparent",
																}}
																secondaryAction={
																	user.updates.includes(
																		index
																	) ? (
																		<CheckCircleRoundedIcon color="success" />
																	) : (
																		<CancelRoundedIcon color="error" />
																	)
																}
															>
																<ListItemButton>
																	<ListItemAvatar
																		sx={{
																			display:
																				"flex",
																			alignItems:
																				"center",
																		}}
																	>
																		{
																			updateItem.icon
																		}
																	</ListItemAvatar>
																	<ListItemText
																		id={
																			labelId
																		}
																		primary={
																			updateItem.label
																		}
																		sx={{
																			fontSize:
																				"large",
																			mr: 2,
																		}}
																	/>
																</ListItemButton>
															</ListItem>
														);
													}
												)}
											</List>
										</Stack>
									</CardContent>
									{/* </CardActionArea> */}
								</Card>
							</Grid>
						);
					})}
			</Grid>
		</>
	);
};

export default AlertUsersView;

/* 
  {
      'Gokul Dev': '8848433125',
      'Ajay Devgn': '8812534789',
      'Sharmila Raj': '9964532157',
      'Bhairavi': '9421133680',
    }

*/
