import Home from './screens/Home';
import Auth from './screens/Authentication';
import Explore from './screens/Explore';
import Profile from './screens/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadForm from './screens/Upload';
import View from './screens/View';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <Router>
      <div className="App">
        <SearchProvider>
        <Routes>
          <Route path='' element={<Home />}/>
          <Route path='auth' element={<Auth />}/>
          <Route path='explore/*' element={ <Explore/> }/>
          <Route path='content/:id' element={ <View/> }/>
          <Route path='upload' element={ <UploadForm/> }/>
          <Route path='profile/*' element={<Profile/>}/>
        </Routes>
        </SearchProvider>
      </div>
    </Router>
  );
}

export default App;

// NOTE: "backend_server": "https://tasvir-backend.vercel.app",