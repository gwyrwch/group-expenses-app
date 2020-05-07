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
    print(id_sender, notification_type, accept, id_user)
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
        friend['photo_path'] = find_user_photo(friend__obj.id)

        res.append(friend)

    return res


def get_user_groups(id_user):
    group_ids = UserToGroup.objects.filter(id_user=id_user)
    print(group_ids)
    res = []

    for group_id in group_ids:
        group = dict()
        print(group_id.id_group)
        group_obj = Group.objects.filter(id=group_id.id_group).get()
        group['name'] = group_obj.name
        group['logo_file_path'] = group_obj.group_logo_path
        group['id'] = group_obj.id

        res.append(group)

    return res


def get_user_group_members(id_user):
    group_ids = UserToGroup.objects.filter(id_user=id_user)
    print(group_ids)
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

    print(res)
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
    return None


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

    print(id_group, username)


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


