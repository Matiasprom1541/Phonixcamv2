document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('#start');
  const stopBtn = document.querySelector('#stop');
  const pauseBtn = document.querySelector('#pause');
  const resumeBtn = document.querySelector('#resume');

  let mediaRecorder, mediaStream;
  let chunks = [];

  async function startRecording() {
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 15 }
        },
        audio: false
      });

      const options = {
        mimeType: 'video/webm;codecs=vp8'
      };

      mediaRecorder = new MediaRecorder(mediaStream, options);
      chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-${Date.now()}.webm`;
        a.click();
      };

      mediaRecorder.start();
      console.log("🎥 Grabación iniciada");
    } catch (err) {
      console.error("❌ Error al iniciar grabación:", err);
    }
  }

  function pauseRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      console.log("⏸️ Grabación pausada");
    }
  }

  function resumeRecording() {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      console.log("▶️ Grabación retomada");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaRecorder.stop();
      console.log("🛑 Grabación detenida");
    }
  }

  // 🎯 Botones
  startBtn.addEventListener('click', startRecording);
  pauseBtn.addEventListener('click', pauseRecording);
  resumeBtn.addEventListener('click', resumeRecording);
  stopBtn.addEventListener('click', stopRecording);

  // 🎯 Teclas F3–F6
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'F9':
        startRecording();
        break;
      case 'F8':
        pauseRecording();
        break;
      case 'F12':
        resumeRecording();
        break;
      case 'F10':
        stopRecording();
        break;
    }
  });
});

