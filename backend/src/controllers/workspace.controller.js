import { StatusCodes } from "http-status-codes";
import { createWorkspaceService } from "../services/workspace.service.js";

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
