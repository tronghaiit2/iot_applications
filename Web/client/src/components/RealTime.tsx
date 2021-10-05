import { Box, Typography } from '@material-ui/core';
import { FC } from 'react';

type Props = {
  ppm: number;
  air: string;
  status: string;
  icon: string;
};

const RealTime: FC<Props> = ({ ppm, air, status, icon }) => {
  let color = '';
  if (status === 'Normal') {
    color = '#66bb6a';
  } else if (status === 'Warning') {
    color = '#fb8c00';
  } else if (status === 'Dangerous') {
    color = '#e53935';
  }
  return (
    <Box
      width={350}
      height={180}
      bgcolor="rgba(255, 255, 255, 0.8)"
      padding="20px"
      borderRadius="15px"
      display="flex"
      alignItems="center"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" flexDirection="column">
          <Box mb={3}>
            <Typography variant="h3" style={{ color: '#616161' }}>
              {air}
            </Typography>
            <Typography variant="h4" style={{ color: '#9e9e9e' }}>
              {ppm} ppm
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" style={{ color: '#616161' }}>
              Status
            </Typography>
            <Typography variant="h4" style={{ color }}>
              {status}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box clone width={100} height={100}>
            <img src={icon} alt="Air quantity" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RealTime;
