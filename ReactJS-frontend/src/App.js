import Navbar from './navbar';
import Profile from './Profile';
import Home from './home';
import Explore from './explore';
import MyGallery from './myGallery';
import AlbumView from './albumView';
import PassChange from './passChange';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
var cryptoJS = require('crypto-js');

function App() {
  var authCred = sessionStorage.getItem('Credentials');
  var isSignedIn;
  if(authCred) {
    isSignedIn = true;
  } else {
    isSignedIn = false;
  }
  var funcAuthCred = (data) => {
    sessionStorage.setItem('Credentials', cryptoJS.AES.encrypt(JSON.stringify(data), 'GiveMeJob').toString());
    window.location.reload();
  }
  return (
    <Router>
      <div className="App">
        <Navbar funcAuthCred = {funcAuthCred} authCred={authCred} isSignedIn={isSignedIn}/>
        <Routes>
          <Route path='/' element={[<Home />, <Explore />]}/>
          <Route path='/explore' element={ <Explore/> }/>
          <Route path='/explore/:Category' element={ <Explore/> }/>
          <Route path='/my-gallery' element={<MyGallery isSignedIn={isSignedIn} authCred={authCred}/>}/>
          <Route path='/forgotPassword' element={ <PassChange code={0}/> }/>
          <Route path='/forgotPassword&spl' element={ <PassChange code={1}/> }/>
          <Route path='/u/:userID' element={<Profile authCred={authCred} isSignedIn={isSignedIn}/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
