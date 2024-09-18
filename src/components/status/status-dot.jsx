import { styled } from '@mui/material/styles';
import { warning, success, error, secondary } from '../../theme/palette';
import { Box } from '@mui/material';

const StatusDot = styled('div')(({ theme, color }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  display: 'inline-block', // For better alignment
//   marginRight: 5,
  background: color,
  alignItems: "center",
  margin: "0 10px 0 10px"
}));

const StatusDotTag = ({ itemStatus }) => {
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center"
    }} >
      {itemStatus === 'healthy' && <StatusDot status="healthy" color={success.main} />} 
      {itemStatus === 'intermediate' && <StatusDot status="intermediate" color={warning.main} />} 
      {itemStatus === 'unhealthy' && <StatusDot status="unhealthy" color={error.main} />}
      {itemStatus === 'mango' && <StatusDot status="mango" color={warning.light} />}
      {itemStatus === 'cashew' && <StatusDot status="cashew" color={secondary.main} />}
    </Box>
  );
}

export default StatusDotTag;
