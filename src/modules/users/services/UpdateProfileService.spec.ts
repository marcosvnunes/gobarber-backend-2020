import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/hashProvider/fakes/fakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateProfile', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateProfile: UpdateProfileService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    );
  });

  it('should be able to update profile name and email without password', async () => {
    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    const userUpdate = await updateProfile.execute({
      user_id: user.id,
      email: 'joetrue@example.com',
      name: 'joe true',
    });
    expect(userUpdate.email).toBe('joetrue@example.com');
    expect(userUpdate.name).toBe('joe true');
  });

  it('should not be able to update profile with email already exists', async () => {
    await fakeUserRepository.create({
      name: 'joe due',
      email: 'joetrue@example.com',
      password: '123123',
    });

    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'joetrue@example.com',
        name: 'joe true',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password ', async () => {
    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    const userUpdate = await updateProfile.execute({
      user_id: user.id,
      email: 'joetrue@example.com',
      name: 'joe true',
      password: '123456',
      old_password: '123123',
    });
    expect(userUpdate.password).toBe('123456');
  });

  it('should not be able to update password without old_password ', async () => {
    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'joetrue@example.com',
        name: 'joe true',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password if old_password not combine', async () => {
    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'joetrue@example.com',
        name: 'joe true',
        password: '123456',
        old_password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password if user no exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'n',
        email: 'joetrue@example.com',
        name: 'joe true',
        password: '123456',
        old_password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
