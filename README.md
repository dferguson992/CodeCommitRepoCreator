# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Deploying the Stack
Make sure CDK has been bootstrapped into the Account & Region you want to deploy into.

Additionally, ensure you are authenticated to AWS by setting the appropriate environment variables.

Finally, be sure to set the AWS_REGION/AWS_DEFAULT_REGION environment variables if you intend to deploy to a specific region.

Once this is all done, the following is a sample command you can use to deploy this infrastructure:

`cdk deploy --parameters templateRepoName=REPO_NAME --parameters templateRepoEnableNotifications=TRUE|FALSE --parameters sourceRoleArn=SOURCE_ROLE_ARN`

### Parameters
* templateRepoName ==> Name of the repository to create.
* templateRepoEnableNotifications ==> Enable SNS Notifications for the repository.
* sourceRoleArn ==> The role you will use to assume the CodeCommit repository's management role.