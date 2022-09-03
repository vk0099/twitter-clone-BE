import { userSchema } from "../users/user-schema";
import { APIError } from "./custom-error";
import { jwt_Verify } from "./utils";

export default async function authenticate(req: any, res: any, next: any) {
  try {
    if (!req.headers.authorization) throw new Error("Missing Token.");
    let token: any = await jwt_Verify(req.headers.authorization);
    const user: any = await userSchema.findOne({
      token: req.headers.authorization,
      email: token.email,
    });
    if (!user || !user.is_active) next(new APIError("Invalid Action", 401));
    res.user = user;
    return next();
  } catch (err) {
    return next(new APIError(err.message, err.code));
  }
}
