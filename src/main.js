import { createStream, createVideo } from "./media";
import { createRTC } from "./rtc";
import { createModerator } from "./moderator";

async function main() {
  const rtc = await createRTC();

  const localStream = await createStream();
  createVideo("#user-1").addStream(localStream.stream);
  rtc.addTracks(localStream.tracks, localStream.stream);

  const remoteStream = await createStream(new MediaStream());
  const remoteVideo = createVideo("#user-2").addStream(remoteStream.stream);
  rtc.watchRemoteTracks((remoteTracks) => {
    remoteStream.addTracks(remoteTracks);
  });

  const userUid = String(Math.floor(Math.random() * 10000));
  const roomUid = "main";

  const moderator = createModerator({ rtc });
  await moderator.createRoom({ userUid, roomUid })
  await moderator.joinRoom({
    onMemberLeave: () => {
      remoteVideo.hide();
    },
    onMemberEnter: () => {
      remoteVideo.show();
    },
  });
}

main().catch(console.error);
