import 'reflect-metadata';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/fakeAppointmnetsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

describe('ListProviderMonthAvailability', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository
    );
  });

  it('should be able to List the month availability from provider', async () => {
    const year = 2025;

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 9, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 13, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 16, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 18, 17, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2025, 4, 19, 10, 0, 0),
    });

    const listAppointments = await listProviderMonthAvailability.execute({
      provider_id: '123123',
      month: 5,
      year: 2025,
    });

    expect(listAppointments).toEqual(
      expect.arrayContaining([
        { day: 17, availability: true },
        { day: 18, availability: false },
        { day: 19, availability: true },
        { day: 20, availability: true },
      ])
    );
  });
});
