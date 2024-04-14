"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const user_model_1 = __importDefault(require("../models/user_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
let app;
const user = {
    firstName: "shai",
    lastName: "matz",
    email: "test@test.com",
    password: "1234",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("Before All");
    yield user_model_1.default.deleteMany({ email: user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("After All");
    yield user_model_1.default.deleteMany({ email: user.email });
    yield post_model_1.default.deleteMany({ content: "This is a test post" });
    yield user_model_1.default.deleteMany({ email: "test1@test1.com" });
    yield mongoose_1.default.connection.close();
}));
describe("User Auth Test", () => {
    test("Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
        expect(res.statusCode).toEqual(200);
        console.log("Registered user: ", res.body);
    }));
    test("Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: user.email,
            password: user.password,
        });
        expect(res.statusCode).toEqual(200);
        console.log("Logged in user: ", res.body);
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
        expect(user.accessToken).toBeDefined();
        expect(user.refreshToken).toBeDefined();
    }));
    test("get post- check autorazation", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/post")
            .set({ Authorization: "JWT " + user.accessToken });
        expect(res.statusCode).toEqual(200);
        console.log("Posts: ", res.body);
    }));
    test("get post- check unAutorazation", () => __awaiter(void 0, void 0, void 0, function* () {
        let wrongToken = user.accessToken + "1";
        const res = yield (0, supertest_1.default)(app)
            .get("/post")
            .set({ Authorization: "JWT " + wrongToken });
        expect(res.statusCode).not.toEqual(200);
        console.log("Posts: ", res.body);
    }));
    test("get post- timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((r) => setTimeout(r, 3 * 1000));
        const res = yield (0, supertest_1.default)(app)
            .get("/post")
            .set({ Authorization: "JWT " + user.accessToken });
        expect(res.statusCode).not.toEqual(200);
        console.log("Posts: ", res.body);
    }));
    test("get post- check refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/auth/refreshToken")
            .set({ Authorization: "JWT " + user.accessToken });
        expect(res.statusCode).toEqual(200);
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
        expect(user.accessToken).toBeDefined();
        expect(user.refreshToken).toBeDefined();
    }));
});
//# sourceMappingURL=auth.test.js.map