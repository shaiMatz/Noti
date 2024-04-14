import request from "supertest";
import { Express } from "express";
import mongoose, { set } from "mongoose";
import init from "../app";
import User from "../models/user_model";
import Post from "../models/post_model";

let app: Express;

type TestUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  accessToken?: string;
  refreshToken?: string;
};

const user: TestUser = {
  firstName: "shai",
  lastName: "matz",
  email: "test@test.com",
  password: "1234",
};

beforeAll(async () => {
  app = await init();
  console.log("Before All");
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  console.log("After All");
  await User.deleteMany({ email: user.email });
  await Post.deleteMany({ content: "This is a test post" });
  await User.deleteMany({ email: "test1@test1.com" });
  await mongoose.connection.close();
});

describe("User Auth Test", () => {
  test("Register", async () => {
    const res = await request(app).post("/auth/register").send(user);
    expect(res.statusCode).toEqual(200);
    console.log("Registered user: ", res.body);
  });

  test("Login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toEqual(200);
    console.log("Logged in user: ", res.body);
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();
  });

  test("get post- check autorazation", async () => {
    const res = await request(app)
      .get("/post")
      .set({ Authorization: "JWT " + user.accessToken });
    expect(res.statusCode).toEqual(200);
    console.log("Posts: ", res.body);
  });

  test("get post- check unAutorazation", async () => {
    let wrongToken = user.accessToken + "1";
    const res = await request(app)
      .get("/post")
      .set({ Authorization: "JWT " + wrongToken });
    expect(res.statusCode).not.toEqual(200);
    console.log("Posts: ", res.body);
  });

  test("get post- timeout", async () => {
    await new Promise((r) => setTimeout(r, 3 * 1000));
    const res = await request(app)
      .get("/post")
      .set({ Authorization: "JWT " + user.accessToken });
    expect(res.statusCode).not.toEqual(200);
    console.log("Posts: ", res.body);
  });

  test("get post- check refresh token", async () => {
    const res = await request(app)
      .get("/auth/refreshToken")
      .set({ Authorization: "JWT " + user.accessToken });
    expect(res.statusCode).toEqual(200);
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();
  });
});
