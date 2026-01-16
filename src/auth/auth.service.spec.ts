import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt globally to avoid the "Cannot redefine property" error
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let repository;
  let jwtService;

  const mockUsersRepository = () => ({
    findOne: jest.fn(),
    createUser: jest.fn(),
  });

  const mockJwtService = () => ({
    signAsync: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    const credentials = { username: 'Fred', password: 'password123' };

    // TEST 1: SUCCESS PATH
    it('should return an access token on successful sign in', async () => {
      repository.findOne.mockResolvedValue({ username: 'Favour', password: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      await jwtService.signAsync.mockResolvedValue('fakeToken');

      const result = await service.signIn(credentials);
      
      // Note: We use access_token (snake_case) to match your return {access_token}
      expect(result).toEqual({ token: 'fakeToken' });
    });

    // TEST 2: USER NOT FOUND PATH
    it('should throw UnauthorizedException if user is not found', async () => {
      // Mock repository to return null (no user exists with that name)
      repository.findOne.mockResolvedValue(null);

      await expect(service.signIn(credentials)).rejects.toThrow(UnauthorizedException);
    });

    // TEST 3: WRONG PASSWORD PATH
    it('should throw UnauthorizedException if password does not match', async () => {
      repository.findOne.mockResolvedValue({ username: 'Favour', password: 'hashedPassword' });
      
      // Mock bcrypt to return false (password mismatch)
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(credentials)).rejects.toThrow(UnauthorizedException);
    });
  });
});