let mediaRecorder;
let recordedChunks = [];

// Start the camera and display the feed in the video element
async function startCamera() {
    const video = document.getElementById('video');

    try {
        // Get all connected media devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Find the MacBook's built-in camera (usually labeled as "FaceTime")
        const macbookCamera = devices.find(
            (device) => device.kind === 'videoinput' && device.label.includes('FaceTime')
        );

        if (!macbookCamera) {
            console.error("MacBook camera not found");
            return;
        }

        // Set constraints to use the MacBook camera by its deviceId
        const constraints = {
            video: { deviceId: macbookCamera.deviceId }
        };

        // Get the video stream with specified constraints
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        console.log("MacBook camera started successfully");

        // Initialize MediaRecorder for the stream
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

        // Store data chunks in an array as they are recorded
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        // Handle video save when recording stops
        mediaRecorder.onstop = () => saveVideo();
    } catch (error) {
        console.error("Error accessing the camera:", error);
    }
}

// Start recording video
function startRecording() {
    recordedChunks = [];
    if (mediaRecorder) {
        mediaRecorder.start();
        console.log("Recording started");
    } else {
        console.error("MediaRecorder is not initialized");
    }
}

// Stop recording video
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        console.log("Recording stopped");
    }
}

// Save the recorded video to a file
function saveVideo() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it to save the video
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded_video.webm';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    console.log("Video saved successfully");
}

// Initialize the camera on load
startCamera();
