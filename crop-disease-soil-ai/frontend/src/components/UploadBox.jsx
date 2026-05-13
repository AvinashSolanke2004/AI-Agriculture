import { useState } from 'react';

function UploadBox({ label, name, onChange }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      onChange(e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      // Create a synthetic event-like object for the parent handler
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.getElementById(`upload-${name}`);
      if (input) {
        input.files = dataTransfer.files;
        const syntheticEvent = { target: input };
        onChange(syntheticEvent);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label} <span className="text-red-500">*</span></label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative border-2 border-dashed border-primary-300 rounded-xl p-6 text-center hover:border-primary-500 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer group"
      >
        <input
          type="file"
          id={`upload-${name}`}
          name={name}
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt={`Preview of ${label}`}
              className="mx-auto max-h-[200px] rounded-lg shadow-md object-contain"
            />
            <p className="text-sm text-primary-600 font-medium truncate px-4">{fileName}</p>
            <p className="text-xs text-gray-400">Click or drop to replace</p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            <div className="mx-auto w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadBox;
