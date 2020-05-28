import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('AppointmentsRepository')
    private appontmentRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appontmentRepository.findAllInDayFromProvider(
      { provider_id, day, month, year }
    );

    return appointments;
  }
}

export default AuthenticateUserService;
