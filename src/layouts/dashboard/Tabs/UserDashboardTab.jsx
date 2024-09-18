/* eslint-disable react/no-unescaped-entities */
/* React */
import { useState, useEffect, useRef } from "react";

/* MUI */
import {
  Card,
  CardContent,
  Grid,
  Snackbar,
} from "@mui/material";

/* MUI Icons */

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
  listenForSmokeRangeChanges
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
import { convertToTimestamp, setRealtimeValues, getChartDataByDateTime } from "../../../firebase/operations";


const UserDashboardTab = () => {
  const mdUp = useResponsive("up", "md");
  const mdDown = useResponsive("down", "md");

  const [action, setAction] = useState("");
  const [isTempPulsating, setIsTempPulsating] = useState(false);
  const [isHumidityPulsating, setIsHumidityPulsating] = useState(false);
  const [isSmokePulsating, setIsSmokePulsating] = useState(false);

  const [mainGraphData, setMainGraphData] = useState([])

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
  const audio2Ref = useRef(null);
  const audio3Ref = useRef(null);
  const [isMuted, setIsMuted] = useState(false)

  const handlePlay1 = () => {
    audio1Ref.current.play();
  };

  const handlePause1 = () => {
    audio1Ref.current.pause();
  };
  
  const handlePlay2 = () => {
    audio2Ref.current.play();
  };

  const handlePause2 = () => {
    audio2Ref.current.pause();
  };
  
  const handlePlay3 = () => {
    audio3Ref.current.play();
  };

  const handlePause3 = () => {
    audio3Ref.current.pause();
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
          getSmokeRanges()
        ]);

        rangeState = {
          Temperature: tempRange.high_temp_range_test,
          Humidity: humidRange.normal_humid_range_test,
          Smoke: smokeRange.smoke_limit,
        };
  
        localStorage.setItem("ranges", JSON.stringify(rangeState));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndUpdateState();

    const unsubscribe = listenForDocumentChanges((newData) => {
      setData(newData);
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      /* Play Alert Sound if Temp > Limit  */
      if (newData.Temperature > ranges.Temperature) {
        console.log(newData.Temperature, ranges.Temperature);
        handlePlay1()
        setIsTempPulsating(true)
      } else {
        handlePause1()
        setIsTempPulsating(false)
      }

      /* Humidity */
      if (newData.Humidity > ranges.Humidity) {
        console.log(newData.Humidity, ranges.Humidity);
        handlePlay2()
        setIsHumidityPulsating(true)
      } else {
        handlePause2()
        setIsHumidityPulsating(false)
      }
      
      /* Smoke */
      if (newData.Smoke > ranges.Smoke) {
        console.log(newData.Smoke, ranges.Smoke);
        handlePlay3()
        setIsSmokePulsating(true)
      } else {
        handlePause3()
        setIsSmokePulsating(false)
      }
      
      /* Add data to realtime DB */
      // const modifiedNewData = {
      //   ...newData,
      //   TimestampTime: convertToTimestamp(newData.Timestamp)
      // }
      // console.log(modifiedNewData)
      // setRealtimeValues(modifiedNewData)
    });

    return () => unsubscribe();
  }, []);

  /* Fetch Live Graph Data */
  useEffect(() => {
    const fetchLiveData = async () => {
      const mainData = await getChartDataByDateTime()
      console.log("main live graph data => ", mainData)

      setMainGraphData(mainData)
    }

    fetchLiveData()

  }, [])

  /* Temperature Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForTempRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      const newRanges = {
        Temperature: newData.high_temp_range_test,
        Humidity: ranges.Humidity,
        Smoke: ranges.Smoke
      }
      localStorage.setItem("ranges", JSON.stringify(newRanges))
    });
    return () => unsubscribe();
  }, []);

  /* Humidity Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForHumidRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      const newRanges = {
        Temperature: ranges.Temperature,
        Humidity: newData.normal_humid_range,
        Smoke: ranges.Smoke
      }
      localStorage.setItem("ranges", JSON.stringify(newRanges))
    });
    return () => unsubscribe();
  }, []);

  /* Smoke Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForSmokeRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      const newRanges = {
        Temperature: ranges.Temperature,
        Humidity: ranges.Humidity,
        Smoke: newData.smoke_limit
      }
      localStorage.setItem("ranges", JSON.stringify(newRanges))
    });
    return () => unsubscribe();
  }, []);

  /* Audio Actions */

  const handleAudioMute = () => {
    setIsMuted(!isMuted)
    checkIfMuted(!isMuted)
  }

  const checkIfMuted = (isMute) => {
    if(isMute) {
      audio1Ref.current.muted = true
      audio2Ref.current.muted = true
      audio3Ref.current.muted = true
    } else {
      audio1Ref.current.muted = false
      audio2Ref.current.muted = false
      audio3Ref.current.muted = false
    }
  }

  

  return (
    <>
      <audio ref={audio1Ref} src="/assets/sounds/alarm-2.mp3" />
      <audio ref={audio2Ref} src="/assets/sounds/alarm-2.mp3" />
      <audio ref={audio3Ref} src="/assets/sounds/alarm-1.mp3" />
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
        <CurrentTime />
        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          <Card sx={{ minWidth: 50 }} className={`custom-card ${ isTempPulsating ? 'pulsating': '' }`}>
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
                <Grid item xs={12}>
                  <TemperatureGraph 
                    title="Live Temperature Monitor"
                    chartInfo={mainGraphData.temperature} 
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          <Card sx={{ minWidth: 50 }} className={`custom-card ${ isHumidityPulsating ? 'pulsating': '' }`}>
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
                    chartInfo={mainGraphData.humidity}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          {/* <QuickBanner percent={0.45} name="Smoke" /> */}
          <Card sx={{ minWidth: 50 }} className={`custom-card ${ isSmokePulsating ? 'pulsating': '' }`}>
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
                <Grid item xs={12}>
                  <SmokeGraph chartInfo={mainGraphData.smoke} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid 
          item 
          xs={12} 
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
              <img src="/assets/illustrations/server-rack-1.png" alt="server rack"
                style={{
                  maxWidth: mdDown ? '10rem' : '20rem',
                  maxHeight: mdDown ? '15rem' : '',
                  marginRight: '-15px'
                }}
              />
              <img src="/assets/illustrations/server-rack-1.png" alt="server rack"
                style={{
                  maxWidth: mdDown ? '10rem' : '20rem',
                  maxHeight: mdDown ? '15rem' : '',
                  marginRight: '-15px'
                }}
              />
              <img src="/assets/illustrations/server-rack-1.png" alt="server rack"
                style={{
                  maxWidth: mdDown ? '10rem' : '20rem',
                  maxHeight: mdDown ? '15rem' : '',
                  marginRight: '-15px'
                }}
              />
              <img src="/assets/illustrations/server-rack-1.png" alt="server rack"
                style={{
                  maxWidth: mdDown ? '10rem' : '20rem',
                  maxHeight: mdDown ? '15rem' : '',
                  marginRight: '-15px'
                }}
              />
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
    </>
  );
};

export default UserDashboardTab;
