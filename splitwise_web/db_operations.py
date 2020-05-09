from django.contrib.auth.models import User

from splitwise_web.models import *


def get_user_notifications(user_id):
    try:
        notifications = Notification.objects.filter(id_recipient=user_id)
        res = []
        for notification in notifications:
            res_notification = dict()
            res_notification['id_sender'] = notification.id_sender
            text = ''
            sender_username = User.objects.filter(id=notification.id_sender).get()
            sender_username = sender_username.username
            if notification.notification_type == 'friend_request':
                text += 'New friend request from @{}'.format(sender_username)
                res_notification['accept_decline'] = True
                res_notification['type'] = 'friend'
            elif notification.notification_type == 'friend_request_reply_accept':
                text += 'Your friend request to @{} was accepted'.format(sender_username)
                res_notification['accept_decline'] = False
                res_notification['type'] = 'friend_reply'
            elif notification.notification_type == 'friend_request_reply_decline':
                text += 'Your friend request to @{} was declined'.format(sender_username)
                res_notification['accept_decline'] = False
                res_notification['type'] = 'friend_reply'

            res_notification['text'] = text
            res.append(res_notification)

        return res
    except:
        return None


def process_notification(id_sender, notification_type, accept=None, id_user=None):
    # print(id_sender, notification_type, accept, id_user)
    if notification_type == 'friend':
        Notification.objects.filter(
            notification_type='friend_request',
            id_sender=id_sender, id_recipient=id_user
        ).delete()

        if accept:
            fr1 = FriendShip(uid_1=id_sender, uid_2=id_user)
            fr2 = FriendShip(uid_1=id_user, uid_2=id_sender)
            fr1.save()
            fr2.save()

            notification = Notification(
                id_sender=id_user,
                id_recipient=id_sender,
                notification_type='friend_request_reply_accept'
            )
            notification.save()
        else:
            notification = Notification(
                id_sender=id_user,
                id_recipient=id_sender,
                notification_type='friend_request_reply_decline'
            )
            notification.save()
    elif notification_type == 'friend_reply':
        try:
            Notification.objects.filter(
                notification_type='friend_request_reply_accept',
                id_sender=id_sender, id_recipient=id_user
            ).delete()

            Notification.objects.filter(
                notification_type='friend_request_reply_decline',
                id_sender=id_sender, id_recipient=id_user
            ).delete()
        except Exception as e:
            print(e)


def get_user_friends(user_id):
    friendships = FriendShip.objects.filter(uid_1=user_id)
    res = []
    for friendship in friendships:
        friend = dict()
        friend__obj = User.objects.filter(id=friendship.uid_2).get()
        friend['friend_username'] = friend__obj.username
        friend['id'] = friend__obj.id
        friend['photo_path'] = find_user_photo(friend__obj.id)

        res.append(friend)

    return res


def get_user_groups(id_user):
    group_ids = UserToGroup.objects.filter(id_user=id_user)
    # print(group_ids)
    res = []

    for group_id in group_ids:
        group = dict()
        # print(group_id.id_group)
        group_obj = Group.objects.filter(id=group_id.id_group).get()
        group['name'] = group_obj.name
        group['logo_file_path'] = group_obj.group_logo_path
        group['id'] = group_obj.id

        res.append(group)

    return res


def get_user_friend_members(id_user, id_friend):
    res = dict()
    friend_photo = find_user_photo(id_friend)
    if not friend_photo:
        friend_photo = "./media/images/profile_default.jpg"

    user_photo = find_user_photo(id_user)
    if not user_photo:
        user_photo = "./media/images/profile_default.jpg"

    res[id_friend] = [
        {'photo': user_photo, 'username': User.objects.filter(id=id_user).first().username},
        {'photo': friend_photo, 'username': User.objects.filter(id=id_friend).first().username},
    ]

    return res


def get_user_group_members(id_user):
    group_ids = UserToGroup.objects.filter(id_user=id_user)
    # print(group_ids)
    res = {}

    for group_id in group_ids:
        group_members = list()
        group_obj = Group.objects.filter(id=group_id.id_group).get()
        id_group = group_obj.id
        user_to_groups = UserToGroup.objects.filter(id_group=id_group)
        for user_to_group in user_to_groups:
            usr = dict()
            user = User.objects.filter(id=user_to_group.id_user).get()
            usr['username'] = user.username
            photo = find_user_photo(user.id)
            if not photo:
                photo = "./media/images/profile_default.jpg"
            usr['photo'] = photo

            group_members.append(usr)

        res[id_group] = group_members

    # print(res)
    return res


def add_or_update_photo(id_user, pic):
    profile_pics = ProfilePictures.objects.filter(id_user=id_user)

    if not len(profile_pics):
        profile_pic = ProfilePictures(id_user=id_user, photo_path=pic)
        profile_pic.save()
    else:
        profile_pic = profile_pics.get()
        profile_pic.photo_path = pic
        profile_pic.save()


def find_user_photo(id_user):
    profile_pics = ProfilePictures.objects.filter(id_user=id_user)

    if len(profile_pics):
        return profile_pics.get().photo_path
    # fix other places
    return "./media/images/profile_default.jpg"


def create_group(name, pic, id_user):
    if not pic:
        pic = "./media/images/group_default.jpg"

    group = Group(
        name=name,
        group_logo_path=pic
    )
    group.save()

    user_to_group = UserToGroup(id_user=id_user, id_group=group.id)
    user_to_group.save()


def delete_group_member(id_group, username):
    id_user = User.objects.filter(username=username).get().id
    UserToGroup.objects.filter(id_group=id_group, id_user=id_user).delete()

    user_to_group = UserToGroup.objects.filter(id_group=id_group)
    if len(user_to_group) == 1:
        Group.objects.filter(id_group=id_group).delete()

    # print(id_group, username)


def edit_group_db(id_group, pic, name, group_members):
    group = Group.objects.filter(id=id_group).get()
    group.name = name
    if pic:
        group.group_logo_path = pic
    group.save()

    for username in group_members:
        user_obj = User.objects.filter(username=username)
        if user_obj:
            user_to_group = UserToGroup(id_group=id_group, id_user=user_obj.get().id)
            user_to_group.save()


def get_group_expenses(id_group):
    expenses = Expense.objects.filter(id_group=id_group)

    res = []
    for expense in expenses:
        exp = dict()
        exp['description'] = expense.description
        exp['date'] = expense.date
        exp['id_paid'] = expense.id_user_paid
        exp['id_owed'] = expense.id_user_owes
        exp['amount'] = expense.amount
        exp['currency'] = expense.currency
        exp['photo'] = expense.pic_file_path
        exp['id_group'] = id_group
        exp['id'] = expense.id

        res.append(exp)

    return res


def get_user_expenses_from_group(id_group, id_user):
    expenses = get_group_expenses(id_group)
    res = []

    for exp in expenses:
        if exp['id_paid'] == exp['id_owed'] and exp['id_paid'] == id_user:
            continue
        if exp['id_paid'] == id_user:
            owed = User.objects.filter(id=exp['id_owed']).first().username
            exp['text'] = 'you lent {}'.format(owed)
            exp['lent'] = True
        elif exp['id_owed'] == id_user:
            paid = User.objects.filter(id=exp['id_paid']).first().username
            exp['text'] = '{} lent you'.format(paid)
            exp['lent'] = False
        else:
            continue
        res.append(exp)

    res.reverse()

    return res


def get_user_expenses_with_friend(id_friend, id_user):
    expenses = Expense.objects.filter(
        id_user_owes=id_friend, id_user_paid=id_user
    ) | Expense.objects.filter(
        id_user_owes=id_user, id_user_paid=id_friend
    )

    res = []
    for expense in expenses:
        exp = dict()
        exp['description'] = expense.description
        exp['date'] = expense.date
        exp['id_paid'] = expense.id_user_paid
        exp['id_owed'] = expense.id_user_owes
        exp['amount'] = expense.amount
        exp['currency'] = expense.currency
        exp['photo'] = expense.pic_file_path
        exp['id_group'] = expense.id_group
        exp['id'] = expense.id
        if expense.id_group:
            exp['group_name'] = Group.objects.filter(id=expense.id_group).first().name

        if exp['id_paid'] == exp['id_owed'] and exp['id_paid'] == id_user:
            continue
        if exp['id_paid'] == id_user:
            owed = User.objects.filter(id=exp['id_owed']).first().username
            exp['text'] = 'you lent {}'.format(owed)
            exp['lent'] = True
        elif exp['id_owed'] == id_user:
            paid = User.objects.filter(id=exp['id_paid']).first().username
            exp['text'] = '{} lent you'.format(paid)
            exp['lent'] = False
        else:
            continue
        res.append(exp)

    res.reverse()

    return res


def get_group_name_by_id(id_group):
    group = Group.objects.filter(id=id_group).first()
    if group:
        return group.name
    return "GROUP NAME"


def get_friend_name_by_id(id_friend):
    return User.objects.filter(id=id_friend).first().username


def get_group_photo_by_id(id_group):
    group = Group.objects.filter(id=id_group).first()
    if group:
        return group.group_logo_path
    return "./media/images/group_default.jpg"


def get_some_user_group_expenses(id_user):
    user_group = UserToGroup.objects.filter(id_user=id_user).first()
    if not user_group:
        return [], -1

    return get_user_expenses_from_group(user_group.id_group, id_user), user_group.id_group


def create_expense(id_group, desc, amount, date, percent_users, paid_username, pic):
    if not pic:
        pic = "./media/images/group_default.jpg"

    for d in percent_users:
        id_user_owes = User.objects.filter(username=d['username']).first().id

        if d['percent'] is None:
            d['percent'] = 0
        user_amount = float(d['percent']) / 100 * amount

        expense = Expense(
            id_group=id_group,
            description=desc,
            amount=user_amount,
            date=date,
            currency='$',
            id_user_paid=User.objects.filter(username=paid_username).first().id,
            pic_file_path=pic,
            id_user_owes=id_user_owes
        )
        expense.save()


def get_expense_info_by_id(id_exp, id_current_user):
    exp = Expense.objects.filter(id=id_exp).get()

    res = dict()
    if exp.id_user_owes == id_current_user:
        res['username_pay'] = 'You'
    else:
        res['username_pay'] = User.objects.filter(id=exp.id_user_owes).get().username

    if exp.id_user_paid == id_current_user:
        res['username_get'] = 'you'
    else:
        res['username_get'] = User.objects.filter(id=exp.id_user_paid).get().username
    res['amount'] = str(exp.amount) + exp.currency

    return res


def settle_up_by_id_exp(id_exp):
    Expense.objects.filter(id=id_exp).delete()


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


def get_user_expenses_to_friends(id_user):
    id_friends = FriendShip.objects.filter(uid_1=id_user).values_list('uid_2')

    expenses = []
    for id_friend in id_friends:
        cur_expenses = Expense.objects.filter(
            id_user_paid=id_friend[0], id_user_owes=id_user
        ) | Expense.objects.filter(
            id_user_paid=id_user, id_user_owes=id_friend[0]
        )
        ans = dict()
        if cur_expenses:
            cur_expenses = list(cur_expenses.values('id_user_paid', 'id_user_owes', 'amount', 'currency'))

            you_pay = 0
            you_owe = 0

            currency = ''
            for exp in cur_expenses:
                currency = exp['currency']
                # fixme if many currencies
                if exp['id_user_paid'] == id_user:
                    you_pay += exp['amount']
                else:
                    you_owe += exp['amount']

            ans['you_pay'] = str(you_pay) + currency
            ans['you_owe'] = str(you_owe) + currency

        else:
            ans['you_pay'] = '0$'
            ans['you_owe'] = '0$'

        ans['name'] = User.objects.filter(id=id_friend[0]).get().username
        ans['photo'] = find_user_photo(User.objects.filter(id=id_friend[0]).get().id)
        ans['id_friend'] = id_friend[0]
        expenses.append(ans)

    return expenses


def get_user_expenses_to_groups(id_user):
    id_groups = UserToGroup.objects.filter(id_user=id_user).values_list('id_group')

    expenses = []
    for id_group in id_groups:
        cur_expenses = Expense.objects.filter(
            id_user_owes=id_user, id_group=id_group[0]
        ) | Expense.objects.filter(
            id_user_paid=id_user, id_group=id_group[0]
        )

        ans = dict()
        if cur_expenses:
            cur_expenses = list(cur_expenses.values('id_user_paid', 'id_user_owes', 'amount', 'currency'))

            you_pay = 0
            you_owe = 0

            currency = ''
            for exp in cur_expenses:
                currency = exp['currency']
                # fixme if many currencies
                if exp['id_user_paid'] == id_user:
                    you_pay += exp['amount']
                else:
                    you_owe += exp['amount']

            ans['you_pay'] = str(round(you_pay, 5)) + currency
            ans['you_owe'] = str(round(you_owe, 5)) + currency

        else:
            ans['you_pay'] = '0$'
            ans['you_owe'] = '0$'

        ans['name'] = Group.objects.filter(id=id_group[0]).get().name
        ans['photo'] = Group.objects.filter(id=id_group[0]).get().group_logo_path
        ans['id'] = id_group[0]
        expenses.append(ans)

    return expenses
