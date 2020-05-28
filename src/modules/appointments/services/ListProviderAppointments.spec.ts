import 'reflect-metadata';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/fakeAppointmnetsRepository';
import ListProviderAppointments from './ListProviderAppointments';

describe('ListProviderDayAvailability', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderAppointments: ListProviderAppointments;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderAppointments = new ListProviderAppointments(
      fakeAppointmentRepository
    );
  });

  it('should be able to List the day availability from provider', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 9, 0, 0),
    });

    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 11, 0, 0),
    });

    const listAppointments = await listProviderAppointments.execute({
      provider_id: '123123',
      day: 18,
      month: 4,
      year: 2020,
    });

    expect(listAppointments).toEqual([appointment1, appointment2]);
  });
});
