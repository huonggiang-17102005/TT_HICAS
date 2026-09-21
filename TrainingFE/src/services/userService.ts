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

export interface ILoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
}

export const userService = {
  getUserProfile: (id = 1): Promise<IUserProfile> => {
    return axiosClient.get(`/users/${id}`);
  },

  login: (username: string, password: string): Promise<ILoginResponse> => {
    return axiosClient.post('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    });
  },
};
