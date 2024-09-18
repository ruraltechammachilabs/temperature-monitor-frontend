import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import WidgetStyles from "./WidgetStyles.module.css";
import PlantLoader from "../../../public/assets/lottie/plant-loader.json";
import LoadLottieAnimation from "../../components/Loader/LoadLottieAnimation";

// import { fShortenNumber } from '../../utils/format-number';

export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  sx,
  loader,
  ...other
}) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      // className={(loader) ? WidgetStyles.cover: ''}
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        m: 0,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}
      {loader && (
        <Box className={loader && total === 0 ? WidgetStyles.cover : ""} />
      )}
      {loader && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            position: "absolute",
            left: "-20px",
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <LoadLottieAnimation animationData={PlantLoader} />
        </Box>
      )}
      <Stack spacing={0.5}>
        {/* <Typography variant="h4">{fShortenNumber(total)}</Typography> */}
        <Typography variant="h4">{total !== 0 && total}</Typography>

        <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  loader: PropTypes.bool,
  title: PropTypes.string,
  total: PropTypes.number,
};
