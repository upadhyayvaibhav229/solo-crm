from rest_framework import serializers
from .models import Lead, Call


class LeadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lead
        fields = '__all__'


class CallSerializer(serializers.ModelSerializer):

    class Meta:
        model = Call
        fields = '__all__'

class FollowUpSerializer(serializers.ModelSerializer):

    class Meta:
        model = Call
        fields = '__all__'