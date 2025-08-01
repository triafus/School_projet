import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const AuthToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || Array.isArray(authHeader)) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2) return null;

    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme)) return null;

    return token;
  }
);
