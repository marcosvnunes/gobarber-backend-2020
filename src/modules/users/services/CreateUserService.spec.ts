import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../infra/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/fakeHashProvider';

describe('CreateAppointment', () => {
  it('should be able to create a new appointmnet', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new appointmnet with email that already exists ', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });
    expect(
      createUser.execute({
        name: 'joe due',
        email: 'joedue@exemple.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
