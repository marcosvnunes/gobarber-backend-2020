import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCacheProvier from '@shared/container/providers/CacheProvider/fakes/fakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/fakeHashProvider';

describe('CreateAppointment', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;
  let fakeCacheProvider: FakeCacheProvier;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvier();
    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });
    await expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with email that already exists ', async () => {
    await createUser.execute({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });
    await expect(
      createUser.execute({
        name: 'joe due',
        email: 'joedue@exemple.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
