import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import history from '../../../helpers/history';
import localStorageService from '../../../helpers/localStorageService';

export class APIError extends Error {
    public status: number;

    constructor(message: string, status: number) {
      super(message);

      this.status = status;
    }
}

const axios: AxiosInstance = Axios.create();

axios.interceptors.response.use(response => response, (error) => {
  if (!error.response) {
    return Promise.reject(new APIError('Unable to reach server', 0));
  }

  if (error.response.status === 401) {
    localStorageService.clear();
    history.push('/');
  }

  if (error.response.data.message) {
    return Promise.reject(new APIError(error.response.data.message, error.response.status));
  }

  return Promise.reject(new APIError(`Request failed with ${error.response.status}`, error.response.status));
});

async function axiosRequest(options: AxiosRequestConfig): Promise<any> {
  const response = await axios(options);

  return response.data;
}

export default axiosRequest;
