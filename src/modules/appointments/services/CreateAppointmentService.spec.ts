import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRespository from '@modules/notifications/repositories/fakes/fakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/fakeAppointmnetsRepository';

describe('CreateAppointment', () => {
  let fakeAppointmentsRepository: FakeAppointmentRepository;
  let fakeNotificationsRespository: FakeNotificationsRespository;
  let createAppointment: CreateAppointmentService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentRepository();
    fakeNotificationsRespository = new FakeNotificationsRespository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRespository
    );
  });

  it('should be able to create a new appointmnet', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 11),
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    await createAppointment.execute({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 11),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '123123',
        user_id: '123456',
        date: new Date(2020, 3, 18, 11),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in pass date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    const appointmentDate = new Date(2020, 3, 18, 9);

    await expect(
      createAppointment.execute({
        provider_id: '123123',
        user_id: '123456',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in same user provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    const appointmentDate = new Date(2020, 3, 18, 11);

    await expect(
      createAppointment.execute({
        provider_id: 'user_id',
        user_id: 'user_id',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am or last 17pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    const appointmentDate = new Date(2020, 3, 18, 18);

    await expect(
      createAppointment.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 3, 19, 7),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
