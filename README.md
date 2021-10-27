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

`cdk deploy -c projectName=PROJECT_NAME --parameters templateRepoName=REPO_NAME --parameters templateRepoEnableNotifications=TRUE|FALSE --parameters sourceRoleArn=SOURCE_ROLE_ARN`

### Environment Variables
* AWS_DEFAULT_REGION
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* CDK_DEFAULT_ACCOUNT
* AWS_SESSION_TOKEN
** Not required, but best practice to connect to AWS within a session
* PROJECT_NAME
** Not required, use in lieu of the context flag.  If neither context flag nor environment variable is set, CDK will supply a random string to ensure stack uniqueness.
** Unique stack names will not ensure successful deployments.  Resource conflicts will still exist if you do not change the CodeCommit repository name.

### Parameters
* templateRepoName ==> Name of the repository to create.
* templateRepoEnableNotifications ==> Enable SNS Notifications for the repository.
* sourceRoleArn ==> The role you will use to assume the CodeCommit repository's management role.

## Next Steps
Now, we modify the `~/.aws/config` file.  We need to create a local profile that will assume our new role and permit the CodeCommit actions we want to take.
The changes to this file should look similar to the below
```text
[profile PROFILE_NAME]
role_arn = ARN_OF_CREATED_ROLE
source_profile = ARN_OF_SOURCE_ROLE
role_session_name = CodeCommitSession
```
Once we've made those changes, we can navigate to the CodeCommit repository in the AWS Console.  Copy the HTTPS (GRC) URL from the repository
in the AWS Console and set this URL as the upstream for the repository you are trying to store on AWS CodeCommit. 

Be sure to modify this URL by injecting the PROFILE_NAME into the HTTPS (GRC) URL.  The intial URL starts like `codecommit::AWS_REGION://REPO_NAME`
and ends like `codecommit::AWS_REGION://PROFILE_NAME@REPO_NAME`.

This simple change tells the `git-remote-codecommit` process to assume the local profile.  The `~/.aws/config` file maps the local profile to
the role we just created by deploying this stack.  We are allowed to do this because we configured this new role to be assumed by our "source role", 
i.e. the role we use for BAU tasks.  

Note, the role we are assuming is a CodeCommit Power User with a 60 minute session duration.  Least privileged access is not currently enforced.

One final note, this project deploys stacks with Termination Protection enabled.