import apiClient, { APIURL } from "./client";
import { Post } from "../models/post_model";
import FormData from 'form-data';
import { date } from "yup";

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
  updates: { content?: string; image?: string }
): Promise<Post> => {
  try {
    const updatedData = {
      ...(updates.content ? { content: updates.content } : {}),
      ...(updates.image ? { image: updates.image } : {}),
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

// Function to upload an image
export const uploadImage = async (imageUri: string) => {
  try {
    // Initialize FormData to prepare for the HTTP POST request
    const formData = new FormData();
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const filename = "photo"+Date.now().toString()+"."+fileType;
    // Append the image file to formData. Since we're working in React Native, we construct the file object from the URI.
    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`, // Assuming JPEG for simplicity. This should be dynamically determined based on the file type.
      name:filename, // Generate a unique name for the file using a timestamp to avoid naming conflicts.
    });

    // Log the file upload attempt details
    console.log(`Uploading file: photo-${Date.now()}.jpg, Type: image/jpeg`);
console.log("formData:", formData);
    // Make the HTTP POST request to upload the formData
    const response = await apiClient.post("/upload/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type header to multipart/form-data to indicate that the request contains a file
      },
    }
    );
    
    // Log the server's response
    console.log("response:", response.data.message);


    // Return the server's response message
    return APIURL+'/uploads/'+filename;
  } catch (error:any) {
    // Error handling: log different types of errors based on the context
    console.error("Error uploading image:", error);
    if (error.response) {
      console.error("Response error:", error.response);
    } else if (error.request) {
      console.error("Request was made but no response was received");
    } else {
      console.error("Error in setting up the request");
    }
    throw new Error("Error uploading image");
  }
};
