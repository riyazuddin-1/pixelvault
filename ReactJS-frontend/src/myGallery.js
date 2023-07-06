import AlbumView from "./albumView";
import Authentication from "./authentication";
import { useState } from 'react';
var cryptoJS = require('crypto-js');

const MyGallery = ({isSignedIn, authCred}) => {
    var userID = '';
    var splPass = '';
    var [verified, setVerified] = useState(false);
    var [imageList, setImageList] = useState(null);
    if(isSignedIn) {
        var bytes = cryptoJS.AES.decrypt(authCred, 'GiveMeJob');
        authCred = bytes.toString(cryptoJS.enc.Utf8);
        authCred = JSON.parse(authCred);
        userID = authCred['uid'];
        if(authCred['splPass']) {
            splPass = authCred['splPass'];
        }
    }

    function showMessage(message) {
        const msgField = document.getElementById('messageField');
        msgField.style.display = 'block';
        msgField.innerHTML = message;
        setTimeout(()=>{
            msgField.style.display = 'none';
        }, 10000)
    }

    async function verify() {
        var data = {
            userID: userID,
            splPass: document.getElementById('splPass').value
        }
        var response = await fetch('https://tasvir-backend.vercel.app/specialPassword', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            var result = await fetch('https://tasvir-backend.vercel.app/getImages', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userID: userID, Private: 1})
            })
            var imagesArray = await result.json();
            setImageList(imagesArray);
            setVerified(true);
        } else {
            var msg = await response.text();
            showMessage(msg);
        }
    }
    async function createSplPass() {
        var data = {
            userID: userID,
            splPass: document.getElementById('splPass').value
        }
        var response = await fetch('https://tasvir-backend.vercel.app/createSpecialPassword', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            authCred['splPass'] = document.getElementById('splPass').value;
            sessionStorage.setItem('Credentials', cryptoJS.AES.encrypt(JSON.stringify(authCred), 'GiveMeJob').toString());
            window.location.reload();
        }
    }
    return (
        <div className="content">
            { !verified && <div className="verification">
                <p className="msgField" id="messageField"></p>
                { isSignedIn && <div id='mygallery'>
                    <div id="splPassword" >
                        <p>This album is password protected</p>
                        { splPass && <form>
                            <fieldset>
                                <legend>Enter album password</legend>
                                <input type='password' placeholder="Album Password" id="splPass"/>
                            </fieldset>
                            <p>Forgot password? <span onClick={() => window.location = '/forgotPassword&spl'} style={{color: 'blue', cursor: 'pointer'}}>Click here</span></p>
                            <button type="button" onClick={()=>verify()}>Verify</button>
                        </form>}
                        { !splPass && <form style={{ display: 'block' }}>
                            <fieldset>
                                <legend>Create album password</legend>
                                <input type='password' placeholder="Album Password" id="splPass"/>
                                <input type="password" placeholder='Confirm Password' id="confirmSplPass"/>
                            </fieldset>                        
                            <button type="button" onClick={()=>createSplPass()}>Create Password</button>
                        </form>}
                    </div>
                </div>}
                { !isSignedIn && <div className="SignIn" style={{ textAlign: 'center' }}>
                    <p>Sign In to View this page</p>
                    <Authentication/>
                </div>}
            </div>}
            { verified && <AlbumView authCred={authCred} imageList={imageList} owner={true} Private={1}/> }
        </div>
    );
}
 
export default MyGallery;