import IUserRepository from '@modules/users/infra/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/models/IStorageProvider';
import User from '../infra/typeorm/entities/user';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new Error('only user authenticated can update avatar');
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    const fileName = await this.storageProvider.save(avatarFileName);

    user.avatar = fileName;

    await this.userRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;
