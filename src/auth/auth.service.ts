import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user-repository/user-repository.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}
}
