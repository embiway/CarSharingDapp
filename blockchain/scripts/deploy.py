from brownie import Caroken , CarShare , PaymentProcessor , accounts

def deploy_caroken():
    acct = accounts[0]
    # Currently working with ganache so its alright
    deployed_caroken = Caroken.deploy(10 , {'from': acct})
    print(deployed_caroken.address);
    return deployed_caroken

def deploy_payment_proceessor(caroken):
    acct = accounts[0]
    deployed_payment_processor = PaymentProcessor.deploy(caroken.address , {'from': acct})
    caroken.approveCarokens(deployed_payment_processor.address , 5 , {'from': acct});
    caroken.mint(deployed_payment_processor.address , 5 , {'from': acct});
    print(deployed_payment_processor)

def deploy_carshare(caroken):
    acct = accounts[0]

    deployed_carshare = CarShare.deploy(caroken.address , {'from': acct})
    print(deployed_carshare)


def main():
    caroken = deploy_caroken()
    deploy_payment_proceessor(caroken)
    deploy_carshare(caroken)