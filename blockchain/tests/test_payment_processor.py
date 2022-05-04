from multiprocessing.connection import wait
from time import sleep
import pytest

from brownie import Caroken, PaymentProcessor, accounts

def test_get_carokens():
    acct = accounts[0]
    # Currently working with ganache so its alright
    caroken = Caroken.deploy(10 , {'from': acct})
    payment_processor = PaymentProcessor.deploy(caroken.address , {'from': acct})
    caroken.approveCarokens(payment_processor.address , 5 , {'from': acct});
    caroken.mint(payment_processor.address , 5 , {'from': acct});

    payer = accounts[1]
    owner = accounts[0]

    caroken.approveCarokens(payment_processor.address , 5 , {'from': accounts[0]})

    init_owner_eth = owner.balance()
    init_payer_eth = payer.balance()
    init_owner_carokens = caroken.balanceOf(owner)
    init_payer_carokens = caroken.balanceOf(payer)

    payment_processor.getCarokens({'from': accounts[1] , 'value': "1 ether"})

    sleep(20)
    # curr = owner.balance()
    # assert curr - init_owner_eth == 10**18
    # curr = payer.balance()
    # assert init_payer_eth - curr == 10**18
    # assert init_owner_carokens -caroken.balanceOf(owner) == 10**18
    # assert caroken.balanceOf(payer) - init_payer_carokens == 10**18
    