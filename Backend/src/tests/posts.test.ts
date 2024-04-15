import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import Post, { IPost } from "../models/post_model";
import init from "../app";

// Define the types for user credentials and tokens
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

let app: Express;

beforeAll(async () => {
  app = await init();

  await Post.deleteMany();
  await User.deleteMany();
  const res = await request(app).post("/auth/register").send(user);
  expect(res.statusCode).toEqual(200);
  console.log("Registered user: ", res.body);
});

async function loginUser() {
  const response = await request(app)
    .post("/auth/login")
    .send({ email: user.email, password: user.password });
  return response.body.accessToken;
}

beforeEach(async () => {
  await loginUser();
});

afterAll(async () => {
  await Post.deleteMany();
  await User.deleteMany();
  mongoose.connection.close();
});

describe("Post Test", () => {
  test("Create Post", async () => {
    const accessToken = await loginUser();
    const res = await request(app)
      .post("/post")
      .set("authorization", "JWT " + accessToken)
      .send({
        userId: user._id,
        content: "This is a test post",
        location: "New York",
        image: "test.jpg",
      });
    expect(res.statusCode).toEqual(201);
  });

  test("Get Posts", async () => {
    const accessToken = await loginUser();
    const res = await request(app)
      .get("/post")
      .set("authorization", "JWT " + accessToken);
    expect(res.statusCode).toEqual(200);
  });

  test("Delete Post", async () => {
    const accessToken = await loginUser();
    const post = await Post.findOne({ content: "This is a test post" });
    const res = await request(app)
      .delete(`/post/${post._id}`)
      .set("authorization", "JWT " + accessToken);
    expect(res.statusCode).toEqual(200);
  });
});
