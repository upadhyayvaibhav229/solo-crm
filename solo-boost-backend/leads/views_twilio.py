from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Gather
from django.conf import settings

@csrf_exempt
def twilio_webhook(request):
    response = VoiceResponse()

    gather = Gather(
        input="speech",
        action=f"{settings.PUBLIC_BASE_URL}/api/leads/calls/twilio/process-speech/",
        method="POST",
        speech_timeout="auto",
        language="en-IN",
    )

    gather.say(
        "Hello, this is an AI assistant from Solo Boost CRM. "
        "I'm calling regarding your business requirements. "
        "Is this a good time to talk?",
        voice="alice",
        language="en-IN",
    )

    response.append(gather)

    response.say(
        "I didn't hear anything. Goodbye.",
        voice="alice",
        language="en-IN",
    )

    return HttpResponse(
        str(response),
        content_type="text/xml",
    )


@csrf_exempt
def process_speech(request):
    speech_text = request.POST.get("SpeechResult", "").strip()

    response = VoiceResponse()

    if not speech_text:
        response.say(
            "Sorry, I didn't understand that. Could you please repeat?",
            voice="alice",
            language="en-IN",
        )

        # Listen again
        gather = Gather(
            input="speech",
            action=f"{settings.PUBLIC_BASE_URL}/api/leads/calls/twilio/process-speech/",
            method="POST",
            speech_timeout="auto",
            language="en-IN",
        )

        response.append(gather)

        return HttpResponse(
            str(response),
            content_type="text/xml",
        )

    print("Customer said:", speech_text)

    try:
        from leads.services.ai_voice import generate_ai_response

        ai_response = generate_ai_response(speech_text)

        print("AI response:", ai_response)

        response.say(
            ai_response,
            voice="alice",
            language="en-IN",
        )

        # Listen for the next response
        gather = Gather(
            input="speech",
            action=f"{settings.PUBLIC_BASE_URL}/api/leads/calls/twilio/process-speech/",
            method="POST",
            speech_timeout="auto",
            language="en-IN",
        )

        response.append(gather)

    except Exception as e:
        print("AI ERROR:", e)

        response.say(
            "Sorry, I'm having trouble processing that. Goodbye.",
            voice="alice",
            language="en-IN",
        )

    return HttpResponse(
        str(response),
        content_type="text/xml",
    )


