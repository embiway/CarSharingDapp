import pytest

from brownie import Caroken, accounts

@pytest.fixture
def deployed_caroken():
    return Caroken.deploy(10 , {'from': accounts[0]})

def test_deploy(deployed_caroken):
    assert deployed_caroken.totalSupply() == 10 * 10 ** 18
    assert deployed_caroken.balanceOf(accounts[0]) == deployed_caroken.totalSupply()

def test_mint(deployed_caroken):
    admin = accounts[0]
    token_receiver = accounts[1]
    fake_sender = accounts[2]

    init_balance_admin = deployed_caroken.balanceOf(admin)
    init_balance_token_receiver = deployed_caroken.balanceOf(token_receiver)
    init_balance_fake_sender = deployed_caroken.balanceOf(fake_sender)
    

    # 1. test mint adds coins to admin account
    deployed_caroken.mint(token_receiver , 1 , {'from': admin})
    assert deployed_caroken.balanceOf(token_receiver) - init_balance_token_receiver == 10**18

    # 2. test mint does nothing when a non admin calls it
    
    init_balance_admin = deployed_caroken.balanceOf(admin)
    init_balance_token_receiver = deployed_caroken.balanceOf(token_receiver)
    init_balance_fake_sender = deployed_caroken.balanceOf(fake_sender)

    try:
        deployed_caroken.mint(token_receiver , 1 , {'from': fake_sender})
        assert 1 == 0
    except:
        assert deployed_caroken.balanceOf(token_receiver) - init_balance_token_receiver == 0
        assert init_balance_admin - deployed_caroken.balanceOf(admin) == 0
        assert init_balance_fake_sender - deployed_caroken.balanceOf(fake_sender) == 0


def test_burn(deployed_caroken):
    admin = accounts[0]

    # 1. Cannot burn more than we own
    try:
        deployed_caroken.burn(deployed_caroken.balanceOf(admin) + 1)
        assert 1 == 0
    except:
        assert 1 == 1