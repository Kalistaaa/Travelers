import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getUsers(){
    return 'app';
  }
}
