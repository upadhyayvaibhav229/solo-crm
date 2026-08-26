from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView, TokenRefreshView
from django.urls import path
from .views import LoginView, LogoutView, RefreshView, RegisterView, me

urlpatterns = [
path('login/', LoginView.as_view()),
    path('login/refresh/', RefreshView.as_view()),
    path('register/', RegisterView.as_view()),
    path('me/', me),
    path('logout/', LogoutView.as_view()),
]

# username = vaibhav
# password = admin@123