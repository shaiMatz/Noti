import apiClient from './client';
import { User } from '../models/user_model';
// Function to get user data by ID
export const getUser = async (): Promise<User> => {
    try {
        const response = await apiClient.get<User>(`/user`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user data');
    }
};

// Function to update user data
export const editUser = async ( userData: Partial<User>): Promise<User> => {
    try {
        const response = await apiClient.put(`/user`, userData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating user data');
    }
};

// Function to delete a user
export const deleteUser = async (): Promise<{ message: string }> => {
    try {
        const response = await apiClient.delete<{ message: string }>(`/user`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting user');
    }
};

// Function to add the user points
export const increasePoints = async (): Promise<User> => {
    try {
        const response = await apiClient.get<User>(`/user/points`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error increasing points');
        
    }
};
