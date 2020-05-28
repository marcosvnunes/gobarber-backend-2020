import ICreateNotifications from '../dtos/ICreateNotifications';

import Notifications from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotifications): Promise<Notifications>;
}
