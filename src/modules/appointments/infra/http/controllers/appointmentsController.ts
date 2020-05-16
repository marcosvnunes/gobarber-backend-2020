import { Request, Response } from 'express';

import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentControler {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { provider_id, date } = request.body;

      const parsedDate = parseISO(date);

      const appointmnetService = container.resolve(CreateAppointmentService);

      const appointment = await appointmnetService.execute({
        provider_id,
        date: parsedDate,
      });

      return response.json(appointment);
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
