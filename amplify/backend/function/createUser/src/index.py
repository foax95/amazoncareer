
import json
import boto3
import uuid
from datetime import datetime
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def handler(event, context):
    try:
        # Parse request body
        body = json.loads(event['body'])

        # Validate required fields
        required_fields = ['email', 'username']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'message': f'Missing required field: {field}'
                    })
                }

        # Check if email already exists
        try:
            response = table.query(
                IndexName='EmailIndex',
                KeyConditionExpression='email = :email',
                ExpressionAttributeValues={
                    ':email': body['email']
                }
            )

            if response['Items']:
                return {
                    'statusCode': 409,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'message': 'Email already exists'
                    })
                }

        except ClientError as e:
            print(e.response['Error']['Message'])

        # Create new user
        timestamp = datetime.utcnow().isoformat()
        user_item = {
            'id': str(uuid.uuid4()),
            'email': body['email'],
            'username': body['username'],
            'createdAt': timestamp,
            'updatedAt': timestamp
        }

        # Add optional fields if they exist
        optional_fields = ['firstName', 'lastName', 'phoneNumber']
        for field in optional_fields:
            if field in body:
                user_item[field] = body[field]

        # Save to DynamoDB
        table.put_item(Item=user_item)

        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(user_item)
        }

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
