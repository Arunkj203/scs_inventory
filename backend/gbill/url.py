from django.contrib import admin
from django.urls import path
from .views import *

app_name="gbill"

urlpatterns = [
    path("view/", login.as_view()),
    path('callback/', AuthenticationCallbackView.as_view(), name='callback'),
]