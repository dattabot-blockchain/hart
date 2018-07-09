import decodeLogs from './../openzeppelin-solidity/test/helpers/decodeLogs';

const HaraToken = artifacts.require('HaraToken');

contract('HaraToken', accounts => {
  let token;
  const creator = accounts[0];
  const minter = accounts[1];
  const burner = accounts[2];

  beforeEach(async function () {
    token = await HaraToken.new({ from: creator });
  });

  it('has a name', async function () {
    const name = await token.name();
    assert.equal(name, 'HaraToken');
  });

  it('has a symbol', async function () {
    const symbol = await token.symbol();
    assert.equal(symbol, 'HART');
  });

  it('has 18 decimals', async function () {
    const decimals = await token.decimals();
    assert(decimals.eq(18));
  });

  it('assigns the initial total supply to the creator', async function () {
    const totalSupply = await token.totalSupply();
    const creatorBalance = await token.balanceOf(creator);

    assert(creatorBalance.eq(totalSupply));

    const receipt = web3.eth.getTransactionReceipt(token.transactionHash);
    const logs = decodeLogs(receipt.logs, HaraToken, token.address);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, 'Transfer');
    assert.equal(logs[0].args.from.valueOf(), 0x0);
    assert.equal(logs[0].args.to.valueOf(), creator);
    assert(logs[0].args.value.eq(totalSupply));
  });

  it('transfer 10 token to burner', async function () {
    await token.transfer(burner, 10, { from: creator });
    const userToken = await token.balanceOf(burner);
    assert.equal(userToken, 10);
  });

  it('burn 20 token and mint the same amount for account[0]', async function () {
    await token.transfer(burner, 50, { from: creator });
    var txHash = await token.burnToken(20, "1this is tes", { from: burner });
    const receipt = web3.eth.getTransactionReceipt(txHash.receipt.transactionHash);
    const logs = decodeLogs(receipt.logs, HaraToken, token.address);
    const afterBurn = await token.balanceOf(burner);
    assert.equal(afterBurn, 30);
    await token.mintToken(logs[2].args.id.valueOf(), logs[2].args.burner, 
          logs[2].args.value.valueOf(), logs[2].args.hashDetails, 1, { from: creator });
    const afterMint = await token.balanceOf(burner);
    assert.equal(afterMint, 50);
  });

  it('minted by minter instead of creator', async function (){
    await token.setMinter(minter, { from: creator });
    const allowedMinter = await token.minter();
    assert.equal(allowedMinter, minter);

    await token.transfer(burner, 50, { from: creator });
    var txBurn = await token.burnToken(20, "1this is tes", { from: burner });
    const receiptBurn = web3.eth.getTransactionReceipt(txBurn.receipt.transactionHash);
    const logsBurn = decodeLogs(receiptBurn.logs, HaraToken, token.address);
    const txMint = await token.mintToken(logsBurn[2].args.id.valueOf(), logsBurn[2].args.burner, 
        logsBurn[2].args.value.valueOf(), logsBurn[2].args.hashDetails, 1, { from: minter });
    const receiptMint = web3.eth.getTransactionReceipt(txMint.receipt.transactionHash);
    const logsMint = decodeLogs(receiptMint.logs, HaraToken, token.address);
    assert.equal(logsMint[2].args.status, true);
  });
});