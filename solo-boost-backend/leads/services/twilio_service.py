from twilio.rest import Client
from django.conf import settings


client = Client(
    settings.TWILIO_ACCOUNT_SID,
    settings.TWILIO_AUTH_TOKEN,
)


def start_call(phone_number, webhook_url):
    call = client.calls.create(
        to=phone_number,
        from_=settings.TWILIO_PHONE_NUMBER,
        url=webhook_url,
        record=True,
    )

    return call.sid