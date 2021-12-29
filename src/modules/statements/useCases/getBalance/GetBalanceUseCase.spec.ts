import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )})

  it("Should be able to get an user balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@teste.com",
      password: "test"
    })
    const user_id = user.id as string;

    await inMemoryStatementsRepository.create({
      amount: 100,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id
    })

    const balance = await getBalanceUseCase.execute({ user_id })
    expect(balance).toHaveProperty("balance")
  });

  it("Should not be able to get a user balance if user does not exist", async () => {
    await expect(async () => {
      await getBalanceUseCase.execute({ user_id: "123456" })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
