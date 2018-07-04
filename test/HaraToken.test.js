import decodeLogs from './openzeppelin-solidity/test/helpers/decodeLogs';

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

});