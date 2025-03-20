import React, { useEffect, useState } from "react";
import { colors } from "../utils";

const Tag = ({ value, checklist, setChecklist, disabled }) => {

    const handleClick = () => {
        if (disabled) return;

        setChecklist(prevChecklist => {
            // If the value exists in the checklist, remove it, otherwise add it
            if (prevChecklist[value]) {
                // Remove the value from the checklist
                const { [value]: _, ...rest } = prevChecklist;
                return rest;
            } else {
                // Add the value to the checklist
                return { ...prevChecklist, [value]: true };
            }
        });
    };

    const isSelected = checklist[value] || false; // Check if the value exists in the checklist

    return (
        <span
            className={`tag ${!disabled ? (isSelected ? "active" : "") : ""}`}
            style={{
                order: colors.includes(value) ? 1 : 2
            }}
            id={value}
            onClick={handleClick}
        >
            {colors.includes(value) && <span className="color-label" style={{ color: value }}>◑ </span>}
            {value}
        </span>
    );
};

const Tags = ({ list, setTags, disabled = false }) => {
    const [checklist, setChecklist] = useState({});

    const clear = () => setChecklist({});

    useEffect(() => {
        if (setTags) {
            setTags(Object.keys(checklist));
        }
    }, [checklist, setTags]);

    return (
        <div id="" className="tag-wrapper">
            {list.map((tag) => (
                <Tag
                    value={tag}
                    checklist={checklist}
                    setChecklist={setChecklist}
                    disabled={disabled}
                    key={tag}
                />
            ))}
            { !disabled && <span className="tag highlight" style={{order: 10}} onClick={clear}>clear</span>}
        </div>
    );
};

export default Tags;