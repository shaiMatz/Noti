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
let app; // Hold a reference to the application
let server; // Hold a reference to the server
beforeAll(done => {
    app = yield appPromise;
    done();
}); // Increase the timeout to 10 seconds
afterAll(done => {
    mongoose_1.default.connection.close();
    done();
}); // Similarly, increase the timeout for teardown if necessary
describe('Initial test 1', () => {
    test("Test 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const temp = 2;
        expect(temp).toEqual(2);
    }));
});
describe("GET /", () => {
    test("It should return a string", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/");
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map