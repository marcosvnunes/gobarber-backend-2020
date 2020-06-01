import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  availability: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appontmentRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appontmentRepository.findAllInDayFromProvider(
      { provider_id, day, month, year }
    );

    const startHour = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour
    );

    const currentDate = new Date(Date.now());

    const hoursAvailability = eachHourArray.map(hour => {
      const hasAppointmnetInHour = appointments.find(
        appointment => hour === getHours(appointment.date)
      );

      const compareDate = new Date(year, month - 1, day, hour);
      console.log(currentDate, compareDate);
      return {
        hour,
        availability:
          !hasAppointmnetInHour && isAfter(compareDate, currentDate),
      };
    });

    return hoursAvailability;
  }
}

export default ListProviderDayAvailabilityService;
