import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter, subDays } from 'date-fns';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availability: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appontmentRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appontmentRepository.findAllInMonthFromProvider(
      { provider_id, month, year }
    );
    const numberDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const eachDayArray = Array.from(
      { length: numberDaysInMonth },
      (_, index) => index + 1
    );
    const currentDate = subDays(new Date(), 1);
    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day
      );
      const compareDate = new Date(year, month - 1, day);
      return {
        day,
        availability:
          appointmentsInDay.length < 10 && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
