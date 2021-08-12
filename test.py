from bit.network.meta import Unspent
from hdwallet import hdwallet
from hdwallet import BIP44HDWallet, symbols
from hdwallet.utils import generate_entropy
from bit.network import NetworkAPI
import bit

ADDRESS = 'xpub661MyMwAqRbcFDhcGMwnUPwLn5gg698DtEhrvarAHMHVcCukcfjqQNJZE5bmjemmrCKYs8RVzNa6zfvGJw5PxpHKxWKuhHDqeHQVLA4SDTW'
KEY = 'xprv9s21ZrQH143K2jd9ALQn7FzcE3rBggQNX1nG8CSYj1kWjQac58RarZz5Noo8rVfrQrmxfzwjySxoCk3txbhEQMT8xFLdgjbGmzs1DNkcgBu'
KEE = 'tprv8ZgxMBicQKsPdsKUruNze5hxuc19ErFJXeV6di6jfs3DjRJcj789MAEXg38jYDBgt4HEcgWWXWrna5CiZAdYRyz34TuAcTgTvWwVhVBHK4h'

idk = 'rpcauth=crnorthc:7cd152aa70c6f1928f60349029c119c6$3beeaa263bbb06b31bc3ed14e3b5c5bace1ad4af3aec4b3feff5b3eff9e40858'


x = BIP44HDWallet()

x = x.from_root_xprivate_key(KEY)

one = x.from_path("m/44/60/0/0/1")
two = x.from_path("m/44/0/0/0/2")

key_one = one.private_key()
key_two = two.wif()

print(key_one)