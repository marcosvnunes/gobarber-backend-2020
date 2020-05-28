import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/user';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('user not exists');
    }

    const userEmail = await this.userRepository.findByEmail(email);
    if (userEmail && userEmail.id !== user.id) {
      throw new AppError('this email already in use');
    }

    user.email = email;
    user.name = name;

    if (password) {
      if (!old_password) {
        throw new AppError('you should send old password');
      }

      const oldPasswordCombine = await this.hashProvider.comparehash(
        old_password,
        user.password
      );

      if (!oldPasswordCombine) {
        throw new AppError('old password not combine');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    const newUser = await this.userRepository.save(user);

    return newUser;
  }
}
export default UpdateProfileService;
