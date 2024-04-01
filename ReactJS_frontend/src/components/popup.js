import React, { useEffect, useState } from "react"

const Popup = ({ showPopup = 0, popupPlaceholder, popupComponent, buttonCSS }) => {
    const [showPopupOption, setPopupOption] = useState(showPopup);
    function showPrompt() {
        document.getElementById('popup').style.display = 'block';
        document.getElementById('backdrop').style.display = 'block';
    }
    function cancelPrompt() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('backdrop').style.display = 'none';
    }

    useEffect(() => {
        if(showPopupOption) {
            showPrompt();
        } else {
            cancelPrompt();
        }
    }, [showPopupOption])

  return (
    <div id="popupContainer">
        {/* { !showPopupOption && <button onClick={ () => setPopupOption(true) } style={ buttonCSS }>{ popupPlaceholder }</button>} */}
        <button onClick={ () => setPopupOption(true) } style={ buttonCSS }>{ popupPlaceholder }</button>
        <div id="backdrop" onClick={()=> setPopupOption(false)}></div>
        <div className="popup" id="popup">
            { popupComponent }
        </div>
    </div>
  )
};

export default Popup;