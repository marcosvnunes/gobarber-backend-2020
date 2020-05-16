import { container } from 'tsyringe';

import IHashProvider from './hashProvider/models/IHashProvider';

import BcryptHashProvider from './hashProvider/implementations/BcryptHashProvider';

container.registerSingleton<IHashProvider>(
  'BcryptHashProvider',
  BcryptHashProvider
);
