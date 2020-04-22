from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index_mobile', views.index_mobile, name='index_mobile'),
    path('profile', views.profile, name='profile'),
    path('sign_in_up', views.sign_in_up, name='sign_in_up'),
    path('friends_groups', views.friends_groups_mobile, name='friends_groups')
]
