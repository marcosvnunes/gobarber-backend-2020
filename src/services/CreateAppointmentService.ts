import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/appontmentsRepository';

interface Appointment {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: Appointment): Promise<Appointment> {
    const parsedHour = startOfHour(date);
    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const findAppointmentInsameDate = await appointmentRepository.findByDate(
      parsedHour
    );

    if (findAppointmentInsameDate) {
      throw Error('this appointment is already booked');
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date: parsedHour,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
