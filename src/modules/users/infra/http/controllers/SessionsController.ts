import { Request, Response } from 'express';
import AutheticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const autheticateUser = container.resolve(AutheticateUserService);

      const { user, token } = await autheticateUser.execute({
        email,
        password,
      });

      return response.json({ user: classToClass(user), token });
    } catch (err) {
      return response.status(400).json({ Error: err.message });
    }
  }
}
