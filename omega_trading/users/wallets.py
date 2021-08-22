from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins
from .TopSecret import mnemonic
from web3 import Web3
from .models import *

def create_wallets(user):    
    coins = ['BTC', 'ETH', 'LTC', 'BNB']

    for coin in coins:
        wallet = Wallet(user=user, coin=coin)        
        address = get_address(user.id, coin)
        address = Address(address=address)
        address.save()
        wallet.save()

def get_wallets(user):
    wallets = Wallet.objects.filter(user_id=user.id)

    if not wallets.exists():
        create_wallets(user)
        get_wallets(user)

    balances = {'BTC': None, 'ETH': None, 'BNB': None, 'LTC': None}

    for wallet in wallets:
        balances[wallet.coin] = get_balance(user.id, wallet.coin)

    return balances

def get_address(id, coin):
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()

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

def checkedsummed(address):
    return Web3.toChecksumAddress(address)

def get_balance(id, coin):
    address = get_address(id, coin)
    balance = Address.objects.filter(address=address)
    balance = balance[0]

    return {'address': address, 'balance': balance.amount}


