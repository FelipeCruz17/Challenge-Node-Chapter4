import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { app } from "../../../../app";
import  createConnection  from "../../../../database";

let connection: Connection;

describe("Authenticate User", () => {
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

  it("Should be able to authenticate a user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test"
    });

    const { token } = responseToken.body;

    expect(responseToken.body).toHaveProperty("token")
  });
})
