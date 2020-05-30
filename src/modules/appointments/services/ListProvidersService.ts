import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import Users from '@modules/users/infra/typeorm/entities/user';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id?: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id }: IRequest): Promise<Users[]> {
    const cachekey = `providers-list:${user_id}`;
    let users = await this.cacheProvider.recovery<Users[]>(cachekey);
    if (!users) {
      users = await this.userRepository.findAllProviders({
        except_user_id: user_id,
      });
      await this.cacheProvider.save(cachekey, users);
    }

    return users;
  }
}

export default AuthenticateUserService;
