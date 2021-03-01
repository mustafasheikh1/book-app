import { IUser } from '../user/IUser';

export interface IAuthResponse {
  authorized: boolean;
  access_token: string;
  user?: IUser;
}
