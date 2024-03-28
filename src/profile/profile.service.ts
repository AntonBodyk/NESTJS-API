import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";
import { ProfileType } from "@app/profile/types/profile.type";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>) {}
  async getProfile(currentUserId: number, username: string): Promise<ProfileType> {
      const user = await this.userRepository.findOne({
        where: {
          username: username
        }
      });

      if(!user){
        throw new HttpException('Usera nety!', HttpStatus.NOT_FOUND);
      }

      const follow = await this.followRepository.findOne({
        where: {
          followerId: currentUserId,
          followingId: user.id
        }
      })

      return {...user, following: Boolean(follow)};     //если подписка найдена то тогда true!!!
  }

  async followProfile(currentUserId: number, username: string): Promise<ProfileType>{
    const user = await this.userRepository.findOne({
      where: {
        username: username
      }
    });

    if(!user){
      throw new HttpException('Usera nety!', HttpStatus.NOT_FOUND);
    }

    if(currentUserId === user.id){
      throw new HttpException('Ne te dannie!', HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id
      }
    });

    if(!follow){
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }

    return {...user, following: true};
  }

  async unfollowProfile(currentUserId: number, username: string): Promise<ProfileType>{
    const userUnfollow = await this.userRepository.findOne({
      where: {
        username: username
      }
    });

    if(!userUnfollow){
      throw new HttpException('Usera nety!', HttpStatus.NOT_FOUND);
    }

    if(currentUserId === userUnfollow.id){
      throw new HttpException('Ne te dannie!', HttpStatus.BAD_REQUEST);
    }

    await this.followRepository.delete({        //таким способом делаем отписку!
      followerId: currentUserId,
      followingId: userUnfollow.id
    });

    return {...userUnfollow, following: false};
  }
  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}