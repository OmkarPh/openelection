import './App.css';
import {Helmet} from 'react-helmet';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import {Container} from 'react-bootstrap';

import Header from './components/Header';
import Listing from './components/Listing';
import Admin from './components/Admin';

function App() {
  return (
    <Router class="coverer">
      <Header />
      <Switch>
        <Route path='/' component={Listing} exact />
        <Route path='/admin' component={Admin} exact />
      </Switch>

    </Router>
  )
}
export default App;