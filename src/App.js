import './App.css';
import {Helmet} from 'react-helmet';
import {Container} from 'react-bootstrap';

import Listing from './components/Listing';

function App() {
  return (
    <Container>
      <Helmet title="Open Election" />
          <h4>
            Ethereum smart contract based dApp to conduct elections without central authority. (Except configuration)
          </h4> 
          <Listing />
    </Container>
  )
}
export default App;