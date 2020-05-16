import { startOfHour } from 'date-fns';
import AppointmentRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/appointment';

interface IRequest {
  provider_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: AppointmentRepository
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const parsedHour = startOfHour(date);

    const findAppointmentInsameDate = await this.appointmentRepository.findByDate(
      parsedHour
    );

    if (findAppointmentInsameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = this.appointmentRepository.create({
      provider_id,
      date: parsedHour,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
