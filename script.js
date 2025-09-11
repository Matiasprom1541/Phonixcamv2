document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('#start');
  const stop = document.querySelector('#stop');

  let mediaRecorder, mediaStream;

  async function startRecording() {
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 640 },      // 📉 Resolución baja
          height: { ideal: 360 },
          frameRate: { ideal: 15 }    // 📉 Menos cuadros por segundo
        },
        audio: false                  // 🎧 Sin audio para menor peso
      });

      const options = {
        mimeType: 'video/webm;codecs=vp8' // ✅ Formato liviano y compatible
      };

      mediaRecorder = new MediaRecorder(mediaStream, options);

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-liviano-${Date.now()}.webm`;
        a.click();
      };

      mediaRecorder.start();
      console.log("🎥 Grabación iniciada");
    } catch (err) {
      console.error("❌ Error al iniciar grabación:", err);
    }
  }

  start.addEventListener('click', () => {
    startRecording();
  });

  stop.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaRecorder.stop();
      console.log("🛑 Grabación detenida");
    }
  });
});