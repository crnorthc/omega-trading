pragma solidity ^0.5.6;

contract Bets {
    
    address me;
    uint amount;
    uint balance;
    
    constructor () public {
        me = msg.sender;
    }
    
    function deposit() public payable {
        balance += msg.value;
    }
    
    function payWinner(address payable winner) public payable {
        winner.transfer(address(this).balance);
    }
    
}