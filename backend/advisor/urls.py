
from django.urls import path
from .views import ChatView, LeadView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('lead/', LeadView.as_view(), name='lead'),
]
