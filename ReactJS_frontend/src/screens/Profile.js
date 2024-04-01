import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { isSignedIn, getAuthCredentials } from '../utils';
import AlbumView from "../components/albumView";
import MyGallery from "../components/myGallery";
import Popup from "../components/popup";
import UploadPopup from "../components/uploader";
import config from '../config.json';

const Profile = () => {
    var { userID } = useParams();
    var [username, setUsername] = useState('undefined');
    var [userExists, setUserExists] = useState(false);
    var [imageList, setImageList] = useState(null);
    var [isLoading, setLoading] = useState(true);
    var [Public, setPublic] = useState(true);
    var [selectedFolder, setFolder] = useState("public");

    var [owner, setOwnerAccess] = useState(false);
    var userInfo;

    function toggleFolder(toggle) {
        setPublic(toggle);
        setFolder( toggle ? "public" : "private")
    }

    useEffect(()=>{
        async function userDetails() {
            // try {
                var response = await fetch(config.backend_server + '/auth/user-details', {
                    method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userID: userID })
                })
                if(response.ok) {
                    var result = await response.json();
                    setUserExists(true);
                    setUsername(result.username);
                    if(isSignedIn) {
                        userInfo = getAuthCredentials();
                        if(typeof(userInfo) == "string"){
                            userInfo = JSON.parse(userInfo);
                        }
                        console.log(userInfo);
                        if(userInfo['uid'] == userID) {
                            setOwnerAccess(true);
                        }
                    }
                }
            // }
            // catch (e) {
            //     console.log('UserID does not exist');
            // }
        }
        async function fetchImages() {
            var response = await fetch(config.backend_server + '/images/get-images', {
                method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userID: userID })
            })
            if(response.ok) {
                var imagesArray = await response.json();
                if(imagesArray) {
                    setLoading(false);
                    setImageList(imagesArray);
                }
            }
        }
        userDetails();
        if(userExists)
        fetchImages();
    }, [userExists])

    const styler = {
        position: 'fixed',
        bottom: '10px',
        right: '20px',
        zIndex: '2'
    };

    return ( 
        <div className="profile content">
            { userExists ? <>
            <div id="profile-content">
                <h3>{ username }</h3>
                <p>&#64;{ userID }</p>
                { !isLoading && <p>Total images: { imageList.length }</p>}
            </div>
            { owner && <div id="folder-toggle">
                <span onClick={() => toggleFolder(true)}><img className={`icon ${ selectedFolder == "public" ? "selectedFolder" : "" }`} src='../images/photographer.svg'/></span>
                | 
                <span onClick={() => toggleFolder(false)}><img className={`icon ${ selectedFolder == "private" ? "selectedFolder" : "" }`}  src='../images/detective.svg'/></span>
            </div>}
            <hr/>
            { owner && <Popup popupComponent={ <UploadPopup userInfo={userInfo}/> } popupPlaceholder={"Upload"} buttonCSS={styler}/>}
            { selectedFolder == "public" ?
            <>
                { !isLoading ? <AlbumView imageList={imageList} owner={owner}/> : 
                    isLoading && <p>Loading...</p>
                }
            </> : 
                <MyGallery/>
            }
            </> : 
                <p>The id {userID} does not exist</p>
            }
        </div>
     );
}
 
export default Profile;