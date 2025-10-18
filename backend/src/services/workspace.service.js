import workspaceRepository from "../repositories/workspace.repository.js"

import {v4 as uuidv4} from 'uuid'; 
import ValidationError from "../utils/errors/validationError.js";
import channelRepository from "../repositories/channel.repository.js";
import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository.js";
import ClientError from "../utils/errors/clientError.js";


const isUserAdminOfWorkspace = (workspace,userId) =>{
    return workspace.members.find(
        (member)=> (member.memberId.toString() === userId || member.memberId._id.toString() === userId  ) && member.role === 'admin'
    );
}


export const isUserMemberOfWorkspace = (workspace,userId)=>{
    return workspace.members.find(
        (member)=> member.memberId.toString() === userId 
    );
}

const isChannelAlreadyPartofWorkspace = (workspace,channelName)=>{
    return workspace.channels.find((channel)=>channel.name.toLowerCase() === channelName.toLowerCase());
}

export const createWorkspaceService = async(workspaceData)=>{
    try {
    const joinCode = uuidv4().substring(0,6).toUpperCase();
    const response  = await workspaceRepository.create({
        name:workspaceData.name,
        description:workspaceData.description,
        joinCode
    });

    console.log('response',response);
    await workspaceRepository.addMemberToWorkspace(
        response._id,
        workspaceData.owner,
        'admin'
    );

    const updatedWorkspace =  await workspaceRepository.addChannelsToWorkspace(response._id,'general')
    
    console.log(updatedWorkspace);
    return updatedWorkspace;
    } catch (error) {
        console.log('Create workspace service error',error);
        if(error.name === 'ValidationError'){
            throw new ValidationError(
                {
                    error:error.errors
                },
                error.message
            );
        }
        if(error.name === 'MongoServerError' && error.code === 11000){
            throw new ValidationError({
                error:['A workspace with same details already exists']
            },
            'A workspace with same details exists'
        );
        }
        throw error;
    }
};

export const getWorkspacesUserIsMemberOfService = async(userId) =>{
    try {
        const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
        return response;        
    } catch (error) {
        console.log('Get workspaces user is member of service error',error);
        throw error;
    }
};



export const deleteWorkspaceService = async(workspaceId,userId)=>{
    try {
        
    
    const workspace = await workspaceRepository.getById(workspaceId);
    const isAllowed =isUserAdminOfWorkspace(workspace,userId);
    //const channelIds = workspace.channels.map()
    if(isAllowed){
        await channelRepository.deleteMany(workspace.channels);
        const response = await workspaceRepository.delete(workspaceId);
        return response;
    }

    throw new Error({
        success:false,
        explanation:'User is not a member or admin',
        message:'User is not allowed to delete the workspace',
        statusCode:StatusCodes.UNAUTHORIZED
    })
} catch (error) {
    console.log(error);
    throw error;       
    }

}


export const getWorkspaceService = async(workspaceId,userId)=>{
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new Error({
                explanation:'Invalid data sent from the client',
                message:'Workspace not found',
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        const isMember = isUserMemberOfWorkspace(workspace,userId);
        if(!isMember){
            throw new Error({
                explanation:'User is not a member of the workspace',
                message:'User is not a member of the workspace',
                statusCode:StatusCodes.UNAUTHORIZED
            })
        }
        return workspace;

    } catch (error) {
        console.log('Get workspace service error',error);
        throw error;
    }
}

export const getWorkspaceByJoinCodeService = async(joinCode,userId)=>{
    try {
        
        const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
        if(!workspace){
            throw new ClientError({
                explanation:'Invalid data sent from the client',
                message:"Workspace not found",
                stausCode:StatusCodes.NOT_FOUND
            })
        }
        const isMember = isUserMemberOfWorkspace(workspace,userId);
        if(!isMember){
            throw new ClientError({
                explanation:'User is not a member of the workspace',
                message:'User is not a member of the workspace',
                statusCode:StatusCodes.UNAUTHORIZED
            });
        }
        return workspace;
    } catch (error) {
        console.log('Get workspace by join code service error',error);
        throw error;
    }
}

export const updatedWorkspaceService = async (workspaceId,workspaceData,userId)=> {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new Error({
                explanation:'Invalid data sent from the client',
                message:'Workspace not found',
                statusCode:StatusCodes.NOT_FOUND
            })
        }

        const isAdmin = isUserAdminOfWorkspace(workspace,userId);
        if(!isAdmin){
            throw new Error({
                explanation:'User is not an admin of the workspace',
                message:'User is not an admin of the workspace',
                statusCode:StatusCodes.UNAUTHORIZED
            })
        }

        const updatedWorkspace = await workspaceRepository.update(workspaceId,workspaceData);
        return updatedWorkspace;
    } catch (error) {
        console.log('Update workspace service error',error);
        throw error;
    }
}

export const addMemberToWorkspaceService = async (workspaceId,memberId,role,userId)=>{
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new Error({
                explanation:'Invalid data sent fromthe client',
                message:'Workspace not found',
                statusCode:StatusCodes.NOT_FOUND
            })
        }

        
        const isAdmin = isUserAdminOfWorkspace(workspace,userId);
        if(!isAdmin){
            throw new ClientError({
                explanantion:'User is not an admin of the workspace',
                message:'User is not an admin of the workspace',
                statusCode:StatusCodes.UNAUTHORIZED
            })
        }

        const isMember = isUserMemberOfWorkspace(workspace,memberId);
        if(isMember){
            throw new ClientError({
                explanation:'User is already a member of the workspace',
                message:'User is not a member of the workspace',
                statusCode:StatusCodes.UNAUTHORIZED
            });
        }

        const isValidUser = await userRepository.getById(memberId);
        if(!isValidUser){
            throw new Error({
                explanation:'Invalid data sent from the client',
                message:'User not found',
                statusCode:StatusCodes.NOT_FOUND
            })
        }

        const response= await workspaceRepository.addMemberToWorkspace(workspaceId,memberId,role);
        return response;

    } catch (error) {
        console.log('add member to workspace service error',error);
        throw error;
    }
}


export const addChannelsToWorkspaceService = async(workspaceId,channelName,userId)=>{
    try {
        const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);

        console.log('workspace', workspace);
        if(!workspace){
            throw new ClientError({
                explanation:'Invalid data sent from the client',
                message:'Workspace not found',
                statusCode:StatusCodes.NOT_FOUND
            })
        }

        const isAdmin = isUserAdminOfWorkspace(workspace,userId);
        if(!isAdmin){
            throw new ClientError({
                explanantion:'User is not an admin of the workspace',
                message:'User is not an admin of the workspace',
                statusCode:StatusCodes.UNAUTHORIZED
            })
        }

        const isChannelPartOfWorkspace = isChannelAlreadyPartofWorkspace(workspace,channelName);
        if(isChannelPartOfWorkspace){
            throw new ClientError({
                explanantion:'Invalid data sent from the client',
                message:'Channel already part of the workspace',
                statusCode:StatusCodes.FORBIDDEN
            });
        }


        const response = await workspaceRepository.addChannelsToWorkspace(workspaceId,channelName);
        return response;

    } catch (error) {
        console.log('Add Channel to workspace service',error);
        throw error;
    }
}

