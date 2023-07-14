import Authentication from './authentication';
var cryptoJS = require('crypto-js');

const Navbar = ({funcAuthCred, authCred, isSignedIn}) => {
    var appear = true;
    if (isSignedIn) {
        var bytesString = cryptoJS.AES.decrypt(authCred, 'GiveMeJob').toString(cryptoJS.enc.Utf8);
        var userInfo = JSON.parse(bytesString);
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
                {isSignedIn && <div id="navToggle">
                    <button onClick={() => toggle()} id="toggleBtn">&#9776;</button>
                    <div className="sidepanel">
                        <a href="/">🏡 Home</a>
                        <a href="/explore">🌟 Explore</a>
                        <a href={myProfile}>👤 Profile</a>
                        <a href="/my-gallery">🦚 My Gallery</a>
                        <hr/>
                        <a href="" id="signout" onClick={()=>{sessionStorage.removeItem('Credentials'); window.location.reload()}}>⬅️ Sign out</a>
                    </div>
                </div>}
                <span id="logo">Tasvir</span>
                </div>
                {!isSignedIn && <Authentication funcAuthCred={funcAuthCred}/>}
            </header>
        </div>
     );
}

export default Navbar;