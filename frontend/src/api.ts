import axios from 'axios';

const API_URL = import.meta.env.VITE_URL_GATEWAY_URL;

export const UrlStatus = {
  PENDING: 'pending',
  SUCCESS: 'successfull',
  FAIL: 'failed',
} as const;

export type UrlStatus = (typeof UrlStatus)[keyof typeof UrlStatus];

export interface UrlItem {
  _id: string;
  url: string;
  status: UrlStatus;
  updatedAt: string;
  content?: string;
}

export const submitUrls = async (urls: string[]) => {
  return axios.post(API_URL, { urls });
};

export const getAllUrls = async () => {
  return axios.get<UrlItem[]>(API_URL);
};

export const getUrlContent = async (id: string) => {
  return axios.get<UrlItem>(`${API_URL}/${id}`);
};
