#!/usr/bin/env node
import 'source-map-support/register';
import {App} from '@aws-cdk/core';
import { CodeCommitRepoMakerStack } from '../lib/code_commit_repo_maker-stack';

const app = new App();

let projectName = process.env.PROJECT_NAME;
if (projectName === undefined) {
  projectName = app.node.tryGetContext('projectName')
}
if (projectName === undefined) {
  projectName = (Math.random() + 1).toString(26).substring(7);
}

new CodeCommitRepoMakerStack(app, `${projectName}-CodeCommitRepoMakerStack`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  terminationProtection: true
});
