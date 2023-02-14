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

const getProjectsQuery = "SELECT * FROM project ORDER BY project_id ASC";
const getProjectQuery = "SELECT * FROM project WHERE project_id = $1";
const addProjectQuery =
  "INSERT INTO project(name, description, estimated_end_date, updated_at) VALUES($1, $2, $3, $4) RETURNING project_id";
const updateProjectQuery =
  "UPDATE project SET name = $1, description = $2, estimated_end_date = $3, updated_at = $4 WHERE project_id = $5";

export const getProjects = async () => {
  const results = await client.query(getProjectsQuery);
  const projects = results.rows.map((row) => {
    return mapToProject(row)
    // projects.push(project);
  });
  return projects;
};

export const getProject = async (id) => {
  try {
    const results = await client.query(getProjectQuery, [id]);
    const project = mapToProject(results.rows[0])
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

const mapToProject = (row) => {
  const project = {
    projectId: row.project_id,
    createdAt: row.created_at,
    name: row.name,
    description: row.description,
    estimatedEndDate: row.estimated_end_date,
    updatedAt: row.updated_at,
  };
  return project;
};
