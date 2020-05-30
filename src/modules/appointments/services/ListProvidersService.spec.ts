import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/fakeCacheProvider';
import ListProvidersService from './ListProvidersService';

describe('ListProviders', () => {
  let fakeUserRepository: FakeUsersRepository;
  let listProviders: ListProvidersService;
  let fakeCacheProvider: FakeCacheProvider;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider
    );
  });

  it('should be able to List all profiles except the user', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'joe due',
      email: 'joedue@exemple.com',
      password: '123123',
    });

    const user2 = await fakeUserRepository.create({
      name: 'joe true',
      email: 'joetrue@exemple.com',
      password: '123123',
    });

    const currentUser = await fakeUserRepository.create({
      name: 'john Quatre',
      email: 'johnQuatre@exemple.com',
      password: '123123',
    });

    const findProfiles = await listProviders.execute({
      user_id: currentUser.id,
    });
    await expect(findProfiles).toEqual([user1, user2]);
  });
});
