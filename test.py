from hdwallet import hdwallet
from hdwallet import BIP44HDWallet, symbols
from hdwallet.utils import generate_entropy
from bit.network import NetworkAPI
import bit

ADDRESS = 'xpub661MyMwAqRbcFDhcGMwnUPwLn5gg698DtEhrvarAHMHVcCukcfjqQNJZE5bmjemmrCKYs8RVzNa6zfvGJw5PxpHKxWKuhHDqeHQVLA4SDTW'
KEY = 'xprv9s21ZrQH143K2jd9ALQn7FzcE3rBggQNX1nG8CSYj1kWjQac58RarZz5Noo8rVfrQrmxfzwjySxoCk3txbhEQMT8xFLdgjbGmzs1DNkcgBu'

x = BIP44HDWallet()

x = x.from_root_xprivate_key(KEY)

y = x.from_path("m/44/0/0/0/1")

key = y.wif()
key = bit.PrivateKeyTestnet(key).segwit_address
print(key)
node = NetworkAPI.connect_to_node(user='crnorthc', password='Jacen359$$$', host='localhost', port=18443, use_https=False, testnet=True)

test_key = node.importaddress(key, 'idk', False)