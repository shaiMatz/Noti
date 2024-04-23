import apiClient from "./client";
import { Post } from "../models/post_model";

// Function to get all posts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiClient.get<Post[]>("/post");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts");
  }
};

// Function to get a single post by ID
export const getPost = async (postId: string): Promise<Post> => {
  try {
    const response = await apiClient.get<Post>(`/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Error fetching post");
  }
};

// Function to create a new post
export const createPost = async (
  post: Partial<Post> & { longitude: number; latitude: number }
): Promise<Post> => {
  try {
    const response = await apiClient.post<Post>("/post", {
      ...post,
      geo: {
        type: "Point",
        coordinates: [post.longitude, post.latitude],
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post");
  }
};

// Function to update an existing post
export const updatePost = async (
  postId: string,
  post: Partial<Post> & { longitude?: number; latitude?: number }
): Promise<Post> => {
  try {
    const updatedData = {
      ...post,
      ...(post.longitude && post.latitude
        ? {
            geo: {
              type: "Point",
              coordinates: [post.longitude, post.latitude],
            },
          }
        : {}),
    };
    const response = await apiClient.put<Post>(`/post/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Error updating post");
  }
};
// Function to delete a post
export const deletePost = async (
  postId: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `/post/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Error deleting post");
  }
};
// Function to get posts by a specific location
export const getPostsByLocation = async (
  longitude: number,
  latitude: number
): Promise<Post[]> => {
  try {
    console.log(
      "getPostsByLocation, longitude:",
      longitude,
      "latitude:",
      latitude
    );

    const response = await apiClient.post<Post[]>("/post/location", {
      longitude,
      latitude,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts by location:", error);
    throw new Error("Error fetching posts by location");
  }
};

// Function to get posts by a specific user
export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  try {
    const response = await apiClient.get<Post[]>(`/post/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    throw new Error("Error fetching posts by user");
  }
};
