import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file for styling

function VerificationPage({ onVerificationSuccess }) {
  const [code, setCode] = useState('');

  const handleVerification = () => {
    // Perform verification here, for demonstration, let's hardcode the code
    if (code === '0516') {
      onVerificationSuccess();
    } else {
      alert('Incorrect code. Please try again.');
    }
  };

  return (
    <div>
      <label htmlFor="codeInput">CODE:</label>
      <input
        type="text"
        id="codeInput"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={4}
      />
      <button onClick={handleVerification}>Verify</button>
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [imagesVideos, setImagesVideos] = useState([]);
  const [viewGallery, setViewGallery] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (viewGallery) {
      fetchImagesVideos();
    }
  }, [viewGallery]);

  const fetchImagesVideos = async () => {
    try {
      const response = await axios.get('https://mserver-lzs3.onrender.com/imagesvideos');
      setImagesVideos(response.data);
    } catch (error) {
      console.error('Error fetching images/videos:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('https://mserver-lzs3.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully');
      setViewGallery(true); // Switch to gallery view after upload
    } catch (error) {
      alert('Error uploading file');
      console.error(error);
    }
  };

  const handleVerificationSuccess = () => {
    setVerified(true);
  };

  return (
    <div>
      {!verified && <VerificationPage onVerificationSuccess={handleVerificationSuccess} />}
      {verified && !viewGallery && (
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
          <button onClick={() => setViewGallery(true)}>View Gallery</button>
        </div>
      )}
      {viewGallery && (
        <div>
          <button onClick={() => setViewGallery(false)}>Back to Upload</button>
          <div className="gallery-container">
            {imagesVideos.map((item, index) => (
              <div key={index} className="card">
                {item.contentType.startsWith('image') ? (
                  <img src={`data:${item.contentType};base64,${item.data}`} alt={`Image ${index}`} />
                ) : (
                  <video controls className="video">
                    {['mp4', 'mov'].map((format, formatIndex) => (
                      <source
                        key={formatIndex}
                        src={`data:${item.contentType};base64,${item.data}`}
                        type={`video/${format}`}
                      />
                    ))}
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
