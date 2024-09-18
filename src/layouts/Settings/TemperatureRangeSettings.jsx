/* React */
import { useState, useEffect } from "react";

/* MUI */
import {
  Grid,
  TextField,
  Typography,
  Slider,
  Card,
  CardContent,
  CardActions,
  Stack,
  Button,
  Snackbar,
  CardHeader,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";

/* Components */
import { grey } from "../../theme/palette";
import { useResponsive } from "../../hooks/use-responsive";
import {
  getTempRanges,
  setTempRange,
} from "../../firebase/SensorSettingsOperations";

/* Styles */
import "../../styles/dashboard.css";

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

const TemperatureRangeSettings = () => {
  const [lowTemp, setLowTemp] = useState(0); // 10
  const [normalTemp, setNormalTemp] = useState(0); // 25
  const [highTemp, setHighTemp] = useState(0); // 29

  const [isEdit, setIsEdit] = useState(false);

  const [tempRanges, setTempRanges] = useState({});
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // const normalMarks = useMemo(() => {
  //   const maxMarkValue = normalTemp * 2;
  //   return [
  //     { value: 0, label: "0 °C" },
  //     { value: maxMarkValue, label: `${maxMarkValue} °C` },
  //   ];
  // }, [normalTemp]);

  const mdUp = useResponsive("up", "md");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await getTempRanges();
        setTempRanges(tempData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLowTemp(Number(tempRanges.low_temp_range));
    setNormalTemp(Number(tempRanges.normal_temp_range));
    setHighTemp(Number(tempRanges.high_temp_range));
  }, [tempRanges]);

  // const onLowTempChange = () => {

  // }

  // const onNormalTempChange = (newVal) => {
  //   if (newVal < normalTemp) {
  //     console.log("Given value is less than Normal Temperature");
  //     setNormalTemp(normalTemp);
  //   } else {
  //     setNormalTemp(newVal);
  //   }
  // };

  const handleTempLimitsSubmit = () => {
    console.log(lowTemp, normalTemp, highTemp);
    setTempRange(lowTemp, normalTemp, highTemp).then(() => {
      console.log("Temperature Range updated successfully !");
      setState((prev) => {
        return { ...prev, open: true };
      });
      setIsEdit(false);
    });
  };

  return (
    <>
      <Card sx={{ minWidth: 50 }} className="custom-card">
        <CardHeader
          action={
            !isEdit && (
              <IconButton aria-label="Edit" onClick={() => setIsEdit(true)}>
                <ModeEditRoundedIcon />
              </IconButton>
            )
          }
        />
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: "10px",
          }}
        >
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Grid item xs={12} md={3}>
              <Typography
                variant="h4"
                sx={{ textAlign: mdUp ? "left" : "center" }}
              >
                Temperature
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  m: mdUp ? 1 : 0,
                }}
              >
                {/* Low */}
                <Grid item xs={12}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pt: 2,
                    }}
                  >
                    <Grid item xs={12} md={2}>
                      <Typography variant="h5"> Low </Typography>
                    </Grid>
                    <Grid item xs={2} md={2} sx={{ m: 2 }}>
                      <TextField
                        name="minLowTemp"
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
                        m: mdUp ? 2 : 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PrettySlider
                        // defaultValue={5}
                        aria-label="Set Low Temperature Range"
                        valueLabelDisplay="auto"
                        color="primary"
                        min={0}
                        max={100}
                        marks={[
                          {
                            value: 0,
                            label: "0 °C",
                          },
                          {
                            value: 100,
                            label: `100 °C`,
                          },
                        ]}
                        value={lowTemp}
                        onChange={(_, newVal) => setLowTemp(newVal)}
                        disabled={!isEdit}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={2}
                      sx={{ m: mdUp ? 2 : 1, ml: mdUp ? 2 : 4 }}
                    >
                      <TextField
                        name="maxLowTemp"
                        label="Max."
                        value={lowTemp}
                        onChange={(event) =>
                          setLowTemp(Number(event.target.value))
                        }
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
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
                    <Grid item xs={2} sx={{ m: 2 }}>
                      <TextField
                        name="minNormalTemp"
                        label="Min."
                        value={lowTemp}
                        inputProps={{
                          step: 1,
                          min: lowTemp,
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
                        m: mdUp ? 2 : 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PrettySlider
                        // defaultValue={14}
                        aria-label="Set Normal Temperature Range"
                        valueLabelDisplay="auto"
                        color="success"
                        min={lowTemp}
                        max={100}
                        value={normalTemp}
                        marks={[
                          {
                            value: lowTemp,
                            label: lowTemp + " °C",
                          },
                          {
                            value: 100,
                            label: "100 °C",
                          },
                        ]}
                        onChange={(_, newVal) => setNormalTemp(newVal)}
                        disabled={!isEdit}
                      />
                    </Grid>
                    {/* <Grid item xs={2} sx={{m: mdUp ? 2 : 1 }}> */}
                    <Grid
                      item
                      xs={2}
                      md={2}
                      sx={{ m: mdUp ? 2 : 1, ml: mdUp ? 2 : 4 }}
                    >
                      <TextField
                        name="maxNormalTemp"
                        label="Max."
                        value={normalTemp}
                        onChange={(event) =>
                          setNormalTemp(Number(event.target.value))
                        }
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
                        disabled={!isEdit}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* High */}
                <Grid item xs={12}>
                  <Grid
                    container
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid item xs={12} md={2}>
                      <Typography variant="h5"> High </Typography>
                    </Grid>
                    <Grid item xs={2} md={2} sx={{ m: 2 }}>
                      <TextField
                        name="minHighTemp"
                        label="Min."
                        value={normalTemp}
                        inputProps={{
                          step: 1,
                          min: normalTemp,
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
                        m: mdUp ? 2 : 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PrettySlider
                        // defaultValue={14}
                        aria-label="Set High Temperature Range"
                        valueLabelDisplay="auto"
                        color="error"
                        min={normalTemp}
                        max={100}
                        step={1}
                        marks={[
                          {
                            value: normalTemp,
                            label: normalTemp + " °C",
                          },
                          {
                            value: 100,
                            label: "100 °C",
                          },
                        ]}
                        onChange={(_, newVal) => setHighTemp(newVal)}
                        disabled={!isEdit}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sx={{ m: mdUp ? 2 : 1, ml: mdUp ? 2 : 4 }}
                    >
                      <TextField
                        name="maxHighTemp"
                        label="Max."
                        value={highTemp}
                        onChange={(event) =>
                          setHighTemp(Number(event.target.value))
                        }
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 100,
                          type: "number",
                        }}
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
              onClick={handleTempLimitsSubmit}
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
              onClick={() => setIsEdit(false)}
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
        message="Temperature Range updated successfully !"
        key={vertical + horizontal}
        autoHideDuration={5000}
      />
    </>
  );
};

export default TemperatureRangeSettings;
