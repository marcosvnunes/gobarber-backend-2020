import { Request, Response } from 'express';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import { container } from 'tsyringe';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = request.body;
      const resetPassword = container.resolve(SendForgotPasswordEmailService);

      await resetPassword.execute({
        email,
      });

      return response.status(204).send();
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
