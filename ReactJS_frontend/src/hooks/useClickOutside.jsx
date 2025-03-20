import { useEffect, useRef } from 'react';

function useClickOutside(callback) {
    const elementRef = useRef(null);

    useEffect(() => {
        // Function to handle clicks outside
        const handleClickOutside = (event) => {
            if (elementRef.current && !elementRef.current.contains(event.target)) {
                callback();
            }
        };

        // Add event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return elementRef;
}

export default useClickOutside;
