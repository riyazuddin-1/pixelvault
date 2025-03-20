import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const DragAndDrop = ({ defaultValue, onFileSelect, placeholder }) => {
  const [imagePreview, setImagePreview] = useState(defaultValue);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      // Check if the file is a PNG or JPG and is less than or equal to 3MB
      if (file) {
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
          alert('Only PNG or JPG files are accepted!');
          return;
        }
        if (file.size > 3 * 1024 * 1024) {
          alert('File size must be 3MB or less!');
          return;
        }

        setImagePreview(URL.createObjectURL(file));
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      id='drag-and-drop'
      className={`drag-and-drop ${isDragActive ? 'drag-active' : ''} ${imagePreview ? '': 'preview-inactive'}`}
    >
      <input {...getInputProps()} className="file-input" />
      {isDragActive ? (
        <p className="message dragging">Drop the image here...</p>
      ) : (
        <div className="message text-center">
          {imagePreview ? (
            <>
              Click to <span className="bold">Change file</span>
            </>
          ) : (
            <>
              <div className="file-info">
                Click to add <span className="bold">{placeholder}</span>
                <p className="pl-1">
                  (or)
                  <br />
                  drag and drop
                </p>
              </div>
              <p className="size-info">PNG or JPG up to 3MB</p>
            </>
          )}
        </div>
      )}
      {imagePreview && (
        <div className="preview-container inline">
          <img src={imagePreview} alt="Preview"/>
          <button
            id='close'
            className="inline br-full square w-fc"
            onClick={(e) => {
              e.stopPropagation();
              setImagePreview(null);
              onFileSelect(null);
            }}
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};
