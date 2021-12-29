import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = "database_challenge"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === "test" ? "localhost": host,
      database: process.env.NODE_ENV === "test"
      ? "challenge_test" : defaultOptions.database
    })
  )
}
