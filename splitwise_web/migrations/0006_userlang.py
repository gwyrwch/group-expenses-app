# Generated by Django 3.0.4 on 2020-05-27 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('splitwise_web', '0005_auto_20200508_1157'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserLang',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_user', models.IntegerField()),
                ('lang', models.CharField(max_length=10)),
            ],
        ),
    ]
