import React, { useEffect, useState } from "react";

const Loading = () => {
  const [status, setStatus] = useState('Loading');
  useEffect(() => {
    const messages = [
      { msg: "Taking longer than expected..", time: 6000 },
      { msg: "First request delay from backend server setup..", time: 10000 },
      { msg: "Please wait..", time: 15000 }
    ];
  
    messages.forEach(({ msg, time }) => setTimeout(() => setStatus(msg), time));
  }, []);
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div>{status}</div>

      <style>{`
        /* Style for the container to center the spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh; /* Full viewport height */
        }

        /* Style for the spinner */
        .loading-spinner {
          width: 2rem; /* 8px */
          height: 2rem; /* 8px */
          border: 2px solid #dec5f8; /* Gray border */
          border-top: 2px solid #705b86; /* Orange top border */
          border-radius: 50%;
          animation: spin 1s linear infinite; /* Animation for spinning */
        }

        /* Keyframe for the spinning animation */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
