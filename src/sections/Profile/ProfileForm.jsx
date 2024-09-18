/* React */
import { useState, useEffect, useContext } from "react";

/* MUI */
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import { updateCurrentUserProfile } from "../../firebase/UserOperations";

/* Components */
import { AuthContext } from "../../Providers/AuthDataProvider";

const ProfileForm = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [phoneno, setPhoneNo] = useState("");

  const { currentUser } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  // const handlePhoneNoChange = (event) => {
  // 	setPhoneNo(event.target.value);
  // };

  const handleEditButtonClick = () => {
	setIsEdit(true)
  }

  const onHandleSaveChanges = (event) => {
    event.preventDefault();
    if (
      fullname !== "" &&
      fullname !== undefined &&
      email !== "" &&
      email !== undefined
    ) {
      updateCurrentUserProfile(currentUser, fullname, email).then(() => {
        setIsEdit(false);
      });
    }
  };

  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      setEmail(currentUser.email);
      setFullName(currentUser.displayName);
    }
  }, [currentUser]);

  return (
    <form noValidate autoComplete="off">
      <Card sx={{ flexGrow: 1, p: 5 }}>
        <CardHeader
          action={
            !isEdit && (
              <Tooltip title="Edit" placement="top">
                <IconButton aria-label="Edit" onClick={handleEditButtonClick}>
                  <ModeEditRoundedIcon />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                id="firstName"
                label="Name"
                value={fullname}
                onChange={handleFullNameChange}
                fullWidth
                inputProps={{
                  readOnly: !isEdit,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                label="Email Address"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                inputProps={{
                  readOnly: !isEdit,
                }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
				<TextField
				id="phoneno"
				label="Phone Number"
				value={phoneno}
				onChange={handlePhoneNoChange}
				fullWidth
				inputProps={{
					readOnly: true,
				}}
				/>
			</Grid> */}
            {isEdit && (
              <Grid item xs={12}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 	35%, rgba(255,40,107,0.5) 70%, rgba(174,0,94,0.5) 100%)",
                    opacity: 0.8,
                    fontWeight: "fontWeightBold",
                    display: "flex",
                  }}
                  onClick={onHandleSaveChanges}
                >
                  Save Changes
                </LoadingButton>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfileForm;
