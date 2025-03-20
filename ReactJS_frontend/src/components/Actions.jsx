import React, {useState, useEffect} from "react"

import like from '../assets/icons/like.svg';
import likeOutline from '../assets/icons/like-outline.svg';
import download from '../assets/icons/download.svg';
import warning from '../assets/icons/warning-circle.svg';
import deleteSymbol from '../assets/icons/delete.svg';
import { isSignedIn, showMessage, credentials, getStorage, names } from "../utils";
import config from '../config.json';

const Likes = ({id, className}) => {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatus() {
            const response = await fetch(config.backend_server + '/images/check-like', {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${getStorage(names.token)}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, uid: credentials.uid })
            });
            if (response.ok) setLiked(response.status === 200);
            else showMessage(await response.text(), "warning");
        }

        async function fetchCount() {
            const response = await fetch(config.backend_server + '/images/get-likes', {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${getStorage(names.token)}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, uid: credentials.uid })
            });
            if (response.ok) setCount(Number(await response.text()));
            else showMessage(await response.text(), "warning");
        }

        async function fetchData() {
            await fetchStatus();
            await fetchCount();
            setLoading(false);
        }

        fetchData();
    }, []);

    const handleLike = async () => {
        const response = await fetch(config.backend_server + '/images/handle-like', {
            method: "POST",
            headers: {
                "authorization": `Bearer ${getStorage(names.token)}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id })
        });

        if (response.ok) {
            setLiked(!liked);
            setCount(liked ? count - 1 : count + 1);
        } else {
            showMessage(await response.text(), "warning");
        }
    };

    return (
        <button
            className={`${className}`}
            onClick={handleLike}
            disabled={loading || count == null}
        >
            <img src={liked ? like : likeOutline} className="icon" />
            <span>{(!isSignedIn && liked) ? count + 1 : count}</span>
        </button>
    );
};

const Download = ({url, className}) => {
    const downloadImage = () => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = url.split('/').pop() || 'downloaded-image';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(err => showMessage('Download error', "warning"));
    };
    return (
        <button 
            className={className}
            onClick={() => downloadImage()}
            disabled={url == null}
        >
            <img src={download} className="icon"/>
        </button>
    )
}

const Actions = ({image, className, preview = false}) => {
    const deleteHandler = async () => {
        const response = await fetch(config.backend_server + '/images/delete-image', {
            method: "POST",
                headers: {
                    "authorization": `Bearer ${getStorage(names.token)}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: image._id })
        })
        if(response.ok) {
            showMessage(await response.text());
            window.location.reload();
        }
        else showMessage(await response.text(), "warning");
    }
  return (
    <div className="actions">
        <Likes id={image._id} className={className}/>
        <Download url={image.url} className={`${ preview ? 'end' : ''} ${className}`}/>
        {
            !preview && (
                image.uid !== credentials.uid ? 
                <button className={`end warning ${className}`}>
                    <img src={warning} className="icon"/>
                    <span style={{color: 'red'}}>report</span>
                </button> :
                <button className={`end warning ${className}`} onClick={deleteHandler}>
                    <img src={deleteSymbol} className="icon"/>
                    <span style={{color: 'red'}}>delete</span>
                </button>
            )
        }
    </div>
  )
};

export default Actions;
