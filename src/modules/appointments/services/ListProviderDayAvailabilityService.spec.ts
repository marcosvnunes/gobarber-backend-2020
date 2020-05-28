import 'reflect-metadata';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/fakeAppointmnetsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

describe('ListProviderDayAvailability', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderDayhAvailability: ListProviderDayAvailabilityService;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayhAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository
    );
  });

  it('should be able to List the day availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 9),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 11),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 3, 18, 13),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 18, 10).getTime();
    });

    const listAppointments = await listProviderDayhAvailability.execute({
      provider_id: '123123',
      day: 18,
      month: 4,
      year: 2020,
    });

    expect(listAppointments).toEqual(
      expect.arrayContaining([
        { hour: 8, availability: false },
        { hour: 9, availability: false },
        { hour: 11, availability: false },
        { hour: 12, availability: true },
        { hour: 13, availability: false },
      ])
    );
  });
});
