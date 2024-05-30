import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import './CameraRecording.css';

const CameraRecording = ({ onExit }) => {
    const videoRef = useRef(null);
    const [audioMuted, setAudioMuted] = useState(false);

    const toggleAudioMute = () => {
        setAudioMuted(!audioMuted);
    };

    const toggleCamera = () => {
        // Implement the logic to switch the camera
    };

    const handleFlash = () => {
        // Implement the logic to toggle flash
    };

    return (
        <div className="camera-recorder">
            <video ref={videoRef} autoPlay playsInline muted={audioMuted}></video>
            <div className="controls">
                <Button icon="pi pi-refresh" className="control-button" onClick={toggleCamera} tooltip="Switch Camera Mode" />
                <Button icon="pi pi-bolt" className="control-button" onClick={handleFlash} tooltip="Flash On/Off" />
                <Button icon="pi pi-times" className="control-button" onClick={onExit} tooltip="Exit" />
                <Button icon={`pi pi-${audioMuted ? 'volume-off' : 'volume-up'}`} className="control-button" onClick={toggleAudioMute} tooltip="Audio Mute/Unmute" />
            </div>
            <Button className="start-button" onClick={() => console.log('Start Session')}></Button>
        </div>
    );
};

export default CameraRecording;
