"""
Weather Data Analysis Agent Tools

This module provides tools for querying weather data and knowledge bases using LangChain
and AWS Bedrock. It includes functionality for searching historical weather conditions
and retrieving information from AWS Knowledge Bases.

Dependencies:
    - langchain_aws: For AWS Bedrock integration
    - langchain_community: For AWS Knowledge Base retrieval
    - boto3: For AWS S3 operations
    - pandas: For data manipulation
    - dotenv: For environment variable management
"""

import os
from langchain_aws import ChatBedrock
from langchain_community.retrievers import AmazonKnowledgeBasesRetriever
from langchain.agents import create_agent
from langchain.tools import tool
import json
import pandas as pd
import boto3
from io import StringIO
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


@tool
def search_similar_conditions(
    provincia: str,
    presMax: float = None,
    presMin: float = None,
    nombre: str = None,
    prec: float = None,
    sol: float = None,
    velmedia: float = None,
    tmed: float = None,
    tmax: float = None,
    tmin: float = None,
    hrMedia: float = None,
    racha: float = None
) -> str:
    """
    Search for similar weather conditions in historical data from CSV stored in S3.

    This tool retrieves historical weather data from an S3 bucket and filters it based
    on the provided parameters. It uses a tolerance of ±10% for numeric values to find
    similar conditions.

    Args:
        provincia (str): Province name (REQUIRED). Case-insensitive search.
        presMax (float, optional): Maximum atmospheric pressure in hPa. Defaults to None.
        presMin (float, optional): Minimum atmospheric pressure in hPa. Defaults to None.
        nombre (str, optional): Weather station name for filtering. Defaults to None.
        prec (float, optional): Precipitation in mm. Defaults to None.
        sol (float, optional): Sun hours. Defaults to None.
        velmedia (float, optional): Average wind speed in km/h. Defaults to None.
        tmed (float, optional): Average temperature in °C. Defaults to None.
        tmax (float, optional): Maximum temperature in °C. Defaults to None.
        tmin (float, optional): Minimum temperature in °C. Defaults to None.
        hrMedia (float, optional): Average relative humidity in %. Defaults to None.
        racha (float, optional): Maximum wind gust in km/h. Defaults to None.

    Returns:
        str: JSON string containing:
            - On success: DataFrame with matching weather records
            - On error: Error message with details

    Environment Variables:
        S3_BUCKET_NAME: Name of the S3 bucket containing the CSV file
        AWS_REGION: AWS region for S3 client

    Note:
        Numeric parameters use a ±10% tolerance range for matching similar conditions.
    """

    try:
        # Get configuration from environment variables
        S3_BUCKET = os.getenv('S3_BUCKET_NAME', 'your_bucket_name')
        REGION = os.getenv('AWS_REGION', 'us-east-1')
        TOLERANCE = 0.10

        # Initialize S3 client and read CSV file
        s3_client = boto3.client('s3', region_name=REGION)

        try:
            response = s3_client.get_object(
                Bucket=S3_BUCKET, Key='2023-2026.csv')
            csv_content = response['Body'].read().decode('utf-8')
            df = pd.read_csv(StringIO(csv_content))
        except Exception as e:
            return json.dumps({
                "error": f"Could not read CSV from S3 or local: {str(e)}"
            }, ensure_ascii=False)

        # Clean column names (remove leading/trailing whitespace)
        df.columns = df.columns.str.strip()

        # Convert numeric columns from string format (with commas) to float
        numeric_cols = ['presMax', 'presMin', 'prec', 'sol', 'velmedia',
                        'tmed', 'tmax', 'tmin', 'hrMedia', 'racha']

        for col in numeric_cols:
            if col in df.columns:
                # Replace comma decimal separator with period
                df[col] = df[col].astype(str).str.replace(
                    ',', '.', regex=False)
                # Convert to numeric, invalid values become NaN
                df[col] = pd.to_numeric(df[col], errors='coerce')

        # Filter by province (case-insensitive)
        provincia_upper = provincia.upper()
        df_filtered = df[df['provincia'].str.upper() == provincia_upper].copy()

        if df_filtered.empty:
            return json.dumps({
                "error": f"No data found for province: {provincia}",
                "searched_province": provincia
            }, ensure_ascii=False)

        # Filter by station name if provided (case-insensitive partial match)
        if nombre:
            df_filtered = df_filtered[
                df_filtered['nombre'].str.contains(
                    nombre, case=False, na=False)
            ]

        # Apply numeric filters with ±10% tolerance
        parametros = {
            'presMax': presMax,
            'presMin': presMin,
            'prec': prec,
            'sol': sol,
            'velmedia': velmedia,
            'tmed': tmed,
            'tmax': tmax,
            'tmin': tmin,
            'hrMedia': hrMedia,
            'racha': racha
        }

        for key, value in parametros.items():
            if value is not None:
                # Filter rows where value is within 90%-110% of the target
                df_filtered = df_filtered[
                    df_filtered[key].between(
                        value * (1-TOLERANCE),
                        value * (1+TOLERANCE),
                        inclusive='both')
                ]

        return df_filtered.to_json()

    except Exception as e:
        return json.dumps({
            "error": f"Error searching for similar conditions: {str(e)}",
            "provincia": provincia
        }, ensure_ascii=False)


@tool
def query_knowledge_base(query: str) -> str:
    """
    Query AWS Knowledge Base for information about weather catastrophes.

    This tool performs a vector similarity search in an AWS Knowledge Base to retrieve
    relevant information based on the provided query. It returns up to 5 most relevant
    document chunks.

    Args:
        query (str): The search query string to find relevant information in the 
                    knowledge base.

    Returns:
        str: JSON string containing:
            - On success: List of up to results with content and metadata
            - On no results: Message indicating no information was found
            - On error: Error message with details

    Environment Variables:
        KB_ID: AWS Knowledge Base ID
        AWS_REGION: AWS region for the Knowledge Base
    """
    # Get configuration from environment variables
    KB_ID = os.getenv('KB_ID')
    REGION = os.getenv('AWS_REGION')
    NUMBER_OF_RESULTS = 6

    try:
        # Initialize Knowledge Base retriever with vector search configuration
        retriever = AmazonKnowledgeBasesRetriever(
            knowledge_base_id=KB_ID,
            retrieval_config={
                "vectorSearchConfiguration": {"numberOfResults": NUMBER_OF_RESULTS}},
            region_name=REGION
        )

        # Execute the search query
        docs = retriever.invoke(query)

        # Handle case where no documents are found
        if not docs:
            return json.dumps({
                "message": "No information found in knowledge base",
                "query": query
            }, ensure_ascii=False)

        results = []
        for i, doc in enumerate(docs[:NUMBER_OF_RESULTS], 1):
            results.append({
                "result": i,
                "content": doc.page_content,
                "metadata": doc.metadata if hasattr(doc, 'metadata') else {}
            })

        return json.dumps({
            "total_results": len(results),
            "query": query,
            "results": results
        }, ensure_ascii=False)

    except Exception as e:
        return json.dumps({
            "error": f"Error querying Knowledge Base: {str(e)}",
            "query": query
        }, ensure_ascii=False)


def invoke_agent_simple(system_prompt: str, user_prompt: str):
    """
    Create and invoke a LangChain agent with weather analysis tools.

    This function initializes an AWS Bedrock-powered agent with access to weather data
    tools and executes it with the provided prompts. The agent can query knowledge bases
    and search historical weather conditions.

    Args:
        system_prompt (str): System-level instructions that define the agent's behavior
                           and context. This is appended to the tool descriptions.
        user_prompt (str): The user's query or request that the agent should process.

    Returns:
        dict: The agent's response containing the result of processing the user prompt.
              The structure depends on the agent's execution and tool usage.

    Environment Variables:
        MODEL_ID: AWS Bedrock model identifier (e.g., 'anthropic.claude-v2')
        AWS_REGION: AWS region for Bedrock service

    Tools Available to Agent:
        - query_knowledge_base: Search weather catastrophe information
        - search_similar_conditions: Find similar historical weather patterns
    """
    # Get model configuration from environment
    MODEL_ID = os.getenv('MODEL_ID')
    REGION = os.getenv('AWS_REGION')

    # Initialize AWS Bedrock LLM
    llm = ChatBedrock(
        model_id=MODEL_ID,
        region_name=REGION
    )

    # Define available tools for the agent
    # Note: RAG (Retrieval-Augmented Generation) is implemented as a tool
    tools = [
        query_knowledge_base,
        search_similar_conditions
    ]

    # Construct the complete agent prompt with tool descriptions
    prompt = f"""
        Available tools:

        1. query_knowledge_base
        - Purpose: Search information in the knowledge base about weather catastrophes
        - Parameters:
            * query (str): Information to search in the database
        - Returns: JSON with search results

        2. search_similar_conditions
        - Purpose: Search for similar weather conditions in historical data
        - Parameters:
            * provincia (str): Province - REQUIRED
            * presMax (float): Maximum pressure - Optional
            * presMin (float): Minimum pressure - Optional
            * nombre (str): Weather station name - Optional
            * prec (float): Precipitation - Optional
            * sol (float): Sun hours - Optional
            * velmedia (float): Average wind speed - Optional
            * tmed (float): Average temperature - Optional
            * tmax (float): Maximum temperature - Optional
            * tmin (float): Minimum temperature - Optional
            * hrMedia (float): Average relative humidity - Optional
            * racha (float): Maximum wind gust - Optional
        - Returns: JSON with rows that have similar conditions from the specified location
        - Note: Returns error if no matches or province not found

        ---
    {system_prompt}
    """

    # Create the agent with LLM, tools, and system prompt
    agent = create_agent(
        llm,
        tools=tools,
        system_prompt=prompt,
    )

    # Execute the agent with the user's prompt
    result = agent.invoke({"messages": user_prompt})

    return result
