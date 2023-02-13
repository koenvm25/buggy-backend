import express from "express";
import { addIssue, getIssuesPerProject } from "../services/issueService.js";
import {
  addProject,
  getProject,
  getProjects,
  updateProject,
} from "../services/projectService.js";

export const projectRouter = express.Router();

projectRouter.get("/", async (req, res) => {
  const projects = await getProjects();
  res.status(200).send(projects);
});

projectRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const project = await getProject(id);
  if (project) {
    res.status(200).send(project);
  } else {
    res.status(404).send("Project is not found");
  }
});

projectRouter.post("/", async (req, res) => {
  const body = req.body;
  console.log(body);
  if (body.name) {
    const project = {
      name: body.name,
      description: body.description,
      estimatedEndDate: body.estimatedEndDate,
    };
    const id = await addProject(project);
    res.status(200).send(id);
  } else if (!body.name) {
    res.status(400).send({ error: "Name is required" });
  } else {
    res.status(500);
  }
});

projectRouter.put("/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const date = new Date(Date.parse(body.estimatedEndDate));
  if (body.name) {
    const project = {
      name: body.name,
      description: body.description,
      estimatedEndDate: date,
    };
    await updateProject(project, id);
    res.status(200).send(`Project with id: ${id} has been updated`);
  } else if (!body.name) {
    res.status(400).send({ error: "Name is required" });
  } else {
    res.status(500);
  }
});

projectRouter.get("/:id/issues", async (req, res) => {
  const id = req.params.id;
  const issues = await getIssuesPerProject(id);
  res.status(200).send(issues);
});

projectRouter.post("/:id/issues", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const project = await getProject(id);
  if (body.title && project.id) {
    const issue = { title: body.title, description: body.description };
    const issueId = await addIssue(issue, id);
    res.status(201).send(issueId);
  } else if (!project.id) {
    res
      .status(400)
      .send({ error: "inputValidation', message: 'Project id can't be found" });
  } else if (!body.title) {
    res.status(400).send({ error: "Title is required" });
  } else {
    res.status(500);
  }
});
