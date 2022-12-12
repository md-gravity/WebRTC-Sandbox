import { createStream, createVideo } from "./media";
import { createRTC } from "./rtc";
import { createRoom } from "./room";
import { createModerator } from "./moderator";

async function main() {
  const userUid = String(Math.floor(Math.random() * 10000));
  const roomUid = "main";
  const room = await createRoom({ userUid, roomUid });
  await room.join();

  const rtc = await createRTC();

  const localStream = await createStream();
  createVideo("#user-1").addStream(localStream.stream);
  rtc.addTracks(localStream.tracks, localStream.stream);

  const remoteStream = await createStream(new MediaStream());
  const remoteVideo = createVideo("#user-2").addStream(remoteStream.stream);
  rtc.watchRemoteTracks((remoteTracks) => {
    remoteStream.addTracks(remoteTracks);
  });

  const moderator = createModerator({ rtc, room });
  moderator.openRoom({
    onMemberLeave: () => {
      remoteVideo.hide();
    },
    onMemberEnter: () => {
      remoteVideo.show();
    },
  });
}

main().catch(console.error);
