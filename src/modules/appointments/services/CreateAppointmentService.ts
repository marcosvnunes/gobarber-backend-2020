import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import NotificationRepository from '@modules/notifications/repositories/INotificationsRepository';

import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/appointment';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: AppointmentRepository,

    @inject('NotificationsRepository')
    private notificationRepository: NotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const appointmentHour = getHours(appointmentDate);

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError(
        'you should create an appointment only between 8:AM and 17:PM  '
      );
    }

    if (provider_id === user_id) {
      throw new AppError("you can't create an appointment for yourself ");
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("you can't create an appointment on a pass date ");
    }
    const findAppointmentInsameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointmentInsameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formatedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${formatedDate}`,
    });

    await this.cacheProvider.invalidade(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d'
      )}`
    );
    return appointment;
  }
}

export default CreateAppointmentService;
