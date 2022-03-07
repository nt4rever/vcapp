// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VC {
    struct Vaccine {
        string nameVaccine;
        string date;
        string vaccinationFacility;
    }

    struct User {
        string name;
        string age;
        string dateOfBirth;
        uint256 numOfVaccine;
        mapping(uint256 => Vaccine) vaccines;
    }

    mapping(address => User) public users;
    mapping(address => bool) public checkUsers;

    function createUser(
        string memory name,
        string memory age,
        string memory dateOfBirth
    ) external {
        address userAddress = msg.sender;
        checkUsers[userAddress] = true;
        User storage u = users[userAddress];
        u.name = name;
        u.age = age;
        u.dateOfBirth = dateOfBirth;
        u.numOfVaccine = 0;
    }

    function addVaccine(
        string memory nameVaccine,
        string memory date,
        string memory vaccinationFacility
    ) external {
        address userAddress = msg.sender;
        if (checkUsers[userAddress]) {
            User storage u = users[userAddress];
            u.vaccines[u.numOfVaccine] = Vaccine(
                nameVaccine,
                date,
                vaccinationFacility
            );
            u.numOfVaccine++;
        }
    }

    function readVaccine() external view returns (Vaccine[] memory) {
        address userAddress = msg.sender;
        if (checkUsers[userAddress]) {
            User storage u = users[userAddress];
            Vaccine[] memory _list = new Vaccine[](u.numOfVaccine);
            for (uint256 i = 0; i < u.numOfVaccine; i++) {
                _list[i] = u.vaccines[i];
            }
            return _list;
        }
        return new Vaccine[](1);
    }

    function getUser(address add)
        external
        view
        returns (
            string memory,
            string memory,
            string memory
        )
    {
        if (checkUsers[add]) {
            User storage u = users[add];
            return (u.name, u.age, u.dateOfBirth);
        }
        return ("null", "null", "null");
    }
}
