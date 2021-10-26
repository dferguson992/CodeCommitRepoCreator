import * as cdk from '@aws-cdk/core';
import * as cc from '@aws-cdk/aws-codecommit';
import * as iam from '@aws-cdk/aws-iam';
import {Topic} from '@aws-cdk/aws-sns';
import {CfnParameter} from "@aws-cdk/core";

export class CodeCommitRepoMakerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repoName = new CfnParameter(this, "templateRepoName", {
      type: "String",
      description: "The name of the Amazon CodeCommit repository to be created."
    });

    const enableNotifications = new CfnParameter(this, "templateRepoEnableNotifications", {
      type: "String",
      description: "Determines if SNS Notifications for the repository will be enabled or not."
    });

    const repo = new cc.Repository(this, 'template-repo', {
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

    new iam.User(this, 'repo-owner', {
      groups:           undefined,
      managedPolicies:  [
          iam.ManagedPolicy.fromManagedPolicyArn(this, 'import-managed-policy', 'arn:aws:iam::aws:policy/AWSCodeCommitPowerUser')
        ],
      userName:         repo.repositoryName + 'RepositoryOwner',
    })

  }
}
