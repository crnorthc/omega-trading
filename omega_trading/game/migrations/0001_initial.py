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
            name='Competition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('code', models.CharField(max_length=8)),
                ('min_size', models.IntegerField(default=0, null=True)),
                ('size', models.IntegerField(default=0, null=True)),
                ('active', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Ebet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bet', models.DecimalField(decimal_places=10, max_digits=25)),
                ('crypto', models.CharField(max_length=10)),
                ('payout', models.IntegerField(default=0)),
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
                ('ready', models.BooleanField(default=False)),
                ('cash', models.DecimalField(decimal_places=4, max_digits=25, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('competition_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='game.competition')),
                ('start_amount', models.FloatField(default=10000)),
                ('start_time', models.IntegerField(default=0)),
                ('end_time', models.IntegerField(default=0)),
                ('public', models.BooleanField(default=True)),
            ],
            bases=('game.competition',),
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
        migrations.AddField(
            model_name='competition',
            name='bet',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.ebet'),
        ),
        migrations.CreateModel(
            name='LongGame',
            fields=[
                ('game_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='game.game')),
                ('commission', models.DecimalField(decimal_places=2, max_digits=4, null=True)),
                ('options', models.BooleanField(default=True)),
            ],
            bases=('game.game',),
        ),
        migrations.CreateModel(
            name='ShortGame',
            fields=[
                ('game_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='game.game')),
                ('duration', models.IntegerField(default=0)),
                ('ready', models.IntegerField(default=0)),
            ],
            bases=('game.game',),
        ),
        migrations.AddField(
            model_name='player',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game'),
        ),
    ]