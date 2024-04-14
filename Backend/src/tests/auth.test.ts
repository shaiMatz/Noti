import request from "supertest";
import { Express } from "express";
import mongoose, { set } from "mongoose";
import init from "../app";
import User from "../models/user_model";
import Post from "../models/post_model";

let app: Express;

type TestUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  accessToken?: string;
  refreshToken?: string;
};

const user: TestUser = {
  _id: "5f3b3b3b7abc123456789012",
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
    const res = await request(app)
    .post("/auth/register").send(user);
    expect(res.statusCode).toEqual(200);
  });

  test("Login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toEqual(200);
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
  });

  test("get post- check unAutorazation", async () => {
    let wrongToken = user.accessToken + "1";
    const res = await request(app)
      .get("/post")
      .set({ Authorization: "JWT " + wrongToken });
    expect(res.statusCode).not.toEqual(200);
  });

 
  test("get post- check refresh token", async () => {
    console.log("Refresh token test: refresh token: ", user.refreshToken);
    const res = await request(app)
      .post("/auth/refreshToken")
      .send({ userInfo: user })
      .set({ Authorization: "JWT " + user.refreshToken });
    expect(res.statusCode).toEqual(200);
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();
  });

  test("get post- timeout", async () => {
    console.log("Timeout test");
    await new Promise(r => setTimeout(r, 6 * 1000+300));
    const res = await request(app)
      .get("/post")
      .set({ Authorization: "JWT " + user.accessToken });
    expect(res.statusCode).not.toEqual(200);
  });

});
