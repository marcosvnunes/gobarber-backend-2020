import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityControler from '../controllers/ProviderDayAvailabilityControler';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticate);

const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityControler = new ProviderDayAvailabilityControler();

appointmentsRouter.get('/', providersController.index);
appointmentsRouter.get(
  '/:provider_id/month-availability/',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index
);
appointmentsRouter.get(
  '/:provider_id/day-availability/',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityControler.index
);

export default appointmentsRouter;
