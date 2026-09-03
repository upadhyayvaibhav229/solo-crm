from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from twilio.base.exceptions import TwilioRestException

from .models import Lead, FollowUp, Call
from .serializers import (
    LeadSerializer,
    FollowUpSerializer,
    CallSerializer,
)
from .services.call_processor import process_completed_call
from .services.twilio_service import start_call
from django.utils import timezone

class LeadViewSet(ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lead.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class FollowUpViewSet(ModelViewSet):
    serializer_class = FollowUpSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FollowUp.objects.filter(
            lead__user=self.request.user
        )

    def perform_create(self, serializer):
        lead_id = self.request.data.get("lead")

        lead = Lead.objects.get(id=lead_id, user=self.request.user)

        serializer.save(
            lead=lead
        )




class CallViewSet(ModelViewSet):
    serializer_class = CallSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Call.objects.filter(
            lead__user=self.request.user
        )

    def perform_create(self, serializer):
        lead_id = self.request.data.get("lead")

        lead = Lead.objects.get(
            id=lead_id,
            user=self.request.user
        )

        call = serializer.save(lead=lead)

        # Analyze immediately if call is already completed
        if call.status == Call.Status.COMPLETED:
            process_completed_call(call)

    def perform_update(self, serializer):
        call = serializer.save()

        if (
            call.status == Call.Status.COMPLETED
            and call.transcript
        ):
            process_completed_call(call)


class CallViewSet(ModelViewSet):
    serializer_class = CallSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Call.objects.filter(
            lead__user=self.request.user
        )

    def perform_create(self, serializer):
        lead_id = self.request.data.get("lead")

        lead = Lead.objects.get(
            id=lead_id,
            user=self.request.user
        )

        serializer.save(lead=lead)

    @action(detail=False, methods=["post"], url_path="start")
    def start_call(self, request):
        lead_id = request.data.get("lead")

        if not lead_id:
            return Response(
                {"detail": "lead is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lead = Lead.objects.get(
                id=lead_id,
                user=request.user
            )
        except Lead.DoesNotExist:
            return Response(
                {"detail": "Lead not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not lead.phone:
            return Response(
                {"detail": "Lead does not have a phone number"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            call_sid = start_call(
                phone_number=lead.phone
            )
        except TwilioRestException as exc:
            if exc.code == 573002:
                detail = (
                    "This Twilio trial account can only call verified numbers. "
                    "Verify the lead's phone number in Twilio, or upgrade the account."
                )
            else:
                detail = "Twilio could not start the call. Please check your Twilio settings."

            return Response(
                {"detail": detail},
                status=status.HTTP_400_BAD_REQUEST
            )

        call = Call.objects.create(
            lead=lead,
            status=Call.Status.SCHEDULED,
            scheduled_at=timezone.now(),
        )

        return Response({
            "message": "Call started",
            "call_id": call.id,
            "call_sid": call_sid,
        })