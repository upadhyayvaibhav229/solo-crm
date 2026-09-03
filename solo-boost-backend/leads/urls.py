from rest_framework.routers import DefaultRouter
from django.urls import path

from .views_twilio import (
    twilio_webhook,
    process_speech,
)
from .views import (
    LeadViewSet,
    FollowUpViewSet,
    CallViewSet,
)

router = DefaultRouter()

router.register(
    "followups",
    FollowUpViewSet,
    basename="followup"
)

router.register(
    "calls",
    CallViewSet,
    basename="call"
)

router.register(
    "",
    LeadViewSet,
    basename="lead"
)

urlpatterns = [
    path(
        "calls/twilio/webhook/",
        twilio_webhook,
        name="twilio-webhook",
        ),
    path(
        "calls/twilio/process-speech/",
        process_speech,
        name="twilio-process-speech",
        ),
    ] + router.urls