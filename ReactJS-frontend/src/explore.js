import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import AlbumView from './albumView';

const Explore = () => {
    var { Category } = useParams();
    var [imageList, setImageList] = useState(null);
    var [isLoading, setLoading] = useState(null);
    var categories = [
        'nature',
        'abstract',
        'minimalist',
        'movies',
        'celebrity',
        'anime',
        'technology',
        'landscape',
        'sports',
        'business',
        'people'
    ];
    if (!categories.includes(Category)) {
        Category = '';
    }
    function goto(locationPath) {
        window.location = '/explore/' + locationPath;
    }
    useEffect(() => {
        async function fetchImages() {
            var response = await fetch('https://tasvir-backend.vercel.app/exploreImages', {
                method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ category: Category })
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
            <div className="content explore">
                <h2>Categories</h2>
                <ul id="categoryList">
                    { categories.map((category, i) => (
                        <li onClick={()=> goto(category)} key={i}>{category}</li>
                    )) }
                </ul>
            </div>
            <div className='content'>
                { isLoading && <div>
                    <h2>Category: {Category ? Category : 'All'}</h2>
                    <AlbumView imageList={imageList}/>
                </div>}
                { !isLoading && <p>Loading...</p> }
            </div>
        </div>
     );
}
 
export default Explore;