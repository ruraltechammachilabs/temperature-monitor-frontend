import { useState, useEffect } from 'react';
import { Typography, Grid } from '@mui/material';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentTime.toLocaleString('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return (
    <>
    <Grid container>
      <Grid 
        item 
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end'
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "right" }}>
            Time (IST) : { formattedTime }
        </Typography>
      </Grid>
    </Grid>
    </>
    
  );
}

export default CurrentTime;
