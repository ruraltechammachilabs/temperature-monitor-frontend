import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
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

const LoginForm = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const emailFieldRef = useRef();
  const passwordFieldRef = useRef();

  const handleClick = () => {
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
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
          </Box>
        </FadeIn>
      </AnimatePresence>
    </>
  );
};

export default LoginForm;
