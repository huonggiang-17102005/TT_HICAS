import axiosClient from './axiosClient.ts';

export interface IUserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: string;
  image: string;
  company?: {
    address?: {
      address?: string;
      city?: string;
    };
  };
  address?: {
    address?: string;
    city?: string;
  };
}

export const userService = {
  getUserProfile: (id = 1): Promise<IUserProfile> => {
    return axiosClient.get(`/users/${id}`);
  },
};
