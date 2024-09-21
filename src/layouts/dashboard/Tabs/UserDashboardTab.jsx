/* eslint-disable react/no-unescaped-entities */
/* React */
import { useState, useEffect, useRef } from "react";

/* MUI */
import {
  Card,
  CardContent,
  Grid,
  Snackbar,
  IconButton,
  Stack,
  Alert,
  AlertTitle,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Slide
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

/* MUI Icons */
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import BarChartIcon from '@mui/icons-material/BarChart';

/* Components */
import QuickBanner from "../../../sections/banner/QuickBanner";
import TemperatureGraph from "../../../sections/graphs/dashboard/TemperatureGraph";
import HumidityGraph from "../../../sections/graphs/dashboard/HumidityGraph";
import SmokeGraph from "../../../sections/graphs/dashboard/SmokeGraph";

/* Services */
import {
  fetchData,
  listenForDocumentChanges,
  listenForTempRangeChanges,
  listenForHumidRangeChanges,
  listenForSmokeRangeChanges,
  convertDateStringToMilliseconds
} from "../../../firebase/operations";
import {
  getHumidRanges,
  getSmokeRanges,
  getTempRanges,
} from "../../../firebase/SensorSettingsOperations";

/* Hooks */
import { useResponsive } from "../../../hooks/use-responsive";

/* Styles */
import "../../../global.css";
import "../../../styles/dashboard.css";

/* Components */
import CurrentTime from "../../../components/current-time/CurrentTime";
import {
  convertToTimestamp,
  setRealtimeValues,
  getChartDataByDateTime,
} from "../../../firebase/operations";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserDashboardTab = () => {
  const mdUp = useResponsive("up", "md");
  const mdDown = useResponsive("down", "md");

  const [tempRanges, setTempRanges] = useState({});
  const [humidRanges, setHumidRanges] = useState({});
  const [smokeRanges, setSmokeRanges] = useState({});

  const [action, setAction] = useState("");
  const [isTempPulsating, setIsTempPulsating] = useState(false);
  const [isSmokePulsating, setIsSmokePulsating] = useState(false);
  // const [isHumidityPulsating, setIsHumidityPulsating] = useState(false);

  /* Graphs */
  const [mainGraphData, setMainGraphData] = useState([]);
  const [showTempGraph, setShowTempGraph] = useState(false);
  const [showHumidGraph, setShowHumidGraph] = useState(false);
  const [showSmokeGraph, setShowSmokeGraph] = useState(false);

  /* system status */
  const [systemStatus, setSystemStatus] = useState("online");
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

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

  /* Audio */
  const audio1Ref = useRef(null);
  // const audio2Ref = useRef(null);
  const audio3Ref = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlay1 = () => {
    audio1Ref.current.play();
  };

  const handlePause1 = () => {
    audio1Ref.current.pause();
  };

  // const handlePlay2 = () => {
  //   audio2Ref.current.play();
  // };

  // const handlePause2 = () => {
  //   audio2Ref.current.pause();
  // };

  const handlePlay3 = () => {
    audio3Ref.current.play();
  };

  const handlePause3 = () => {
    audio3Ref.current.pause();
  };

  /* Load Ranges */

  const loadRangeData = async () => {
    try {
      const [tempRange, humidRange, smokeRange] = await Promise.all([
        getTempRanges(),
        getHumidRanges(),
        getSmokeRanges(),
      ]);

      const rangeState = {
        Temperature: tempRange.high_temp_range,
        Humidity: humidRange.normal_humid_range,
        Smoke: smokeRange.smoke_limit,
      };

      /* Store all Ranges to show in Dashboard UI */
      setTempRanges(tempRange);
      setHumidRanges(humidRange);
      setSmokeRanges(smokeRange);

      localStorage.setItem("ranges", JSON.stringify(rangeState));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /* Read Firestore Data */
  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      const data = await fetchData("Data_reads");
      setData(data);
      loadRangeData();
    };

    let rangeState = {};

    const loadRangeData = async () => {
      try {
        const [tempRange, humidRange, smokeRange] = await Promise.all([
          getTempRanges(),
          getHumidRanges(),
          getSmokeRanges(),
        ]);

        rangeState = {
          Temperature: tempRange.high_temp_range,
          Humidity: humidRange.normal_humid_range,
          Smoke: smokeRange.smoke_limit,
        };

        /* Store all Ranges to show in Dashboard UI */
        setTempRanges(tempRange);
        setHumidRanges(humidRange);
        setSmokeRanges(smokeRange);

        localStorage.setItem("ranges", JSON.stringify(rangeState));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdateState();

    const unsubscribe = listenForDocumentChanges((newData) => {
      setData(newData);
      const ranges = JSON.parse(localStorage.getItem("ranges"));
      if (ranges === null || ranges === undefined) {
        loadRangeData().then(() => {
          /* Play Alert Sound if Temp > Limit  */
          // if (newData.Temperature > ranges.Temperature) {
          if (newData.Temperature > tempRanges.high_temp_range) {
            handlePlay1();
            setIsTempPulsating(true);
          } else {
            handlePause1();
            setIsTempPulsating(false);
          }

          /* Humidity */
          // if (newData.Humidity > ranges.Humidity) {
          // if (newData.Humidity > humidRanges.normal_humid_range) {
          //   handlePlay2();
          //   setIsHumidityPulsating(true);
          // } else {
          //   handlePause2();
          //   setIsHumidityPulsating(false);
          // }

          /* Smoke */
          // if (newData.Smoke > ranges.Smoke) {
          if (newData.Smoke > smokeRanges.smoke_limit) {
            handlePlay3();
            setIsSmokePulsating(true);
          } else {
            handlePause3();
            setIsSmokePulsating(false);
          }

          /* Add data to realtime DB */
          const modifiedNewData = {
            ...newData,
            TimestampTime: convertToTimestamp(newData.Timestamp),
          };
          setRealtimeValues(modifiedNewData);
        });
      } else {
        /* Play Alert Sound if Temp > Limit  */
        if (newData.Temperature > tempRanges.Temperature) {
          handlePlay1();
          setIsTempPulsating(true);
        } else {
          handlePause1();
          setIsTempPulsating(false);
        }

        /* Humidity */
        // if (newData.Humidity > humidRanges.Humidity) {
        //   handlePlay2();
        //   setIsHumidityPulsating(true);
        // } else {
        //   handlePause2();
        //   setIsHumidityPulsating(false);
        // }

        /* Smoke */
        if (newData.Smoke > smokeRanges.Smoke) {
          handlePlay3();
          setIsSmokePulsating(true);
        } else {
          handlePause3();
          setIsSmokePulsating(false);
        }

        /* Add data to realtime DB */
        const modifiedNewData = {
          ...newData,
          TimestampTime: convertToTimestamp(newData.Timestamp),
        };
        // console.log(modifiedNewData);
        setRealtimeValues(modifiedNewData);
      }
    });

    return () => unsubscribe();
  }, []);

  /* Trigger Alert if Limits Changes */
  useEffect(() => {
    /* Play Alert Sound if Temp > Limit  */
    // if (newData.Temperature > ranges.Temperature) {
    if (data.Temperature > tempRanges.high_temp_range) {
      handlePlay1();
      setIsTempPulsating(true);
    } else {
      handlePause1();
      setIsTempPulsating(false);
    }
  }, [data, tempRanges]);

  // useEffect(() => {
  //   /* Humidity */
  //   // if (newData.Humidity > ranges.Humidity) {
  //   if (data.Humidity > humidRanges.normal_humid_range) {
  //     handlePlay2();
  //     setIsHumidityPulsating(true);
  //   } else {
  //     handlePause2();
  //     setIsHumidityPulsating(false);
  //   }
  // }, [humidRanges]);

  useEffect(() => {
    /* Smoke */
    // if (newData.Smoke > ranges.Smoke) {
    if (data.Smoke > smokeRanges.smoke_limit) {
      handlePlay3();
      setIsSmokePulsating(true);
    } else {
      handlePause3();
      setIsSmokePulsating(false);
    }
  }, [data, smokeRanges]);

  /* Fetch Live Graph Data */
  useEffect(() => {
    const fetchLiveData = async () => {
      const mainData = await getChartDataByDateTime();

      setMainGraphData(mainData);
    };

    fetchLiveData();
  }, []);

  /* Temperature Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForTempRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      if (ranges !== null && ranges !== undefined) {
        const newRanges = {
          Temperature: newData.high_temp_range,
          Humidity: ranges.Humidity,
          Smoke: ranges.Smoke,
        };
        setTempRanges(newData);
        localStorage.setItem("ranges", JSON.stringify(newRanges));
      } else {
        loadRangeData().then(() => {
          const ranges = JSON.parse(localStorage.getItem("ranges"));
          const newRanges = {
            Temperature: newData.high_temp_range,
            Humidity: ranges.Humidity,
            Smoke: ranges.Smoke,
          };
          setTempRanges(newData);
          localStorage.setItem("ranges", JSON.stringify(newRanges));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  /* Humidity Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForHumidRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      if (ranges !== null && ranges !== undefined) {
        const newRanges = {
          Temperature: ranges.Temperature,
          Humidity: newData.normal_humid_range,
          Smoke: ranges.Smoke,
        };
        setHumidRanges(newData);
        localStorage.setItem("ranges", JSON.stringify(newRanges));
      } else {
        loadRangeData().then(() => {
          const ranges = JSON.parse(localStorage.getItem("ranges"));
          const newRanges = {
            Temperature: ranges.Temperature,
            Humidity: newData.normal_humid_range,
            Smoke: ranges.Smoke,
          };
          setHumidRanges(newData);
          localStorage.setItem("ranges", JSON.stringify(newRanges));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  /* Smoke Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForSmokeRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      if (ranges !== null && ranges !== undefined) {
        const newRanges = {
          Temperature: ranges.Temperature,
          Humidity: ranges.Humidity,
          Smoke: newData.smoke_limit,
        };
        setSmokeRanges(newData);
        localStorage.setItem("ranges", JSON.stringify(newRanges));
      } else {
        const ranges = JSON.parse(localStorage.getItem("ranges"));
        const newRanges = {
          Temperature: ranges.Temperature,
          Humidity: ranges.Humidity,
          Smoke: newData.smoke_limit,
        };
        setSmokeRanges(newData);
        localStorage.setItem("ranges", JSON.stringify(newRanges));
      }
    });
    return () => unsubscribe();
  }, []);

  /* Check System Status */

  useEffect(() => {
    if (data) {

      // const date = new Date(data.Timestamp);

      // Get the timestamp in milliseconds
      // const timestampMilliseconds = date.getTime();

      // Run the 2-second interval check and stop it after 2 minutes
      startChecking();

      // Cleanup both the interval and the timeout when `data` is updated or component unmounts
      return () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
      };
    }
  }, [data]);

  const startChecking = () => {
    // Clear any previous intervals and timeouts
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    // Perform an immediate system check
    performSystemCheck();

    // Start the interval to check every 2 seconds
    intervalRef.current = setInterval(() => {
      performSystemCheck();
    }, 2000);

    // Stop the interval after 2 minutes
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current); // Clear the interval after 2 minutes
      // console.log(
      //   "2-minute checking ended. No further checks until data is updated."
      // );
    }, 120000);
  };

  const performSystemCheck = async () => {
    // logic to check if the system is on or off
    const currentTimestamp = await convertDateStringToMilliseconds(data.Timestamp)
    const timestampDiff = Date.now() - currentTimestamp

    if (data && (timestampDiff < 120000)) {
      setSystemStatus("online");
    } else {
      setSystemStatus("offline");
    }
  };

  /* Audio Actions */

  const handleAudioMute = () => {
    setIsMuted(!isMuted);
    checkIfMuted(!isMuted);
  };

  const checkIfMuted = (isMute) => {
    if (isMute) {
      audio1Ref.current.muted = true;
      // audio2Ref.current.muted = true;
      audio3Ref.current.muted = true;
    } else {
      audio1Ref.current.muted = false;
      // audio2Ref.current.muted = false;
      audio3Ref.current.muted = false;
    }
  };

  /* Toggle Button Click Events for Viewing Graph */
  const handleTempGraphButtonClick = () => {
    setShowTempGraph(!showTempGraph)
  }
  
  const handleHumidityGraphButtonClick = () => {
    setShowHumidGraph(!showHumidGraph)
  }
  
  const handleSmokeGraphButtonClick = () => {
    setShowSmokeGraph(!showSmokeGraph)
  }

  /* System On Off Dialog */

  const [openSystemStatusDialog, setOpenSystemStatusDialog] = useState(false);

  const handleCloseSystemStatusDialog = () => {
    setOpenSystemStatusDialog(false);
  };

  return (
    <>
      <audio ref={audio1Ref} src="/assets/sounds/alarm-2.mp3" loop />
      {/* <audio ref={audio2Ref} src="/assets/sounds/alarm-2.mp3" loop /> */}
      <audio ref={audio3Ref} src="/assets/sounds/alarm-1.wav" loop />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Alert
            severity="error"
            sx={{
              justifyContent: "center",
              textAlign: "center",
              display: isTempPulsating ? "flex" : "none",
            }}
            className="alert-box"
          >
            <AlertTitle style={{ textAlign: "center" }}>WARNING</AlertTitle>
            CRITICAL ALERT - TEMPERATURE HIGH
          </Alert>
          {/* <Alert
            severity="error"
            sx={{
              display: isHumidityPulsating ? "flex" : "none",
              justifyContent: "center",
              textAlign: "center",
            }}
            className="alert-box"
          >
            <AlertTitle style={{ textAlign: "center" }}>WARNING</AlertTitle>
            CRITICAL ALERT - HUMIDITY HIGH
          </Alert> */}
          <Alert
            severity="error"
            sx={{
              display: isSmokePulsating ? "flex" : "none",
              justifyContent: "center",
              textAlign: "center",
            }}
            className="alert-box"
          >
            <AlertTitle style={{ textAlign: "center" }}>WARNING</AlertTitle>
            CRITICAL ALERT - SMOKE HIGH
          </Alert>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          pr: mdUp ? 15 : 0,
          pl: mdUp ? 15 : 0,
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
              justifyContent: "right",
              width: "100%",
              mb: 2,
            }}
          >
            <IconButton
              aria-label="Audio Mute Button"
              className="reboot-button"
              sx={{
                ml: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
              onClick={handleAudioMute}
            >
              {isMuted ? (
                <VolumeOffIcon sx={{ width: 35, height: 35 }} />
              ) : (
                <VolumeUpIcon sx={{ width: 35, height: 35 }} />
              )}
              <span
                style={{
                  marginTop: "5px",
                  fontSize: "small",
                  letterSpacing: 1,
                }}
              >
                {isMuted ? "Muted" : "Mute"}
              </span>
            </IconButton>
          </Stack>
        </Grid>

        <CurrentTime />

        {/* Limits */}
        <Grid item xs={12} alignItems="center" justifyContent="center">
          <Card sx={{ minWidth: 50 }} className="custom-card">
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid container spacing={1}>
                {/* Temperature Limits */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{ p: 2, borderRight: "1px dashed #ccc" }}
                >
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h5">Temperature Limit</Typography>
                    </Grid>
                    {/* Temp Low */}
                    <Grid item xs={6}>
                      <Typography variant="h5" align="left">
                        Low
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        {`${tempRanges["low_temp_range"]} °C`}
                      </Typography>
                    </Grid>

                    {/* Temp Normal */}
                    <Grid item xs={6}>
                      <Typography variant="h5" align="left">
                        Normal
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        {`${tempRanges["normal_temp_range"]} °C`}
                      </Typography>
                    </Grid>

                    {/* Temp High */}
                    <Grid item xs={6}>
                      <Typography variant="h5" align="left">
                        High
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        {`${tempRanges["high_temp_range"]} °C`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Humidity Limits */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{ p: 2, borderRight: "1px dashed #ccc" }}
                >
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h5">Humidity Limit</Typography>
                    </Grid>

                    {/* Humid Low */}
                    <Grid item xs={6}>
                      <Typography variant="h5" align="left">
                        Low
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        {`${humidRanges["low_humid_range"]} %`}
                      </Typography>
                    </Grid>

                    {/* Humid Normal */}
                    <Grid item xs={6}>
                      <Typography variant="h5" align="left">
                        Normal
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        {`${humidRanges["normal_humid_range"]} %`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Smoke Limits */}
                <Grid item xs={12} md={4} sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h5">Smoke Limit</Typography>
                    </Grid>

                    {/* Smoke */}
                    <Grid item xs={6}>
                      <Typography variant="h5" align="left">
                        Limit
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        {`${smokeRanges["smoke_limit"]}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          <Card
            sx={{ minWidth: 50 }}
            className={`custom-card ${isTempPulsating ? "pulsating" : ""}`}
          >
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
                    name="Temperature"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 0,
                  }}
                >
                  <Typography variant="h2">{data.Temperature} °C</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 5
                  }}
                >
                  <LoadingButton
                    loading={false}
                    loadingPosition="start"
                    startIcon={<BarChartIcon />}
                    variant="contained"
                    onClick={handleTempGraphButtonClick}
                  >
                    View Graph / History
                  </LoadingButton>
                </Grid>
                {showTempGraph && (
                  <Grid item xs={12}>
                    <TemperatureGraph
                      title="Live Temperature Monitor"
                      chartInfo={mainGraphData.temperature}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          <Card
            sx={{ minWidth: 50 }}
            // className={`custom-card ${isHumidityPulsating ? "pulsating" : ""}`}
            className="custom-card"
          >
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
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 0,
                  }}
                >
                  <Typography variant="h2">{data.Humidity} %</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 5
                  }}
                >
                  <LoadingButton
                    loading={false}
                    loadingPosition="start"
                    startIcon={<BarChartIcon />}
                    variant="contained"
                    onClick={handleHumidityGraphButtonClick}
                  >
                    View Graph / History
                  </LoadingButton>
                </Grid>
                {showHumidGraph && (
                  <Grid item xs={12}>
                    <HumidityGraph
                      title="Live Humidity Monitor"
                      chartInfo={mainGraphData.humidity}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          <Card
            sx={{ minWidth: 50 }}
            className={`custom-card ${isSmokePulsating ? "pulsating" : ""}`}
          >
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
                  <QuickBanner value={data.Smoke} name="Smoke" />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 0,
                  }}
                >
                  <Typography variant="h2">{data.Smoke}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 5
                  }}
                >
                  <LoadingButton
                    loading={false}
                    loadingPosition="start"
                    startIcon={<BarChartIcon />}
                    variant="contained"
                    onClick={handleSmokeGraphButtonClick}
                  >
                    View Graph / History
                  </LoadingButton>
                </Grid>
                {showSmokeGraph && (
                  <Grid item xs={12}>
                    <SmokeGraph chartInfo={mainGraphData.smoke} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/illustrations/server-rack-1.png"
            alt="server rack"
            style={{
              maxWidth: mdDown ? "10rem" : "20rem",
              maxHeight: mdDown ? "15rem" : "40rem",
              marginRight: "-15px",
            }}
          />
          <img
            src="/assets/illustrations/server-rack-1.png"
            alt="server rack"
            style={{
              maxWidth: mdDown ? "10rem" : "20rem",
              maxHeight: mdDown ? "15rem" : "40rem",
              marginRight: "-15px",
            }}
          />
          <img
            src="/assets/illustrations/server-rack-1.png"
            alt="server rack"
            style={{
              maxWidth: mdDown ? "10rem" : "20rem",
              maxHeight: mdDown ? "15rem" : "40rem",
              marginRight: "-15px",
            }}
          />
          {/* <img
            src="/assets/illustrations/server-rack-1.png"
            alt="server rack"
            style={{
              maxWidth: mdDown ? "10rem" : "20rem",
              maxHeight: mdDown ? "15rem" : "",
              marginRight: "-15px",
            }}
          /> */}
        </Grid>

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
      </Grid>

      <Dialog
        open={systemStatus === "offline" ? true : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSystemStatusDialog}
        disableEscapeKeyDown
        color="error"
        sx={{
          border: "2px solid white", 
          backgroundColor: "rgba(0,0,0,0.85)"
        }}
        maxWidth="sm"
        fullWidth
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle 
          className="dialog-bg"
          sx={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 700,
            letterSpacing: '2px'
          }}
        >
          {"SYSTEM STATUS"}
        </DialogTitle>
        <DialogContent 
          className="dialog-bg" 
          sx={{
            textAlign: 'center',
            color: 'white',
          }}
        >
          <DialogContentText 
            id="alert-dialog-slide-description"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 700,
              letterSpacing: '2px'
            }}
          >
            OFFLINE
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDashboardTab;
