import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AlbumView from "./albumView";
var cryptoJS = require('crypto-js');

const Profile = ({authCred, isSignedIn}) => {
    var { userID } = useParams();
    var [imageList, setImageList] = useState(null);
    var [isLoading, setLoading] = useState(null);
    var owner = false;
    var userInfo;
    if(isSignedIn) {
        var bytesString = cryptoJS.AES.decrypt(authCred, 'GiveMeJob').toString(cryptoJS.enc.Utf8);
        userInfo = JSON.parse(bytesString);
        if(userInfo['uid'] == userID) {
            owner = true;
        }
    }
    useEffect(()=>{
        async function fetchImages() {
            var response = await fetch('https://tasvir-backend.vercel.app/getImages', {
                method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userID: userID, Private: 0 })
            })
            if(response.ok) {
                var imagesArray = await response.json();
                if(imagesArray) {
                    setLoading(true);
                    setImageList(imagesArray);
                }
            }
        }
        fetchImages();
    }, [])
    return ( 
        <div>
            { isLoading && <AlbumView userInfo={userInfo} imageList={imageList} Private={0} owner={owner}/>}
            { !isLoading && <p>Loading...</p> }
        </div>
     );
}
 
export default Profile;