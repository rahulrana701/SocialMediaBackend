import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line turbo/no-undeclared-env-vars
const jwtsecret = process.env.DB_JWTSECRET || "default_secret";




export const authencticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtsecret, (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: "false",
          message: "please login or signup correctly",
        });
        return;
      }
      if (!decoded) {
        res.status(403).json({
          success: "false",
          message: "please login or signup correctly",
        });
        return;
      }

      if (typeof decoded === "string") {
        res.status(403).json({
          success: "false",
          message: "please login or signup correctly",
        });
        return;
      }

      req.headers["UserId"] = decoded.UserId;
      next();
    });
  } else {
    res
      .status(403)
      .json({ success: "false", message: "please login or signup correctly" });
    return;
  }
};
