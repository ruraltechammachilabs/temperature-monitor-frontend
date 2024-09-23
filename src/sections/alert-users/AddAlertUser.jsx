/* React */
import { useContext, useEffect, useState } from "react";

/* MUI */
import {
  Box,
  Typography,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  // Card,
  // CardContent,
  // Avatar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

/* MUI Icons */
import RestoreIcon from "@mui/icons-material/Restore";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";

/* Hooks */
// import { useResponsive } from "../../hooks/use-responsive";

/* Components */
import { grey } from "../../theme/palette";
import {
  addAlertUser,
  addAlertUserToFirestore,
} from "../../firebase/AlertUserOperations";
import { GlobalDataContext } from "../../Providers/GlobalDataProvider";

const AddAlertUser = ({ closeModal }) => {
  /* User Options */
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
    },
  ];
  const [checked, setChecked] = useState([0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { setIsNewAlertUserAdded } = useContext(GlobalDataContext);

  const handleToggle = (index) => () => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  /* Submit */
  const handleAddUserClick = async () => {
    checked.push(4) // Manual trigger SMS (Added by default)
    
    const user = {
      name,
      phone: "+91" + phone,
      updates: checked,
    };


    await addAlertUserToFirestore(user).then((counts) => {
      addAlertUser(user, counts).then((isAdded) => {
		if(isAdded) {
			closeModal();
			setIsNewAlertUserAdded(true)

      setTimeout(() => {
				setIsNewAlertUserAdded(false)
			}, 1000);
		}
      });
    });

    // setIsNewAlertUserAdded(false);
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" color={grey[500]} gutterBottom sx={{ mt: 2 }}>
          Add Phone Number for Alerts
        </Typography>
        <Stack spacing={3} sx={{ mt: 5, display: "flex" }}>
          <TextField
            name="name"
            label="Name"
            color="secondary"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            name="mobileno"
            label="Phone Number"
            color="secondary"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />

          {/* User Options */}
          <Typography variant="h6" color={grey[500]}>
            User Options
          </Typography>
          <Typography variant="subtitle2" color={grey[500]} sx={{ m: 0 }}>
            Select the options for SMS updates
          </Typography>
          <List
            dense
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "transparent",
            }}
          >
            {items.map((updateItem, index) => {
              const labelId = `checkbox-list-secondary-label-${index}`;
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Checkbox
                      size="large"
                      edge="end"
                      color="secondary"
                      onChange={handleToggle(index)}
                      checked={checked.indexOf(index) !== -1}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  }
                  disablePadding
                  sx={{ bgcolor: "transparent" }}
                >
                  <ListItemButton>
                    <ListItemAvatar
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* <Avatar
                        alt={`Avatar n°${value + 1}`}
                        src={`/assets/images/avatars/avatar_${value + 1}.jpg`}
                      /> */}
                      {updateItem.icon}
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={updateItem.label}
                      sx={{
                        fontSize: "large",
                        mr: 2,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Stack>

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
      </Box>
    </>
  );
};

export default AddAlertUser;
