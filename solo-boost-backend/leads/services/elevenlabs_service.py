from elevenlabs.client import ElevenLabs
from django.conf import settings


client = ElevenLabs(
    api_key=settings.ELEVENLABS_API_KEY
)


VOICE_ID = "YOUR_VOICE_ID"


def generate_voice(text):
    audio = client.text_to_speech.convert(
        text=text,
        voice_id=VOICE_ID,
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    return b"".join(audio)