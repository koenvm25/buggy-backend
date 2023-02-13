import express from 'express';
import { addIssue, getIssue, getIssues } from '../services/issueService.js';

export const issueRouter = express.Router();

issueRouter.get("/", async (req, res) => {
  const issues = await getIssues();
  res.status(200).send(issues);
});

issueRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const issue = await getIssue(id);
  if (issue) {
    res.status(200).send(issue);
  } else {
    res.status(404).send("Issue is not found");
  }
});

issueRouter.post("/", async (req, res) => {
  const body = req.body;
  if (body.title) {
    const issue = { title: body.title, description: body.description };
    const id = await addIssue(issue);
    res.status(201).send(id);
  } else {
    res.status(500).send("something went wrong");
  }
});