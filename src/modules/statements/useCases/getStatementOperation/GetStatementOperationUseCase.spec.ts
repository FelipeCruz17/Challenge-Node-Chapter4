import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get a user statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "test",
      password: "password"
    })

    const user_id = user.id as string;

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "test description",
      type: OperationType.DEPOSIT,
      user_id
    })

    const statement_id = statement.id as string;

    const userStatement = await getStatementOperationUseCase.execute({
      statement_id,
      user_id
    })

    expect(userStatement).toEqual(statement)
  });

  it("Should not be able to get a statement if a user does not exist", async () => {
    await expect(async () => {
      const statement = await inMemoryStatementsRepository.create({
        amount: 100,
        description: "test description",
        type: OperationType.DEPOSIT,
        user_id: "123"
      })

      const statement_id = statement.id as string;

      await getStatementOperationUseCase.execute({
        statement_id,
        user_id: "123456"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it("Should not be able to get a non-existing statement", async () => {
    await expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@test.com",
        name: "test",
        password: "password"
      })

      const user_id = user.id as string;

      await getStatementOperationUseCase.execute({
        statement_id: "123456",
        user_id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
})
