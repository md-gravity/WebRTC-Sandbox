import AgoraRTM from "agora-rtm-sdk";

async function createSignal(uid) {
  const appId = "d436ec78b5c745ea8a4482232d741468";
  const client = AgoraRTM.createInstance(appId);
  await client.login({ uid, token: null });

  return {
    async send(message, memberId) {
      return client.sendMessageToPeer(message, memberId);
    },
    on(event, handler) {
      return client.on(event, handler);
    },
    async logout() {
      return client.logout();
    },
    createChannel(name) {
      return client.createChannel(name);
    },
  };
}

export { createSignal };
