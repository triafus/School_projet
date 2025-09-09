"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveSensitiveFieldsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let RemoveSensitiveFieldsInterceptor = class RemoveSensitiveFieldsInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (Array.isArray(data)) {
                return data.map((item) => this.removeFields(item));
            }
            return this.removeFields(data);
        }));
    }
    removeFields(data) {
        if (!data || typeof data !== "object")
            return data;
        const { password, images } = data, rest = __rest(data, ["password", "images"]);
        return rest;
    }
};
exports.RemoveSensitiveFieldsInterceptor = RemoveSensitiveFieldsInterceptor;
exports.RemoveSensitiveFieldsInterceptor = RemoveSensitiveFieldsInterceptor = __decorate([
    (0, common_1.Injectable)()
], RemoveSensitiveFieldsInterceptor);
//# sourceMappingURL=remove-sensitive-fields.interceptor.js.map