import { useState, useEffect } from "react";
import { showMessage, credentials, isSignedIn, categories, colors, getStorage, names } from "../utils";
import config from '../config.json';
import { DragAndDrop } from "../components/DragAndDrop";
import Checker from "../components/Checker";
import Tags from "../components/Tags";

const UploadForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [publishImage, setPublishImage] = useState('Yes');
    const [categoryList, setCategoryList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [file, setFile] = useState(null);

    if(!isSignedIn) window.location = '/auth';

    function upload(e) {
        setSubmitting(true);
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.delete("published");
        formData.append('uid', credentials.uid);
        formData.append('published', publishImage == 'Yes');
        formData.append('image', file);
        formData.append('categories', [...categoryList, ...colorList]);

        fetch(config.backend_server + '/images/upload-image', {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${getStorage(names.token)}`
            },
            body: formData
        }).then((response) => {
            if (response.ok) {
                showMessage("Image uploaded successfully");
            } else {
                showMessage("Error uploading image", "warning");
            }
            setSubmitting(false);
        });
    }

    return (
        <div className="form-wrapper">
            <h1>New Stuff</h1>
            <p>Introduce the world to your creativity</p>
            <form id="form" onSubmit={upload}>
                <div className="image-input-wrapper">
                    <DragAndDrop onFileSelect={setFile}/>
                    <div id="image-meta" className="flex-column">
                        <label>
                            Title
                        </label>
                        <input type="text" name="title" className="w-full" maxLength={40}/>
                        <label>
                            Description
                        </label>
                        <textarea name="description" className="w-full"/>
                    </div>
                </div>
                
                <h2>Enable image access</h2>

                <h3 className="inline">Publish Image:</h3>
                {'  '}
                <Checker 
                list={['Yes', 'No']} 
                onChange={setPublishImage}
                className="inline"
                />

                <h3>Add tags</h3>
                <div id="color-tags">
                    <h4>Colors</h4>
                    <Tags list={colors} setTags={setColorList}/>
                </div>
                <div id="category-tags">
                    <h4>Categories</h4>
                    <Tags list={categories} setTags={setCategoryList}/>
                </div>

                <button type="submit" className="btn-primary w-full" disabled={submitting}>Submit</button>
            </form>
        </div>
    );
}

export default UploadForm;
