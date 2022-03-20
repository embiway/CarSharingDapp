pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.5.0/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.5.0/contracts/token/ERC721/ERC721.sol";
import "./Caroken.sol";

contract CarShare is ERC721 {
    address public manager;
    IERC20 public caroken;

    struct Car {
        uint256 carId;
        string CarNo;
        address owner;
        address currentRentee;
        uint256 shareStart;
        string name;
        string yearOfManufacture;
        uint256 mileage;
        uint256 basePriceToRent;
        bool isShared;
    }

    // This event will return the id of newly added car
    event CarAdded(address owner, uint256 _id);

    event CarReturned(address owner, address rentee, uint256 _carid);

    event CarShared(address owner, address rentee, uint256 _carid);

    mapping(string => uint256) public CarIdMapper;
    mapping(string => bool) public CarNoUsed;

    Car[] public cars;

    constructor(address carokenAddress) ERC721("CarShare", "CRS") {
        manager = msg.sender;
        caroken = IERC20(carokenAddress);
    }

    function getCarDetailsById(uint256 _id)
        public
        view
        returns (
            string memory carNo,
            address owner,
            string memory name,
            uint256 basePriceToRent,
            uint256 mileage,
            bool isShared,
            address currentRentee
        )
    {
        return (
            cars[_id].CarNo,
            cars[_id].owner,
            cars[_id].name,
            cars[_id].basePriceToRent,
            cars[_id].mileage,
            cars[_id].isShared,
            cars[_id].currentRentee
        );
    }

    function getOwner(uint256 _carid) public view returns (address) {
        return ownerOf(_carid);
    }

    function getIdbyNo(string memory number) public view returns (uint256) {
        return CarIdMapper[number];
    }

    function getTotalCars() public view returns (uint256) {
        return cars.length;
    }

    function shareCarByCarNo(string memory carNo) public {
        require(CarNoUsed[carNo], "This car hasn't been added to our system");

        shareCar(CarIdMapper[carNo] - 1);
    }

    function shareCar(uint256 id) public returns (bool) {
        require(!cars[id].isShared, "The required car is already shared");

        address ownerAddress = ownerOf(id);

        require(msg.sender != ownerAddress, "Owner doesn't need to rent");
        require(msg.sender != cars[id].owner, "Owner doesn't need to rent");

        require(
            caroken.balanceOf(msg.sender) > cars[id].basePriceToRent,
            "Not enough balance to purchase"
        );

        caroken.transferFrom(
            msg.sender,
            ownerAddress,
            cars[id].basePriceToRent
        );

        _safeTransfer(ownerAddress, msg.sender, id, "Enjoy!");

        cars[id].shareStart = block.timestamp;
        cars[id].currentRentee = msg.sender;
        cars[id].isShared = true;

        emit CarShared(ownerAddress, msg.sender, id);
        return true;
    }

    function addCar(
        string memory CarNo,
        string memory name,
        string memory yearOfManufacture,
        uint256 mileage,
        uint256 basePriceToRent
    ) public {
        require(!CarNoUsed[CarNo], "Car has already been added");

        uint256 currCarId = getTotalCars();
        cars.push(
            Car(
                currCarId,
                CarNo,
                msg.sender,
                msg.sender,
                block.timestamp,
                name,
                yearOfManufacture,
                mileage,
                basePriceToRent,
                false
            )
        );

        CarIdMapper[CarNo] = currCarId + 1;
        CarNoUsed[CarNo] = true;

        _safeMint(msg.sender, currCarId);

        emit CarAdded(msg.sender, currCarId);
    }

    function returnCar(uint256 _id) public {
        require(cars[_id].isShared, "The car is with the owner itself");
        require(
            cars[_id].currentRentee == msg.sender,
            "Only the rentee can return the car"
        );
        require(
            ownerOf(_id) == msg.sender,
            "Only the current rentee can return"
        );

        uint256 currTime = block.timestamp;
        uint256 timeForRent = uint256(currTime - cars[_id].shareStart);

        // To send this much coins to the owner
        require(
            caroken.balanceOf(msg.sender) * 10**18 > timeForRent,
            "Rentee doesn't have enough coins to pay"
        );

        caroken.approve(cars[_id].owner, timeForRent / 10**18);
        caroken.transferFrom(msg.sender, cars[_id].owner, timeForRent / 10**18);

        _safeTransfer(ownerOf(_id), cars[_id].owner, _id, "Enjoy!");
        cars[_id].currentRentee = cars[_id].owner;
        cars[_id].isShared = false;

        emit CarReturned(cars[_id].owner, msg.sender, _id);
    }
}
