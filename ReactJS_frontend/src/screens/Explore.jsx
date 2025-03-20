import { useNavigate, useParams } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Gallery from '../components/Gallery';
import Navbar from '../components/Navbar';
import { useSearch } from '../contexts/SearchContext';
import { credentials, isSignedIn } from '../utils';

const Favourites = ({request}) => {
    return (
        <Gallery
            request={{ 
                sort: 'favourites', 
                ...request,
                ...(isSignedIn && { uid: credentials.uid })
            }}
        />
    );
}

const SortedGallery = ({request}) => {
    const { sort } = useParams();
    if(!['popular', 'random'].includes(sort)) return <>Not found</>;
    return (
        <Gallery
            request={{ sort, ...request }}
        />
    )
}

const Explore = () => {
    const {searchQuery} = useSearch();
    const navigate = useNavigate();

    return (
        <div id='explore'>
                <Navbar/>
                <div className='prime-layout'>
                    <div className="panel-left explore">
                        <p 
                            className={`explore label ${window.location.pathname == '/explore' ? 'active': ''}`}
                            onClick={() => navigate('/explore')}
                        >
                            ✨ New
                        </p>
                        <p 
                            className={`explore label ${window.location.pathname == '/explore/popular' ? 'active': ''}`}
                            onClick={() => navigate('/explore/popular')}
                        >
                            🔥 Popular
                        </p>
                        <p 
                            className={`explore label ${window.location.pathname == '/explore/random' ? 'active': ''}`}
                            onClick={() => navigate('/explore/random')}
                        >
                            🪄 Random
                        </p>
                        <p 
                            className={`explore label ${window.location.pathname == '/explore/favourites' ? 'active': ''}`}
                            onClick={() => navigate('/explore/favourites')}
                        >
                            💗 Favourites
                        </p>
                        {/* <label>Categories</label>
                        <ul>
                            { 
                            categories.map(category => (
                                <li className={``} onClick={()=> goto(category)} key={category}>{category}</li>
                            ))
                            }
                        </ul> */}
                    </div>
                    <div className='content'>
                        <div>
                        <Routes>
                            <Route 
                            path='' 
                            element = {
                                <Gallery
                                    request={{ searchQuery }}
                                />
                            }
                            />
                            <Route 
                            path='/favourites'
                            element = {<Favourites request={searchQuery}/>}
                            />
                            <Route 
                            path='/:sort'
                            element = {<SortedGallery request={searchQuery}/>}
                            />
                        </Routes>
                        </div>
                    </div>
                    <div className='panel-right'>
                        <h1>Explore Stunning Art</h1>
                        <p>Discover a vast collection of photography, digital art, and graphic design on PixelVault. Browse through unique creations from talented artists worldwide, get inspired, and showcase your own work. Join a global creative community today and connect with like-minded creators.</p>
                    </div>
                </div>
        </div>
     );
}
 
export default Explore;