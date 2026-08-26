from rest_framework import serializers
from .models import Lead, Call, FollowUp


class LeadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ('user',)


class CallSerializer(serializers.ModelSerializer):

    class Meta:
        model = Call
        fields = '__all__'

class FollowUpSerializer(serializers.ModelSerializer):
    business = serializers.CharField(source='lead.business_name', read_only=True)

    class Meta:
        model = FollowUp
        fields = '__all__'
        read_only_fields = ('business',)