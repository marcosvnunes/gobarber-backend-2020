import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ListProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const provider_id = request.user.id;
      const { day, month, year } = request.query;
      const listProviderAppointments = container.resolve(
        ListProviderAppointmentsService
      );

      const appointments = await listProviderAppointments.execute({
        provider_id,
        day: Number(day),
        month: Number(month),
        year: Number(year),
      });

      return response.json(classToClass(appointments));
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
