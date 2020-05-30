import { container } from 'tsyringe';
import DiskStoregaProvider from './implementations/DiskStoregaProvider';
import IStorageProvider from './models/IStorageProvider';

const providers = {
  disk: DiskStoregaProvider,
};

container.registerSingleton<IStorageProvider>(
  'MailTemplateProvider',
  providers.disk
);
