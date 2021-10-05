import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Container from './components/Container';
import Home from './pages/Home';

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </Container>
  );
}

export default App;
