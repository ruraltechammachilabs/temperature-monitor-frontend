/* eslint-disable react/no-unescaped-entities */
/* React */
import { useState, useEffect, useRef } from "react";

/* MUI */
import {
  Typography,
  Grid,
  SvgIcon,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stack,
  TextField,
  Box,
  Fab,
  Snackbar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";

/* Components */
import ChatBotIllustration from "/assets/illustrations/bot-illustration.png";
import TelegramLogoIllustration from "/assets/icons/dashboard/telegram-illustration.png";
import {
  getTelegramCredentials,
  setTelegramCredentials,
} from "../../../firebase/operations";
// import TelegramLogo from "/assets/icons/dashboard/telegram-logo.svg";

/* Styles */
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "../../../styles/fonts/poppins.css";
import "./telegram-bot-styles.css";
import { grey } from "../../../theme/palette";
import styled from "styled-components";

const WhiteTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#4E4AA6",
    borderColor: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      "&:hover": {
        borderColor: "white",
      },
      "&.Mui-focused": {
        borderColor: "white",
      },
      "& .MuiInputLabel-root": {
        color: "white",
      },
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "12px 14px",
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
  },
  zIndex: 2,
}));

const TelegramSvgIcon = () => {
  return (
    <SvgIcon fontSize="large" sx={{ width: "50px", height: "auto" }}>
      <svg
        width="800px"
        height="800px"
        viewBox="0 0 256 256"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <g>
          <path
            d="M128,0 C57.307,0 0,57.307 0,128 L0,128 C0,198.693 57.307,256 128,256 L128,256 C198.693,256 256,198.693 256,128 L256,128 C256,57.307 198.693,0 128,0 L128,0 Z"
            fill="#40B3E0"
          ></path>
          <path
            d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308"
            fill="#FFFFFF"
          ></path>
          <path
            d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475"
            fill="#D2E5F1"
          ></path>
          <path
            d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624"
            fill="#B5CFE4"
          ></path>
        </g>
      </svg>
    </SvgIcon>
  );
};

const TelegramBotConfig = () => {
  const [chatId, setChatId] = useState("");
  const [token, setToken] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperContainer = useRef(null);
  const [mySwiper, setMySwiper] = useState(null);

  const NavigateNext = () => {
    mySwiper.slideTo(activeIndex + 1);
  };

  const NavigatePrev = () => {
    if (activeIndex > 0) {
      mySwiper.slideTo(activeIndex - 1);
    }
  };

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      const telegramData = await getTelegramCredentials();
      setChatId(telegramData.CHAT_ID);
      setToken(telegramData.TOKEN);
    };

    fetchDataAndUpdateState();
  }, []);

  const handleTelegramInputs = () => {
    setTelegramCredentials(chatId, token);
    setState({ ...state, alertOpen: true });
  };

  /* snackbar alert */
  const [state, setState] = useState({
    alertOpen: false,
    vertical: "bottom",
    horizontal: "center",
    msg: "Telegram credentials successfully updated !",
  });
  const { vertical, horizontal, alertOpen } = state;

  const handleSnackbarClose = () => {
    setState({ ...state, alertOpen: false });
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  textTransform: "uppercase",
                  width: "90%",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                }}
                className="poppins-medium"
              >
                Instructions to create Telegram chatbot
                <TelegramSvgIcon />
              </Typography>

              <Swiper
                modules={[Navigation, Scrollbar, A11y]}
                spaceBetween={30}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  setMySwiper(swiper);
                }}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.activeIndex);
                }}
                ref={swiperContainer}
                centeredSlides={true}
                onResize={(swiper) => {
                  swiper.update();
                }}
              >
                <SwiperSlide>
                  <List
                    sx={{
                      width: "100%",
                      background: "transparent",
                      color: "#fff",
                      // bgcolor: "#4E4AA6",
                    }}
                    className="poppins-regular"
                  >
                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="1"
                          src="/static/images/avatar/1.jpg"
                          sx={{
                            bgcolor: grey[800],
                            borderRadius: "5px",
                            color: "white",
                          }}
                        />
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
                              color="#e0e0e0"
                            >
                              Step 1
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              // color="#e0e0e0"
                              // color="#A7A4D2"
                              color="#C8C6F0"
                            >
                              using the Telegram Bot API or BotFather, follow
                              their respective instructions to create a new bot.
                              You'll need to provide a name and username for
                              your bot.
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />

                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="2"
                          src="/static/images/avatar/1.jpg"
                          sx={{
                            bgcolor: grey[800],
                            borderRadius: "5px",
                            color: "white",
                          }}
                        />
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
                              color="#e0e0e0"
                            >
                              Step 2
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              // color="#e0e0e0"
                              color="#C8C6F0"
                            >
                              using the Telegram Bot API or BotFather, follow
                              their respective instructions to create a new bot.
                              You'll need to provide a name and username for
                              your bot.
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />

                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="3"
                          src="/static/images/avatar/1.jpg"
                          sx={{
                            bgcolor: grey[800],
                            borderRadius: "5px",
                            color: "white",
                          }}
                        />
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
                              color="#e0e0e0"
                            >
                              Step 3
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              // color="#e0e0e0"
                              color="#C8C6F0"
                            >
                              using the Telegram Bot API or BotFather, follow
                              their respective instructions to create a new bot.
                              You'll need to provide a name and username for
                              your bot.
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                </SwiperSlide>
                <SwiperSlide>
                  <List
                    sx={{
                      width: "100%",
                      background: "transparent",
                      color: "#fff",
                      // bgcolor: "#4E4AA6",
                    }}
                    className="poppins-regular"
                  >
                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="4"
                          src="/static/images/avatar/1.jpg"
                          sx={{
                            bgcolor: grey[800],
                            borderRadius: "5px",
                            color: "white",
                          }}
                        />
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
                              color="#e0e0e0"
                            >
                              Step 4
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              // color="#e0e0e0"
                              color="#C8C6F0"
                            >
                              using the Telegram Bot API or BotFather, follow
                              their respective instructions to create a new bot.
                              You'll need to provide a name and username for
                              your bot.
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />

                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="5"
                          src="/static/images/avatar/1.jpg"
                          sx={{
                            bgcolor: grey[800],
                            borderRadius: "5px",
                            color: "white",
                          }}
                        />
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
                              color="#e0e0e0"
                            >
                              Step 5
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              // color="#e0e0e0"
                              color="#C8C6F0"
                            >
                              using the Telegram Bot API or BotFather, follow
                              their respective instructions to create a new bot.
                              You'll need to provide a name and username for
                              your bot.
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />

                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="6"
                          src="/static/images/avatar/1.jpg"
                          sx={{
                            bgcolor: grey[800],
                            borderRadius: "5px",
                            color: "white",
                          }}
                        />
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
                              color="#e0e0e0"
                            >
                              Step 6
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              // color="#e0e0e0"
                              color="#C8C6F0"
                            >
                              using the Telegram Bot API or BotFather, follow
                              their respective instructions to create a new bot.
                              You'll need to provide a name and username for
                              your bot.
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                </SwiperSlide>
              </Swiper>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Fab
                  size="small"
                  aria-label="previous"
                  className="swiper-prev-button"
                  onClick={NavigatePrev}
                  sx={{
                    m: 1,
                    background: "linear-gradient(to right, #ff4e50, #f9d423)",
                    color: "white",
                    position: "relative",
                  }}
                >
                  <TrendingFlatOutlinedIcon
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) scaleX(-1)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform:
                          "translateX(-5px) scaleX(-1) translate(50%, -50%)",
                      },
                    }}
                  />
                </Fab>
                <Fab
                  size="small"
                  color="secondary"
                  aria-label="next"
                  className="swiper-next-button"
                  onClick={NavigateNext}
                  sx={{
                    m: 1,
                    background: "linear-gradient(to right, #ff4e50, #f9d423)",
                    color: "white",
                    position: "relative",
                  }}
                >
                  <TrendingFlatOutlinedIcon
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)", // Center the icon
                      transition: "transform 0.3s ease-in-out", // Add transition for smooth animation
                      "&:hover": {
                        transform: "translateX(5px) translate(-50%, -50%)", // Move the icon on hover
                      },
                    }}
                  />
                </Fab>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={3} sx={{ mt: 5, p: 5, position: "relative" }}>
                <img
                  src={TelegramLogoIllustration}
                  alt="Telegram Logo Illustration"
                  className="telegram-logo-illustration"
                />
                <WhiteTextField
                  name="chatId"
                  label="Chat ID"
                  value={chatId}
                  variant="outlined"
                  className="poppins-regular"
                  onChange={(e) => setChatId(e.target.value)}
                />
                <WhiteTextField
                  name="token"
                  label="Token"
                  value={token}
                  variant="outlined"
                  className="poppins-regular"
                  onChange={(e) => setToken(e.target.value)}
                />

                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleTelegramInputs}
                    sx={{
                      backgroundImage:
                        "linear-gradient(to right, #ff4e50, #f9d423)",
                      opacity: 0.8,
                      mt: 2,
                      width: "50%",
                      position: "relative",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    endIcon={
                      <TrendingFlatOutlinedIcon
                        sx={{
                          position: "absolute",
                          top: "50%",
                          ml: 1,
                          transform: "translate(-50%, -50%)", // Center the icon
                          transition: "transform 0.3s ease-in-out", // Add transition for smooth animation
                          "&:hover": {
                            transform: "translateX(3px) translate(50%, -50%)", // Move the icon on hover
                          },
                        }}
                      />
                    }
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Stack>
              <Stack
                spacing={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={ChatBotIllustration}
                  alt="Chat Bot Illustration"
                  className="illustration"
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: state.vertical,
          horizontal: state.horizontal,
        }}
        color="success"
        open={alertOpen}
        onClose={handleSnackbarClose}
        message={state.msg}
        key={vertical + horizontal}
        autoHideDuration={4000}
      />
    </>
  );
};

export default TelegramBotConfig;
