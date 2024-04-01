from django.contrib import admin
from django.urls import path
from .views import *

from rest_framework.routers import DefaultRouter

app_name="gbill"

router = DefaultRouter()

router.register(r'assets', Assets, basename='assets')

urlpatterns = [
    path("view/", login.as_view()),
    path('callback/', AuthenticationCallbackView.as_view(), name='callback'),
    path('files/', Accessfiles.as_view(), name='files'),

]+router.urls
