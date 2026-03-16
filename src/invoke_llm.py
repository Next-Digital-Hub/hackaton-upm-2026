import boto3
import os


def invoke_llm(system_prompt: str, user_prompt: str):
    # parameters
    KB_ID = os.getenv('KB_ID')
    MODEL_ID = os.getenv('MODEL_ID')
    MODEL_ARN = os.getenv('MODEL_ARN')
    REGION = os.getenv('AWS_REGION')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

    session = boto3.Session(
        region_name=REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    bedrock_runtime = session.client('bedrock-agent-runtime', region_name=REGION)

    combined_prompt = f"$search_results$ {system_prompt} {user_prompt}"

    # Params
    request_params = {
        'input': {
            'text': user_prompt
        },
        'retrieveAndGenerateConfiguration': {
            'type': 'KNOWLEDGE_BASE',
            'knowledgeBaseConfiguration': {
                'knowledgeBaseId': KB_ID,
                'modelArn': MODEL_ARN,
                'generationConfiguration': {
                    'promptTemplate': {
                        'textPromptTemplate': combined_prompt
                    }
                },
                'retrievalConfiguration': {
                    'vectorSearchConfiguration': {
                        'numberOfResults': 6
                    }
                }
            }
        }
    }

    # retriver and invoke
    response = bedrock_runtime.retrieve_and_generate(**request_params)
    return response['output']['text']
