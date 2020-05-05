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
