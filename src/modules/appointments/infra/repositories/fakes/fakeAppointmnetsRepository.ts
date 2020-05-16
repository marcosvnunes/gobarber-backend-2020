import ICreateAppontmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '../../typeorm/entities/appointment';
import IAppointmentsRepository from '../IAppointmentsRepository';

class AppointmentsRepository implements IAppointmentsRepository {
  private Appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.Appointments.find(appointment =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppontmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, date });

    this.Appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
