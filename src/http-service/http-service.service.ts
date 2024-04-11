import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpServiceService {
  constructor(private readonly _httpService: HttpService) {}

  get(uri: string, params?: any, headers: any= null) {
    return this._httpService.get(uri, {
      params: params,
      headers: headers
    });
  }
}
