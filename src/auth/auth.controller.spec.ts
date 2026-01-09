import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './auth-credential.dto';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // 1. ARRANGE: Create a Mock Service
  // We use jest.fn() so we can track if these methods are called
  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  // Reset mocks after each test to ensure a clean slate
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- SIGN UP TEST ---
  describe('SignUp', () => {
    it('should call authService.signUp and return the result', async () => {
      const dto: AuthCredentialDto = { username: 'fred', password: 'password123' };
      const expectedResult = { message: 'User created successfully' };

      // Training the mock
      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.SignUp(dto);

      expect(service.signUp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  // --- SIGN IN TEST ---
  describe('SignIn', () => {
    it('should return an access token when credentials are valid', async () => {
      const dto: AuthCredentialDto = { username: 'fred', password: 'password123' };
      const mockToken = { accessToken: 'secret-jwt-token' };

      // Training the mock
      mockAuthService.signIn.mockResolvedValue(mockToken);

      const result = await controller.SignIn(dto);

      expect(service.signIn).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockToken);
    });
  });

  // --- GREETINGS TEST ---
  describe('greetings', () => {
    it('should return the "Oga Fred" string', () => {
      const result = controller.greetings();
      expect(result).toBe("Greetings Oga Fred");
    });
  });

  // --- GET USER ID TEST ---
  describe('getUserId', () => {
    it('should return the username passed manually', () => {
      // In a unit test, we don't need the decorator to run.
      // We just pass the argument directly to the method.
      const username = 'fred_dev';
      const result = controller.getUserId(username);

      expect(result).toEqual({ username: 'fred_dev' });
    });
  });
});