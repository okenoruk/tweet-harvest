"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENABLE_EXPONENTIAL_BACKOFF = exports.HEADLESS_MODE = exports.ACCESS_TOKEN = void 0;
const dotenv_1 = require("dotenv");
const znv_1 = require("znv");
(0, dotenv_1.config)();
({ DEV_ACCESS_TOKEN: exports.ACCESS_TOKEN, HEADLESS_MODE: exports.HEADLESS_MODE, ENABLE_EXPONENTIAL_BACKOFF: exports.ENABLE_EXPONENTIAL_BACKOFF } = (0, znv_1.parseEnv)(process.env, {
    DEV_ACCESS_TOKEN: znv_1.z.string().min(1).optional(),
    HEADLESS_MODE: znv_1.z.boolean().default(true),
    ENABLE_EXPONENTIAL_BACKOFF: znv_1.z.boolean().default(false),
}));
