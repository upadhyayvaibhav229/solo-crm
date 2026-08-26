from rest_framework.routers import DefaultRouter

from .views import (
    LeadViewSet,
    FollowUpViewSet,
    CallViewSet,
)

router = DefaultRouter()

router.register('followups', FollowUpViewSet, basename='followup')
router.register('calls', CallViewSet, basename='call')
router.register('', LeadViewSet, basename='lead')

urlpatterns = router.urls