import "express";
import { User } from "../src/users/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
