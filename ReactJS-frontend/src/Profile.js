import { useParams } from "react-router-dom";
import AlbumView from "./albumView";
import { useEffect, useState } from "react";
var cryptoJS = require('crypto-js');

const Profile = ({authCred, isSignedIn}) => {
    var { userID } = useParams();
    var [imageList, setImageList] = useState(null);
    var [isLoading, setLoading] = useState(null);
    var owner = false;
    if(isSignedIn) {
        var bytes = cryptoJS.AES.decrypt(authCred, 'GiveMeJob');
        authCred = bytes.toString(cryptoJS.enc.Utf8);
        authCred = JSON.parse(authCred);
        if(authCred['uid'] == userID) {
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
            { isLoading && <AlbumView authCred={authCred} imageList={imageList} Private={0} owner={owner}/>}
            { !isLoading && <p>Loading...</p> }
        </div>
     );
}
 
export default Profile;