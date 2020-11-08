from django.db import models

# Create your models here.


class Group(models.Model):
    name = models.CharField(max_length=30)
    group_logo_path = models.CharField(max_length=100)


class UserToGroup(models.Model):
    id_group = models.IntegerField()
    id_user = models.IntegerField()

