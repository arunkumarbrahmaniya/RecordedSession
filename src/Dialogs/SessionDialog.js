import React, { useState, useRef, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';

const SessionDialog = ({ openSessionDialog, setVisible }) => {
    const [sessionType, setSessionType] = useState('video');
    const [sessionOption, setSessionOption] = useState('recordedVideo');
    const [sessionTitle, setSessionTitle] = useState('');
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [videoURL, setVideoURL] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [blobToSave, setBlobToSave] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [videoChanged, setVideoChanged] = useState(false); // New state variable
    const canvasRef = useRef(null);
    const toastBottomCenter = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (recording && sessionOption === "screenCapture") {
            startRecording();
        } else if (recording && sessionOption === "recordedVideo") {
            startCameraRecording();
        } else {
            stopRecording();
        }
    }, [recording]);

    const handleStartStop = () => {
        if (sessionTitle === '') {
            toastBottomCenter.current.show({ severity: 'warn', summary: 'Please Enter Session Title', life: 3000 });
        } else {
            setRecording(!recording);
        }
    };

    const startRecording = async () => {
        let screenStream, audioStream;
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);

            const recorder = new MediaRecorder(combinedStream);
            setMediaRecorder(recorder);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setChunks((prevChunks) => [...prevChunks, event.data]);
                }
            };

            recorder.onstop = () => {
                screenStream.getTracks().forEach(track => track.stop());
                audioStream.getTracks().forEach(track => track.stop());

                if (chunks.length > 0) {
                    const blob = new Blob(chunks, { type: 'video/mp4' });
                    setVideoURL(URL.createObjectURL(blob));
                    setBlobToSave(blob);
                    setShowSaveDialog(true);
                    uploadRecording(blob);
                }
            };

            recorder.start();
        } catch (err) {
            console.error('Error starting screen recording:', err);
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        }
    };

    const startCameraRecording = async () => {
        let cameraStream;
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
            const recorder = new MediaRecorder(cameraStream);
            setMediaRecorder(recorder);
    
            videoRef.current.srcObject = cameraStream;
            debugger
            recorder.ondataavailable = (event) => {
                debugger
                if (event.data.size > 0) {
                    debugger
                    setChunks((prevChunks) => [...prevChunks, event.data]);
                }
            };
    
            recorder.onstop = () => {
                cameraStream.getTracks().forEach(track => track.stop());
    
                setChunks(prevChunks => {
                    if (prevChunks.length > 0) {
                        const blob = new Blob(prevChunks, { type: 'video/webm' });
                        setVideoURL(URL.createObjectURL(blob));
                        // setBlobToSave(blob);
                        saveRecordingToSystem(blob);
                        setShowSaveDialog(true);
                        uploadRecording(blob);
                    }
                    return []; // Reset chunks after processing
                });
            };
    
            recorder.start();
        } catch (err) {
            console.error('Error starting camera recording:', err);
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        }
    };
    

    const stopRecording = () => {
        debugger
        if (mediaRecorder) {
            debugger
            setRecording(false);
            mediaRecorder.stop();
            
        }
    };

    const startCameraForPhoto = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setCameraStream(stream);
            videoRef.current.srcObject = stream;
            setShowCamera(true);
        } catch (err) {
            console.error('Error accessing camera for photo capture:', err);
        }
    };

    const capturePhotoWithAudio = () => {
        setTimeout(async () => {
            const videoTrack = cameraStream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);
            const photoBlob = await imageCapture.takePhoto();

            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioRecorder = new MediaRecorder(audioStream);
            const audioChunks = [];

            audioRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            audioRecorder.onstop = async () => {
                audioStream.getTracks().forEach(track => track.stop());
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

                const formData = new FormData();
                formData.append('file', photoBlob, `${sessionTitle}-photo.jpg`);
                formData.append('upload_preset', 'QSIGHTS');
                formData.append('cloud_name', 'di3friidq');
                
                // Upload photo to Cloudinary
                const responsePhoto = await fetch(`https://api.cloudinary.com/v1_1/di3friidq/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                
                const photoData = await responsePhoto.json();
                if (responsePhoto.ok) {
                    toastBottomCenter.current.show({ severity: 'success', summary: 'Photo Upload Successful', life: 3000 });
                    console.log('Cloudinary Photo URL:', photoData.secure_url);
                } else {
                    toastBottomCenter.current.show({ severity: 'error', summary: 'Photo Upload Failed', detail: photoData.error.message, life: 3000 });
                    console.error('Upload Error:', photoData.error.message);
                }

                const combinedBlob = new Blob([photoBlob, audioBlob], { type: 'video/webm' });
                setBlobToSave(combinedBlob);
                setShowSaveDialog(true);
                uploadRecording(combinedBlob);
            };

            audioRecorder.start();
            setTimeout(() => {
                audioRecorder.stop();
            }, 3000); // Record 3 seconds of audio
        }, 3000); // Capture photo after 3 seconds
    };

    const uploadRecording = async (blob) => {
        if (blob.size === 0) {
            console.error('Blob is empty, nothing to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', blob, `${sessionTitle}.webm`);
        formData.append('upload_preset', 'QSIGHTS');
        formData.append('cloud_name', 'di3friidq');

        try {
            setUploading(true);

            const response = await fetch(`https://api.cloudinary.com/v1_1/di3friidq/video/upload`, {
                method: 'POST',
                body: formData,
                onUploadProgress: (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setUploadProgress(progress);
                    }
                }
            });

            const data = await response.json();

            if (response.ok) {
                toastBottomCenter.current.show({ severity: 'success', summary: 'Upload Successful', life: 3000 });
                console.log('Cloudinary URL:', data.secure_url);
            } else {
                toastBottomCenter.current.show({ severity: 'error', summary: 'Upload Failed', detail: data.error.message, life: 3000 });
                console.error('Upload Error:', data.error.message);
            }
        } catch (err) {
            console.error('Error uploading recording:', err);
            toastBottomCenter.current.show({ severity: 'error', summary: 'Upload Failed', life: 3000 });
        } finally {
            setUploading(false);
        }
    };

    const saveRecordingToSystem = async (FILE) => {
        debugger
        let saveFailed = false;
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: `${sessionTitle}.webm`,
                types: [
                    {
                        description: 'WebM Video',
                        accept: {
                            'video/webm': ['.webm']
                        }
                    }
                ]
            });
    
            const writable = await handle.createWritable();
    
            // Write the data to the file in chunks to avoid memory issues
            const chunkSize = 1024 * 1024; // 1 MB chunk size
            for (let start = 0; start < FILE.size; start += chunkSize) {
                const end = Math.min(start + chunkSize, FILE.size);
                await writable.write(await FILE.slice(start, end).arrayBuffer());
            }
    
            await writable.close();
            console.log('File closed successfully');
            toastBottomCenter.current.show({ severity: 'success', summary: 'File Saved', life: 3000 });
        } 
        catch (err) {
            debugger
            saveFailed = true;
            // Check if the error is due to user cancellation
            if (!(err instanceof DOMException && err.name === 'AbortError')) {
                console.error('Error saving file:', err);
            }
        } finally {
            if (saveFailed) {
                toastBottomCenter.current.show({ severity: 'error', summary: 'Save Failed', life: 3000 });
            }
            setShowSaveDialog(false);
        }
    };
    const header = () => (
        <div className="p-3">
            <i className="pi pi-video"></i>
            <span style={{ paddingLeft: '10px' }}>Start Session</span>
        </div>
    );

    const sessionOptions = {
        video: [
            { label: 'Live Video (with text probing)', value: 'liveVideoText' },
            { label: 'Live Video (with audio probing)', value: 'liveVideoAudio' },
            { label: 'Recorded Video', value: 'recordedVideo' },
            { label: 'Screen Capture', value: 'screenCapture' },
            { label: '2-Way Live Video', value: 'twoWayLiveVideo' },
        ],
        photo: [
            { label: 'Photo Only', value: 'photoOnly' },
            { label: 'Photo Burst', value: 'photoBurst' },
            { label: 'Photos with Audio (Live)', value: 'photosWithAudioLive' },
            { label: 'Photos with Audio (Recorded)', value: 'photosWithAudioRecorded' },
        ],
        audio: [
            { label: 'Live Audio', value: 'liveAudio' },
            { label: 'Recorded Audio', value: 'recordedAudio' },
            { label: '2 Way Live Audio', value: '2wayLiveAudio' },
        ]
    };

    const handleSessionTitle = (event) => {
        setSessionTitle(event.target.value);
    };

    return (
        <div>
            <Dialog
                header={header}
                visible={openSessionDialog}
                style={{ width: '90%', height: '100%' }}
                onHide={() => setVisible(false)}
            >
                <div className="p-3" style={{ height: '80%' }}>
                    <Toast ref={toastBottomCenter} position="bottom-center" />
                    <div className="mb-3">
                        <label htmlFor="sessionTitle" className="form-label">Session Title</label>
                        <InputText style={{ paddingLeft: '0.5rem' }} id="sessionTitle" className="w-100" onChange={handleSessionTitle} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Type of Session</label>
                        <div className="d-flex justify-content-between">
                            <div className="form-check form-check-inline">
                                <RadioButton inputId="video" name="sessionType" value="video" onChange={(e) => setSessionType(e.value)} checked={sessionType === 'video'} />
                                <label htmlFor="video" className="form-check-label">Video</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <RadioButton inputId="photo" name="sessionType" value="photo" onChange={(e) => setSessionType(e.value)} checked={sessionType === 'photo'} />
                                <label htmlFor="photo" className="form-check-label">Photo</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <RadioButton inputId="audio" name="sessionType" value="audio" onChange={(e) => setSessionType(e.value)} checked={sessionType === 'audio'} />
                                <label htmlFor="audio" className="form-check-label">Audio</label>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className="mb-4 mt-4">
                        {sessionOptions[sessionType].map(option => (
                            <div key={option.value} className="form-check">
                                <RadioButton inputId={option.value} name="sessionOption" value={option.value} onChange={(e) => setSessionOption(e.value)} checked={sessionOption === option.value} />
                                <label htmlFor={option.value} className="form-check-label">{option.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <Button onClick={handleStartStop} label={recording ? "Stop Recording" : "Start Now"} className="p-button-primary" style={{ padding: '10px', borderRadius: '4px' }} />
                    {sessionOption === 'photosWithAudioRecorded' && (
                        <Button onClick={startCameraForPhoto} label={showCamera ? "Capture Photo with Audio" : "Start Camera"} className="p-button-secondary mt-2" style={{ padding: '10px', borderRadius: '4px' }} />
                    )}
                    {showCamera && sessionOption === 'photosWithAudioRecorded' && (
                        <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', marginTop: '10px' }}></video>
                    )}
                    {uploading && (
                        <div className="mt-2" style={{ width: '100%', textAlign: 'center' }}>
                            <span>Uploading: {Math.round(uploadProgress)}%</span>
                        </div>
                    )}
                </div>
            </Dialog>
            {sessionOption === "recordedVideo" && recording && (
                <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9000, border: '1px solid black' }}>
                    <video ref={videoRef} controls autoPlay style={{ width: '200px', height: '150px' }}></video>
                </div>
            )}
            {videoURL && !recording && (
                <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9000, border: '1px solid black' }}>
                    <video key={videoChanged} src={videoURL} controls style={{ width: '200px', height: '150px' }}></video>
                </div>
            )}
        </div>
    );
};

export default SessionDialog;
