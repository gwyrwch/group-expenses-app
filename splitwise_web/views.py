import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from django.views.generic.base import View

from splitwise_web.db_operations import *
from splitwise_web.models import Notification

from django.template.defaulttags import register


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


class Index(View):
    def get(self, request):
        if request.user.is_authenticated:
            context = dict()
            context['user'] = request.user

            user_notifications = get_user_notifications(request.user.id)
            if user_notifications:
                context['notifications'] = user_notifications

            selected_group_id = request.GET.get('group')
            selected_friend_id = request.GET.get('friend')

            print("DEBUG")
            print(selected_group_id,  selected_friend_id)

            if selected_group_id:
                selected_group_id = int(selected_group_id)
                user_group_expenses = get_user_expenses_from_group(selected_group_id, request.user.id)
                context['group_expenses'] = user_group_expenses
                context['selected_group_id'] = selected_group_id
                context['selected_group_name'] = get_group_name_by_id(selected_group_id)
                context['selected_group_photo'] = get_group_photo_by_id(selected_group_id)
            elif selected_friend_id:
                selected_friend_id = int(selected_friend_id)
                user_friend_expenses = get_user_expenses_with_friend(selected_friend_id, request.user.id)
                context['group_expenses'] = user_friend_expenses
                context['selected_friend_id'] = selected_friend_id
                context['selected_friend_name'] = get_friend_name_by_id(selected_friend_id)
                context['selected_group_photo'] = find_user_photo(selected_friend_id)

            else:
                context['group_expenses'], context['selected_group_id'] = \
                    get_some_user_group_expenses(request.user.id)
                context['selected_group_name'] = get_group_name_by_id(context['selected_group_id'])
                context['selected_group_photo'] = get_group_photo_by_id(context['selected_group_id'])

            user_friends = get_user_friends(request.user.id)
            user_groups = get_user_groups(request.user.id)

            context['user_friends'] = user_friends
            context['user_photo_path'] = find_user_photo(request.user.id)
            context['user_groups'] = user_groups
            if not selected_friend_id:
                context['group_members'] = get_user_group_members(request.user.id)
            else:
                context['group_members'] = get_user_friend_members(request.user.id, selected_friend_id)

            return render(request, 'index.html', context=context)
        else:
            return HttpResponseRedirect(redirect_to='/sign_in_up')

    def post(self, request):
        pass


def handle_uploaded_file(f):
    name = f.name
    with open('./media/images/{}'.format(name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    return 'media/images/{}'.format(name)


class Profile(View):
    def get(self, request):
        if request.user.is_authenticated:
            photo_path = find_user_photo(request.user.id)

            return render(request, 'profile.html', context={'user': request.user, 'photo_path': photo_path})
        else:
            return HttpResponseRedirect(redirect_to='/sign_in_up')

    def post(self, request):
        photo = request.FILES.get('photo')
        cur_password = request.POST.get('cur_password')
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        password = request.POST.get('password')
        email = request.POST.get('email')
        currency = request.POST.get('currency')

        # print(request.POST)

        if len(cur_password) == 0 or not check_password(cur_password, request.user.password):
            # todo: show error msg
            return HttpResponseRedirect('/profile')

        if len(name) > 0 and name != request.user.first_name:
            request.user.first_name = name
            request.user.save()

        if len(surname) > 0 and surname != request.user.last_name:
            request.user.last_name = surname
            request.user.save()

        if len(email) > 0 and email != request.user.email:
            request.user.email = email
            request.user.save()

        if photo:
            fs = handle_uploaded_file(photo)
            add_or_update_photo(request.user.id, fs)

        return HttpResponseRedirect(redirect_to='/profile')


class SignInUP(View):
    def get(self, request):
        return render(request, 'sign_in_up.html')

    def post(self, request):
        if request.POST.get('sign-in-username'):
            # print(request.POST)
            username = request.POST.get('sign-in-username')
            password = request.POST.get('sign-in-password')
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                return HttpResponseRedirect(redirect_to='/')
            else:
                # todo: show that data is invalid with context={'invalid_data': True} or somehow
                return HttpResponseRedirect(redirect_to='/sign_in_up')

        elif request.POST.get('sign-up-username'):
            username = request.POST.get('sign-up-username')
            password = request.POST.get('sign-up-password')
            email = request.POST.get('sign-up-email')
            user = User.objects.create_user(username, password=password, email=email)
            # print(user)

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(redirect_to='/')

            return HttpResponseRedirect(redirect_to='/sign_in_up')

        return HttpResponseRedirect(redirect_to='/sign_in_up')


def index_mobile(request):
    if request.user.is_authenticated:
        return render(request, 'index_mobile.html')
    else:
        return HttpResponseRedirect(redirect_to='/sign_in_up')


def friends_groups_mobile(request):
    if request.user.is_authenticated:
        return render(request, 'friends_groups_mobile.html')
    else:
        return HttpResponseRedirect(redirect_to='/sign_in_up')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(redirect_to='/sign_in_up')


@csrf_exempt
def send_friend_invitation(request):
    r = json.loads(request.body)
    friend_username = r.get('username')
    try:
        user_friend = User.objects.filter(username=friend_username).get()
        # print(user_friend.id)
        # print(user_friend.username)
        notification = Notification(
            id_sender=request.user.id,
            id_recipient=user_friend.id,
            notification_type='friend_request'
        )
        notification.save()
    except:
        # no such user
        pass
    return JsonResponse({})


@csrf_exempt
def reply_to_notification(request):
    r = json.loads(request.body)
    # print(r)
    id_sender = int(r.get('n_sender_id'))
    accept = r.get('accept')
    notification_type = r.get('n_type')
    if accept == 'accept':
        accept = True
    elif accept == 'decline':
        accept = False
    else:
        accept = None

    process_notification(id_sender, notification_type, accept, request.user.id)

    return JsonResponse({})


@csrf_exempt
def create_new_group(request):
    photo = request.FILES.get('group_photo')
    name = request.POST.get('group_name')

    pic = None
    if photo:
        pic = handle_uploaded_file(photo)
    create_group(name, pic, request.user.id)
    return JsonResponse({})


@csrf_exempt
def edit_group(request):
    photo = request.FILES.get('group_photo')
    pic = None
    if photo:
        pic = handle_uploaded_file(photo)
    name = request.POST.get('group_name')
    group_members = request.POST.get('group_members')
    id_group = request.POST.get('id_group')
    group_members = json.loads(group_members)

    edit_group_db(int(id_group), pic, name, group_members)

    return JsonResponse({})


@csrf_exempt
def delete_member_from_group(request):
    r = json.loads(request.body)
    id_group = r.get('id_group')
    username = r.get('username')

    delete_group_member(int(id_group), username)

    return JsonResponse({})


@csrf_exempt
def create_new_expense(request):
    id_group = request.POST.get('id_group')
    amount = float(request.POST.get('amount'))
    date = request.POST.get('date')
    percent_users = json.loads(request.POST.get('percent_users'))
    photo = request.FILES.get('photo')
    desc = request.POST.get('desc')
    paid_username = request.POST.get('paid_username')
    equally = request.POST.get('equally')
    is_friend =  True if request.POST.get('is_friend') == 'true' else False

    if equally == 'true':
        size = len(percent_users)
        p = 100 / size
        for i in range(size):
            percent_users[i]['percent'] = p

    pic = None
    if photo:
        pic = handle_uploaded_file(photo)

    if paid_username == 'you':
        paid_username = request.user.username

    print(int(id_group), desc, amount, date, percent_users, paid_username, pic, equally,  is_friend)

    if is_friend:
        create_expense(None, desc, amount, date, percent_users, paid_username, pic)
    else:
        create_expense(int(id_group), desc, amount, date, percent_users, paid_username, pic)

    return JsonResponse({})