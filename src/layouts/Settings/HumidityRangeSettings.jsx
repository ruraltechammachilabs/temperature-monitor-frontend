/* React */
import { useState, useEffect } from "react";


/* MUI */
import {
  Grid,
  TextField,
  Typography,
  Slider,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Stack,
  IconButton,
  Snackbar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';

/* Components */
import { grey } from "../../theme/palette";
import { useResponsive } from '../../hooks/use-responsive'
import { setHumidRange } from "../../firebase/SensorSettingsOperations";

/* Styles */
import "../../styles/dashboard.css"
import { getHumidRanges } from "../../firebase/SensorSettingsOperations";

const PrettySlider = styled(Slider)({
  color: (theme) => theme.palette.slider.main,
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: grey[600],
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

const HumidityRangeSettings = () => {

  const mdUp = useResponsive('up', 'md');

  const [lowHumidity, setLowHumidity] = useState(0)
  const [normalHumidity, setNormalHumidity] = useState(0)
  
  const [defaultLowHumidity, setDefaultLowHumidity] = useState(0)
  const [defaultNormalHumidity, setDefaultNormalHumidity] = useState(0)

  const [isEdit, setIsEdit] = useState(false);

  const [humidRanges, setHumidRanges] = useState({}); // Data from Server
  
  /* snackbar alert */
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  /* Fetch Data from Server */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const humidData = await getHumidRanges();
        setHumidRanges(humidData);
        console.log(humidData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLowHumidity(Number(humidRanges.low_humid_range));
    setNormalHumidity(Number(humidRanges.normal_humid_range));
    
    setDefaultLowHumidity(Number(humidRanges.low_humid_range));
    setDefaultNormalHumidity(Number(humidRanges.normal_humid_range));
  }, [humidRanges]);

  const handleHumidLimitsSubmit = () => {
    console.log(lowHumidity, normalHumidity);
    setHumidRange(lowHumidity, normalHumidity).then(() => {
      console.log("Humidity Range updated successfully !");
      setState((prev) => {
        return { ...prev, open: true };
      });
      setIsEdit(false)
    });
  };

  const cancelEditRange = () => {
    setLowHumidity(defaultLowHumidity)
    setNormalHumidity(defaultNormalHumidity)
    setIsEdit(false)
  }


  return (
    <>
      <Card sx={{ minWidth: 50, mt: 2 }} className="custom-card">
      <CardHeader
          action={
            !isEdit &&
            <IconButton 
              aria-label="Edit"
              onClick={() => setIsEdit(true)}
            >
              <ModeEditRoundedIcon />
            </IconButton>
          }
        >
        </CardHeader>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={1}
            sx={{ 
              display: "flex", 
              alignItems: "center",
              mt: 2
            }}
          >
            <Grid item xs={12} md={3}>
              <Typography 
                variant="h4" 
                sx={{ 
                  textAlign: mdUp ? 'left' : 'center' 
                }}
              > 
                Humidity 
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid
                container
                spacing={1}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {/* Low */}
                <Grid item xs={12}>
                  <Grid
                    container
                    sx={{ 
                      display: "flex", 
                      alignItems: "center" 
                    }}
                  >
                    <Grid item xs={12} md={2}>
                      <Typography variant="h5"> Low </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ m: 2 }}>
                      <TextField 
                        name="minLowHumidity" 
                        label="Min." 
                        value={0}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
                        disabled 
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ 
                        m: 2, 
                        display: "flex", 
                        alignItems: "center" 
                      }}
                    >
                      <PrettySlider
                        // defaultValue={5}
                        aria-label="Set Low Humidity Range"
                        valueLabelDisplay="auto"
                        color="primary"
                        min={0}
                        max={100}
                        value={lowHumidity}
                        marks={[
                          {
                            value: 0,
                            label: "0 %",
                          },
                          {
                            value: 100,
                            label: "100 %",
                          },
                        ]}
                        onChange={(_, newVal) => setLowHumidity(newVal)}
                        disabled={!isEdit}
                      />
                    </Grid>
                    <Grid item xs={2} sx={{ m: mdUp ? 2 : 1 }}>
                      <TextField name="maxLowHumidity" label="Max."
                        value={lowHumidity}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
                        onChange={(event) => setLowHumidity(event.target.value)}
                        disabled={!isEdit}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Normal */}
                <Grid item xs={12}>
                  <Grid
                    container
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid item xs={12} md={2}>
                      <Typography variant="h5"> Normal </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ m: mdUp ? 2 : 1 }}>
                      <TextField 
                        name="minNormalHumidity" 
                        label="Min." 
                        value={lowHumidity}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
                        disabled 
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ m: 2, display: "flex", alignItems: "center" }}
                    >
                      <PrettySlider
                        // defaultValue={14}
                        aria-label="Set Normal Humidity Range"
                        valueLabelDisplay="auto"
                        color="success"
                        min={lowHumidity}
                        max={100}
                        marks={[
                          {
                            value: lowHumidity,
                            label: lowHumidity + " %",
                          },
                          {
                            value: 100,
                            label: "100 %",
                          },
                        ]}
                        onChange={(_, newVal) => setNormalHumidity(newVal)}
                        disabled={!isEdit}
                      />
                    </Grid>
                    <Grid item xs={2} sx={{ m: mdUp ? 2 : 1 }}>
                      <TextField 
                        name="maxNormalHumidity" 
                        label="Max." 
                        value={normalHumidity}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
                        onChange={(event) => setNormalHumidity(Number(event.target.value))}
                        disabled={!isEdit}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            display: isEdit ? "flex" : "none",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "center",
              pr: 10,
            }}
          >
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={handleHumidLimitsSubmit}
              sx={{
                backgroundImage:
                  "linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 35%, rgba(255,40,107,0.5) 70%, rgba(174,0,94,0.5) 100%)",
                opacity: 0.8,
                m: 1,
              }}
              // endIcon={<TrendingFlatOutlinedIcon />}
            >
              Save
            </Button>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{
                opacity: 0.8,
              }}
              className="cancel-button"
              // onClick={() => setIsEdit(false)}
              onClick={cancelEditRange}
            >
              cancel
            </Button>
          </Stack>
        </CardActions>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: state.vertical,
          horizontal: state.horizontal,
        }}
        color="success"
        open={open}
        onClose={handleClose}
        message="Humidity Range updated successfully !"
        key={vertical + horizontal}
        autoHideDuration={5000}
      />
    </>
  );
};

export default HumidityRangeSettings;
