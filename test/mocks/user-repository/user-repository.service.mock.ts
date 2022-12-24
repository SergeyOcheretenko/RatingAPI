export class MockUserRepository {
  findByEmail = jest.fn;
  create = jest.fn;
}
