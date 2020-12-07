import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.core.validators import validate_email
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.template.defaulttags import register
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import View
from django.views.i18n import set_language
from webpush import send_user_notification

from splitwise_web.db_operations import *
from splitwise_web.img_processing import process_img


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


def get_index_context(request):
    context = dict()
    context['user'] = request.user

    user_notifications = get_user_notifications(request.user.id)
    if user_notifications:
        context['notifications'] = user_notifications

    selected_group_id = request.GET.get('group')
    selected_friend_id = request.GET.get('friend')
    dashboard = request.GET.get('dashboard')

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
        context['selected_group_name'] = get_friend_name_by_id(selected_friend_id)
        context['selected_group_photo'] = find_user_photo(selected_friend_id)
    elif dashboard:
        context['group_expenses'] = get_user_dashboard_expenses(id_user=request.user.id)
        # context['selected_friend_id'] = None
        context['selected_group_name'] = _('DASHBOARD')
        context['selected_group_photo'] = find_user_photo(request.user.id)
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

    notifications_modal = request.GET.get('notifications')
    if notifications_modal:
        context['show_notifications'] = True

    return context


class Index(View):
    def get(self, request):
        # from django.db import connection
        # with connection.cursor() as cursor:
        #     cursor.execute('describe table Expense;')
        #     print(cursor.fetchall())
        #
        # return render(request, 'index.html')
        if request.user.is_authenticated:
            context = get_index_context(request)

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
    return '/media/images/{}'.format(name)


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
        lang_code = request.POST.get('language')

        print(lang_code)
        update_or_set_lang_user(request.user.id, lang_code)

        if len(cur_password) == 0 or not check_password(cur_password, request.user.password):
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

        if len(password) >= 5:
            request.user.set_password(password)
            request.user.save()
            login(request, request.user)

        if photo:
            fs = handle_uploaded_file(photo)
            path = process_img(fs, request.user.username)
            add_or_update_photo(request.user.id, path)

        resp = set_language(request)
        return resp
        # return HttpResponseRedirect(redirect_to='/profile')


class SignInUP(View):
    def get(self, request):
        return render(request, 'sign_in_up.html', context={'no_such_user': False})

    def post(self, request):
        if request.POST.get('sign-in-username'):
            username = request.POST.get('sign-in-username')
            password = request.POST.get('sign-in-password')
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                return HttpResponseRedirect(redirect_to='/ru' if get_user_lang(user.id) == 'ru' else '/')
            else:
                raise

        elif request.POST.get('sign-up-username'):
            username = request.POST.get('sign-up-username')
            password = request.POST.get('sign-up-password')
            email = request.POST.get('sign-up-email')
            user = User.objects.create_user(username, password=password, email=email)
            update_or_set_lang_user(user.id, 'en-us')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(redirect_to='/')

            return HttpResponseRedirect(redirect_to='/sign_in_up', context={'no_such_user': False})

        return HttpResponseRedirect(redirect_to='/sign_in_up', context={'no_such_user': False})


class IndexMobile(View):
    def get(self, request):
        if request.user.is_authenticated:
            context = get_index_context(request)

            return render(request, 'index_mobile.html', context=context)
        else:
            return HttpResponseRedirect(redirect_to='/sign_in_up')

    def post(self, request):
        pass


class FriendsGroupsMobile(View):
    def get(self, request):
        if request.user.is_authenticated:
            context = dict()
            context['user'] = request.user
            context['user_photo_path'] = find_user_photo(request.user.id)

            if request.GET.get('friends'):
                context['title'] = _('Friends')
                context['cards_content'] = get_user_expenses_to_friends(request.user.id)
            else:
                context['title'] = _('Groups')
                context['cards_content'] = get_user_expenses_to_groups(request.user.id)

            return render(request, 'friends_groups_mobile.html', context=context)
        else:
            return HttpResponseRedirect(redirect_to='/sign_in_up')

    def post(self, request):
        pass


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(redirect_to='/sign_in_up')


@csrf_exempt
def send_friend_invitation(request):
    r = json.loads(request.body)
    friend_username = r.get('username')
    try:
        user_friend = User.objects.filter(username=friend_username).get()
        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO Notification VALUES (NULL, %s, %s, %s)',
                ['friend_request', request.user.id, user_friend.id]
            )

        photo = find_user_photo(request.user.id)
        payload = {
            'head': _('friend request'),
            'body': '{} {}'.format(request.user.username, _('wants to be your friend')),
            'icon': photo
        }
        send_user_notification(user=user_friend, payload=payload, ttl=1000)
        print('notification sent')
    except Exception as e:
        print(e)
    return JsonResponse({})


@csrf_exempt
def reply_to_notification(request):
    r = json.loads(request.body)

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

    photo = find_user_photo(request.user.id)
    payload = {
        'head': _('friend reply'),
        'body': '{} {} {}'.format(request.user.username, _('accepted') if accept else _('declined'), _('your invitation')),
        'icon': photo
    }
    send_user_notification(user=User.objects.filter(id=id_sender).first(), payload=payload, ttl=1000)

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
    if not len(percent_users):
        return JsonResponse({})
    photo = request.FILES.get('photo')
    desc = request.POST.get('desc')
    paid_username = request.POST.get('paid_username')
    equally = request.POST.get('equally')
    is_friend = True if request.POST.get('is_friend') == 'true' else False

    if equally == 'true':
        size = len(percent_users)
        p = 100 / size
        for i in range(size):
            percent_users[i]['percent'] = p

    pic = None
    if photo:
        pic = handle_uploaded_file(photo)

    if paid_username == 'you' or paid_username == 'тобой':
        # fixme:

        paid_username = request.user.username

    if is_friend:
        create_expense(None, desc, amount, date, percent_users, paid_username, pic)
    else:
        print((int(id_group), desc, amount, date, percent_users, paid_username, pic))
        create_expense(int(id_group), desc, amount, date, percent_users, paid_username, pic)
        # print((int(id_group), desc, amount, date, percent_users, paid_username, pic))

    return JsonResponse({})


@csrf_exempt
def get_expense_info(request):
    id_exp = int(request.body.decode("utf-8"))
    res = get_expense_info_by_id(id_exp, request.user.id)

    print("RESULT TO JSON", res)
    return JsonResponse(res)


@csrf_exempt
def settle_up(request):
    id_exp = int(request.body.decode("utf-8"))
    settle_up_by_id_exp(id_exp)

    return JsonResponse({})


@csrf_exempt
def check_user_is_valid(request):
    resp = check_if_user_is_valid(json.loads(request.body))
    print(resp)
    return JsonResponse(resp)


@csrf_exempt
def check_sign_in_user(request):
    resp = json.loads(request.body)
    ans = dict()
    if check_no_such_username(resp.get('username')):
        ans['username'] = 'invalid'
        ans['password'] = None
    else:
        ans['username'] = 'valid'
        ans['password'] = check_password(
            resp.get('password'), User.objects.filter(username=resp.get('username')).first().password
        )

    return JsonResponse(ans)


@csrf_exempt
def is_password_valid(request):
    valid = None
    if check_password(json.loads(request.body)['pass'], request.user.password):
        valid = True
    else:
        valid = False

    return JsonResponse({'valid': valid})


@csrf_exempt
def check_username_used(request):
    return JsonResponse({'valid': check_no_such_username(json.loads(request.body))})


@csrf_exempt
def check_email_used(request):
    email = json.loads(request.body)
    invalid = False
    try:
        validate_email(email)
    except:
        invalid = True

    return JsonResponse({'valid': check_is_email_valid(email), 'incorrect_email': invalid})

