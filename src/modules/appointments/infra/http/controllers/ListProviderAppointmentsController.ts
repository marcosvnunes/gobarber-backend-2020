import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointments';

export default class ListProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const provider_id = request.user.id;
      const { day, month, year } = request.body;

      const listProviderAppointments = container.resolve(
        ListProviderAppointmentsService
      );

      const availability = await listProviderAppointments.execute({
        provider_id,
        day,
        month,
        year,
      });

      return response.json(availability);
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
