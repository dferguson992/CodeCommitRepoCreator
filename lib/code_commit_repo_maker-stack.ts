#!/usr/bin/env node
import {CfnParameter, Construct, Duration, RemovalPolicy, Stack, StackProps} from "@aws-cdk/core";
import {Repository} from '@aws-cdk/aws-codecommit';
import {Topic} from '@aws-cdk/aws-sns';
import {ArnPrincipal, CompositePrincipal, ManagedPolicy, Role, ServicePrincipal} from "@aws-cdk/aws-iam";

export class CodeCommitRepoMakerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceRoleArn = new CfnParameter(this, "sourceRoleArn", {
      type:         "String",
      description:  "The ARN of the role used to assume CodeCommit operations."
    })

    const repoName = new CfnParameter(this, "templateRepoName", {
      type: "String",
      description: "The name of the Amazon CodeCommit repository to be created."
    });

    const enableNotifications = new CfnParameter(this, "templateRepoEnableNotifications", {
      type: "String",
      description: "Determines if SNS Notifications for the repository will be enabled or not."
    });

    const repo = new Repository(this, 'template-repo', {
      repositoryName:   repoName.valueAsString,
      description:      "CDK generated CodeCommit repository."
    })

    if (enableNotifications.valueAsString == 'True') {
      repo.notify(new Topic(this, 'notification-topic', {
        contentBasedDeduplication:  false,
        displayName:                repoName.valueAsString + "_notification_topic",
        fifo:                       false,
        topicName:                  repoName.valueAsString + "_notification_topic",
        masterKey:                  undefined
      }).topicArn);
    }

    const policy = ManagedPolicy.fromManagedPolicyArn(this, 'imported-role', 'arn:aws:iam::aws:policy/AWSCodeCommitPowerUser');
    new Role(this, 'repo-owner', {
      roleName: repo.repositoryName + 'RepositoryOwner',
      description: "Role used to manage this repository.",
      assumedBy: new CompositePrincipal(
          new ServicePrincipal('codecommit.amazonaws.com', {
            region: props?.env?.region
          }),
          new ArnPrincipal(sourceRoleArn.valueAsString)
      ),
      managedPolicies: [policy],
      permissionsBoundary: policy,
      maxSessionDuration: Duration.minutes(60)
    }).applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}
