from django.test import TestCase
from django.db import connection

# Create your tests here.


class AnimalTestCase(TestCase):
    def test_notification_creation(self):
        user_id = 100
        friend_id = 200
        n_type = 'friend request'

        with connection.cursor() as cursor:
            cursor.execute(
                'INSERT INTO Notification VALUES (NULL, %s, %s, %s)',
                [n_type, user_id, friend_id]
            )
            notification_id = cursor.lastrowid

            cursor.execute(
                'SELECT * FROM Notification WHERE id=%s',
                [notification_id]
            )

            notifications = cursor.fetchall()
            self.assertEqual(len(cursor.fetchall), 1)

            id_notification, notification_type, id_sender, id_recipient = notifications[0]

            self.assertEqual(notification_type, n_type)
            self.assertEqual(id_sender, user_id)
            self.assertEqual(id_recipient, friend_id)
