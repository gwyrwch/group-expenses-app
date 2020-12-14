
from django.test import TestCase

from splitwise_web.db_operations import *
from django.test import Client

username = 'rita123'
password = '12345'
email = 'rita123@mail.ru'


class TestClientTestCase(TestCase):
    def test_sign_in_up_open(self):
        c = Client()
        response = c.get('/sign_in_up')
        self.assertEqual(response.status_code, 200)

    def test_sign_in_user(self):
        c = Client()

        User.objects.create_user(username, password=password, email=email)
        response = c.post('/sign_in_up', {'sign-in-username': username, 'sign-in-password': password})

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, '/')


class DatabaseTestCase(TestCase):
    def test_friendship_creation(self):
        uid_1 = 1
        uid_2 = 2

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_friendShip VALUES (NULL, %s, %s)',
                [uid_1, uid_2]
            )

            cursor.execute(
                'INSERT INTO splitwise_web_friendShip VALUES (NULL, %s, %s)',
                [uid_2, uid_1]
            )

            cursor.execute('SELECT * FROM splitwise_web_friendShip WHERE uid_1=%s OR uid_2=%s', [uid_1, uid_1])
            friendships = cursor.fetchall()

            self.assertEqual(len(friendships), 2)

            _, uid_1_0, uid_2_0 = friendships[0]
            _, uid_1_1, uid_2_1 = friendships[1]

            self.assertEqual(uid_1, uid_1_0)
            self.assertEqual(uid_2, uid_2_0)
            self.assertEqual(uid_1, uid_2_1)
            self.assertEqual(uid_2, uid_1_1)

    def test_group_creation(self):
        name = 'test_group'
        logo_path = '/test.png'

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_group VALUES (NULL, %s, %s)',
                [name, logo_path]
            )

            group_id = cursor.lastrowid
            cursor.execute('SELECT * FROM splitwise_web_group WHERE id=%s', [group_id])

            groups = cursor.fetchall()

            self.assertEqual(len(groups), 1)

            _, g_name, g_logo_path = groups[0]

            self.assertEqual(g_name, name)
            self.assertEqual(g_logo_path, logo_path)

    def test_user_to_group_creation(self):
        id_group = 1
        id_user = 2

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_userToGroup VALUES (NULL, %s, %s)',
                [id_group, id_user]
            )

            user_to_group_id = cursor.lastrowid
            cursor.execute('SELECT * FROM splitwise_web_userToGroup WHERE id=%s', [user_to_group_id])

            user_to_groups = cursor.fetchall()

            self.assertEqual(len(user_to_groups), 1)

            _, _id_group, _id_user = user_to_groups[0]

            self.assertEqual(_id_group, id_group)
            self.assertEqual(_id_user, id_user)

    def test_expense_creation(self):
        import datetime

        desc = '123'
        date = datetime.datetime.now().date()
        user_amount = 20
        id_user_owes = 1
        id_user_paid = 2
        id_group = 1
        pic = ''

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_expense VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)',
                [
                    desc, date, '$', user_amount,
                    id_user_paid,
                    id_user_owes, id_group, pic
                ]
            )
            expense_id = cursor.lastrowid

            cursor.execute(
                'SELECT * FROM splitwise_web_expense WHERE id=%s',
                [expense_id]
            )

            expenses = cursor.fetchall()
            self.assertEqual(len(expenses), 1)

            _, description, date_db, currency, amount, \
                id_user_paid_db, id_user_owes_db, id_group_db, pic_file_path = expenses[0]

            self.assertEqual(description, desc)
            self.assertEqual(date_db, date)
            self.assertEqual(currency, '$')
            self.assertEqual(amount, user_amount)
            self.assertEqual(id_user_paid_db, id_user_paid)
            self.assertEqual(id_user_owes_db, id_user_owes)
            self.assertEqual(id_group_db, id_group)
            self.assertEqual(pic_file_path, pic)

    def test_notification_creation(self):
        user_id = 100
        friend_id = 200
        n_type = 'friend request'

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_notification VALUES (NULL, %s, %s, %s)',
                [n_type, user_id, friend_id]
            )
            notification_id = cursor.lastrowid

            cursor.execute(
                'SELECT * FROM splitwise_web_notification WHERE id=%s',
                [notification_id]
            )

            notifications = cursor.fetchall()
            self.assertEqual(len(notifications), 1)

            id_notification, notification_type, id_sender, id_recipient = notifications[0]

            self.assertEqual(notification_type, n_type)
            self.assertEqual(id_sender, user_id)
            self.assertEqual(id_recipient, friend_id)

    def test_profile_pictures_creation(self):
        user_id = 100
        pic = 'temp.png'

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_profilePictures VALUES (NULL, %s, %s)',
                [user_id, pic]
            )
            profile_pic_id = cursor.lastrowid

            cursor.execute(
                'SELECT * FROM splitwise_web_profilePictures WHERE id=%s',
                [profile_pic_id]
            )

            profile_pics = cursor.fetchall()
            self.assertEqual(len(profile_pics), 1)

            _, user_id_db, pic_db = profile_pics[0]

            self.assertEqual(user_id_db, user_id)
            self.assertEqual(pic_db, pic)

    def test_profile_user_lang_creation(self):
        user_id = 100
        lang = 'ru'

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO splitwise_web_userLang VALUES (NULL, %s, %s)',
                [user_id, lang]
            )
            user_lang_id = cursor.lastrowid

            cursor.execute(
                'SELECT * FROM splitwise_web_userLang WHERE id=%s',
                [user_lang_id]
            )

            user_langs = cursor.fetchall()
            self.assertEqual(len(user_langs), 1)

            _, user_id_db, lang_db = user_langs[0]

            self.assertEqual(user_id_db, user_id)
            self.assertEqual(lang_db, lang)
