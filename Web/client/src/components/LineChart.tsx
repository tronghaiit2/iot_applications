import { Box, Typography } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import TodayIcon from '@material-ui/icons/Today';
import { FC } from 'react';
import {
  Line,
  LineChart as LC,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';

type Props = {
  data: any[];
  yAxisKey: string;
  chartName: string;
};

const LineChart: FC<Props> = ({ data, yAxisKey, chartName }) => {
  let stroke = '#66bb6a';
  data.forEach((el) => {
    if (el.ppm > 4) {
      stroke = '#fb8c00';
    } else if (el.ppm > 10) {
      stroke = '#e53935';
    }
  });
  return (
    <Box
      height="100%"
      position="relative"
      bgcolor="rgba(255, 255, 255, 0.5)"
      borderRadius={15}
    >
      <Box
        position="absolute"
        top={0}
        left={10}
        display="flex"
        alignItems="center"
      >
        <FiberManualRecordIcon style={{ color: '#66bb6a' }} />
        <Typography variant="h6">{chartName}</Typography>
      </Box>
      <Box
        position="absolute"
        top={20}
        right={10}
        display="flex"
        alignItems="center"
        style={{ color: '#9e9e9e' }}
      >
        <TodayIcon />
        <Typography variant="body2" style={{ marginLeft: 5 }}>
          {new Date().toLocaleDateString()}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <LC
          data={data}
          margin={{
            top: 50,
            right: 20,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <YAxis dataKey={yAxisKey} width={40} stroke="#9e9e9e" />
          <Tooltip />
          <Line
            type="linear"
            dataKey={yAxisKey}
            stroke={stroke}
            strokeWidth={2.5}
          />
        </LC>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChart;
