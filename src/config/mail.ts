interface IMailConfig {
  driver: 'ethereal' | 'mailTrap';
}

export default {
  driver: process.env.MAIL_PROVIDER || 'mailTrap',
} as IMailConfig;
