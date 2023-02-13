import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;
const credentials = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
};
const client = new Client(credentials);
client.connect();

const getIssuesQuery = "SELECT * FROM issue ORDER BY id ASC";
const getIssueQuery = "SELECT * FROM issue WHERE id = $1";
const addIssueQuery =
  "INSERT INTO issue(title, description, project) VALUES($1, $2, $3) RETURNING id";
const updateIssueQuery = "UPDATE issue SET title = $1, description = $2, updated_at = $3 WHERE id = $4"
const getIssuesPerProjectQuery = "SELECT * FROM issue where project = $1";

export const getIssues = async () => {
  const results = await client.query(getIssuesQuery);
  return results.rows;
};

export const getIssue = async (id) => {
  try {
    const results = await client.query(getIssueQuery, [id]);
    return results.rows[0];
  } catch (err) {
    console.error(err.stack);
  }
};

export const updateIssue = async (issue, id) => {
  await client.query(updateIssueQuery, [
    issue.title,
    issue.description,
    new Date(),
    id,
  ]);
};

export const addIssue = async (issue, projectId) => {
  const values = [issue.title, issue.description, projectId];
  try {
    const results = await client.query(addIssueQuery, values);
    return results.rows[0].id;
  } catch (err) {
    console.error(err.stack);
  }
};

export const getIssuesPerProject = async (id) => {
  try {
    const results = await client.query(getIssuesPerProjectQuery, [id]);
    return results.rows;
  } catch (err) {
    console.error(err.stack);
  }
};

// export const archiveIssue = (id) => {
//   try {
//     await client.query
//   }
// }
