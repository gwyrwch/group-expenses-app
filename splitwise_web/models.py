from django.db import models

# Create your models here.


class FriendShip(models.Model):
    uid_1 = models.IntegerField()
    uid_2 = models.IntegerField()


class Group(models.Model):
    name = models.CharField(max_length=30)
    group_logo_path = models.CharField(max_length=100)
    logo_file_path = models.CharField(max_length=100, default=None)


class UserToGroup(models.Model):
    id_group = models.IntegerField()
    id_user = models.IntegerField()


class Expense(models.Model):
    description = models.CharField(max_length=200)
    date = models.DateField()
    split_method = models.CharField(max_length=30)
    currency = models.CharField(max_length=10)
    amount = models.CharField(max_length=15)
    id_user = models.IntegerField()
    id_group = models.IntegerField()
    pic_file_path = models.CharField(max_length=100, default=None)


class Notification(models.Model):
    notification_type = models.CharField(max_length=30)  # friend invitation,
    id_sender = models.IntegerField()
    id_recipient = models.IntegerField()


class ProfilePictures(models.Model):
    id_user = models.IntegerField()
    photo_path = models.CharField(max_length=100)
