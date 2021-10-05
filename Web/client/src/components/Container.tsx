import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    background: 'linear-gradient(-30deg, #33ccff, #eee, #ffccff, #81d5ff)',
    height: '100vh',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 0px',
    [theme.breakpoints.up('md')]: {
      padding: '20px',
    },
  },
}));

const Container: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box
        width="80vw"
        minHeight="90vh"
        bgcolor="rgba(255, 255, 255, 0.4)"
        p="20px 20px 40px 20px"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Container;
