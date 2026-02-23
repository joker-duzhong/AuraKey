import { apiRequest } from './api';

export interface Artist {
  id: string;
  name: string;
  previewUrl: string;
  tags: string[];
}

export const getAllArtists = async (): Promise<Artist[]> => {
  const response = await apiRequest('/artists');
  return response.data;
};

export const createArtist = async (data: Omit<Artist, 'id'>): Promise<Artist> => {
  const response = await apiRequest('/artists', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateArtist = async (id: string, data: Partial<Artist>): Promise<Artist> => {
  const response = await apiRequest(`/artists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const deleteArtist = async (id: string): Promise<any> => {
  return apiRequest(`/artists/${id}`, { method: 'DELETE' });
};

export const searchArtists = async (name: string): Promise<Artist[]> => {
  const response = await apiRequest(`/artists/search/by-name?name=${encodeURIComponent(name)}`);
  return response.data;
};
