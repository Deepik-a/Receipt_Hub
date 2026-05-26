import api from '@/services/api/axiosInstance';
import type { AuthUser } from '@/types/user';

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}

const userService = {
  async uploadAvatar(file: File): Promise<{ message: string; user: AuthUser }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<{ message: string; user: AuthUser }>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/user/change-password', payload);
    return response.data;
  },
};

export default userService;
