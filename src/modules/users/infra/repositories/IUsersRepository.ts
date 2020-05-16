import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../typeorm/entities/user';

export default interface IAppointmentsRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
