function App() {
  const [file, setFile] = useState(null);
  const [imagesVideos, setImagesVideos] = useState([]);
  const [viewGallery, setViewGallery] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (viewGallery && verified) {
      fetchImagesVideos();
    }
  }, [viewGallery, verified]);

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
    <div className="background-gradient">
      {!verified && (
        <VerificationPage onVerificationSuccess={handleVerificationSuccess} />
      )}
      {verified && !viewGallery && (
        <div className="center-container">
          <div>
            <input type="file" accept="image/*, video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={() => setViewGallery(true)}>View Gallery</button>
            <button onClick={() => setVerified(false)}>Back to Home</button>
          </div>
        </div>
      )}
      {viewGallery && (
        <div className="gallery-container">
          <button onClick={() => setViewGallery(false)} className="back-to-upload">Back to Upload</button>
          <p>Total Images and Videos: {imagesVideos.length}</p>
          {imagesVideos.map((item, index) => (
            <div key={index} className="card">
              {item.contentType.startsWith('image') ? (
                <div className="image-container">
                  <img src={`data:${item.contentType};base64,${item.data}`} alt={`Image ${index}`} />
                </div>
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
      )}
    </div>
  );
}
