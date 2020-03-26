from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile', views.profile, name='profile'),
    path('sign_in_up', views.sign_in_up, name='sign_in_up')
]
