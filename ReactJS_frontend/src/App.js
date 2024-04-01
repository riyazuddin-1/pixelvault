import Navbar from './components/navbar';
import Home from './screens/home';
import Explore from './screens/explore';
import Profile from './screens/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path='' element={<Home />}/>
          <Route path='explore/:Category' element={ <Explore/> }/>
          <Route path='u/:userID' element={<Profile/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
