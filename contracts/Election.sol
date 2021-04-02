// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

/**
 * @title Election
 * @dev Store & retrieve value in a variable
 */
contract Election is Ownable {
    
    string public title;
    
    uint public candidateCount;
    string[] public candidates;
    mapping(string => uint) private voteCounts;    
    
    uint public startTime;
    uint public endTime;
    
    mapping(string => uint) public leaderBoard;
    bool public leaderBoardStatus = false;
    
    constructor(string[] memory candidateNames, uint electionStartTime, uint electionEndTime, string memory _title) public {
        
        title = _title;
        
        for (uint i=0; i<candidateNames.length; i++) {
            // Maintain candidates list
            candidates.push(candidateNames[i]);
            
            // Initialise electionMapping
            voteCounts[candidateNames[i]] = 1;
        }
        candidateCount = candidateNames.length;
        
        // Put election time limits
        startTime = electionStartTime;
        endTime = electionEndTime;
    }
    
    function clear() internal{
        // Remove candidate mappings of previous election
        for(uint i=0; i<candidates.length; i++){
            delete voteCounts[candidates[i]];
            delete leaderBoard[candidates[i]];
        }
        
        // Reset candidates list
        delete candidates;
        
    }
    
    function restart(string[] memory newCandidates, uint  electionStartTime, uint electionEndTime, string memory _title)  public onlyOwner{
        require(block.timestamp * 1000 >= endTime, "Cannot start new election until previous election ends !");
        
        clear();
        
        title = _title;
        
        for (uint i=0; i<newCandidates.length; i++) {
            // Maintain new candidates list
            candidates.push(newCandidates[i]);
            
            // Initialise mapping for new election
            voteCounts[newCandidates[i]] = 1;
        }
        
        candidateCount = newCandidates.length;
        leaderBoardStatus = false;
        
        startTime = electionStartTime;
        endTime = electionEndTime;
    }
    
    function reset() external onlyOwner{
        
        require(block.timestamp * 1000 >= endTime, "Cannot reset until previous election ends !");
        
        clear();
        
        title = "No election going on";
        
        candidateCount = 0;
        leaderBoardStatus = false;
        
        startTime = block.timestamp * 1000;
        endTime = block.timestamp * 1000;
    }

    function vote(string memory candidateName) public{
        require(voteCounts[candidateName] != 0, "Candidate not included in the list !");
        require(block.timestamp * 1000 >= startTime, "Election not started yet !");
        require(block.timestamp * 1000 <= endTime, "Election timed out !");
        voteCounts[candidateName]++;
    }
    
    function displayLeaderboard() external onlyOwner{
        require(block.timestamp * 1000 >= endTime, "Election must end before displaying leaderBoard !");
        require(!leaderBoardStatus, "Leaderboard already active !");
        for(uint i=0; i<candidates.length; i++){
            leaderBoard[candidates[i]] = voteCounts[candidates[i]];
        }
        leaderBoardStatus = true;
    }
}