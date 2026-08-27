import json
from openai import OpenAI
from django.conf import settings

from django.utils import timezone

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)



CALL_ANALYSIS_PROMPT = """
You are an AI sales-call analyst for a freelance CRM.

Analyze the completed sales call transcript.

Your job is to determine:
1. The current lead status.
2. The lead score.
3. The result of the call.
4. Customer intent.
5. A concise summary.
6. Whether a follow-up is required.
7. What the follow-up should be.
8. Whether a meeting was booked.

Allowed lead statuses:
New
Contacted
Interested
Meeting
Proposal
Won
Lost

Allowed call results:
interested
not_interested
follow_up
no_answer
wrong_number
meeting_booked

Lead score:
0-100.

Scoring guidance:
0-20   = very poor / wrong number / not interested
21-40  = low interest
41-60  = moderate interest
61-80  = strong interest
81-100 = very strong buying intent / proposal / meeting / won

Important:
- Do NOT invent information.
- Only use information explicitly present in the transcript.
- Do NOT assume a meeting is booked unless the customer actually agrees to a meeting.
- Do NOT mark a lead as Won unless the customer clearly confirms they are proceeding, hiring, purchasing, or starting the project.
- If the customer asks for a proposal, use Proposal.
- If the customer expresses interest but no proposal or meeting is established, use Interested.
- If the customer agrees to a meeting, use Meeting.
- If the customer clearly rejects the service, use Lost.
- If the customer only asks to be contacted later, use Contacted or Interested depending on their expressed interest.
- Use null when information is unavailable.
- follow_up_required must be true when another action/contact is clearly required.
- follow_up_date must be an ISO 8601 date/time when an exact date/time is explicitly available.
- Otherwise use null.
- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT include ```json.
- follow_up_date must be an ISO 8601 datetime.

- Use the current date/time as context when interpreting:
-- today
-- tomorrow
-- next week
-- Monday
-- next Friday

If a follow-up is required but no timing can be determined, return null.
- Only return follow_up_date when the transcript provides a specific date or time.
- For phrases such as "next week", "later", or "soon" without a specific date/time, return null.
- Never invent a specific date or time.

Return exactly this structure:

{
    "lead_status": "New",
    "lead_score": 0,
    "call_result": "follow_up",
    "customer_intent": "",
    "summary": "",
    "follow_up_required": false,
    "follow_up_title": null,
    "follow_up_date": null,
    "follow_up_notes": null,
    "meeting_booked": false
}
"""


def analyze_call(transcript):
    current_datetime = timezone.now().isoformat()

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": CALL_ANALYSIS_PROMPT,
            },
            {
                "role": "user",
                "content": f"""
CURRENT DATE/TIME:
{current_datetime}

CALL TRANSCRIPT:

{transcript}
""",
            },
        ],
        temperature=0,
    )

    content = response.choices[0].message.content.strip()

    return json.loads(content)