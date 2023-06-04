import { JwtService } from '@nestjs/jwt';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../../../src/modules/auth/auth.constants';
import {
  AlreadyRegisteredException,
  AuthService,
  UserNotFoundException,
  WrongPasswordException,
} from '../../../src/modules/auth/auth.service';
import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';
import { User } from '../../../src/schemas/user.schema';
import { UserService } from '../../../src/modules/user/user.service';
import { MockJwtService } from '../../mocks/modules/jwt-service/jwt.service.mock';
import { MockUserRepository } from '../../mocks/user-repository/user-repository.service.mock';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';

describe('AuthService (unit)', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: UserService;

  beforeEach(() => {
    jwtService = new MockJwtService() as unknown as JwtService;
    userRepository = new MockUserRepository() as unknown as UserService;

    authService = new AuthService(userRepository, jwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.register() method tests', () => {
    const USER_DATA: RegisterDto = {
      username: 'test',
      email: 'test@gmail.com',
      password: '1234',
    };

    const USER: User = {
      username: 'test',
      email: 'test@gmail.com',
      passwordHash: 'abcd',
    };

    beforeEach(() => {
      userRepository.getByEmail = jest.fn().mockResolvedValue(null);
      userRepository.create = jest.fn().mockResolvedValue(USER);
    });

    it('Should create new user', async () => {
      const result = await authService.register(USER_DATA);

      expect(userRepository.getByEmail).toHaveBeenCalledWith(USER_DATA.email);
      expect(userRepository.create).toHaveBeenCalledWith(USER_DATA);
      expect(result).toEqual(USER);
    });

    it('Should throw the AlreadyRegisteredException whem user was found', async () => {
      userRepository.getByEmail = jest.fn().mockResolvedValue(USER);

      expect(async () => await authService.register(USER_DATA)).rejects.toThrow(
        new AlreadyRegisteredException(ALREADY_REGISTERED_ERROR),
      );

      expect(userRepository.getByEmail).toHaveBeenCalledWith(USER_DATA.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('.validateUser() method tests', () => {
    const USER_DATA: LoginDto = {
      email: 'test@gmail.com',
      password: '1234',
    };

    const USER: User = {
      username: 'test',
      email: 'test@gmail.com',
      passwordHash: bcryptjs.hashSync(USER_DATA.password),
    };

    beforeEach(() => {
      userRepository.getByEmail = jest.fn().mockResolvedValue(USER);
      jest.spyOn(bcryptjs, 'compare');
    });

    it('Should validate user and return his email', async () => {
      const result = await authService.validateUser(USER_DATA);

      expect(userRepository.getByEmail).toHaveBeenCalledWith(USER_DATA.email);
      expect(bcryptjs.compare).toHaveBeenCalledWith(
        USER_DATA.password,
        USER.passwordHash,
      );
      expect(result).toEqual({ email: USER_DATA.email });
    });

    it('Should throw the UserNotFoundException when user not found', async () => {
      userRepository.getByEmail = jest.fn().mockResolvedValue(null);

      expect(() => authService.validateUser(USER_DATA)).rejects.toThrow(
        new UserNotFoundException(USER_NOT_FOUND_ERROR),
      );

      expect(userRepository.getByEmail).toHaveBeenCalledWith(USER_DATA.email);
      expect(bcryptjs.compare).not.toHaveBeenCalled();
    });

    it('Should throw the WrongPasswordException when password comparing failed', async () => {
      expect(
        async () =>
          await authService.validateUser({ ...USER_DATA, password: 'WRONG' }),
      ).rejects.toThrow(new WrongPasswordException(WRONG_PASSWORD_ERROR));

      expect(userRepository.getByEmail).toHaveBeenCalledWith(USER_DATA.email);
      // expect(bcryptjs.compare).toHaveBeenCalled();
    });
  });
});
