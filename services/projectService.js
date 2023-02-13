import pkg from "pg";

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

const getProjectsQuery = "SELECT * FROM project ORDER BY id ASC";
const getProjectQuery = "SELECT * FROM project WHERE id = $1";
const addProjectQuery =
  "INSERT INTO project(name, description, estimated_end_date, updated_at) VALUES($1, $2, $3, $4) RETURNING id";
const updateProjectQuery =
  "UPDATE project SET name = $1, description = $2, estimated_end_date = $3, updated_at = $4 WHERE id = $5";

export const getProjects = async () => {
  const projects = []
  const results = await client.query(getProjectsQuery);
  results.rows.map((row) => {
    const project = {
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      description: row.description,
      estimatedEndDate: row.estimated_end_date,
      updatedAt: row.updated_at,
    }
    projects.push(project)
  })
  return projects;
};

export const getProject = async (id) => {
  try {
    const results = await client.query(getProjectQuery, [id]);
    const project = {
      id: results.rows[0].id,
      createdAt: results.rows[0].created_at,
      name: results.rows[0].name,
      description: results.rows[0].description,
      estimatedEndDate: results.rows[0].estimated_end_date,
      updatedAt: results.rows[0].updated_at,
    }
    return project;
  } catch (err) {
    console.error(err.stack);
  }
};

export const addProject = async (project) => {
  const values = [
    project.name,
    project.description,
    project.estimatedEndDate,
    new Date(),
  ];
  try {
    const results = await client.query(addProjectQuery, values);
    return results.rows[0].id;
  } catch (err) {
    console.error(err.stack);
  }
};

export const updateProject = async (project, id) => {
  await client.query(updateProjectQuery, [
    project.name,
    project.description,
    project.estimatedEndDate,
    new Date(),
    id,
  ]);
};
