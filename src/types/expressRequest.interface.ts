import {UserEntity} from '@app/user/user.entity';
import {Request} from 'express';

//ЗДЕСЬ РАСШИРЯЕМ INTERFACE REQUEST

export interface ExpressRequest extends Request {
  user?: UserEntity
}