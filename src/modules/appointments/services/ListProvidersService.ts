import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import Users from '@modules/users/infra/typeorm/entities/user';

interface IRequest {
  user_id?: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<Users[]> {
    return this.userRepository.findAllProviders({ except_user_id: user_id });
  }
}

export default AuthenticateUserService;
