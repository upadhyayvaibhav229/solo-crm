from twilio.rest import Client
from django.conf import settings

client = Client(
    settings.TWILIO_ACCOUNT_SID,
    settings.TWILIO_AUTH_TOKEN,
)


def start_call(phone_number):
    call = client.calls.create(
        to=phone_number,
        from_=settings.TWILIO_PHONE_NUMBER,
        url=f"{settings.PUBLIC_BASE_URL}/api/leads/calls/twilio/webhook/",
    )

    return call.sid