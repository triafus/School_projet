"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = void 0;
const common_1 = require("@nestjs/common");
exports.AuthToken = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || Array.isArray(authHeader))
        return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2)
        return null;
    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme))
        return null;
    return token;
});
//# sourceMappingURL=auth-token.decorator.js.map