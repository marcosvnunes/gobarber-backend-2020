import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import Users from '../models/user';

interface User {
  name: string;
  email: string;
  password: string;
}

class CreateAppointmentService {
  public async execute({ name, email, password }: User): Promise<User> {
    const userRepository = getRepository(Users);

    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new Error('User Exists in database');
    }

    const hashedPassword = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);
    return user;
  }
}

export default CreateAppointmentService;
