import { apiRequest } from './api';

export interface Sref {
  id: string;
  code: string;
  previewUrl: string;
  tags: string[];
}

export const getAllSrefs = async (): Promise<Sref[]> => {
  const response = await apiRequest('/srefs');
  return response.data;
};

export const createSref = async (data: Omit<Sref, 'id'>): Promise<Sref> => {
  const response = await apiRequest('/srefs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateSref = async (id: string, data: Partial<Sref>): Promise<Sref> => {
  const response = await apiRequest(`/srefs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const deleteSref = async (id: string): Promise<any> => {
  return apiRequest(`/srefs/${id}`, { method: 'DELETE' });
};

export const searchSrefs = async (tag: string): Promise<Sref[]> => {
  const response = await apiRequest(`/srefs/search/by-tag?tag=${encodeURIComponent(tag)}`);
  return response.data;
};
