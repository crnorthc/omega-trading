# Generated by Django 3.2.5 on 2021-08-23 23:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0007_tournament_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='next_round',
            field=models.IntegerField(default=0),
        ),
    ]
