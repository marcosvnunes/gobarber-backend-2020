import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/fakeHashProvider';

describe('ResetPassordService', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeUsersTokensRepository: FakeUsersTokensRepository;
  let resetPasswordService: ResetPasswordService;
  let fakeHashProvider: FakeHashProvider;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUsersTokensRepository,
      fakeHashProvider
    );
  });

  it('should to able reset the password using a password and token', async () => {
    const user = await fakeUserRepository.create({
      name: 'john due',
      email: 'johndue@example.com',
      password: '123123',
    });

    const { token } = await fakeUsersTokensRepository.generate(user.id);

    await resetPasswordService.execute({ token, password: '123456' });

    const userUpdate = await fakeUserRepository.findById(user.id);
    expect(userUpdate?.password).toBe('123456');
  });

  it('should throw an error when trying reset the password using a token invalid', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'token-invalid ',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw an error when trying reset the password using an user invalid', async () => {
    const { token } = await fakeUsersTokensRepository.generate('no-user');

    expect(
      resetPasswordService.execute({ token, password: '123456' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should to able create a new password hashed', async () => {
    const user = await fakeUserRepository.create({
      name: 'john due',
      email: 'johndue@example.com',
      password: '123123',
    });

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const { token } = await fakeUsersTokensRepository.generate(user.id);

    await resetPasswordService.execute({ token, password: '123456' });

    expect(generateHash).toHaveBeenCalledWith('123456');
  });

  it('should not to able reset password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'john due',
      email: 'johndue@example.com',
      password: '123123',
    });

    const { token } = await fakeUsersTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({ token, password: '123456' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
