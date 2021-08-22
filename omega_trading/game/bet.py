from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins
from .TopSecret import mnemonic
from web3 import Web3

# Binance Chain API - https://github.com/sammchardy/python-binance-chain

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

    return account.PublicKey().ToAddress()

def get_key(id, coin):
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

    return account.PrivateKey().Raw()

def gas_quote():
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
    return w3.eth.gas_price

def checkedsummed(address):
    return Web3.toChecksumAddress(address)

def get_raw_hex(to, from_key, value, nonce):
    w3 = Web3()
    signed_txn = w3.eth.account.sign_transaction(dict(
        nonce=nonce,
        gas=100000,
        gasPrice=10000,
        to=to,
        value=value,
    ),
    from_key,
    )

    return signed_txn.rawTransaction.hex()