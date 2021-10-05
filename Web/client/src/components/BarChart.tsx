import { Box, Typography } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import TodayIcon from '@material-ui/icons/Today';
import { FC } from 'react';
import {
  Bar,
  BarChart as BC,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  chartName: string;
  fill: string;
};

const BarChart: FC<Props> = ({ data, xAxisKey, yAxisKey, chartName, fill }) => {
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
        <BC
          data={data}
          margin={{
            top: 50,
            right: 20,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey={xAxisKey} stroke="#9e9e9e" />
          <YAxis dataKey={yAxisKey} width={40} stroke="#9e9e9e" />
          <Tooltip />
          <Bar dataKey={yAxisKey} fill={fill} />
        </BC>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart;
