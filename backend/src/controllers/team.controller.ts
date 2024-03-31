import { NextFunction, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorhandler";
import { Admin } from "../models/admin.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { ITeamDocument, Team } from "../models/team.model";

export const createNewTeam = catchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, domain, users } = req.body;
    if (!name || !domain)
      return next(new ErrorHandler("Name and domain are required", 400));
    if (users.length === 0)
      return next(new ErrorHandler("Team should have atleast one user", 409));

    const admin = await Admin.findById(req.admin?.id).populate("teams");

    if (admin?.teams.length !== 0) {
      admin?.teams.map((team: any) => {
        if (team.domain === domain) {
          return next(
            new ErrorHandler(`You have already a team in ${domain} domain`, 409)
          );
        }
      });
    }

    const newTeam = await Team.create({
      name,
      domain,
      users,
      admin: req.admin?.id,
    });

    return res.status(200).json({ success: true, newTeam });
  }
);

export const getTeamInfo = catchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const teamId = req.params.id;
    if (!teamId) return next(new ErrorHandler("Team id is required", 400));
    const team = await Team.findById(teamId).populate("users");
    return res.status(200).json({
      success: true,
      team,
    });
  }
);
