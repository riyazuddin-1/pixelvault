import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import { credentials, getStorage, names, showMessage } from "../utils";
import config from '../config.json';

import Gallery from '../components/Gallery';
import Tags from "../components/Tags";
import Loading from "../components/Loading";
import Actions from "../components/Actions";

const View = () => {
    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        async function fetchImage() {
          try {
            const response = await fetch(config.backend_server + '/images/get-image-content', {
              method: "POST",
                  headers: {
                      "authorization": `Bearer ${getStorage(names.token)}`,
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: id, uid: credentials.uid ?? 'guest' })
            })
            if(response.ok) {
              setImage(await response.json());
              setLoading(false);
            } else {
              showMessage(await response.text(), "warning");
              setImage(null);
              setLoading(false);
            }
          } catch(e) {
            showMessage("Network error", "warning");
            setImage(null);
            setLoading(false);
          }
        }
        fetchImage();
    }, [])

    if(!id) return <>Invalid Content Id</>;
    if(loading) return <Loading/>;
    if(image === null) return <>Content not available</>;
  return (
    <div 
      className="image-view-page" 
    >
      <div className="image-view-container">
        <div className="image-view-wrapper">
          <p>Added by: <span className="highlight"><u>{image.uid}</u></span></p>
          <img className="image-view" src={image.url} loading="lazy"/>
          <Actions image={image} className={'btn-secondary'}/>
          <div>
            <h1>{image.title}</h1>
            <p>{image.description}</p>
          </div>
          <hr></hr>
          <label>Tags:</label>
          { image && <Tags list={image.categories} disabled={true}/>}
        </div>
      </div>
      <hr></hr>
      <div className="similar-images-container">
        <Gallery request={{ access: "viewer", categories: image.categories, uid: credentials.uid ?? 'guest' }}/>
      </div>
    </div>
  )
};

export default View;
