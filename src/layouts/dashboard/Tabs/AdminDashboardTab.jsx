/* eslint-disable react/no-unescaped-entities */
/* React */
// import { useContext } from "react";
import { useState, useEffect, useRef, useContext } from "react";

/* MUI */
import {
  Card,
  CardContent,
  Grid,
  CardHeader,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  CardActions,
  Fab,
  Modal,
  Stack,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";

/* MUI Icons */
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

/* Hooks */
import { useResponsive } from "../../../hooks/use-responsive";
// import { useSelector, useDispatch } from 'react-redux'

/* Styles */
import "../../../global.css";
import "../../../styles/dashboard.css";

/* Components */
import { grey } from "../../../theme/palette";
import TelegramBotConfig from "../Telegram/telegram-bot-config";
import {
  getHumidRanges,
  getSmokeRanges,
  getTempRanges,
  rebootSystem,
  shutdownSystem,
} from "../../../firebase/SensorSettingsOperations";
import {
  fetchData,
  listenForDocumentChanges,
  listenForTempRangeChanges,
  listenForHumidRangeChanges,
  listenForSmokeRangeChanges,
  deleteNodesWithoutTimestampTime
} from "../../../firebase/operations";
import { deleteAlertUser } from "../../../firebase/AlertUserOperations";
import QuickBanner from "../../../sections/banner/QuickBanner";
import TemperatureGraph from "../../../sections/graphs/dashboard/TemperatureGraph";
import HumidityGraph from "../../../sections/graphs/dashboard/HumidityGraph";
import SmokeGraph from "../../../sections/graphs/dashboard/SmokeGraph";
import AddAlertUser from "../../../sections/alert-users/AddAlertUser";
import { getLimitedAlertUsers } from "../../../firebase/AlertUserOperations";
import CurrentTime from "../../../components/current-time/CurrentTime";
import { GlobalDataContext } from "../../../Providers/GlobalDataProvider";
// import { setThreshold } from "../../../services/monitoringSlice";
import { convertToTimestamp, setRealtimeValues, getChartDataByDateTime } from "../../../firebase/operations";
import { GraphDataContext } from "../../../Providers/GraphDataProvider";

const AdminDashboardTab = () => {
  const mdUp = useResponsive("up", "md");
  const mdDown = useResponsive("down", "md");

  const { isNewAlertUserAdded, setIsAlertUserRemoved, isAlertUserRemoved } = useContext(GlobalDataContext);
  const { setTempGraphData, setHumidGraphData, setSmokeGraphData } = useContext(GraphDataContext)

  const [action, setAction] = useState("");
  const [isTempPulsating, setIsTempPulsating] = useState(false);
  const [isHumidityPulsating, setIsHumidityPulsating] = useState(false);
  const [isSmokePulsating, setIsSmokePulsating] = useState(false);
  
  const [mainGraphData, setMainGraphData] = useState([])

  const [alertUsers, setAlertUsers] = useState([]);

  /* monitor Redux state */
  // const storedTemperature = useSelector((state) => state.monitor.temperature)
  // const storedHumidity = useSelector((state) => state.monitor.humidity)
  // const storedSmoke = useSelector((state) => state.monitor.smoke)
  // const dispatch = useDispatch()

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

  /* Modal */
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

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
      setData(data)
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

        /* Change the range for alert according to requirements */
        rangeState = {
          Temperature: tempRange.high_temp_range,
          Humidity: humidRange.normal_humid_range,
          Smoke: smokeRange.smoke_limit,
        };

        localStorage.setItem("ranges", JSON.stringify(rangeState));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdateState();

    const unsubscribe = listenForDocumentChanges((newData) => {
      setData(newData);
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      /* Play Alert Sound if Temp > Limit  */
      if (newData.Temperature > ranges.Temperature) {
        console.log(newData.Temperature, ranges.Temperature);
        handlePlay1();
        setIsTempPulsating(true);
      } else {
        handlePause1();
        setIsTempPulsating(false);
      }

      /* Humidity */
      if (newData.Humidity > ranges.Humidity) {
        console.log(newData.Humidity, ranges.Humidity);
        handlePlay2();
        setIsHumidityPulsating(true);
      } else {
        handlePause2();
        setIsHumidityPulsating(false);
      }

      /* Smoke */
      if (newData.Smoke > ranges.Smoke) {
        console.log(newData.Smoke, ranges.Smoke);
        handlePlay3();
        setIsSmokePulsating(true);
      } else {
        handlePause3();
        setIsSmokePulsating(false);
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
      // console.log("main live graph data => ", mainData)

      setMainGraphData(mainData)
    }

    fetchLiveData()

  }, [])

  /* Temperature Changes Alert */
  useEffect(() => {
    const unsubscribe = listenForTempRangeChanges((newData) => {
      const ranges = JSON.parse(localStorage.getItem("ranges"));

      const newRanges = {
        Temperature: newData.high_temp_range,
        Humidity: ranges.Humidity,
        Smoke: ranges.Smoke,
      };
      localStorage.setItem("ranges", JSON.stringify(newRanges));
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
        Smoke: ranges.Smoke,
      };
      localStorage.setItem("ranges", JSON.stringify(newRanges));
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
        Smoke: newData.smoke_limit,
      };
      localStorage.setItem("ranges", JSON.stringify(newRanges));
    });
    return () => unsubscribe();
  }, []);

  /* Load Alert Users */
  useEffect(() => {
    const fetchData = async () => {
      await getLimitedAlertUsers().then((alertusers) => {
        console.log("alertUsers -> ", alertusers);
        setAlertUsers(alertusers);
      });
    };

    fetchData();
  }, []);

  /* Alert User Actions */
  useEffect(() => {

    const fetchData = async () => {
      await getLimitedAlertUsers().then((alertusers) => {
        console.log("alertUsers -> ", alertusers);
        setAlertUsers(alertusers);
      });
    };

    
    if(isNewAlertUserAdded || isAlertUserRemoved) {
      console.log(isNewAlertUserAdded, isAlertUserRemoved)
      fetchData();
    }
  }, [isNewAlertUserAdded, isAlertUserRemoved])

  /* System Actions */

  const shutdownDevice = () => {
    shutdownSystem().then(() => {
      setAction("Shutdown");
      setState({ ...state, alertOpen: true });
    });
  };

  const rebootDevice = () => {
    rebootSystem().then(() => {
      setAction("Reboot");
      setState({ ...state, alertOpen: true });
    });
  };

  const handleDeleteAlertUser = async (alertUser) => {
		console.log(alertUser)
		await deleteAlertUser(alertUser)
		.then(() => {
			setIsAlertUserRemoved(true)
		}) 

		setIsAlertUserRemoved(false)
	}

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

  // const handleGetLiveTemperatureData = () => {

  // }

  return (
    <>
      <audio ref={audio1Ref} src="/assets/sounds/alarm-2.mp3" />
      <audio ref={audio2Ref} src="/assets/sounds/alarm-2.mp3" />
      <audio ref={audio3Ref} src="/assets/sounds/alarm-1.wav" />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Alert
            severity="error"
            // sx={{ display: isTempPulsating ? "block" : "none" }}
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
          <Alert
            severity="error"
            // sx={{ display: isTempPulsating ? "block" : "none" }}
            sx={{
              display: isHumidityPulsating ? "flex" : "none",
              justifyContent: "center",
              textAlign: "center",
            }}
            className="alert-box"
          >
            <AlertTitle style={{ textAlign: "center" }}>WARNING</AlertTitle>
            CRITICAL ALERT - HUMIDITY HIGH
          </Alert>
          <Alert
            severity="error"
            // sx={{ display: isTempPulsating ? "block" : "none" }}
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
          pr: mdUp ? 25 : 0,
          pl: mdUp ? 25 : 0,
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
              justifyContent: "end",
              width: "100%",
              mb: 2,
            }}
          >
            <IconButton
              aria-label="Power Button"
              className="power-button"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
              onClick={shutdownDevice}
            >
              <PowerSettingsNewRoundedIcon sx={{ width: 35, height: 35 }} />
              <span
                style={{
                  marginTop: "5px",
                  fontSize: "small",
                  letterSpacing: 1,
                }}
              >
                Shutdown
              </span>
            </IconButton>
            <IconButton
              aria-label="Reboot Button"
              className="reboot-button"
              sx={{
                ml: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
              onClick={rebootDevice}
            >
              <RestartAltRoundedIcon sx={{ width: 35, height: 35 }} />
              <span
                style={{
                  marginTop: "5px",
                  fontSize: "small",
                  letterSpacing: 1,
                }}
              >
                Restart
              </span>
            </IconButton>

            {/* <IconButton
              aria-label="Delete Nodes Button"
              className="reboot-button"
              sx={{
                ml: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
              onClick={deleteNodesWithoutTimestampTime}
            >
              <DeleteForeverIcon sx={{ width: 35, height: 35 }} />
              <span
                style={{
                  marginTop: "5px",
                  fontSize: "small",
                  letterSpacing: 1,
                }}
              >
                Delete
              </span>
            </IconButton> */}
            
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
              { 
                isMuted ? (
                  <VolumeOffIcon sx={{ width: 35, height: 35 }} />
                ) : 
                (
                  <VolumeUpIcon sx={{ width: 35, height: 35 }} />
                )
              }
              <span
                style={{
                  marginTop: "5px",
                  fontSize: "small",
                  letterSpacing: 1,
                }}
              >
                {
                  isMuted ? 'Muted' : 'Mute'
                }
              </span>
            </IconButton>
          </Stack>
        </Grid>
        <CurrentTime />
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
                <Grid item xs={12}>
                  {/* <TemperatureGraph
                      title="Live Temperature Monitor"
                      chart={{
                        labels: [
                          "01/01/2024",
                          "02/01/2024",
                          "03/01/2024",
                          "04/01/2024",
                          "05/01/2024",
                          "06/01/2024",
                          "07/01/2024",
                          "08/01/2024",
                          "09/01/2024",
                          "10/01/2024",
                          "11/01/2024",
                        ],
                        series: [
                          {
                            name: "Temperature",
                            type: "area",
                            fill: "gradient",
                            data: [44.5, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                          },
                        ],
                      }}
                    /> */}
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
          <Card
            sx={{ minWidth: 50 }}
            className={`custom-card ${isHumidityPulsating ? "pulsating" : ""}`}
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
                <Grid item xs={12}>
                  <HumidityGraph
                    title="Live Humidity Monitor"
                    chartInfo={mainGraphData.humidity}
                    // chart={{
                    //   labels: [
                    //     "01/01/2024",
                    //     "02/01/2024",
                    //     "03/01/2024",
                    //     "04/01/2024",
                    //     "05/01/2024",
                    //     "06/01/2024",
                    //     "07/01/2024",
                    //     "08/01/2024",
                    //     "09/01/2024",
                    //     "10/01/2024",
                    //     "11/01/2024",
                    //   ],
                    //   series: [
                    //     {
                    //       name: "Humidity",
                    //       type: "area",
                    //       fill: "gradient",
                    //       data: [44.5, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                    //     },
                    //   ],
                    // }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} alignItems="center" justifyContent="center">
          {/* <QuickBanner percent={0.45} name="Smoke" /> */}
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
                <Grid item xs={12}>
                  <SmokeGraph
                  chartInfo={mainGraphData.smoke}
                  // title="Live Smoke Detection Monitor"
                  // chart={{
                  //   labels: [
                  //     "01/01/2024",
                  //     "02/01/2024",
                  //     "03/01/2024",
                  //     "04/01/2024",
                  //     "05/01/2024",
                  //     "06/01/2024",
                  //     "07/01/2024",
                  //     "08/01/2024",
                  //     "09/01/2024",
                  //     "10/01/2024",
                  //     "11/01/2024",
                  //     "12/01/2024",
                  //     "12/02/2024",
                  //   ],
                  //   series: [
                  //     {
                  //       name: "Smoke",
                  //       type: "area",
                  //       fill: "gradient",
                  //       data: [
                  //         44.5, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 50,
                  //         33,
                  //       ],
                  //     },
                  //   ],
                  // }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Telegram Bot */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              minWidth: 50,
              borderRadius: 5,
              backgroundColor: "#4E4AA6",
              color: "#fff",
            }}
            className="custom-card"
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                m: 2,
              }}
            >
              <TelegramBotConfig />
            </CardContent>
          </Card>
        </Grid>

        {/* Add User */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              minWidth: 100,
              borderRadius: 5,
              p: 3,
            }}
            className="custom-card"
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    bgcolor: grey[500],
                  }}
                  aria-label="User"
                />
              }
              action={
                <IconButton aria-label="settings">
                  {/* <MoreVertIcon /> */}
                  <ArrowForwardIosIcon />
                </IconButton>
              }
              title="Users"
            />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <List
                sx={{
                  width: "100%",
                  background: "transparent",
                  color: "#fff",
                }}
                className="poppins-regular"
              >
                {alertUsers.map((user, index) => {
                  return (
                    <ListItem
                      key={index}
                      alignItems="center"
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteAlertUser(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src="/assets/images/avatars/avatar_13.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        className="list-item-text"
                        primary={
                          <>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                              component="span"
                              color="#aaa7c3"
                            >
                              { user.name }
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline", fontWeight: 500 }}
                              component="span"
                              variant="body2"
                              color="#A7A4D2"
                            >
                              { user.phone }
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
                {/* <ListItem
                  alignItems="center"
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src="/assets/images/avatars/avatar_13.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    className="list-item-text"
                    primary={
                      <>
                        <Typography
                          sx={{ fontWeight: 700, textTransform: "uppercase" }}
                          component="span"
                          color="#aaa7c3"
                        >
                          Gokul Dev
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "inline", fontWeight: 500 }}
                          component="span"
                          variant="body2"
                          color="#A7A4D2"
                        >
                          +91 8848433125
                        </Typography>
                      </>
                    }
                  />
                </ListItem> */}
                {/* <ListItem
                  alignItems="center"
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src="/assets/images/avatars/avatar_13.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    className="list-item-text"
                    primary={
                      <>
                        <Typography
                          sx={{ fontWeight: 700, textTransform: "uppercase" }}
                          component="span"
                          color="#aaa7c3"
                        >
                          Rajesh
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "inline", fontWeight: 500 }}
                          component="span"
                          variant="body2"
                          color="#A7A4D2"
                        >
                          +91 9047254320
                        </Typography>
                      </>
                    }
                  />
                </ListItem> */}
              </List>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Fab
                size="small"
                aria-label="add"
                onClick={handleOpen}
                sx={{
                  background: "#4E4AA6",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#666AA6" /* Lighter shade */,
                    color: "#e0e0e0",
                  },
                }}
              >
                <AddIcon />
              </Fab>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Add Alert User Modal */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-user-modal"
        aria-describedby="add-user-modal"
      >
        <Card
          sx={{
            minWidth: 50,
            borderRadius: 5,
            p: 3,
            width: mdDown ? "85%" : "30%",
            ...style,
          }}
          className="custom-card"
        >
          <CardHeader
            sx={{ p: 0 }}
            action={
              <IconButton
                aria-label="close"
                color="secondary"
                onClick={handleModalClose}
              >
                <CloseIcon />
              </IconButton>
            }
          ></CardHeader>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
            }}
          >
            <AddAlertUser />
          </CardContent>
        </Card>
      </Modal>
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
      {/* <Alert severity="error" sx={{ display: isPlaying? 'block' : 'none' }}>
        <AlertTitle>Error</AlertTitle>
        This is an error Alert with a scary title.
      </Alert> */}
    </>
  );
};

export default AdminDashboardTab;
