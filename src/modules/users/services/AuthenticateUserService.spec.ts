import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/fakeHashProvider';

describe('Authenticate', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let authenticateUser: AuthenticateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );
  });
  it('should be able create a new token of authenticate', async () => {
    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });

    const response = await authenticateUser.execute({
      email: 'joedue@exemple.com',
      password: '123123',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able create a new token of authenticate with email incorrect', async () => {
    await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'joedue2@exemple.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able create a new token of authenticate with password incorrect', async () => {
    await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'joedue@exemple.com',
        password: '321321',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
