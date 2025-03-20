import { useEffect, useState, useRef, useCallback } from "react";
import { getStorage, names, showMessage } from "../utils";
import config from '../config.json';

import Actions from "./Actions";
import Loading from "./Loading";

const Image = ({ data }) => {
    const [showPreview, setShowPreview] = useState(false);
    
    return (
        <div className="image-wrapper">
            <div 
                className="image" 
                onMouseOver={() => setShowPreview(true)}
                onMouseLeave={() => setShowPreview(false)}
            >
                <div className={`preview ${showPreview ? 'visible' : ''}`}>
                    <button 
                        className="btn-secondary" 
                        onClick={() => window.location = `/content/${data._id}`}
                    >
                        View
                    </button>
                </div>
                <img src={data.url} loading="lazy" />
            </div>
            <Actions image={data} className={"btn-small"} preview />
        </div>
    );
}

const Gallery = ({ request }) => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const fetchImages = useCallback(async () => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(config.backend_server + '/images/get-images', {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${getStorage(names.token)}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    ...request, 
                    ...( !request.access && {access: "viewer"}),
                    limit: 20, 
                    skip: page * 20 
                })
            });

            if (response.ok) {
                const newImages = await response.json();
                setImages(prev => [...prev, ...newImages]);
                setHasMore(newImages.length === 20);
            } else {
                setImages(null);
                showMessage(await response.text(), "warning");
            }
            setLoading(false);
        } catch (error) {
            setImages(null);
            setLoading(false);
            showMessage("Error fetching images", "warning");
        }
    }, [page, request, hasMore]);

    useEffect(() => {
        fetchImages();
    }, [page]);

    useEffect(() => setPage(0), [request]);

    const lastImageRef = useCallback(node => {
        if (!hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [hasMore]);

    if(images === null) return (
        <>
        <h1>Error while fetching the data</h1>
        <p>I am really sorry about that, currently working on it..</p>
        </>
    )

    if(loading) return <Loading/>;

    return (
        <div>
            {images.length ? (
                <div className="gallery">
                    {images.map((image, index) => (
                        <Image 
                            key={image._id} 
                            data={image}
                        />
                    ))}
                    {hasMore && <div ref={lastImageRef} style={{ height: "1px" }} />}
                </div>
            ) : (
                <p>No data found</p>
            )}
        </div>
    );
}

export default Gallery;
