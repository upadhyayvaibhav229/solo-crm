from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse


@csrf_exempt
def twilio_webhook(request):
    response = VoiceResponse()

    response.say(
        "Hello, this is an AI assistant calling regarding your business requirements. "
        "Is this a good time to talk?",
        voice="alice",
        language="en-IN",
    )

    return HttpResponse(
        str(response),
        content_type="text/xml",
    )