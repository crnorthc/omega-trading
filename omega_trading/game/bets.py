from web3 import Web3
from solcx import compile_source
from solcx import install_solc
import json
import math

FEE = 4809320000000000
ADDRESS = '0x655C6D9Ed7068B7F78837D841BAb327ECBF97d6b'


def check_address(address):
    return Web3.isAddress(address)


def checkedsummed(address):
    return Web3.toChecksumAddress(address)


def pay_winner(contract_address, abi, address):
    # Create Web3 instance
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))

    # Connect to contract
    contract = w3.eth.contract(abi=abi, address=contract_address)

    # Make Transaction
    contract.functions.payWinner(address).transact()


def place_betds(contract, players, bet_amount, fee):
    # Compile and Extract data from .sol
    bytecode = contract['bytecode']
    abi = contract['abi']

    # setup web3.py instance
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
    w3.eth.default_account = w3.eth.accounts[0]

    # setup contract
    Contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    tx_hash = Contract.constructor(fee).transact()
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    contract = w3.eth.contract(address=contract_address, abi=abi)

    num_of_players = len(players)

    for player, value in players.items():
        # Build Transaction
        tx = contract.functions.deposit().buildTransaction({
            "from": value['address'],
            "value": bet_amount + math.ceil(fee / num_of_players),
            "nonce": w3.eth.getTransactionCount(value['address'])
        })
        signed_tx = w3.eth.account.sign_transaction(
            tx, private_key=value['key'])

        # Make transaction
        w3.eth.sendRawTransaction(signed_tx.rawTransaction)


def submit_bet(contract_address, abi, address, key, value):
    # Create Web3 instance
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))

    # Connect to contract
    contract = w3.eth.contract(abi=abi, address=contract_address)

    # Build and Sign transaction
    tx = contract.functions.deposit().buildTransaction({
        "from": address,
        "value": value,
        "nonce": w3.eth.getTransactionCount(address)
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=key)

    # Make transaction
    w3.eth.sendRawTransaction(signed_tx.rawTransaction)


def contract_compiler():
    install_solc(version='0.5.6')
    return compile_source(
        "pragma solidity ^0.5.6; contract Bets { address payable me; uint balance; uint fee; constructor (uint _fee) public { me = msg.sender; fee = _fee; } function deposit() public payable { balance += msg.value; } function payWinner(address payable winner) public payable { uint winnings = balance - fee - 1000000000000000; winner.transfer(winnings); me.transfer(fee + 1000000000000000); } }",
        output_values=['abi', 'bin'],
        solc_version='0.5.6'
    )


def check_balance(address, bet, fee):
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))

    return w3.eth.get_balance(address) > (bet + fee) / 2


def gas_quote():
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
    return w3.eth.gas_price / 1000000000


def contract_fee_estimate():
    # Compile and Extract data from .sol
    compiled_sol = contract_compiler()
    contract_id, contract_interface = compiled_sol.popitem()
    bytecode = contract_interface['bin']
    abi = contract_interface['abi']

    # setup web3.py instance
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
    w3.eth.default_account = w3.eth.accounts[0]
    gas_quote = w3.eth.gas_price

    # setup contract
    Contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    gas_amount = Contract.constructor(FEE).estimateGas()
    gas_amount += 50000

    return gas_amount * gas_quote, abi, bytecode


def create_contract(address, key, value):
    # Compile and Extract data from .sol
    compiled_sol = contract_compiler()
    contract_id, contract_interface = compiled_sol.popitem()
    bytecode = contract_interface['bin']
    abi = contract_interface['abi']

    # setup web3.py instance
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
    w3.eth.default_account = w3.eth.accounts[0]

    # setup contract
    Contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    tx_hash = Contract.constructor().transact()
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    contract = w3.eth.contract(address=contract_address, abi=abi)

    # make first bet
    tx = contract.functions.firstDeposit(FEE).buildTransaction({
        "from": address,
        "value": int(value),
        "nonce": w3.eth.getTransactionCount(address)
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=key)
    w3.eth.sendRawTransaction(signed_tx.rawTransaction)

    return abi, contract_address
