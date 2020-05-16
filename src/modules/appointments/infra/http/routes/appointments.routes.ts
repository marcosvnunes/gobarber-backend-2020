import { Router } from 'express';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import AppointmentsController from '../controllers/appointmentsController';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticate);

// appointmentsRouter.get('/', async (request, response) => {
//  const appointments = await appointmentsRepository.find();
//  return response.json(appointments);
// });

const appointmentsController = new AppointmentsController();

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
