import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import AppWidgetSummary from "../app-widget-summary"

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Mango"
            total={1714}
            color="success"
            icon={
              <img 
                alt="icon" 
                src="/assets/icons/cashew-icon-vector.svg" 
          />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Cashew"
            total={1352}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/ic_cashew.svg" />
            }
          />
        </Grid>
      </Grid>
    </Container>
  );
}
