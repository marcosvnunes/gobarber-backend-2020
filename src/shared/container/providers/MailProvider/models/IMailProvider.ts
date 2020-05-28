import IsendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendMail(data: IsendMailDTO): Promise<void>;
}
