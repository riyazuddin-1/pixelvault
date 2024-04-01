import { useEffect, useState } from "react";
import { showMessage } from "../utils";
import config from '../config.json';

const CategoryItem = ({ categoryTitle, categoryList }) => {
    const [selected, setSelected] = useState(false);
    useEffect(() => {
        if (selected) {
            categoryList[categoryTitle] = true;
        } else {
            delete categoryList[categoryTitle];
        }
    }, [selected])
    return (
        <li className={`category-list-item ${selected ? "selected-category-list-item" : ""}`} id={categoryTitle} onClick={() => setSelected(!selected)}>{categoryTitle}</li>
        )
}

const UploadPopup = ({ userInfo}) => {
    var categoryList = {};

    function upload(e) {
        e.preventDefault();
        if(Object.keys(categoryList).length) {
            const form = e.currentTarget;
            var formData = new FormData(form);
            formData.append('userID', userInfo['uid']);
            formData.append('categories', JSON.stringify(categoryList));
            console.log(Object.fromEntries(formData.entries()));
            fetch(config.backend_server + '/images/upload-image', {
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
    
    return (
        <>
        <form id="uploader" onSubmit={upload}>
            <input type="file" accept="image/png, image/gif, image/jpeg" placeholder="Choose file" name="image" id="file" required/>
            <hr/>
            <p><b>Image access</b></p>
            <input className="w-fc" type="radio" id="access" name="Private" defaultValue="true" required/>
            <label htmlFor="access">Private</label>
            <br />
            <input className="w-fc" type="radio" id="access-to-all" name="Private" defaultValue="false" required/>
            <label htmlFor="access-to-all">Public</label>
            <br />
            <p><b>Select category of the image</b></p>
            <ul id="categorySelect">
                <CategoryItem categoryTitle={'nature'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'abstract'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'minimalist'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'movies'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'celebrity'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'anime'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'technology'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'landscape'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'sports'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'business'} categoryList={categoryList}/>
                <CategoryItem categoryTitle={'people'} categoryList={categoryList}/>
            </ul>
            <button type="submit" id="uploadBtn">Submit</button>
        </form>
        </>
    );
}

export default UploadPopup;