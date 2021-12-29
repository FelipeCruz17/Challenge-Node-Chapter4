import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new User", async () => {
    const user = await createUserUseCase.execute({
      name: "Test",
      email: "test@test.com",
      password: "test",
    });

    expect(user).toHaveProperty("id")
  });

  it("Should not be able to create a new user if there is already one with same email", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        name: "Name test",
        email: "Email@test",
        password: "password test"
      })

      await createUserUseCase.execute({
        name: "Name test",
        email: "Email@test",
        password: "password test"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
