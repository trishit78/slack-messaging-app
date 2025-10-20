import { JOIN_CHANNEL } from "../utils/common/eventConstants.js";

export default function messageHandlers(io,socket){
socket.on(JOIN_CHANNEL, async function JoinChannelHandler(data, cb) {
  const roomId = data.channelId;
  socket.join(roomId);
  console.log(`User ${socket.id} joined the channel: ${roomId}`);

  if (typeof cb === "function") {
    cb({
      success: true,
      message: "Successfully joined the channel",
      data: roomId,
    });
  } else {
    console.log("No callback provided by client");
  }
});

}