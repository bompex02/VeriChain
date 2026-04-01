// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Credentials {

    struct Credential {
        address issuer;
        address recipient;
        string metadataURI;
        uint256 timestamp;
        bool revoked;
    }

    mapping(uint256 => Credential) public credentials;
    uint256 public credentialCount;

    function issueCredential(address _recipient, string memory _uri) public {
        credentials[credentialCount] = Credential(
            msg.sender,
            _recipient,
            _uri,
            block.timestamp,
            false
        );
        credentialCount++;
    }

    function revokeCredential(uint256 id) public {
        require(msg.sender == credentials[id].issuer, "Only issuer can revoke");
        credentials[id].revoked = true;
    }

    function activateCredential(uint256 id) public {
        require(msg.sender == credentials[id].issuer, "Only issuer can activate");
        credentials[id].revoked = false;
    }

    function verifyCredential(uint256 id) public view returns (bool) {
        return !credentials[id].revoked;
    }
}