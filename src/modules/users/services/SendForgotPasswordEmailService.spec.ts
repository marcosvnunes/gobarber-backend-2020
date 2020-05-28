import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';

describe('SendForgotPassWord', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeMailProvider: FakeMailProvider;
  let fakeUsersTokensRepository: FakeUsersTokensRepository;
  let SendForgotPasswordEmail: SendForgotPasswordEmailService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    SendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUsersTokensRepository
    );
  });

  it('should to able recovery the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      name: 'john due',
      email: 'johndue@example.com',
      password: '123123',
    });
    await SendForgotPasswordEmail.execute({
      email: 'johndue@example.com',
    });
    expect(sendMail).toHaveBeenCalled();
  });

  it('should not to able recovery the password using an email invalid', async () => {
    await expect(
      SendForgotPasswordEmail.execute({
        email: 'joedue@exemple.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token ', async () => {
    const generate = jest.spyOn(fakeUsersTokensRepository, 'generate');
    const user = await fakeUserRepository.create({
      name: 'john due',
      email: 'johndue@example.com',
      password: '123123',
    });
    await SendForgotPasswordEmail.execute({
      email: 'johndue@example.com',
    });
    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
