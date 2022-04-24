from multiprocessing.connection import wait
from time import sleep
import pytest

from brownie import Caroken, PaymentProcessor, accounts

@pytest.fixture
def deployed_payment_processor():
    caroken = Caroken.deploy(10 , {'from': accounts[0]});
    return [caroken , PaymentProcessor.deploy(caroken.address , {'from': accounts[0]})]

def test_get_carokens(deployed_payment_processor):
    caroken, payement_processor = deployed_payment_processor
    payer = accounts[1]
    owner = accounts[0]

    caroken.approveCarokens(payement_processor.address , 5 , {'from': accounts[0]})

    init_owner_eth = owner.balance()
    init_payer_eth = payer.balance()
    init_owner_carokens = caroken.balanceOf(owner)
    init_payer_carokens = caroken.balanceOf(payer)

    payement_processor.getCarokens({'from': accounts[1] , 'value': "1 ether"})

    sleep(10)
    # curr = owner.balance()
    # assert curr - init_owner_eth == 10**18
    # curr = payer.balance()
    # assert init_payer_eth - curr == 10**18
    assert init_owner_carokens -caroken.balanceOf(owner) == 10**18
    assert caroken.balanceOf(payer) - init_payer_carokens == 10**18
    