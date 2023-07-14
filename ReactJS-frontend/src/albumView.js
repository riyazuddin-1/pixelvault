import { useState } from "react";

const AlbumView = ({userInfo, Private, owner, imageList}) => {
    var [images, setImages] = useState(imageList);
    function uploadPrompt() {
        document.getElementById('uploadpopup').style.display = 'block';
        document.getElementsByClassName('images')[0].style.display = 'none';
        document.getElementById('backdrop2').style.display = 'block';
    }
    function cancelPrompt2() {
        document.getElementById('uploadpopup').style.display = 'none';
        document.getElementsByClassName('images')[0].style.display = 'block';
        document.getElementById('backdrop2').style.display = 'none';
    }
    function showMessage(message) {
        const msgField2 = document.getElementById('messageField2');
        msgField2.style.display = 'block';
        msgField2.innerHTML = message;
        setTimeout(()=>{
            msgField2.style.display = 'none';
        }, 5000)
    }
    var categoryList = {};
    function categoryArray(id) {
        var category = document.getElementById(id);
        if(!category.value) {
            category.style.backgroundColor = 'white';
            category.value = true;
            categoryList[id] = true;
        } else {
            category.style.backgroundColor = 'rgb(101, 224, 136)';
            category.value = false;
            delete categoryList[id];
        }
    }

    function upload(e) {
        e.preventDefault();
        if(Object.keys(categoryList).length) {
            const form = e.currentTarget;
            var formData = new FormData(form);
            formData.append('userID', userInfo['uid']);
            formData.append('categories', JSON.stringify(categoryList));
            formData.append('private', Private);
            fetch('https://tasvir-backend.vercel.app/upload', {
                method: 'POST',
                body: formData
            }).then((response)=> {
                if(response.ok) {
                    showMessage("Image uploaded");
                }
            })
        } else {
            showMessage('Select atleast one category');
        }
    }

    function deleteHandler(id) {
        const newImages = images.filter(image => image._id != id);
        setImages(newImages);
        fetch('https://tasvir-backend.vercel.app/deleteImage', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageID: id })
        }).then(()=>{
            showMessage('image deleted');
        })
    }

    const styler = {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        color: 'black',
        border: '1px solid silver',
        zIndex: '2'
    };
    return (
        <div className="content">
            { owner && <button onClick={ () => uploadPrompt() } style={ styler }>Upload</button>}
            <div className="gallery">
                <ul className="images">
                    { images && images.map((image) => (
                        <li className="card" key={image._id}>
                            <img src= { 'data:'+image.img.contentType+';base64,'+image.img.data.toString('base64') }/>
                            <div className="imgBtns">
                                <a
                                href={'data:'+image.img.contentType+';base64,'+image.img.data.toString('base64')}
                                download>
                                    <img src='../images/download.svg'/>
                                </a>
                                { owner && <a onClick={()=>deleteHandler(image._id)}>
                                        <img
                                            src='../images/delete.svg'
                                            style={ {marginLeft: '10px', backgroundColor: 'rgb(252, 85, 85)'} }
                                        />
                                    </a> }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div id="backdrop2" onClick={()=>cancelPrompt2()}></div>
            <div id='uploadpopup' className="popup">
                <p className="msgField" id='messageField2'></p>
                <form onSubmit={upload}>
                    <input type="file" accept="image/png, image/gif, image/jpeg" placeholder="Choose file" name="image" id="file" required/>
                    <hr/>
                    <p><b>Select category of the image</b></p>
                    <ul id="categorySelect">
                        <li onClick={ () => categoryArray('nature') } id="nature">nature</li>
                        <li onClick={ () => categoryArray('abstract')} id="abstract">abstract</li>
                        <li onClick={ () => categoryArray('minimalist')} id="minimalist">minimalist</li>
                        <li onClick={ () => categoryArray('movies')} id="movies">movies</li>
                        <li onClick={ () => categoryArray('celebrity')} id="celebrity">celebrity</li>
                        <li onClick={ () => categoryArray('anime')} id="anime">anime</li>
                        <li onClick={ () => categoryArray('technology')} id="technology">technology</li>
                        <li onClick={ () => categoryArray('landscape')} id="landscape">landscape</li>
                        <li onClick={ () => categoryArray('sports')} id="sports">sports</li>
                        <li onClick={ () => categoryArray('business')} id="business">business</li>
                        <li onClick={ () => categoryArray('people')} id="people">people</li>
                    </ul>
                    <button type="submit" id="uploadBtn">Submit</button>
                </form>
            </div>
        </div>
    );
}
export default AlbumView;