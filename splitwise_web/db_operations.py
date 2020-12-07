from collections import defaultdict
from time import strftime

from django.contrib.auth.models import User
from django.utils.translation import gettext as _
from splitwise_web.models import *
from django.utils.translation import to_locale, get_language

from django.db import connection

eps = 10 ** -6


def get_user_notifications(id_user):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT * FROM Notification WHERE id_recipient=%s',
                [id_user]
            )

            notifications = cursor.fetchall()
            res = []
            for notification in notifications:
                id_notification, notification_type, id_sender, id_recipient = notification
                res_notification = dict()
                res_notification['id_sender'] = id_sender
                text = ''
                sender_username = User.objects.filter(id=id_sender).get()
                sender_username = sender_username.username
                if notification_type == 'friend_request':
                    text += '{} @{}'.format(_('New friend request from'), sender_username)
                    res_notification['accept_decline'] = True
                    res_notification['type'] = 'friend'
                elif notification_type == 'friend_request_reply_accept':
                    text += '{} @{} {}'.format(_('Your friend request to'), sender_username, _('was accepted'))
                    res_notification['accept_decline'] = False
                    res_notification['type'] = 'friend_reply'
                elif notification_type == 'friend_request_reply_decline':
                    text += '{} @{} {}'.format(_('Your friend request to'), sender_username, _('was declined'))
                    res_notification['accept_decline'] = False
                    res_notification['type'] = 'friend_reply'

                res_notification['text'] = text
                res.append(res_notification)

            return res
    except:
        return None


def process_notification(id_sender, notification_type, accept=None, id_user=None):
    if notification_type == 'friend':
        with connection.cursor() as cursor:
            cursor.execute(
                'DELETE FROM Notification WHERE notification_type=%s AND id_sender=%s AND id_recipient=%s',
                ['friend_request', id_sender, id_user]
            )

        if accept:
            with connection.cursor() as cursor:
                cursor.execute(
                    'INSERT INTO FriendShip VALUES (NULL, %s, %s)',
                    [id_sender, id_user]
                )
                cursor.execute(
                    'INSERT INTO FriendShip VALUES (NULL, %s, %s)',
                    [id_user, id_sender]
                )

            with connection.cursor() as cursor:
                cursor.execute(
                    'INSERT INTO Notification VALUES (NULL, %s, %s, %s)',
                    ['friend_request_reply_accept', id_user, id_sender]
                )
        else:
            with connection.cursor() as cursor:
                cursor.execute(
                    'INSERT INTO Notification VALUES (NULL, %s, %s, %s)',
                    ['friend_request_reply_decline', id_user, id_sender]
                )
    elif notification_type == 'friend_reply':
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    'DELETE FROM Notification WHERE notification_type=%s AND id_sender=%s AND id_recipient=%s',
                    ['friend_request_reply_accept', id_sender, id_user]
                )

                cursor.execute(
                    'DELETE FROM Notification WHERE notification_type=%s AND id_sender=%s AND id_recipient=%s',
                    ['friend_request_reply_decline', id_sender, id_user]
                )
        except Exception as e:
            print(e)


def get_user_friends(id_user):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM FriendShip WHERE uid_1=%s', [id_user])
        friendships = cursor.fetchall()
        res = []
        if len(friendships):
            for friendship in friendships:
                _, uid_1, uid_2 = friendship

                friend = dict()
                friend_obj = User.objects.filter(id=uid_2).get()
                friend['friend_username'] = friend_obj.username
                friend['id'] = friend_obj.id
                friend['photo_path'] = find_user_photo(friend_obj.id)
                res.append(friend)

    return res


def get_user_groups(id_user):
    with connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM UserToGroup WHERE id_user=%s',
            [id_user]
        )
        group_ids = cursor.fetchall()

        res = []

        for group_id in group_ids:
            _, id_group, id_user = group_id
            group = dict()

            cursor.execute(
                'SELECT * FROM mydb.Group WHERE id=%s',
                [id_group]
            )
            group_obj = cursor.fetchall()
            if len(group_obj):
                id_group, name, group_logo_path = group_obj[0]
                group['name'] = name
                group['logo_file_path'] = group_logo_path
                group['id'] = id_group

                res.append(group)
        return res


def get_user_friend_members(id_user, id_friend):
    res = dict()
    friend_photo = find_user_photo(id_friend)
    if not friend_photo:
        friend_photo = "/media/images/profile_default.jpg"

    user_photo = find_user_photo(id_user)
    if not user_photo:
        user_photo = "/media/images/profile_default.jpg"

    res[id_friend] = [
        {'photo': user_photo, 'username': User.objects.filter(id=id_user).first().username},
        {'photo': friend_photo, 'username': User.objects.filter(id=id_friend).first().username},
    ]

    return res


def get_user_group_members(id_user):
    with connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM UserToGroup WHERE id_user=%s',
            [id_user]
        )
        group_ids = cursor.fetchall()

        res = {}

        for group_id in group_ids:
            group_members = list()

            _, id_group, _ = group_id
            cursor.execute(
                'SELECT * FROM UserToGroup WHERE id_group=%s',
                [id_group]
            )

            user_to_groups = cursor.fetchall()
            for user_to_group in user_to_groups:
                _, _, id_user = user_to_group
                usr = dict()
                user = User.objects.filter(id=id_user).get()
                usr['username'] = user.username
                photo = find_user_photo(user.id)
                if not photo:
                    photo = "/media/images/profile_default.jpg"
                usr['photo'] = photo

                group_members.append(usr)

            res[id_group] = group_members
        return res


def add_or_update_photo(id_user, pic):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM ProfilePictures WHERE id_user=%s', [id_user])
        profile_pic = cursor.fetchall()

        if not len(profile_pic):
            cursor.execute(
                'INSERT INTO ProfilePictures VALUES (NULL, %s, %s)',
                [id_user, pic]
            )
        else:
            cursor.execute(
                'UPDATE ProfilePictures SET photo_path=%s WHERE id_user=%s',
                [pic, id_user]
            )


def find_user_photo(id_user):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM ProfilePictures WHERE id_user=%s', [id_user])
        values = cursor.fetchall()

        if len(values):
            _, _, profile_pic = values[0]
            return profile_pic
        else:
            return "/media/images/profile_default.png"


def create_group(name, pic, id_user):
    if not pic:
        pic = "/media/images/group_default.png"

    with connection.cursor() as cursor:
        cursor.execute(
            'INSERT INTO mydb.Group VALUES (NULL, %s, %s)',
            [name, pic]
        )

        cursor.execute(
            'INSERT INTO UserToGroup VALUES (NULL, %s, %s)',
            [cursor.lastrowid, id_user]
        )


def delete_group_member(id_group, username):
    id_user = User.objects.filter(username=username).get().id

    with connection.cursor() as cursor:
        cursor.execute(
            'DELETE FROM UserToGroup WHERE id_group=%s AND id_user=%s',
            [id_group, id_user]
        )

        cursor.execute(
            'SELECT * FROM UserToGroup WHERE id_group=%s',
            [id_group]
        )

        user_to_group = cursor.fetchall()
        if len(user_to_group) == 1:
            cursor.execute(
                'DELETE FROM mydb.Group WHERE id=%s',
                [id_group]
            )


def edit_group_db(id_group, pic, name, group_members):
    with connection.cursor() as cursor:
        cursor.execute(
            'UPDATE mydb.Group SET name=%s WHERE id=%s',
            [name, id_group]
        )
        if pic:
            cursor.execute(
                'UPDATE mydb.Group SET group_logo_path=%s WHERE id=%s',
                [pic, id_group]
            )

        for username in group_members:
            user_obj = User.objects.filter(username=username)
            if user_obj:
                cursor.execute(
                    'INSERT INTO UserToGroup VALUES (NULL, %s, %s)',
                    [id_group, user_obj.get().id]
                )


def get_user_dashboard_expenses(id_user):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM Expense WHERE id_user_owes=%s', [id_user])
        expenses_owes = cursor.fetchall()
        cursor.execute('SELECT * FROM Expense WHERE id_user_paid=%s', [id_user])
        expenses_owed = cursor.fetchall()

        sums = defaultdict(int)
        id_user_paid, id_user_owes = None, None
        for ex in expenses_owes:
            _, description, date, currency, amount, id_user_paid, id_user_owes, id_group, pic_file_path = ex
            sums[id_user_paid] -= amount
        if id_user_paid:
            print(sums[id_user_paid])
        for ex in expenses_owed:
            _, description, date, currency, amount, id_user_paid, id_user_owes, id_group, pic_file_path = ex
            sums[id_user_owes] += amount
        if id_user_owes:
            print(sums[id_user_owes])
        res = []
        for id_friend, total_sum in sums.items():
            exp = dict()
            exp['description'] = ''
            exp['date'] = ''

            if total_sum > 0:
                exp['id_paid'] = id_user
                exp['id_owed'] = id_friend
                exp['amount'] = round(total_sum, 5)
            else:
                exp['id_paid'] = id_friend
                exp['id_owed'] = id_user
                exp['amount'] = -round(total_sum, 5)

            exp['currency'] = '$'
            exp['photo'] = find_user_photo(id_friend)
            exp['id_group'] = None
            exp['id'] = ''

            res.append(exp)

        return prepare_expenses(id_user, res)


def get_group_expenses(id_group):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM Expense WHERE id_group=%s', [id_group])
        expenses = cursor.fetchall()
        res = []
        for expense in expenses:
            id_expense, description, date, currency, amount, id_user_paid, id_user_owes, id_group, pic_file_path = expense
            exp = dict()
            exp['description'] = description

            if to_locale(get_language()) == 'ru':
                exp['date'] = strftime("%d.%m.%Y")
            else:
                exp['date'] = date
            print(exp['date'])

            exp['id_paid'] = id_user_paid
            exp['id_owed'] = id_user_owes
            exp['amount'] = round(amount, 5)
            exp['currency'] = currency
            exp['photo'] = pic_file_path
            exp['id_group'] = id_group
            exp['id'] = id_expense

            res.append(exp)

        return res


def prepare_expenses(id_user, expenses):
    res = []

    for exp in expenses:
        if exp['id_paid'] == exp['id_owed'] and exp['id_paid'] == id_user:
            continue
        if exp['id_paid'] == id_user and exp['amount'] > eps:
            owed = User.objects.filter(id=exp['id_owed']).first().username
            exp['text'] = '{} {}'.format(_('you lent'), owed)
            exp['lent'] = True
        elif exp['id_owed'] == id_user and exp['amount'] > eps:
            paid = User.objects.filter(id=exp['id_paid']).first().username
            exp['text'] = '{} {}'.format(paid, _('lent you'))
            exp['lent'] = False
        else:
            continue
        res.append(exp)

    res.reverse()

    return res


def get_user_expenses_from_group(id_group, id_user):
    expenses = get_group_expenses(id_group)
    return prepare_expenses(id_user, expenses)


def get_user_expenses_with_friend(id_friend, id_user):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM Expense WHERE '
                       '(id_user_owes=%s AND id_user_paid=%s) OR '
                       '(id_user_owes=%s AND id_user_paid=%s)',
                       [id_friend, id_user, id_user, id_friend])

        expenses = cursor.fetchall()
        res = []
        for expense in expenses:
            id_expense, description, date, currency, amount, id_user_paid, \
                id_user_owes, id_group, pic_file_path = expense
            exp = dict()
            exp['description'] = description
            exp['date'] = date
            exp['id_paid'] = id_user_paid
            exp['id_owed'] = id_user_owes
            exp['amount'] = round(amount, 5)
            exp['currency'] = currency
            exp['photo'] = pic_file_path
            exp['id_group'] = id_group
            exp['id'] = id_expense
            if id_group:
                cursor.execute(
                    'SELECT name FROM mydb.Group WHERE id=%s',
                    [id_group]
                )
                group_name = cursor.fetchall()
                if len(group_name):
                    group_name = group_name[0][0]
                    exp['group_name'] = group_name

            if exp['id_paid'] == exp['id_owed'] and exp['id_paid'] == id_user:
                continue
            if exp['id_paid'] == id_user and exp['amount'] > eps:
                owed = User.objects.filter(id=exp['id_owed']).first().username
                exp['text'] = '{} {}'.format(_('you lent'), owed)
                exp['lent'] = True
            elif exp['id_owed'] == id_user and exp['amount'] > eps:
                paid = User.objects.filter(id=exp['id_paid']).first().username
                exp['text'] = '{} {}'.format(paid, _('lent you'))
                exp['lent'] = False
            else:
                continue
            res.append(exp)

        res.reverse()
        return res


def get_group_name_by_id(id_group):
    with connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM mydb.Group WHERE id=%s',
            [id_group]
        )

        group_name = cursor.fetchall()
        if len(group_name):
            __, name, __ = group_name[0]
            return name

        print('get_group_name_by_id', group_name)
        return _("GROUP NAME")


def get_friend_name_by_id(id_friend):
    return User.objects.filter(id=id_friend).first().username


def get_group_photo_by_id(id_group):
    with connection.cursor() as cursor:
        cursor.execute(
            'SELECT group_logo_path FROM mydb.Group WHERE id=%s',
            [id_group]
        )

        group_photo = cursor.fetchall()
        if len(group_photo):
            group_photo = group_photo[0][0]
            return group_photo

        return "/media/images/group_default.png"


def get_some_user_group_expenses(id_user):
    with connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM UserToGroup WHERE id_user=%s',
            [id_user]
        )

        user_group = cursor.fetchall()
        if len(user_group):
            user_group = user_group[0]
            _, id_group, _ = user_group
            return get_user_expenses_from_group(id_group, id_user), id_group

        print('get_some_user_group_expenses', user_group)
        return [], -1


def create_expense(id_group, desc, amount, date, percent_users, paid_username, pic):
    if not pic:
        pic = "/media/images/group_default.png"

    for d in percent_users:
        id_user_owes = User.objects.filter(username=d['username']).first().id

        if d['percent'] is None:
            d['percent'] = 0
        user_amount = float(d['percent']) / 100 * amount

        with connection.cursor() as cursor:
            if User.objects.filter(username=paid_username).first():
                cursor.execute(
                    'INSERT INTO Expense VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)',
                    [
                        desc, date, '$', user_amount,
                        User.objects.filter(username=paid_username).first().id,
                        id_user_owes, id_group, pic
                    ]
                )


def get_expense_info_by_id(id_exp, id_current_user):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Expense WHERE id = %s",
            [id_exp]
        )

        expense = cursor.fetchall()
        id_expense, description, date, currency, amount, \
            id_user_paid, id_user_owes, id_group, pic_file_path = expense[0]
        res = dict()

        if id_user_owes == id_current_user:
            res['username_pay'] = 'You'

        else:
            res['username_pay'] = User.objects.filter(id=id_user_owes).get().username

        if id_user_paid == id_current_user:
            res['username_get'] = 'you'
        else:
            res['username_get'] = User.objects.filter(id=id_user_paid).get().username
        res['amount'] = str(round(amount, 5)) + currency

        return res


def settle_up_by_id_exp(id_exp):
    with connection.cursor() as cursor:
        cursor.execute(
            'DELETE FROM Expense WHERE id = %s',
            [id_exp]
        )


def check_if_user_is_valid(user):
    username = User.objects.filter(username=user['username']).first()
    ans = dict()
    if username:
        ans['username'] = False
    else:
        ans['username'] = True

    email = User.objects.filter(email=user['email']).first()
    if email:
        ans['email'] = False
    else:
        ans['email'] = True

    return ans


def check_no_such_username(username):
    username = User.objects.filter(username=username).first()
    if username:
        return False

    return True


def check_is_email_valid(email):
    email = User.objects.filter(email=email).first()
    if email:
        return False

    return True


def get_user_expenses_to_friends(id_user):
    with connection.cursor() as cursor:
        cursor.execute('SELECT uid_2 FROM FriendShip WHERE uid_1=%s', [id_user])
        expenses = []
        id_friends = cursor.fetchall()

        for id_friend in id_friends:
            cursor.execute(
                'SELECT id_user_paid, id_user_owes,  amount, currency FROM Expense WHERE '
                '(id_user_paid=%s AND id_user_owes=%s) OR '
                '(id_user_paid=%s AND id_user_owes=%s)',
                [id_friend[0], id_user, id_user, id_friend[0]]
            )

            cur_expenses = cursor.fetchall()
            ans = dict()
            if cur_expenses:
                you_pay = 0
                you_owe = 0

                currency = ''
                for exp in cur_expenses:
                    id_user_paid, id_user_owes, amount, currency = exp
                    if id_user_paid == id_user:
                        you_pay += round(amount, 5)
                    else:
                        you_owe += round(amount, 5)

                ans['you_pay'] = str(round(you_pay, 5)) + currency
                ans['you_owe'] = str(round(you_owe, 5)) + currency

            else:
                ans['you_pay'] = '0$'
                ans['you_owe'] = '0$'

            ans['name'] = User.objects.filter(id=id_friend[0]).get().username
            ans['photo'] = find_user_photo(User.objects.filter(id=id_friend[0]).get().id)
            ans['id'] = id_friend[0]
            expenses.append(ans)

        return expenses


def get_user_expenses_to_groups(id_user):
    with connection.cursor() as cursor:
        cursor.execute(
            'SELECT id_group FROM UserToGroup WHERE id_user=%s',
            [id_user]
        )
        id_groups = cursor.fetchall()

        expenses = []
        for id_group in id_groups:
            cursor.execute(
                'SELECT id_user_paid, id_user_owes,  amount, currency FROM Expense WHERE '
                '(id_user_owes=%s AND id_group=%s) OR '
                '(id_user_paid=%s AND id_group=%s)',
                [id_user, id_group[0], id_user, id_group[0]]
            )

            ans = dict()
            cur_expenses = cursor.fetchall()
            if cur_expenses:
                you_pay = 0
                you_owe = 0

                currency = ''
                for exp in cur_expenses:
                    id_user_paid, id_user_owes, amount, currency = exp
                    currency = currency
                    if id_user_paid == id_user:
                        you_pay += round(amount, 5)
                    else:
                        you_owe += round(amount, 5)

                ans['you_pay'] = str(round(you_pay, 5)) + currency
                ans['you_owe'] = str(round(you_owe, 5)) + currency

            else:
                ans['you_pay'] = '0$'
                ans['you_owe'] = '0$'

            cursor.execute(
                'SELECT * FROM mydb.Group WHERE id=%s',
                [id_group[0]]
            )

            group = cursor.fetchall()
            if len(group):
                _, name, group_logo_path = group[0]
                ans['name'] = name
                ans['photo'] = group_logo_path
                ans['id'] = id_group[0]
                expenses.append(ans)

        return expenses


def update_or_set_lang_user(id_user, lang_code):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM UserLang WHERE id_user=%s', [id_user])
        lang = cursor.fetchall()

        if not len(lang):
            cursor.execute(
                'INSERT INTO UserLang VALUES (NULL, %s, %s)',
                [id_user, lang_code]
            )
        else:
            cursor.execute(
                'UPDATE UserLang SET lang=%s WHERE id_user=%s',
                [lang_code, id_user]
            )


def get_user_lang(id_user):
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT * FROM UserLang WHERE id_user=%s', [id_user])
            _, _, lang = cursor.fetchall()[0]
        return lang
    except Exception as e:
        return 'en-us'
