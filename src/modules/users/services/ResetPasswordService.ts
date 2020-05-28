import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { differenceInHours } from 'date-fns';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';
import IhashProvider from '../providers/hashProvider/models/IHashProvider';

interface IRequest {
  password: string;
  token: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('UsersTokensRepository')
    private userTokenRepository: IUsersTokensRepository,

    @inject('HashProvider')
    private hashProvider: IhashProvider
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const usertoken = await this.userTokenRepository.findByToken(token);

    if (!usertoken) {
      throw new AppError('token not exists');
    }
    const user = await this.userRepository.findById(usertoken.user_id);

    if (!user) {
      throw new AppError('user not exists');
    }

    const tokenDate = usertoken.created_at;

    if (differenceInHours(Date.now(), tokenDate) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);
    this.userRepository.save(user);
  }
}

export default ResetPasswordService;
