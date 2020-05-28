import { Request, Response } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { container } from 'tsyringe';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { password, token } = request.body;
      const resetPassword = container.resolve(ResetPasswordService);

      await resetPassword.execute({
        password,
        token,
      });

      return response.status(204).send();
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
