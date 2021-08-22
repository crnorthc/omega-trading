from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins
from .TopSecret import user_root, game_root
from django.apps import apps
from web3 import Web3
from .models import *

Wallet = apps.get_model('users', 'Wallet')
Address = apps.get_model('users', 'Address')

def get_wallets(user):
    wallets = Wallet.objects.filter(user_id=user.id)

    balances = {'BTC': None, 'ETH': None, 'BNB': None, 'LTC': None}

    for wallet in wallets:
        balances[wallet.coin] = get_wallet(user.id, wallet.coin)

    return balances

def get_user_address(id, coin):
    seed_bytes = Bip39SeedGenerator(user_root).Generate()

    if coin == 'BNB':
        coin = Bip44Coins.BINANCE_CHAIN
    if coin == 'BTC':
        coin = Bip44Coins.BITCOIN
    if coin == 'LTC':
        coin = Bip44Coins.LITECOIN
    if coin == 'ETH':
        coin = Bip44Coins.ETHEREUM

    root = Bip44.FromSeed(seed_bytes, coin)
    account = root.Purpose().Coin().Account(id)

    if coin != 'ETH': return account.PublicKey().ToAddress(); return checkedsummed(account.PublicKey().ToAddress())

def bet_balance(id, coin):
    address = get_user_address(id, coin)
    balance = Address.objects.filter(address=address)
    balance = balance[0]

    return balance.amount

def checkedsummed(address):
    return Web3.toChecksumAddress(address)

def get_wallet(id, coin):
    address = get_user_address(id, coin)
    balance = Address.objects.filter(address=address)
    balance = balance[0]

    return {'address': address, 'balance': balance.amount}

def get_game_address(id, coin):
    seed_bytes = Bip39SeedGenerator(game_root).Generate()

    if coin == 'BNB':
        coin = Bip44Coins.BINANCE_CHAIN
    if coin == 'BTC':
        coin = Bip44Coins.BITCOIN
    if coin == 'LTC':
        coin = Bip44Coins.LITECOIN
    if coin == 'ETH':
        coin = Bip44Coins.ETHEREUM

    root = Bip44.FromSeed(seed_bytes, coin)
    account = root.Purpose().Coin().Account(id)

    if coin != 'ETH': return account.PublicKey().ToAddress(); return checkedsummed(account.PublicKey().ToAddress())






