import IUserRepository from '@modules/users/infra/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/user';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface IUser {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
    @inject('BcryptHashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, email, password }: IUser): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('User Exists in database');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateAppointmentService;
