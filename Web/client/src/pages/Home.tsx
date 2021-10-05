import { Box, Grid, MenuItem, Select, Typography } from '@material-ui/core';
import axios from 'axios';
import mqtt from 'mqtt';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import CO2Icon from '../assets/co2.svg';
import FactoryIcon from '../assets/eco-factory.svg';
import PlanIcon from '../assets/plan.svg';
import LineChart from '../components/LineChart';
import RealTime from '../components/RealTime';
import { AirQuantity } from '../types';

interface Coordinate {
  lng: number;
  lat: number;
}
const Home = () => {
  const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');
  const [airQuantity, setAirQuantity] = useState<AirQuantity>({
    CO: 0,
    CO2: 0,
    NH4: 0,
    Acetona: 0,
  });
  const [statistical, setStatistical] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [location, setLocation] = useState<string>('HoangMai');
  const [coordinate] = useState<Coordinate>({
    lng: 20.98334,
    lat: 105.852048,
  });

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://iot-airquantity.herokuapp.com/statistical/${location}`
      );
      const air = res.data.airStatistical.map((el: any) => {
        const air = el.ppm.map((item: any) => ({
          ppm: item,
        }));
        return {
          air,
          name: el.air,
        };
      });
      setStatistical(air);
    })();
  }, [location]);

  useEffect(() => {
    client.on('connect', () => {
      client.subscribe(`/MQ135/${location}/data`);
    });
    client.on('message', (topic, message) => {
      setAirQuantity(JSON.parse(message.toString()));
    });

    return () => {
      client.end();
    };
  }, [location, client]);
  const changeLocation = (event: any) => {
    const location = event.target.value;
    setLocation(location);
    switch (location) {
      case 'BachKhoa':
        map.setView([21.0044156, 105.8418001], 17);
        break;
      case 'HoangMai':
        map.setView([20.9749322, 105.8229188], 17);
        break;
      case 'PhuongMai':
        map.setView([21.0031746, 105.8335332], 17);
        break;
      case 'DongDa':
        map.setView([21.0147467, 105.8030133], 17);
        break;
      case 'GiapBat':
        map.setView([20.9832988, 105.8435466], 17);
        break;
      case 'LongBien':
        map.setView([21.037137, 105.8551097], 17);
        break;
      default:
        map.setView([21.0044156, 105.8418001], 17);
    }
    client.end();
  };
  return (
    <Box>
      <Box display="flex" alignItems="center" mb="20px">
        <Typography variant="h4" style={{ marginRight: '20px' }}>
          Station:{' '}
        </Typography>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={location}
          onChange={changeLocation}
        >
          <MenuItem value="BachKhoa">Bách Khoa</MenuItem>
          <MenuItem value="HoangMai">Hoàng Mai</MenuItem>
          <MenuItem value="PhuongMai">Phương Mai</MenuItem>
          <MenuItem value="DongDa">Đống Đa</MenuItem>
          <MenuItem value="GiapBat">Giáp Bát</MenuItem>
          <MenuItem value="LongBien">Long Biên</MenuItem>
        </Select>
      </Box>
      <Grid container spacing={4}>
        {Object.keys(airQuantity).map((air) => {
          if (air === 'CO') {
            let status = 'Normal';
            if (airQuantity[air] >= 10) {
              status = 'Dangerous';
            } else if (airQuantity[air] >= 5) {
              status = 'Warning';
            }
            return (
              <Grid item xs={12} sm={6} lg={3} key={air}>
                <RealTime
                  ppm={airQuantity[air]}
                  air={air}
                  icon={FactoryIcon}
                  status={status}
                />
              </Grid>
            );
          } else if (air === 'CO2') {
            let status = 'Normal';
            if (airQuantity[air] >= 8) {
              status = 'Dangerous';
            } else if (airQuantity[air] >= 3) {
              status = 'Warning';
            }
            return (
              <Grid item xs={12} sm={6} md={6} lg={3} key={air}>
                <RealTime
                  ppm={airQuantity[air]}
                  air={air}
                  status={status}
                  icon={CO2Icon}
                />
              </Grid>
            );
          } else if (air === 'NH4') {
            let status = 'Normal';
            if (airQuantity[air] >= 15) {
              status = 'Dangerous';
            } else if (airQuantity[air] >= 7) {
              status = 'Warning';
            }
            return (
              <Grid item xs={12} sm={6} md={6} lg={3} key={air}>
                <RealTime
                  ppm={airQuantity[air]}
                  air={air}
                  status={status}
                  icon={PlanIcon}
                />
              </Grid>
            );
          } else if (air === 'Acetona') {
            let status = 'Normal';
            if (airQuantity[air] >= 9) {
              status = 'Dangerous';
            } else if (airQuantity[air] >= 7) {
              status = 'Warning';
            }
            return (
              <Grid item xs={12} sm={6} md={6} lg={3} key={air}>
                <RealTime
                  ppm={airQuantity[air]}
                  air={air}
                  status={status}
                  icon={PlanIcon}
                />
              </Grid>
            );
          } else {
            return null;
          }
        })}
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '50px' }}>
        <Grid item xs={12} sm={6} style={{ height: '500px' }}>
          <MapContainer
            center={[coordinate.lng, coordinate.lat]}
            zoom={17}
            scrollWheelZoom={false}
            whenCreated={(map) => setMap(map)}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </Grid>
        <Grid item container xs={12} sm={6} spacing={1}>
          {statistical.map((el) => (
            <Grid item xs={12} sm={6} key={el.name}>
              <LineChart
                data={el.air}
                yAxisKey="ppm"
                chartName={`Statistical ${el.name}`}
              ></LineChart>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
