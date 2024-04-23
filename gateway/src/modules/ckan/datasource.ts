import { RESTDataSource } from '@apollo/datasource-rest';
import { CkanResponse } from './types';

class CkanAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://opendata.muenchen.de/api/3/action/';
  }

  async getDataset(id: string) {
    const response = await this.get<CkanResponse>(`package_show?id=${id}`);
    return response.result;
  }

  async searchDatasets(query: string) {
    const response = await this.get(`package_search?q=${query}`);
    return response.result;
  }

  async getResource(id: string) {
    const response = await this.get(`resource_show?id=${id}`);
    return response.result;
  }

  async getResourceData(id: string) {
    const response = await this.get(`resource_proxy?id=${id}&cachebust=${Date.now()}`);
    return response;
  }
}

export default CkanAPI;
