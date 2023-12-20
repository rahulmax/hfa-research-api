import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpServiceService {
  constructor(private readonly _httpService: HttpService) {}

  get(uri: string, params?: any) {
    return this._httpService.get(uri, {
      params: params,
    });
  }
}
