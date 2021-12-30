import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { app } from "../../../../app";
import  createConnection  from "../../../../database";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("test", 8)

    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at)
      VALUES('${id}', 'Test Name', 'test@test.com', '${password}', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a deposit", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "Test Name",
      email: "test@test.com",
      password: "test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test"
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit"
    }).set({
      Authorization: `Bearer ${ token }`
    })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.type).toEqual("deposit")
  });

  it("Should be able to create a withdraw", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "Test Name",
      email: "test@test.com",
      password: "test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test"
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "Withdraw"
    }).set({
      Authorization: `Bearer ${ token }`
    })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.type).toEqual("withdraw")
  });

  it("Should not be able to withdraw if funds are insufficient", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "Test Name",
      email: "test@test.com",
      password: "test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test"
    });

    const { token } = responseToken.body;
    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "Withdraw"
    }).set({
      Authorization: `Bearer ${ token }`
    })
    expect(response.status).toBe(400);
  });
})
