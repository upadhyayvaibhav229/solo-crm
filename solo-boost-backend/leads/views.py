from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Lead, FollowUp, Call
from .serializers import (
    LeadSerializer,
    FollowUpSerializer,
    CallSerializer,
)


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

        serializer.save(
            lead=lead
        )