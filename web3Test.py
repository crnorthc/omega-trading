from web3 import Web3

w3 = Web3()

signed_txn = w3.eth.account.sign_transaction(dict(
    nonce=0,
    gas=100000,
    gasPrice=10000,
    to='0xd3CdA913deB6f67967B99D67aCDFa1712C293601',
    value=12345,
  ),
  '2f7e1fddd88eb7e1812fa61318a9e213ae6b6d2af73c23d92fea7e35edf7a329',
)

print(signed_txn.rawTransaction.hex())

# This fucking works