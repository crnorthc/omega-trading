# Generated by Django 3.1.6 on 2021-06-29 20:54

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('portfolio_amount', models.FloatField(default=25000)),
                ('verification_code', models.CharField(max_length=6)),
                ('transactions', models.JSONField(default=dict)),
                ('holdings', models.JSONField(default=dict)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Friends',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('friend', models.ManyToManyField(
                    related_name='friend', to=settings.AUTH_USER_MODEL)),
                ('user', models.ManyToManyField(
                    related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
