from web3 import Web3
from solcx import compile_source
import json

address_wallet = "0xe5a1A3Bc1Be3adbfb951Ef39eCe61f58F5cb8b5a"
private_key = "22ab8812b2e4932942457c13ab774ff79fb86a6a86f4e20b3dcfb3506a926623"

address = '0xd5f540C7488d251455E54771131AfD6125890250'
with open('omega_trading/game/info.json') as f:
    info = json.load(f)
abi = info["abi"]
provider = Web3.HTTPProvider('HTTP://127.0.0.1:7545')
w3 = Web3(provider)


def submit_bet(profile, value):
    escrow = w3.eth.contract(abi=abi)
    contract = escrow(address=address)
    tx = contract.functions.deposit().buildTransaction({
        "from": profile,
        "value": value,
        "nonce": w3.eth.getTransactionCount(profile)
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    w3.eth.sendRawTransaction(signed_tx.rawTransaction)


submit_bet('0xe5a1A3Bc1Be3adbfb951Ef39eCe61f58F5cb8b5a', 5000000000000000000)


def contractCompiler():


def create_contract(address):
    compiled_sol = contractCompiler()
