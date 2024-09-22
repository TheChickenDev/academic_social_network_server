import { Introduction } from './user.interface';
import { ImageData } from './utils.interface';

export interface TokenPayload {
  username: string;
  isAdmin: boolean;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  introduction: Introduction;
  avatarImg: ImageData;
  backgroundImg: ImageData;
}
