import {createRoom} from "./room";

function createModerator({ rtc }) {
  let room
  return {
    async createRoom({ userUid, roomUid }) {
      room = await createRoom({ userUid, roomUid });
    },
    async joinRoom({ onMemberLeave, onMemberEnter }) {
      await room.join();

      room.onMemberJoin(handleMemberJoined);
      room.onMessage(handlePeerMessage);
      room.onMemberLeave(() => {
        onMemberLeave?.();
      });

      window.addEventListener("beforeunload", async () => {
        await room.exit();
      });

      async function handleMemberJoined(memberId) {
        rtc.watchIce(handleCandidate);

        const offer = await rtc.createOffer();

        async function handleCandidate(candidate) {
          await room.send(
            {
              type: "candidate",
              candidate,
            },
            memberId
          );
        }

        await room.send(
          {
            type: "offer",
            offer,
          },
          memberId
        );
      }

      async function handlePeerMessage(message, memberId) {
        if (message.type === "offer") {
          const answer = await rtc.createAnswer(message.offer);
          await room.send({ type: "answer", answer }, memberId);
          onMemberEnter?.();
        }

        if (message.type === "answer") {
          await rtc.addAnswer(message.answer);
          onMemberEnter?.();
        }

        if (message.type === "candidate") {
          await rtc.addCandidate(message.candidate);
        }
      }
    },
  };
}

export { createModerator };
