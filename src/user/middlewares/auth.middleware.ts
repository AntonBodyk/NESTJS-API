import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction , Response} from "express";
import { ExpressRequest } from "@app/types/expressRequest.interface";
import {verify} from 'jsonwebtoken';
import { JWT_SECRET } from "@app/config";
import { UserService } from "@app/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
  constructor(private readonly userService: UserService) {
  }
  async use( req: ExpressRequest, res: Response, next: NextFunction){
    if(!req.headers.authorization){
      req.user = null
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log('token', token)

    try {
      const decode: any = verify(token, JWT_SECRET);    //any или не обратится в свойству decode.id
      const user= await this.userService.findById(decode.id);
      req.user = user;
      console.log('decode', decode);
      next();
    }catch (e) {
      req.user = null;
      next();
    }
  }
}