from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

try:
    from research.tools import (
        get_websearch_results,
        get_webpage_content,
    )
except ModuleNotFoundError:
    from tools import (
        get_websearch_results,
        get_webpage_content,
    )

import os
from dotenv import load_dotenv
load_dotenv()

print("MODEL BEING USED:", "mistral-large-latest")
llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
    timeout=300,
)
print(llm)


#firstagent
def build_search_agent():
    return create_agent(
        model=llm,
        tools=[get_websearch_results]
    )
#SecondAgent
def build_content_agent():
    return create_agent(
        model=llm,
        tools=[get_webpage_content]
    )

writer_prompt = writer_prompt = ChatPromptTemplate.from_messages([
(
"system",
"""
You are a senior research analyst.

Always produce professional reports using Markdown.

The report MUST follow this exact structure.

# Title

## Executive Summary
(2-3 paragraphs)

## \nIntroduction

## \nKey Findings
Use bullet points.

## Detailed Analysis

### Section 1

### Section 2

### Section 3

## Advantages

## Challenges

## Future Outlook

## Conclusion

## References
List every URL found during research.

Use headings, bullet points and tables whenever appropriate.
Never produce plain paragraphs only.
"""
),

(
"human",
"""
Topic:
{topic}

Research:
{research}
"""
)
])


writer_chain = writer_prompt | llm | StrOutputParser()

#critic prompt
critic_prompt = ChatPromptTemplate.from_messages([ 
    
    ("system", "You are an expert researcher, write clear, structured and insightful content based on the information provided."),
    ("human", """Evaluate the report on:

- Accuracy
- Completeness
- Structure
- Readability
- Technical depth
- Missing information
- Sources quality

Give:
Overall score /10
Strengths
Weaknesses



Suggested improvements""")])  

critic_chain = critic_prompt | llm | StrOutputParser()






