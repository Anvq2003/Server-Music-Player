import UserModel from '@models/user';

import BaseController from './Base';

export default class User extends BaseController {
  constructor() {
    super(UserModel as any);
  }
}


