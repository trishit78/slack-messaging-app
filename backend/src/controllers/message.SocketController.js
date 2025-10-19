import { createMessageService } from "../services/message.service.js";
import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECIEVED_EVENT } from "../utils/common/eventConstants.js";

export default function messageHandlers(io,socket){
    socket.on(NEW_MESSAGE_EVENT,async function createMessageHandler(data,cb){
    const messageResponse = await createMessageService(data);
    socket.broadcast.emit(NEW_MESSAGE_RECIEVED_EVENT,messageResponse);
    cb({
        success:true,
        message:'Successfully created the message',
        data:messageResponse
    })

});
}

