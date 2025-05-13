# amplify/backend/function/getUserFunction/src/index.py

import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def handler(event, context):
    try:
        # Get user ID from path parameters
        user_id = event['pathParameters']['id']

        # Get user from DynamoDB
        try:
            response = table.get_item(
                Key={
                    'id': user_id
                }
            )

            # Check if user exists
            if 'Item' not in response:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'message': 'User not found'
                    })
                }

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(response['Item'])
            }

        except ClientError as e:
            print(e.response['Error']['Message'])
            raise

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Internal server error'
            })
        }
