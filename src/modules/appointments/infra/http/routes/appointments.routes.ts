import { Router } from 'express';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import { celebrate, Segments, Joi } from 'celebrate';
import AppointmentsController from '../controllers/appointmentsController';
import ListProviderAppointmentsController from '../controllers/ListProviderAppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticate);

// appointmentsRouter.get('/', async (request, response) => {
//  const appointments = await appointmentsRepository.find();
//  return response.json(appointments);
// });

const appointmentsController = new AppointmentsController();
const listProviderAppointmentsController = new ListProviderAppointmentsController();

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.string().isoDate(),
    },
  }),
  appointmentsController.create
);
appointmentsRouter.get('/me', listProviderAppointmentsController.index);

export default appointmentsRouter;
