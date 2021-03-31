import './App.css';
import {Helmet} from 'react-helmet';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import {Container} from 'react-bootstrap';

import Header from './components/Header';
import Listing from './components/Listing';

function App() {
  return (
    <Router class="coverer">
      <Header />
      <Switch>
        <Route path='/' component={Listing} exact />
      </Switch>

    </Router>
  )
}
export default App;