/* React */
import { useContext, useState } from "react";

/* MUI */
import {
	Grid,
	Box,
	Typography,
	TextField,
	InputAdornment,
	IconButton,
	FormControlLabel,
	Avatar,
	Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

/* MUI Icons */
import {
	// TrendingFlatOutlinedIcon,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";

/* Hooks */
import { useResponsive } from "../../hooks/use-responsive";

/* Components */
import { grey } from "../../theme/palette";
import { addUser } from "../../firebase/UserOperations";
import { AuthContext } from "../../Providers/AuthDataProvider";

const AvatarIcon = (props) => {
	return (
		<Avatar
			alt="Role image"
			src={props.src}
			variant="rounded"
			sx={{
				width: 100,
				height: 100,
			}}
		/>
	);
};

const AddUser = ({ handleAddUserModalClose }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [passwd, setPasswd] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { setIsNewUser } = useContext(AuthContext);

	/* Role Selection */
	const [selectedRoleValue, setSelectedRoleValue] = useState("");

	const mdDown = useResponsive("down", "md");

	/* Components */
	const AvatarRadio = (props) => {
		return (
			<Radio
				color="default"
				icon={<AvatarIcon src={props.src} />}
				checkedIcon={<AvatarIcon src={props.src} />}
				{...props}
				sx={{
					// "&.Mui-checked": {
					// border: `2px solid ${primary.light}`,
					// border: (setSelectedRoleValue === "admin") ? '2px dashed #ccc' : 'none'
					// },
					borderRadius: 2,
					p: 0.5,
				}}
			/>
		);
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleChange = (event) => {
		console.log(event.target.value);
		setSelectedRoleValue(() => event.target.value);
	};

	/* Submit */
	const handleAddUserClick = async () => {
		setIsNewUser(true);
		await addUser(name, email, passwd, selectedRoleValue).then(
			(isAdded) => {
				setIsNewUser(false);
				console.log(isAdded);
				if (isAdded) {
					handleAddUserModalClose();
				}
			}
		);
	};

	return (
		<>
			<Box sx={{ mt: 2 }}>
				<Grid
					container
					spacing={3}
					sx={{
						// mt: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Grid item xs={12}>
						<Typography
							variant="h5"
							color={grey[500]}
							gutterBottom
							sx={{ pl: mdDown ? 4 : 6 }}
						>
							Add a User
						</Typography>
					</Grid>
					<Grid
						item
						xs={10}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TextField
							fullWidth
							name="name"
							label="Name"
							color="secondary"
							type="text"
							onChange={(event) => setName(event.target.value)}
						/>
					</Grid>
					<Grid
						item
						xs={10}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TextField
							fullWidth
							name="email"
							label="Email"
							color="secondary"
							type="email"
							onChange={(event) => setEmail(event.target.value)}
						/>
					</Grid>

					<Grid
						item
						xs={10}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TextField
							fullWidth
							name="passwd"
							color="secondary"
							type={showPassword ? "text" : "password"}
							InputProps={{
								endAdornment: (
									<InputAdornment
										position="end"
										sx={{
											background: "transparent",
										}}
									>
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={
												handleMouseDownPassword
											}
											edge="end"
										>
											{showPassword ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
							label="Password"
							onChange={(event) => setPasswd(event.target.value)}
						/>
					</Grid>

					{/* Role */}

					<Grid item xs={12}>
						<Grid
							container
							sx={{
								display: "flex",
								justifyContent: "center",
								margin: "0 auto",
							}}
						>
							<Grid
								item
								xs={3}
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									width: "100%",
								}}
							>
								<FormControlLabel
									value="admin"
									control={
										<AvatarRadio src="/assets/images/avatars/avatar_12.jpg" />
									}
									sx={{
										margin: "0 auto",
										border:
											selectedRoleValue === "admin"
												? "2px dashed #ccc"
												: "none",
										borderRadius: "8px",
									}}
									checked={selectedRoleValue === "admin"}
									onChange={handleChange}
								/>
								<Typography
									variant="subtitle1"
									color={grey[500]}
									justifyContent="center"
									textAlign="center"
									letterSpacing={1}
								>
									Admin
								</Typography>
							</Grid>
							<Grid
								item
								xs={3}
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									width: "100%",
								}}
							>
								<FormControlLabel
									value="user"
									control={
										<AvatarRadio src="/assets/images/avatars/avatar_13.jpg" />
									}
									sx={{
										margin: "0 auto",
										border:
											selectedRoleValue === "user"
												? "2px dashed #ccc"
												: "none",
										borderRadius: "8px",
									}}
									checked={selectedRoleValue === "user"}
									onChange={handleChange}
								/>
								<Typography
									variant="subtitle1"
									color={grey[500]}
									justifyContent="center"
									textAlign="center"
									letterSpacing={1}
								>
									User
								</Typography>
							</Grid>
						</Grid>
					</Grid>

					<Grid
						item
						xs={10}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<LoadingButton
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							onClick={handleAddUserClick}
							sx={{
								backgroundImage:
									"linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 	35%, rgba(255,40,107,0.5) 70%, rgba(174,0,94,0.5) 100%)",
								opacity: 0.8,
								mt: 4,
							}}
							endIcon={<TrendingFlatOutlinedIcon />}
						>
							Add User
						</LoadingButton>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default AddUser;
