from openai import OpenAI
from django.conf import settings


client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


SYSTEM_PROMPT = """
You are an AI sales assistant for Solo Boost CRM.

You are speaking with a potential business customer over a phone call.

Your job is to have a natural, short sales conversation.

Rules:
- Be professional and friendly.
- Keep responses short because they will be spoken over the phone.
- Ask only one question at a time.
- Do not make up information.
- Do not promise prices, features, or timelines unless the customer provides them.
- Try to understand what website/software/service the customer needs.
- If the customer is interested, continue the conversation naturally.
- If the customer is not interested, politely acknowledge it.
- If the customer wants a proposal, acknowledge it and ask an appropriate next question.
- If the customer wants a meeting, ask when they would prefer to meet.
"""


def generate_ai_response(customer_message):

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": customer_message,
            },
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content.strip()