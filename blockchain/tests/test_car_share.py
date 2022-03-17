import pytest

from brownie import CarShare, Caroken, accounts

'''
    0 -> carId;
    1 -> CarNo;
    2 -> owner;
    3 -> currentRentee;
    4 -> shareStart;
    5 -> name;
    6 -> yearOfManufacture;
    7 -> mileage;
    8 -> basePriceToRent;
    9 -> isShared;
'''

@pytest.fixture
def deployed_carshare():
    admin = accounts[0]
    deployed_caroken = Caroken.deploy(1000 , {'from': admin})
    deployed_caroken.mint(accounts[1] , 100 , {'from': admin})      # only for testing
    return [deployed_caroken , CarShare.deploy(deployed_caroken.address , {'from': admin})]

def test_initial_conditions(deployed_carshare):
    caroken , carshare = deployed_carshare
    assert carshare.manager() == accounts[0]
    assert carshare.getTotalCars() == 0

def test_add_car(deployed_carshare):
    caroken , carshare = deployed_carshare
    # Shouldn't be able to add same car again

    # Adding one car
    carshare.addCar("12345" , "WagonR" , "1998" , 20 , 2 , {'from': accounts[0]})
    assert carshare.getTotalCars() == 1
    assert carshare.cars(0)[1] == "12345"

    # Shouldn't be able to add the same car again
    try:
        carshare.addCar("12345" , "WagonR" , "1998" , 20 , 2 , {'from': accounts[0]})
        assert 1 == 0
        # If the above transaction succeeds then it means there is a problem hence sserting a false condition
    except:
        assert carshare.getTotalCars() == 1
        # The car shouldn't have been added

def test_share_car(deployed_carshare):
    caroken , carshare = deployed_carshare
    carshare.addCar("12345" , "WagonR" , "1998" , 20 , 2 , {'from': accounts[0]})
    # 1. Can't share the car if you are the owner
    try:
        carshare.shareCar(0 , {'from': accounts[0]})
        assert 1 == 0
    except:
        assert 1 == 1

    init_balance_owner = caroken.balanceOf(accounts[0])
    init_balance_rentee = caroken.balanceOf(accounts[1])
    # sharing car with account[1] for testing 2

    assert caroken.balanceOf(accounts[1]) > 0
    # approving 2 coins from accounts[1] to be transferrable from the contract
    caroken.approve(carshare.address , 2 , {'from': accounts[1]})
    caroken.approve(carshare.address , 2 , {'from': accounts[1]})
    carshare.shareCar(0 , {'from': accounts[1]})
    assert caroken.balanceOf(accounts[0]) - init_balance_owner == carshare.cars(0)[8]
    assert init_balance_rentee - caroken.balanceOf(accounts[1]) == carshare.cars(0)[8]
    assert carshare.getOwner(0) == accounts[1]
    assert carshare.cars(0)[2] == accounts[0]
    assert carshare.cars(0)[3] == accounts[1]  
    assert carshare.cars(0)[9]

    # 2. Can't share the car if it is already shared

    try:
        carshare.shareCar(0 , {'from': accounts[2]})
        assert 1 == 0
    except:
        assert 1 == 1
    # 3. Rentee can't take the car if he doesn't have enough coins

    # 4. After transfer ownership of car NFT should be with the rentee, but owner field in the car shouldn't change
    # 5. Car should be marked as shared
    # 6. current rentee should be updated to the owner

def test_return_car(deployed_carshare):
    caroken , carshare = deployed_carshare
    # 1. Car can only be returned if it is shared
    carshare.addCar("12345" , "WagonR" , "1998" , 20 , 2 , {'from': accounts[0]})

    caroken.approve(carshare.address , 0 , {'from': accounts[1]})
    caroken.approve(carshare.address , 10 , {'from': accounts[1]})
    
    try:
        # Shouldn't be able to return car if not rented
        carshare.returnCar(0 , {'from': accounts[0]})
        assert 1 == 0
    except:
        pass

    carshare.shareCar(0 , {'from': accounts[1]})

    init_balance_owner = caroken.balanceOf(accounts[0])
    init_balance_rentee = caroken.balanceOf(accounts[1])

    carshare.returnCar(0 , {'from': accounts[1]})

    assert caroken.balanceOf(accounts[0]) >= init_balance_owner
    assert caroken.balanceOf(accounts[1]) <= init_balance_rentee
    assert carshare.cars(0)[9] == False
    assert carshare.cars(0)[3] == accounts[0]
    
    # 2. Once the car is returned the NFT ownership is transferred back to the owner
    # 3. isShared field is marked false
    # 4. Owner's balance is increased