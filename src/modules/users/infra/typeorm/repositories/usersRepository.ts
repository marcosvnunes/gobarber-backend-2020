import { getRepository, Repository, Not } from 'typeorm';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProfiles from '@modules/users/dtos/IFindAllProfilesDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../entities/user';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const emailExistis = await this.ormRepository.findOne({ where: { email } });

    return emailExistis;
  }

  public async findById(id: string): Promise<User | undefined> {
    const idExists = await this.ormRepository.findOne(id);

    return idExists;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProfiles): Promise<User[]> {
    let usersProfiles: User[];
    if (except_user_id) {
      usersProfiles = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      usersProfiles = await this.ormRepository.find();
    }

    return usersProfiles;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
