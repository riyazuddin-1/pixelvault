import { useState } from 'react';
import AlbumView from "./albumView";
import Authentication from "./authentication";
var cryptoJS = require('crypto-js');

const MyGallery = ({isSignedIn, authCred}) => {
    var userID = '';
    var splPass = '';
    var [verified, setVerified] = useState(false);
    var [imageList, setImageList] = useState(null);
    var userInfo;
    if(isSignedIn) {
        var bytesString = cryptoJS.AES.decrypt(authCred, 'GiveMeJob').toString(cryptoJS.enc.Utf8);
        userInfo = JSON.parse(bytesString);
        userID = userInfo['uid'];
        if(userInfo['splPass']) {
            splPass = userInfo['splPass'];
        }
    } else {
        window.location = '/';
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
            userInfo['splPass'] = document.getElementById('splPass').value;
            sessionStorage.setItem('Credentials', cryptoJS.AES.encrypt(JSON.stringify(userInfo), 'GiveMeJob').toString());
            window.location.reload();
        }
    }
    return (
        <div className="content">
            { verified ?
                <AlbumView userInfo={userInfo} imageList={imageList} owner={true} Private={1}/>
                :
                <div className="verification">
                <p className="msgField" id="messageField"></p>
                { isSignedIn ?
                    <div id="splPassword" >
                        <p>This album is password protected</p>
                        { splPass ?
                            <form>
                            <fieldset>
                                <legend>Enter album password</legend>
                                <input type='password' placeholder="Album Password" id="splPass"/>
                            </fieldset>
                            <p>Forgot password? <span onClick={() => window.location = '/forgotPassword&spl'} style={{color: 'blue', cursor: 'pointer'}}>Click here</span></p>
                            <button type="button" onClick={()=>verify()}>Verify</button>
                            </form>
                            :
                            <form style={{ display: 'block' }}>
                            <fieldset>
                                <legend>Create album password</legend>
                                <input type='password' placeholder="Album Password" id="splPass"/>
                                <input type="password" placeholder='Confirm Password' id="confirmSplPass"/>
                            </fieldset>                        
                            <button type="button" onClick={()=>createSplPass()}>Create Password</button>
                            </form>
                        }
                    </div>
                    :
                    <div className="SignIn" style={{ textAlign: 'center' }}>
                        <p>Sign In to View this page</p>
                        <Authentication/>
                    </div>
                }
                </div>
            }
        </div>
    );
}
 
export default MyGallery;