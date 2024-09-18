import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import {
	Stack,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
	Box,
	// Link,
	// Checkbox,
	// FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

/* Components */
import Iconify from "../../components/iconify";
import { AnimatePresence } from "framer-motion";
import { grey } from "../../theme/palette";
import FadeIn from "/src/components/Animations/FadeIn";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
import { signInUser } from "../../firebase/UserOperations";
import { AuthContext } from "../../Providers/AuthDataProvider";
// import { GlobalDataContext } from "/src/Providers/GlobalDataProvider";

const LoginForm = () => {
	const navigate = useNavigate();
	const { setCurrentUser, currentUser } = useContext(AuthContext);
	// const { setUserData } = useContext(GlobalDataContext);

	const [showPassword, setShowPassword] = useState(false);
	const emailFieldRef = useRef();
	const passwordFieldRef = useRef();

	// useEffect(() => {
	//   console.log(!!currentUser)
	//   if(currentUser) {
	//     console.log("user not empty")
	//     navigate('/dashboard/home');
	//   }
	// }, [currentUser])

	const handleClick = () => {
		// navigate("/dashboard/user/", { replace: true });

		const email = emailFieldRef.current.value;
		const password = passwordFieldRef.current.value;

		signInUser(email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				const userInfo = userCredential;

				localStorage.setItem("user", JSON.stringify(user));
				localStorage.setItem("userInfo", JSON.stringify(userInfo));

				// Store user information securely
				const token = user.accessToken;
				localStorage.setItem("userToken", token);

				if (user) {
					console.log(user);
					setCurrentUser(user);
					navigate("/dashboard/home");
				}
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};

	return (
		<>
			<AnimatePresence>
				<FadeIn direction="up" delay={0}>
					<Box sx={{ mt: 2 }}>
						<Typography
							variant="h5"
							color={grey[500]}
							gutterBottom
							sx={{ mt: 2 }}
						>
							Sign in to Your Account.
						</Typography>
						<Stack spacing={3} sx={{ mt: 5 }}>
							<TextField
								name="email"
								label="Email address"
								inputRef={emailFieldRef}
							/>

							<TextField
								name="password"
								label="Password"
								inputRef={passwordFieldRef}
								type={showPassword ? "text" : "password"}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() =>
													setShowPassword(
														!showPassword
													)
												}
												edge="end"
											>
												<Iconify
													icon={
														showPassword
															? "eva:eye-fill"
															: "eva:eye-off-fill"
													}
												/>
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Stack>

						{/* <Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							sx={{ my: 2 }}
						>
							<Link
								variant="subtitle2"
								underline="hover"
								href="/reset"
								justifyContent="right"
							>
								Forgot password?
							</Link>
						</Stack> */}

						<LoadingButton
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							onClick={handleClick}
							sx={{
								backgroundImage:
									"linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 	35%, rgba(255,40,107,0.5) 70%, rgba(174,0,94,0.5) 100%)",
								opacity: 0.8,
								mt: 5,
							}}
							endIcon={<TrendingFlatOutlinedIcon />}
						>
							Sign In
						</LoadingButton>

						{/* <Typography
							variant="body2"
							sx={{ mb: 5, mt: 2 }}
							align="center"
							letterSpacing={1}
						>
							Don’t have an account? {""}
							<Link
								variant="subtitle2"
								href="/auth/register"
								underline="hover"
							>
								Get started
							</Link>
						</Typography> */}
					</Box>
				</FadeIn>
			</AnimatePresence>
		</>
	);
};

export default LoginForm;
