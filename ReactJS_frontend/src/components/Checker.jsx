import React, { useEffect, useState } from "react"

const Checker = ({ list, onChange, className = '' }) => {
    const [selected, setSelected] = useState(list[0]);
    useEffect(() => onChange(selected), [selected]);
  return (
    <div className={`checker ${className}`}>
      {
        list.map((item) => (
            <span 
                key={item} 
                className={`item ${selected == item ? 'checked': ''}`}
                onClick={() => setSelected(item)}
            >
                {item}
            </span>
        ))
      }
    </div>
  )
};

export default Checker;
