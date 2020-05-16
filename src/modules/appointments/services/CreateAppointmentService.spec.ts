import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '../infra/repositories/fakes/fakeAppointmnetsRepository';

describe('CreateAppointment', () => {
  it('should be able to create a new appointmnet', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );

    const appointment = await createAppointment.execute({
      provider_id: '123123',
      date: new Date(),
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments on the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
    const appointmentDate = new Date();
    await createAppointment.execute({
      provider_id: '123123',
      date: appointmentDate,
    });
    expect(
      createAppointment.execute({
        provider_id: '123123',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
