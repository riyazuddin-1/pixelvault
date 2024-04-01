import { useState } from 'react';
import { isSignedIn, getAuthCredentials, setAuthCredentials, showMessage } from '../utils';
import AlbumView from "./albumView";
import PassChange from './passChange';
import config from '../config.json';

const MyGallery = () => {
    var userID = '';
    var splPass = '';
    var [verified, setVerified] = useState(false);
    var [imageList, setImageList] = useState(null);
    var [knowsPass, setuserKnowsPass] = useState(true);
    var userInfo;
    if(isSignedIn) {
        userInfo = getAuthCredentials();
        if(typeof(userInfo) == "string"){
            userInfo = JSON.parse(userInfo);
        }
        userID = userInfo['uid'];
        if(userInfo['splPass']) {
            splPass = userInfo['splPass'];
        }
    } else {
        window.location = '/';
    }

    async function verify() {
        var data = {
            userID: userID,
            splPass: document.getElementById('splPass').value
        }
        var response = await fetch(config.backend_server + '/auth/check-special-password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            var imagesArray = await response.json();
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
        var response = await fetch(config.backend_server + '/auth/create-special-password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            userInfo.splPass = document.getElementById('splPass').value;
            setAuthCredentials(JSON.stringify(userInfo));
        }
    }
    return (
        <div className="">
            { verified ?
                <AlbumView userInfo={userInfo} imageList={imageList} owner={true} Private={1}/>
                :
                <div className="verification">
                { knowsPass ?
                    <div id="splPassword" >
                        <p>This album is password protected</p>
                        { splPass ?
                            <div>
                            <fieldset>
                                <legend>Enter album password</legend>
                                <input type='password' placeholder="Album Password" id="splPass"/>
                            </fieldset>
                            <p>Forgot password? <span className='link' onClick={() => setuserKnowsPass(false)}>Click here</span></p>
                            <button type="button" onClick={()=>verify()}>Verify</button>
                            </div>
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
                    <>
                    <span className='link' onClick={() => setuserKnowsPass(true)}>&lt; back</span>
                    <PassChange mailID={userInfo['mailID']} code={1}/>
                    </>
                }
                </div>
            }
        </div>
    );
}
 
export default MyGallery;