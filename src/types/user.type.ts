import { UserEntity } from "@app/user/user.entity";

export type UserType = Omit<UserEntity, 'hashPassword'>     //таким способом удаляем метод хэширования из сущности