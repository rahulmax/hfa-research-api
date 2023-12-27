import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GraphqlService {
  async query(query: string, variables?: any) {
    const response = await axios.post('https://hub.snapshot.org/graphql', {
      query,
      variables,
    });
    return response.data;
  }
}
