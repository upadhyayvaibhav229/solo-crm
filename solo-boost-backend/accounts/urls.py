from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView, TokenRefreshView
from django.urls import path
from .views import RegisterView, me
from .views import LoginView

urlpatterns = [
path('login/', LoginView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),   # ← new: renews access token
    path('register/', RegisterView.as_view()),
    path('me/', me),
    path('logout/', TokenBlacklistView.as_view()),
]

# username = vaibhav
# password = admin@123