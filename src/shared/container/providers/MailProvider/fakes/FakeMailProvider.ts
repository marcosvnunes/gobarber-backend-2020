import IMailProvider from '../models/IMailProvider';
import IsendMailDTO from '../dtos/ISendMailDTO';

class FakeMailProvider implements IMailProvider {
  private mailList: IsendMailDTO[] = [];

  public async sendMail(message: IsendMailDTO): Promise<void> {
    this.mailList.push(message);
  }
}

export default FakeMailProvider;
