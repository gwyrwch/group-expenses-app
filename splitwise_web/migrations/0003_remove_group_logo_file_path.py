# Generated by Django 3.0.4 on 2020-05-07 09:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('splitwise_web', '0002_auto_20200505_1758'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='logo_file_path',
        ),
    ]