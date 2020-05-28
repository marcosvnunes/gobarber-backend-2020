import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllProfiles from '@modules/users/dtos/IFindAllProfilesDTO';
import User from '@modules/users/infra/typeorm/entities/user';
import IUsersRepository from '../IUsersRepository';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const userExistis = this.users.find(findUser => findUser.email === email);
    return userExistis;
  }

  public async findById(id: string): Promise<User | undefined> {
    const userExistis = this.users.find(findUser => findUser.id === id);

    return userExistis;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProfiles): Promise<User[]> {
    let resultFind = this.users;

    if (except_user_id) {
      resultFind = this.users.filter(
        findUser => findUser.id !== except_user_id
      );
    }

    return resultFind;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[userIndex] = user;

    return user;
  }
}

export default UsersRepository;
