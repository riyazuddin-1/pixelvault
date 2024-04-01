import { useState } from "react";
import { showMessage } from "../utils";
import config from '../config.json';

const Image = ({imageUrl, deleteHandler, imageId, owner}) => {
    const [loading, setLoading] = useState(true);
    return (
    <>
            <img src= { imageUrl } onLoad={() => setLoading(false)}/>
            { !loading && <div className="imgBtns">
                <a
                href={imageUrl}
                download>
                    <img src='../images/download.svg'/>
                </a>
                { owner && <a onClick={()=>deleteHandler(imageId)}>
                        <img
                            src='../images/delete.svg'
                            style={ { backgroundColor: 'rgb(252, 85, 85)'} }
                        />
                    </a> }
            </div>}
        </>
    );
}

const AlbumView = ({owner, imageList}) => {
    var [images, setImages] = useState(imageList);

    function deleteHandler(id) {
        const newImages = images.filter(image => image._id != id);
        setImages(newImages);
        fetch(config.backend_server + '/images/delete-image', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageID: id })
        }).then(()=>{
            showMessage('image deleted');
        })
    }

    return (
        <div className="album-view">
            { imageList.length ? <div className="gallery">
                <ul className="images">
                    { images && images.map((image) => (
                        <li className="card" key={image._id}>
                            <Image imageUrl={image.imageUrl}  deleteHandler={deleteHandler} imageId={image.public_id} owner={owner}/>
                        </li>
                    ))}
                </ul>
            </div> :
            <p>No data found</p>
            }
        </div>
    );
}
export default AlbumView;