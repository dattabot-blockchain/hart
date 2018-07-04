# HART main-net ERC-20

HART are an ERC-20 token that are capped at 1.2 billion HART that are burnable and mintable. HART are required to be burnable and mintable because of special circumstances where HART 
currently will be deployed in 2 network: 

- Ethereum main-net
- Hara sidechain net

The HART ERC-20 Token will be transferable between the networks via an off-chain bridging service. Whenever someone wants to transfer their token, all they have to do is burn their token and the same value will be minted for them in the other network.

Main-Net  <===> Bridging Service <===> Hara-net

Thus, the total sum of HART supply in all networks (*plus all pending transaction*) will be the total supply of HART which is 1.2 billion HART.

## Transfering to Hara-net

Transfer can occur when a HART token holder in main-net calls the burn function of the smart contract. The burn function will burn their token and create a **receipt id**. The bridging service will detect everytime the burn function is called and therefore mint the same amount on the Hara-net. 

## Transfer Claim

When tranfering from Hara-net back to Ethereum main-net, HART token holder in Hara-net can call the burn function and the bridging service will register it as pending transfer. If the user have sufficient balance on the bridging service, the pending transfer will be immidiately processed, if not the user can transfer the required balance to the bridging service address and then their transaction will be processed.

## Transfer Pending

There can be a little window between the transfer when the bridging service have not detect the function call yet. If the transfer is not registered after the window has passed, user can claim to the bridging service by providing the **receipt id** so that the bridging service can process their transfer.

## Transfer with Data

Since all the HART usage (except from trading) are bound to the Hara-net (buying data, staking, etc...), sometimes user wants to use their token in main-net as a way to transact in Hara-net. Instead of two-step process of transfering HART first then doing the transaction, user can call the burn function that have data parameter. By inputing data, user can simplify the two-step process into one step, just transfer it and put all the things you want to do in the data (such as buy certain data, stake, etc...)


