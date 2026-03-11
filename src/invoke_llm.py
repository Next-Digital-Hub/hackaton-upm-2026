import boto3
import os


def invoke_llm(system_prompt: str, user_prompt: str):
    # parameters
    KB_ID = os.getenv('KB_ID')
    MODEL_ID = os.getenv('MODEL_ID')
    REGION = os.getenv('AWS_REGION')

    # bedrock conection
    bedrock_runtime = boto3.client('bedrock-agent-runtime', region_name=REGION)

    # Params
    request_params = {
        'input': {
            'text': user_prompt
        },
        'retrieveAndGenerateConfiguration': {
            'type': 'KNOWLEDGE_BASE',
            'knowledgeBaseConfiguration': {
                'knowledgeBaseId': KB_ID,
                'modelArn': f'arn:aws:bedrock:{REGION}::foundation-model/{MODEL_ID}',
                'generationConfiguration': {
                    'promptTemplate': {
                        'textPromptTemplate': system_prompt
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
