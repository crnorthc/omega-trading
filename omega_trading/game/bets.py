from web3 import Web3
from solcx import compile_source
from solcx import install_solc
import json

FEE = 4809320000000000


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
        "pragma solidity ^0.5.6;contract Bets {address payable me;address payable host;uint amount;uint balance;uint fee;constructor () public {me = msg.sender;}function firstDeposit(uint _fee) public payable {host = msg.sender;balance = msg.value;fee = _fee;}function deposit() public payable {balance += msg.value;}function payWinner(address payable winner) public payable {uint winnings = balance - fee - fee - 1000000000000000;winner.transfer(winnings);host.transfer(fee);me.transfer(fee + 1000000000000000);}}",
        output_values=['abi', 'bin'],
        solc_version='0.5.6'
    )


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


def gas_quote():
    w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
    return w3.eth.gas_price / 1000000000
