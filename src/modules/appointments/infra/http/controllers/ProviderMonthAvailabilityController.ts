import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailability {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { provider_id } = request.params;
      const { month, year } = request.body;

      const providerMonthAvailability = container.resolve(
        ProviderMonthAvailabilityService
      );

      const availability = await providerMonthAvailability.execute({
        provider_id,
        month,
        year,
      });

      return response.json(availability);
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
