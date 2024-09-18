/* React */
import { useEffect, useContext, useMemo, useState, memo } from "react";

/* MUI */
import { Grid, Typography } from "@mui/material";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

/* Components */
import GaugeChart from "react-gauge-chart";
import { GlobalDataContext } from "../../Providers/GlobalDataProvider";
// import { success } from "../../theme/palette";

const QuickBanner = ({ percent, value, name }) => {
  const { toggleDark } = useContext(GlobalDataContext);
  const memoisedNeedleColor = useMemo(
    () => (toggleDark ? "#595858" : "#c8ccca"),
    [toggleDark]
  );
  const memoisedTextColor = useMemo(
    () => (toggleDark ? "white" : "black"),
    [toggleDark]
  );

  // const chartStyle = {
  //   height: "auto",
  //   width: "80%",
  // };

  /* Guage chart declaration for Smoke */
  const maxSmokeValue = 10000;
  const [smokePercentage, setSmokePercentage] = useState(0);

  useEffect(() => {
    let percentage = 0;
    if (name === "Smoke") {
      percentage = value / maxSmokeValue;
      setSmokePercentage(percentage);
    }
  }, [value, name]);

  const setValueByType = () => {
    if (name === "Temperature") {
      return value + " °C";
    } else if (name === "Humidity") {
      return value + " %";
    } else if (name === "Smoke") {
      return value + " ";
    } else {
      return " ";
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">{name}</Typography>
        </Grid>
        {name === "Smoke" ? (
          // <Grid
          //   item
          //   xs={12}
          //   sx={{
          //     display: "flex",
          //     justifyContent: "center",
          //     alignItems: "center",
          //     m: 1
          //   }}
          // >
          //   <Typography variant="h5" color={success.light}>Not Detected</Typography>
          // </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <GaugeChart
              style={{
                height: "auto",
                width: "80%",
              }}
              percent={smokePercentage}
              animDelay={0}
              needleColor={memoisedNeedleColor}
              needleBaseColor="#c8ccca"
              colors={["#4caf50", "#FFC371", "#FF5F6D"]}
              nrOfLevels={3}
              formatTextValue={() => value + ""}
              textColor={memoisedTextColor}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <GaugeChart
              style={{
                height: "auto",
                width: "80%",
              }}
              percent={percent}
              animDelay={0}
              needleColor={memoisedNeedleColor}
              needleBaseColor="#c8ccca"
              colors={["#a2cf6e", "#4caf50", "#FFC371", "#FF5F6D"]}
              nrOfLevels={4}
              formatTextValue={() => setValueByType(value)}
              textColor={memoisedTextColor}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

const MemoQuickBanner = memo(QuickBanner);

export default MemoQuickBanner;
