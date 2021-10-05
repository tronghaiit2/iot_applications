import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#66ba6a',
    },
  },
  typography: {
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#757575',
      marginBottom: '40px',
    },
    h3: {
      color: '#66ba6a',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
