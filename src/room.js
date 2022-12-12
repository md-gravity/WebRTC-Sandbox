import { createSignal } from "./signal";

async function createRoom({ userUid, roomUid }) {
  const signal = await createSignal(userUid);
  const channel = signal.createChannel(roomUid);

  return {
    async join() {
      return await channel.join();
    },
    async send(message, memberId) {
      return signal.send(
        {
          text: JSON.stringify(message),
        },
        memberId
      );
    },
    async exit() {
      await channel.leave();
      await signal.logout();
    },
    onMessage(handler) {
      signal.on("MessageFromPeer", (message, memberId) =>
        handler(JSON.parse(message.text), memberId)
      );
    },
    onMemberJoin(handler) {
      channel.on("MemberJoined", (memberId) => handler(memberId));
    },
    onMemberLeave(handler) {
      channel.on("MemberLeft", (memberId) => handler(memberId));
    },
  };
}

export { createRoom };
