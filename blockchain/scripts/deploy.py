from brownie import Caroken , CarShare , PaymentProcessor , accounts

def deploy_caroken():
    acct = accounts[0]
    # Currently working with ganache so its alright
    deployed_caroken = Caroken.deploy(10 , {'from': acct})
    print(deployed_caroken.address);
    return deployed_caroken.address

def deploy_payment_proceessor(caroken_address):
    acct = accounts[0]
    deployed_payment_processor = PaymentProcessor.deploy(caroken_address , {'from': acct})
    print(deployed_payment_processor)

def deploy_carshare(caroken_address):
    acct = accounts[0]

    deployed_carshare = CarShare.deploy(caroken_address , {'from': acct})
    print(deployed_carshare)


def main():
    caroken_address = deploy_caroken()
    deploy_payment_proceessor(caroken_address)
    deploy_carshare(caroken_address)