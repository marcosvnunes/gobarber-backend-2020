import { Request, Response } from 'express';
import AutheticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const autheticateUser = container.resolve(AutheticateUserService);

      const { user, token } = await autheticateUser.execute({
        email,
        password,
      });

      delete user.password;

      return response.json({ user, token });
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
