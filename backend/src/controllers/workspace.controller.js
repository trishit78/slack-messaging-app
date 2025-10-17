import { StatusCodes } from "http-status-codes";
import { addChannelsToWorkspaceService, addMemberToWorkspaceService, createWorkspaceService, deleteWorkspaceService, getWorkspaceByJoinCodeService, getWorkspaceService, getWorkspacesUserIsMemberOfService, updatedWorkspaceService } from "../services/workspace.service.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObjects.js";

export const createWorkspaceController = async (req, res) => {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user,
    });
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Workspace created successfully",
      data: response,
      error: {},
    });
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        err: error.explanation,
        data: {},
        message: error.message,
      });
    }
  }
};


export const getWorkspacesUserIsMemberOfController = async(req,res)=>{
  try {
    const response = await getWorkspacesUserIsMemberOfService(req.user);
    return res.status(StatusCodes.OK).json(successResponse(response,'Workspaces fetched successfully'));
  } catch (error) {
    console.log(error);
    if(error.statusCode){
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
}


export const deleteWorkspaceController = async (req,res) => {
    try {
      const response = await deleteWorkspaceService(
        req.params.workspaceId,
        req.user
      )
      return res.status(StatusCodes.OK).json(successResponse(response,'Workspace deleted successfully'));
    } catch (error) {
      console.log(error);
      if(error.statusCode){
        return res.status(error.statusCode).json(customErrorResponse(error));
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getWorkspaceController = async (req,res)=> {
  try {
    const response = await getWorkspaceService(req.params.workspaceId,req.user);
    return res.status(StatusCodes.OK).json({
      success:true,
      explanation:'Data of a workspace',
      data:response      
    })
  } catch (error) {
    console.log('Get workspace controller error',error);
    if(error.statusCode){
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  
  
  }
}


export const getWorkspaceByJoinController = async (req,res)=> {
  try {
   
    const response = await getWorkspaceByJoinCodeService(req.params.joinCode,req.user);
    return res.status(StatusCodes.OK).json({
      success:true,
      explanation:'Workspace fetched successfully',
      data:response      
    })
  } catch (error) {
    console.log('Get workspace by join controller error',error);
    if(error.statusCode){
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
}

export const updateWorkspaceController = async(req,res)=>{
  try {
    const response = await updatedWorkspaceService(req.params.workspaceId,req.body,req.user);
    return res.status(StatusCodes.OK).json(successResponse(response,'Workspace updated successfully'));
  } catch (error) {
    console.log('update workspace controller error',error);
    if(error.statusCode){
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
}



export const addMemberToWorkspaceController = async(req,res)=>{
  try {
    const response = await addMemberToWorkspaceService(req.params.workspaceId,req.body.memberId,req.body.role || 'member',req.user);
    return res.status(StatusCodes.OK).json(
      successResponse(response,'member added to workspace')
    )
  } catch (error) {
     console.log('add member to workspace controller error',error);
    if(error.statusCode){
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }

}

export const addChannelsToWorkspaceController = async(req,res)=>{
  try {
    const response = await addChannelsToWorkspaceService(req.params.workspaceId,req.body.channelName,req.user);
    return res.status(StatusCodes.OK).json(successResponse(response,'Member added to workspace successfully'));
  } catch (error) {
    console.log('add member to workspace controller error',error);
    if(error.statusCode){
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
  }
}
