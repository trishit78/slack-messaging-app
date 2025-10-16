import workspaceRepository from "../repositories/workspace.repository.js"

import {v4 as uuidv4} from 'uuid'; 
import ValidationError from "../utils/errors/validationError.js";

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





