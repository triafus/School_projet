import { User } from "../../users/user.entity";
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}
