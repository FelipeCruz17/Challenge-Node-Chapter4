import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError"

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show a user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@test.com",
      name: "User test",
      password: "password"
    });
    const id = user.id as string;

    const userFound = await showUserProfileUseCase.execute(id)

    expect(userFound).toEqual(user);
  })

  it("Should not be able to show user profile if user does not exist", async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute("123")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
