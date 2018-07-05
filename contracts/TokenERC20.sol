pragma solidity ^0.4.24;

import "./../openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "./../openzeppelin-solidity/contracts/token/ERC20/CappedToken.sol";


contract HaraToken is BurnableToken, CappedToken(1200000000 * (10 ** uint256(18))) {
    string public constant name = "HaraToken";
    string public constant symbol = "HART";
    uint8 public constant decimals = 18;
    
    uint256 public constant INITIAL_SUPPLY = 12000 * (10 ** 5) * (10 ** uint256(decimals));

    uint256 public nonce;
    mapping (uint8 => mapping(uint256 => bool)) public mintStatus;

    event BurnLog(uint256 indexed id, address indexed burner, uint256 value, bytes32 hashDetails, string data);
    event MintLog(uint256 indexed id, address indexed requester, uint256 value, bool status);

    /**
    * @dev Constructor that gives msg.sender all of existing tokens.
    */
    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }
    /**
    * @dev Function to burn tokens
    * @param value The amount of tokens to burn.
    * @param data String of description.
    */
    function burnToken(uint256 value, string data) public {
        burn(value);
        emit BurnLog(nonce, msg.sender, value, hashDetails(nonce, msg.sender, value), data);
        nonce = nonce + 1;
    }

    /**
    * @dev Function to burn tokens
    * @param value The amount of tokens to burn.
    */
    function burnToken(uint256 value) public {
        burnToken(value, "");
    }

    /**
    * @dev Function to mint tokens
    * @param id The unique burn ID.
    * @param requester The address that will receive the minted tokens.
    * @param value The amount of tokens to mint.
    * @param hash Generated hash from burn function.
    * @return A boolean that indicates if the operation was successful.
    */
    function mintToken(uint256 id, address requester, uint256 value, bytes32 hash, uint8 from) public returns(bool) {
        require(mintStatus[from][id]==false, "id already requested for mint");
        bytes32 hashInput = hashDetails(id, requester, value);
        require(hashInput == hash, "request item are not valid");
        bool status = mint(requester, value);
        emit MintLog(id, requester, value, status);
        mintStatus[from][id] = status;
        return status;
    }

    /**
    * @dev Function to hash burn and mint details.
    * @param id The unique burn ID.
    * @param burner The address that will receive the minted tokens.
    * @param value The amount of tokens to mint.
    * @return bytes32 from keccak256 hash of inputs.
    */
    function hashDetails(uint256 id, address burner, uint256 value) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(id, burner, value));
    }   
}

