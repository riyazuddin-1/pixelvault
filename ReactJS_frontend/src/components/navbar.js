import Authentication from './authentication';
import { isSignedIn, getAuthCredentials } from '../utils';

const Navbar = ({}) => {
    var appear = true;
    var userInfo;
    if (isSignedIn) {
        userInfo = getAuthCredentials();
        if(typeof(userInfo) == "string"){
            userInfo = JSON.parse(userInfo);
        }
        var myProfile = '/u/'+ userInfo['uid'];
    }
    function toggle() {
        if(appear) {
            document.getElementsByClassName('sidepanel')[0].style.display = 'block';
            appear = false;
        } else {
            document.getElementsByClassName('sidepanel')[0].style.display = 'none';
            appear = true;
        }
    }

    return (
        <div className='navbar'>
            <header>
                <div id="navLeft">
                    <p id="logo">Tasvir</p>
                </div>
                <p id="messageField"></p>
                <div id="navRight">
                    {isSignedIn ? <>
                        <span className='small-screen-nav'>
                            <a href="/">Home</a>
                            <a href="/explore/all">Explore</a>
                        </span>
                        <div id="navToggle">
                            <button onClick={() => toggle()} id="toggleBtn"><img src='../images/user-icon.svg'/></button>
                            <div className="sidepanel">
                                <span className='small-screen'>
                                <a href="/">🏡 Home</a>
                                <a href="/explore/all">🌟 Explore</a>
                                </span>
                                <a href={myProfile}>👤 Profile</a>
                                <hr/>
                                <a href="" id="signout" onClick={()=>{sessionStorage.removeItem('Credentials'); window.location.reload()}}>⬅️ Sign out</a>
                            </div>
                        </div>
                        </> :
                        <Authentication/>
                    }
                </div>
            </header>
        </div>
     );
}

export default Navbar;