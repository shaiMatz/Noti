import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
import init from "../app";

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
  await User.deleteMany({});
});

beforeEach(async () => {
  await User.create({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    passwordHash: await bcrypt.hash(user.password, 10),
    // Additional fields like profilePicture can be set here if required
  });
  const accessToken = await loginUser();
  user.accessToken = accessToken;
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
});

async function loginUser(): Promise<string> {
  const response = await request(app)
    .post("/auth/login")
    .send({ email: user.email, password: user.password });
  return response.body.accessToken;
}

describe("User Test", () => {
  test("Get User", async () => {
    const res = await request(app)
      .get(`/user`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(user.email);
  });

  test("Edit User", async () => {
    const newName = "newName";
    const res = await request(app)
      .put(`/user`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ firstName: newName });
    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toEqual(newName);
  });

  test("Delete User", async () => {
    const res = await request(app)
      .delete(`/user`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});
