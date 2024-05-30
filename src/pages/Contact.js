import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faPlay, faStop, faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import './CameraRecorder.css'; // Assuming you will add styles here

const isMobile = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const CameraRecorder = () => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [orientation, setOrientation] = useState('portrait');

  const handleStartRecording = useCallback(() => {
    if (webcamRef.current) {
      const stream = webcamRef.current.stream;
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        window.URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);
      setIsRecording(true);
    }
  }, [recordedChunks]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  const handleSwitchCamera = useCallback(() => {
    setFacingMode((prevFacingMode) => (prevFacingMode === 'user' ? 'environment' : 'user'));
  }, []);

  const handleOrientationChange = useCallback(() => {
    if (isMobile()) {
      setOrientation((prevOrientation) => (prevOrientation === 'portrait' ? 'landscape' : 'portrait'));
    }
  }, []);

  const videoConstraints = {
    facingMode: facingMode,
    aspectRatio: orientation === 'portrait' ? 9 / 16 : 16 / 9,
  };

  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        if (window.innerHeight > window.innerWidth) {
          setOrientation('portrait');
        } else {
          setOrientation('landscape');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial orientation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`camera-recorder-container ${orientation}`}>
      <Webcam
        audio={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={isMobile() ? videoConstraints : {}}
        style={{ width: '100%', height: '100%' }}
      />
      <div className="controls">
        <button onClick={handleSwitchCamera} title="Switch Camera">
          <FontAwesomeIcon icon={faSync} />
        </button>
        {isRecording ? (
          <button onClick={handleStopRecording} title="Stop Recording">
            <FontAwesomeIcon icon={faStop} />
          </button>
        ) : (
          <button onClick={handleStartRecording} title="Start Recording">
            <FontAwesomeIcon icon={faPlay} />
          </button>
        )}
        {isMobile() && (
          <button onClick={handleOrientationChange} title="Change Orientation">
            <FontAwesomeIcon icon={faArrowsAltH} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraRecorder;
