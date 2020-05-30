import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import MailTrapProvider from './implementations/MailTrapProvider';
import IMailProvider from './models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  mailTrap: container.resolve(MailTrapProvider),
};
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver]
);
