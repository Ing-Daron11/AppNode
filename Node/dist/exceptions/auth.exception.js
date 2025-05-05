"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
class AuthError extends Error {
    constructor() {
        super(...arguments);
        this.name = this.constructor.name;
        this.stack = "Authentication Error \n" + this.stack;
    }
}
exports.AuthError = AuthError;
