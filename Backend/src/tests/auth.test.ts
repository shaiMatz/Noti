import supertest from "supertest";
import Post from "../models/post_model";
import User from "../models/user_model";
import mongoose from "mongoose";
import app from "../app";

const request = supertest(app);

beforeAll(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  mongoose.connection.close();
});

describe("auth tests", () => {
  test("Register a user", async () => {
    const res = await request.post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "jhon@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toEqual(200);
  });
});
