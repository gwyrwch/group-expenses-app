from django.urls import path

from . import views

urlpatterns = [
    path('', views.Index.as_view(), name='index'),
    path('index_mobile', views.index_mobile, name='index_mobile'),
    path('profile', views.Profile.as_view(), name='profile'),
    path('sign_in_up', views.SignInUP.as_view(), name='sign_in_up'),
    path('friends_groups', views.friends_groups_mobile, name='friends_groups'),
    path('logout_view', views.logout_view, name='logout'),
    path('send_friend_invitation', views.send_friend_invitation, name='send_friend_invitation'),
    path('reply_to_notification', views.reply_to_notification, name='reply_to_notification'),
]
