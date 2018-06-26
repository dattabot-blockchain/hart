import json, os, sys
from web3 import Web3, HTTPProvider, Account

def deploy_contract(web3, bytecode, address, privateKey, chainId):
    
    gasPrice = web3.eth.gasPrice
    gasPriceHex = web3.toHex(gasPrice)
    gasLimitHex = web3.toHex(300000)

    nonce = web3.eth.getTransactionCount(address)
    nonceHex = web3.toHex(nonce)

    rawTx = {
    "nonce": nonceHex,
    "gasPrice": gasPriceHex,
    "gas": gasLimitHex,
    "data": bytecode,
    "from": address,
    "chainId": int(chainId)
    }

    # signed_tx = Account.signTransaction(rawTx, privateKey)
    signed_tx = web3.eth.account.signTransaction(rawTx, privateKey)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return tx_hash

def checking_tx(web3, tx_hash):
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt.contractAddress

try:
    address = os.getenv("ADDRESS")
    privateKey = os.getenv("PRIVATE_KEY")
    chainId = os.getenv("CHAIN_ID")

    web3 = Web3(HTTPProvider(os.getenv("PROVIDER")))


    for build_file in os.listdir(sys.argv[1]):
        # open build file ad parse to json
        with open("{}/{}".format(sys.argv[1],build_file)) as f:
            data = json.load(f)
            f.close()

        bytecode = data['bytecode']
        print("deploying contract {} ....".format(build_file))
        hash = deploy_contract(web3, bytecode, address, privateKey, chainId)
        print("transaction hash {}".format(hash.hex()))
        contract_address = checking_tx(web3, hash)
        print("contract deployed with address {}".format(contract_address))
    exit(0)
except Exception as e:
    print("type error: " + str(e))
    exit(1)
