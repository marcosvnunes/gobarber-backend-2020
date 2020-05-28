import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/fakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateUserAvatar', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let UpdateUserAvatar: UpdateUserAvatarService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    UpdateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider
    );
  });

  it('should be able to update avatar of an user', async () => {
    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });
    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar from non existing user ', async () => {
    await expect(
      UpdateUserAvatar.execute({
        user_id: 'no-have-user',
        avatarFileName: 'avatar.png',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update avatar of an user', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@example.com',
      password: '123123',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.png',
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
