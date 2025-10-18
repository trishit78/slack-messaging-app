import { StatusCodes } from "http-status-codes";
import channelRepository from "../repositories/channel.repository.js";
import ClientError from "../utils/errors/clientError.js";
//import { isUserMemberOfWorkspace } from "./workspace.service.js";

export const getChannelByIdService= async(channelId)=>{
    try {

    const channel = await channelRepository.getById(channelId);
    
    console.log(channel);

    if(!channel || !channel.workspaceId){
        throw new ClientError({
            message:'Channel not found with the provided ID ',
            explanation:'Invalid data sent from the client ',
            statusCode:StatusCodes.NOT_FOUND
        })
    }

  //  const isUserPartOfWorkspace = isUserMemberOfWorkspace(channel.workspaceId,userId);
    
    // if(!isUserPartOfWorkspace){
    //     throw new ClientError({
    //         message:'User is not a member of the workspace & cannot access the channel',
    //         explanation:'User is not a member of the workspace',
    //         statusCode:StatusCodes.UNAUTHORIZED
    //     });
    // }
    return channel;

    } catch (error) {
        console.log('Get channel by ID service error',error);
        throw error;

    }
}