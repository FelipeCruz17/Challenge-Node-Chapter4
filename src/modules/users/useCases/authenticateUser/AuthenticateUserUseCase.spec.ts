import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../useCases/authenticateUser/IncorrectEmailOrPasswordError"

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      name: "User test",
      password: "password"
    }

    await createUserUseCase.execute(user);

    const userCreated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userCreated).toHaveProperty("token");
  });

  it("should not be able to authenticate an user with incorrect email", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        password: "test",
        email: "test@test.com",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "test@nonexistent.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with incorrect password", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        password: "test",
        email: "test@test.com",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
