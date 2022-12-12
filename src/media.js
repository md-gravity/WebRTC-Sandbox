async function createStream(stream) {
  stream = stream || (await getMediaStream());
  return {
    get stream() {
      return stream;
    },
    addTracks(tracks) {
      tracks.forEach((track) => {
        stream.addTrack(track);
      });
      return stream;
    },
    get tracks() {
      return stream.getTracks();
    },
  };
}

async function getMediaStream() {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
}

function createVideo(selector) {
  const video = document.querySelector(selector);
  return {
    get video() {
      return video;
    },
    addStream(stream) {
      video.srcObject = stream;
      return this;
    },
    show(showValue = "block") {
      video.style.display = showValue;
    },
    hide() {
      video.style.display = "none";
    },
  };
}

export { createStream, createVideo };
