/* React */
// import { useEffect, useState } from "react";

/* MUI */
import { Grid, Typography } from "@mui/material";

/* Components */
import { useResponsive } from '../hooks/use-responsive'
import TemperatureRangeSettings from "../layouts/Settings/TemperatureRangeSettings";
import HumidityRangeSettings from "../layouts/Settings/HumidityRangeSettings";
import SmokeRangeSettings from "../layouts/Settings/SmokeRangeSettings";
import SmsLimitSettings from "../layouts/Settings/SmsLimitSettings";

const SensorSettings = () => {

  const mdUp = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "left", ml: mdUp ? 5 : 1, pl: lgUp ? 20 : 0 }}>
        Range Settings
      </Typography>

      <Grid 
        container 
        spacing={1} 
        sx={{ 
          pl: lgUp ? 20 : 0,
          pr: lgUp ? 20 : 0,
        }}
      >
        <Grid item xs={12} sx={{ m: mdUp ? 5 : 1 }}>
          {/* <CircularSlider
            label="Temperature"
            min={0}
            max={10}
            dataIndex={5}
            // prependToValue="$"
            appendToValue="°C"
            labelColor="#005a58"
            labelBottom={true}
            knobColor="#005a58"
            knobSize={72}
            progressColorFrom="#00bfbd"
            progressColorTo="#005a58"
            progressSize={24}
            trackColor="#eeeeee"
            trackSize={34}
            // width={280}
            circleWidth={20}
          >
            <FiberManualRecordIcon x="22" y="22" width="28px" height="28px" sx={{ color: grey[0] }} />
          </CircularSlider> */}
          <TemperatureRangeSettings />
          <HumidityRangeSettings />
          <SmokeRangeSettings />
          <SmsLimitSettings />
        </Grid>
      </Grid>
    </>
  );
};

export default SensorSettings;
