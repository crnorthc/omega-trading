# Generated by Django 3.2.5 on 2021-08-07 16:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Duration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('days', models.IntegerField(default=0)),
                ('hours', models.IntegerField(default=0)),
                ('minutes', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('start_amount', models.FloatField(default=10000)),
                ('room_code', models.CharField(max_length=8)),
                ('start_time', models.CharField(max_length=10)),
                ('end_time', models.CharField(max_length=10)),
                ('bet', models.FloatField(default=10000)),
                ('positions', models.IntegerField(default=0)),
                ('active', models.BooleanField(default=True)),
                ('is_contract', models.BooleanField(default=False)),
                ('public', models.BooleanField(default=True)),
                ('duration', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.duration')),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_amount', models.FloatField(default=10000)),
                ('bet', models.FloatField(default=10000)),
                ('start_time', models.CharField(max_length=10)),
                ('positions', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(default='', max_length=42)),
                ('key', models.CharField(default='', max_length=64)),
                ('is_host', models.BooleanField(default=False)),
                ('payed', models.BooleanField(default=False)),
                ('ready', models.BooleanField(default=False)),
                ('cash', models.DecimalField(decimal_places=4, max_digits=25)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bought', models.BooleanField()),
                ('symbol', models.CharField(max_length=10)),
                ('quantity', models.DecimalField(decimal_places=10, max_digits=25)),
                ('price', models.DecimalField(decimal_places=3, max_digits=10)),
                ('time', models.DecimalField(decimal_places=5, max_digits=15)),
                ('cash', models.DecimalField(decimal_places=4, max_digits=25)),
                ('total_quantity', models.DecimalField(decimal_places=10, max_digits=25)),
                ('positions', models.IntegerField(default=0)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.player')),
            ],
        ),
        migrations.CreateModel(
            name='PlayerHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cash', models.DecimalField(decimal_places=4, max_digits=25)),
                ('history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.history')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Holdings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symbol', models.CharField(max_length=10)),
                ('quantity', models.DecimalField(decimal_places=10, max_digits=25)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.player')),
            ],
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contract', models.JSONField(default=dict)),
                ('bet', models.IntegerField(default=0)),
                ('dollar', models.DecimalField(decimal_places=3, max_digits=10)),
                ('fee', models.IntegerField(default=0)),
                ('bets_complete', models.BooleanField(default=False)),
                ('ready_to_bet', models.BooleanField(default=False)),
                ('ready_to_start', models.BooleanField(default=False)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
            ],
        ),
    ]
