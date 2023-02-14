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

const getIssuesQuery =
  "SELECT issue.issue_id, issue.created_at, issue.title, issue.description, issue.updated_at, project.name, project.project_id, project.estimated_end_date FROM issue INNER JOIN project ON issue.project_id=project.project_id ORDER BY issue_id ASC";
const getIssueQuery =
  "SELECT issue.issue_id, issue.created_at, issue.title, issue.description, issue.updated_at, project.name, project.project_id, project.estimated_end_date FROM issue INNER JOIN project ON issue.project_id=project.project_id WHERE issue_id = 8";
const addIssueQuery =
  "INSERT INTO issue(title, description, project) VALUES($1, $2, $3) RETURNING issue)id";
const updateIssueQuery =
  "UPDATE issue SET title = $1, description = $2, updated_at = $3 WHERE issue_id = $4";
const getIssuesPerProjectQuery = "SELECT * FROM issue where project_id = $1";

export const getIssues = async () => {
  const results = await client.query(getIssuesQuery);
  const issues = results.rows.map((row) => {
    return mapToIssue(row);
  })
  return issues;
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

const mapToIssue = (row) => {
  const issue = {
    issueId: row.issue_id,
    createdAt: row.created_at,
    title: row.title,
    description: row.description,
    updatedAt: row.updated_at,
    projectId: row.project_id,
    projectName: row.name,
    projectEstimatedEndDate: row.estimated_end_date
  };
  return issue;
};
