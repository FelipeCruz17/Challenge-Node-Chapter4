import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType } from "../../entities/Statement"

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository);
  });

  it("Should not be able to create a statement if a user does not exist", async () => {
    await expect(async () => {
      const statement = await createStatementUseCase.execute({
        amount: 100,
        description: "Statement test",
        type: OperationType.DEPOSIT,
        user_id: "123456"
      })

      await createStatementUseCase.execute(statement)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("Should be able to creat a deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User test",
      email: "Email@test.com",
      password: "password"
    });

    const id = user.id as string;

    const statement = {
      amount: 100,
      description: "Deposit test",
      type: OperationType.DEPOSIT,
      user_id: id
    }

    const depositStatement = await createStatementUseCase.execute(statement);

    expect(depositStatement).toMatchObject(statement)
  });

  it("Should be able to create a withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User test",
      email: "Email@test.com",
      password: "password"
    });

    const id = user.id as string;

    await createStatementUseCase.execute({
      amount: 100,
      description: "Statement deposit test",
      type: OperationType.DEPOSIT,
      user_id: id
    });

    const statement = {
      amount: 100,
      description: "Withdraw test",
      type: OperationType.WITHDRAW,
      user_id: id
    }

    const withdrawStatement = await createStatementUseCase.execute(statement);

    expect(withdrawStatement).toMatchObject(statement)
  });

  it("Should not be able to withdraw if funds are insufficient", async () => {
    await expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "User test",
        email: "Email@test.com",
        password: "password"
      });

      const id = user.id as string;

      await createStatementUseCase.execute({
        amount: 100,
        description: "Statement deposit test",
        type: OperationType.DEPOSIT,
        user_id: id
      });

      const statement =  await createStatementUseCase.execute({
        amount: 500,
        description: "Statement withdraw test",
        type: OperationType.WITHDRAW,
        user_id: id
      })

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
