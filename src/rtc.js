async function createRTC() {
  const peerConfig = {
    iceServers: [
      {
        urls: [
          "stun:stun1.1.google.com:19302",
          "stun:stun2.1.google.com:19302",
        ],
      },
    ],
  };
  let peerConnection = new RTCPeerConnection(peerConfig);

  return {
    addTracks(tracks, stream) {
      tracks.forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    },
    watchRemoteTracks(handler) {
      peerConnection.ontrack = function onRemoteTracks(e) {
        handler(e.streams[0].getTracks());
      };
    },
    /**
     * INFO: Should call after "addTrack" and "onRemoteTracks".
     * This is pre-configuration for creating offer
     */
    async createOffer() {
      let offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      return offer;
    },
    async createAnswer(offer) {
      await peerConnection.setRemoteDescription(offer);

      let answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      return answer;
    },
    watchIce(handler) {
      peerConnection.onicecandidate = function onIceCandidate(e) {
        if (e.candidate) {
          handler(e.candidate);
        }
      };
    },
    async addAnswer(answer) {
      return peerConnection.setRemoteDescription(answer);
    },
    async addCandidate(candidate) {
      return peerConnection.addIceCandidate(candidate);
    },
  };
}

export { createRTC };
