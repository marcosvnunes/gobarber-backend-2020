import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import Users from '../infra/typeorm/entities/user';
import IFindAllProfiles from '../dtos/IFindAllProfilesDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateUserDTO): Promise<Users>;
  findByEmail(email: string): Promise<Users | undefined>;
  findById(id: string): Promise<Users | undefined>;
  findAllProviders(data: IFindAllProfiles): Promise<Users[]>;
  save(user: Users): Promise<Users>;
}
