from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index_mobile', views.index_mobile, name='index_mobile'),
    path('profile', views.Profile.as_view(), name='profile'),
    path('sign_in_up', views.SignInUP.as_view(), name='sign_in_up'),
    path('friends_groups', views.friends_groups_mobile, name='friends_groups'),
    path('logout_view', views.logout_view, name='logout')
]
