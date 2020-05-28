import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailability {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { provider_id } = request.params;
      const { day, month, year } = request.body;

      const providerDayAvailability = container.resolve(
        ListProviderDayAvailabilityService
      );

      const availability = await providerDayAvailability.execute({
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
