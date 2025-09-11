document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('#start');
  const stopBtn = document.querySelector('#stop');
  const pauseBtn = document.querySelector('#pause');
  const resumeBtn = document.querySelector('#resume');
  const qualitySelect = document.querySelector('#quality');

  let mediaRecorder, mediaStream;
  let chunks = [];

  function getResolution() {
    const selected = qualitySelect.value;
    switch (selected) {
      case '2160': return { width: 3840, height: 2160 }; // 4K
      case '1440': return { width: 2560, height: 1440 }; // 2K
      case '1080': return { width: 1920, height: 1080 }; // Full HD
      case '720':  return { width: 1280, height: 720 };  // HD
      case '480':  return { width: 854,  height: 480 };  // SD
      case '360':  return { width: 640,  height: 360 };  // Baja
      case '180':  return { width: 320,  height: 180 };  // Muy baja
      default:     return { width: 854,  height: 480 };  // SD por defecto
    }
  }

  async function startRecording() {
    try {
      const resolution = getResolution();

      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: resolution.width },
          height: { ideal: resolution.height },
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
        a.download = `video-${resolution.height}p-${Date.now()}.webm`;
        a.click();
      };

      mediaRecorder.start();
      console.log(`🎥 Grabando en ${resolution.height}p`);
    } catch (err) {
      console.error("❌ Error al iniciar grabación:", err);
    }
  }

  function pauseRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      console.log("⏸️ Pausado");
    }
  }

  function resumeRecording() {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      console.log("▶️ Retomado");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaRecorder.stop();
      console.log("🛑 Detenido");
    }
  }

  // Botones
  startBtn.addEventListener('click', startRecording);
  pauseBtn.addEventListener('click', pauseRecording);
  resumeBtn.addEventListener('click', resumeRecording);
  stopBtn.addEventListener('click', stopRecording);

  // Teclas F3–F6
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'F3': startRecording(); break;
      case 'F4': pauseRecording(); break;
      case 'F5': resumeRecording(); break;
      case 'F6': stopRecording(); break;
    }
  });
});
