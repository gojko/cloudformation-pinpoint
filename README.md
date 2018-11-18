# Custom CloudFormation resource for deploying Pinpoint applications

1. package the template

```bash
aws cloudformation package --template-file pinpoint-configuration.yml --output-template-file output.yml --s3-bucket $DEPLOYMENT_BUCKET_NAME
```

2. deploy the template (using CAPABILITIES_IAM for role creation)

```bash
aws cloudformation deploy --capabilities CAPABILITY_IAM --template-file output.yml --stack-name $STACK_NAME --parameter-overrides AppName=$APPLICATION_NAME 
```

if you have a dead-letter SNS topic for unrecoverable Lambda errors (optional but recommended), add it as well to the parameter overrides

```bash
aws cloudformation deploy --capabilities CAPABILITY_IAM --template-file output.yml --stack-name $STACK_NAME --parameter-overrides AppName=$APPLICATION_NAME DLQSNSTopicARN=$SNS_TOPIC_ARN
```
  

