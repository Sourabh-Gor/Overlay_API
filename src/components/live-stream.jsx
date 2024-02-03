import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

const Livestream = () => {
  const [overlayData, setOverlayData] = useState([]);
  const [newOverlay, setNewOverlay] = useState({
    content: '',
    position: { top: 0, left: 0 },
    size: { width: 100, height: 50 },
  });
  const [selectedOverlayId, setSelectedOverlayId] = useState(null); 
  const [updateContentInput, setUpdateContentInput] = useState('');
  const [updatePositionInput, setUpdatePositionInput] = useState({ top: 0, left: 0 });
  const [updateSizeInput, setUpdateSizeInput] = useState({ width: 100, height: 50 });

  // Fetch overlay data from backend every render
  const fetchOverlayData = () => {
    axios.get('http://localhost:5000/api/overlays')
      .then(response => setOverlayData(response.data))
      .catch(error => console.error(error));
  };

  // Fetch overlay data on component mount
  useEffect(() => {
    fetchOverlayData();
  }, []);  


  const videoPlayerWidth = 640; // Replace with the actual width of your video player
  const videoPlayerHeight = 360; // Replace with the actual height of your video player

  const handleCreateOverlay = () => {
    axios.post('http://localhost:5000/api/overlays', newOverlay)
      .then(response => {
        setOverlayData([...overlayData, response.data]);
        setNewOverlay({
          content: '',
          position: { top: 0, left: 0 },
          size: { width: 100, height: 50 },
        });
      })
      .catch(error => console.error(error));
  };

  const handleUpdateOverlay = (overlayId) => {
    setSelectedOverlayId(overlayId);
    const selectedOverlay = overlayData.find(overlay => overlay._id === overlayId);
    setUpdateContentInput(selectedOverlay.content);
    setUpdatePositionInput(selectedOverlay.position);
    setUpdateSizeInput(selectedOverlay.size);
  };

  const saveUpdatedOverlay = () => {
    const updatedOverlay = {
      content: updateContentInput,
      position: updatePositionInput,
      size: updateSizeInput,
    };

    axios.put(`http://localhost:5000/api/overlays/${selectedOverlayId}`, updatedOverlay, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setOverlayData(overlayData.map(overlay =>
          overlay._id === selectedOverlayId ? { ...overlay, ...response.data } : overlay
        ));
        setUpdateContentInput('');
        setSelectedOverlayId(null);
      })
      .catch(error => console.error(error));
  };

  const handleDeleteOverlay = (overlayId) => {
    axios.delete(`http://localhost:5000/api/overlays/${overlayId}`)
      .then(response => {
        setOverlayData(overlayData.filter(overlay => overlay._id !== overlayId));
      })
      .catch(error => console.error(error));
  };

  const calculateOverlayStyle = (overlay) => {
    const { position, size } = overlay;

    const calculatedTop = (position.top / videoPlayerHeight) * 100;
    const calculatedLeft = (position.left / videoPlayerWidth) * 100;
    const calculatedWidth = (size.width / videoPlayerWidth) * 100;
    const calculatedHeight = (size.height / videoPlayerHeight) * 100;

    return {
      position: 'absolute',
      top: `${calculatedTop}%`,
      left: `${calculatedLeft}%`,
      width: `${calculatedWidth}%`,
      height: `${calculatedHeight}%`,
      border: '1px solid red',
    };
  };

  return (
    <div>
      <ReactPlayer url="rtsp://b03773d78e34.entrypoint.cloud.wowza.com:1935/app-4065XT4Z/80c76e59_stream1" playing controls />
      <br />
      <div>
        {overlayData.map((overlay) => (
          <div key={overlay._id} style={calculateOverlayStyle(overlay)}>
            {overlay.content}
            <div>
              {selectedOverlayId === overlay._id ? (
                <div>
                  <input
                    type="text"
                    placeholder="Enter updated content"
                    value={updateContentInput}
                    onChange={(e) => setUpdateContentInput(e.target.value)}
                  />
                  <br />
                  <label>Top:</label>
                  <input
                    type="number"
                    value={updatePositionInput.top}
                    onChange={(e) => setUpdatePositionInput({ ...updatePositionInput, top: e.target.value })}
                  />
                  <label>Left:</label>
                  <input
                    type="number"
                    value={updatePositionInput.left}
                    onChange={(e) => setUpdatePositionInput({ ...updatePositionInput, left: e.target.value })}
                  />
                  <br />
                  <label>Width:</label>
                  <input
                    type="number"
                    value={updateSizeInput.width}
                    onChange={(e) => setUpdateSizeInput({ ...updateSizeInput, width: e.target.value })}
                  />
                  <label>Height:</label>
                  <input
                    type="number"
                    value={updateSizeInput.height}
                    onChange={(e) => setUpdateSizeInput({ ...updateSizeInput, height: e.target.value })}
                  />
                  <br />
                  <button onClick={saveUpdatedOverlay}>
                    Save
                  </button>
                </div>
              ) : (
                <button onClick={() => handleUpdateOverlay(overlay._id)}>
                  Update
                </button>
              )}
            </div>
            <button onClick={() => handleDeleteOverlay(overlay._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Overlay Content"
          value={newOverlay.content}
          onChange={(e) => setNewOverlay({ ...newOverlay, content: e.target.value })}
        />
        <input
          type="number"
          placeholder="Top"
          value={newOverlay.position.top}
          onChange={(e) => setNewOverlay({ ...newOverlay, position: { ...newOverlay.position, top: e.target.value } })}
        />
        <input
          type="number"
          placeholder="Left"
          value={newOverlay.position.left}
          onChange={(e) => setNewOverlay({ ...newOverlay, position: { ...newOverlay.position, left: e.target.value } })}
        />
        <input
          type="number"
          placeholder="Width"
          value={newOverlay.size.width}
          onChange={(e) => setNewOverlay({ ...newOverlay, size: { ...newOverlay.size, width: e.target.value } })}
        />
        <input
          type="number"
          placeholder="Height"
          value={newOverlay.size.height}
          onChange={(e) => setNewOverlay({ ...newOverlay, size: { ...newOverlay.size, height: e.target.value } })}
        />
        <button onClick={handleCreateOverlay}>Create Overlay</button>
      </div>
    </div>
  );
};

export default Livestream;
