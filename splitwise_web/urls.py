from django.conf.urls import url
from django.urls import path
from django.views.decorators.cache import cache_control
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path('', views.Index.as_view(), name='index'),
    path('index_mobile', views.IndexMobile.as_view(), name='index_mobile'),
    path('profile', views.Profile.as_view(), name='profile'),
    path('sign_in_up', views.SignInUP.as_view(), name='sign_in_up'),
    path('friends_groups', views.FriendsGroupsMobile.as_view(), name='friends_groups'),
    path('logout_view', views.logout_view, name='logout'),
    path('send_friend_invitation', views.send_friend_invitation, name='send_friend_invitation'),
    path('reply_to_notification', views.reply_to_notification, name='reply_to_notification'),
    path('create_new_group', views.create_new_group, name='create_group'),
    path('delete_member_from_group', views.delete_member_from_group, name='delete_member'),
    path('edit_group', views.edit_group, name='edit_group'),
    path('create_new_expense', views.create_new_expense, name='create_expense'),
    path('get_expense_info', views.get_expense_info, name='get_expense_info'),
    path('settle_up', views.settle_up, name='settle_up'),
    path('check_user_is_valid', views.check_user_is_valid, name='check_user_is_valid'),
    path('is_password_valid', views.is_password_valid, name='is_password_valid'),
    path('check_username_used', views.check_username_used, name='check_username_used'),
    path('check_email_used', views.check_email_used, name='check_email_used'),
    path('service.js', TemplateView.as_view(template_name='service.js', content_type='application/x-javascript')),
    path('check_sign_in_user', views.check_sign_in_user, name='check_sign_in_user'),
]


