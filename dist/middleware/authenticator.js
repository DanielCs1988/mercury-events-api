"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
exports.validateJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI
    }),
    credentialsRequired: true,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
});
//# sourceMappingURL=authenticator.js.map