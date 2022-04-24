# CarSharingDapp

This project is meant to provide a decentralised platform for sharing/renting ones so as to eliminate the problems caused by the centralised counterparts (like lack of trust, transparency, etc).

## Installation

---

- Create a virtual environment using ```virtualenv env``` on windows or ```python3 -m venv env``` on linux.
- Activate the virtual environment by using ```source env/Scripts/activate``` on windows or ```source env/bin/activate``` on linux.
- cd to the blockchain directory and Install the python dependencies using 
    ```
    pip install -r requirements.txt
    ```

    If it doesn't work manually install ```brownie``` using 
    ```
    pip install eth-brownie
    ```

- Install ```Ganache``` from https://trufflesuite.com/ganache/
- Install ```Metamask``` from [Chrome Web Store](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related).
- Install ```node``` for running the react app.
- Add ganache gui to brownie networks using the following command
  
    ```
    brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
    ```


## Running instructions

---

Use the ```deploy.sh``` script in the ```scripts``` folder to deploy the smart contracts and run the react app using the following command
    ```
    bash scripts/deploy.sh
    ```
What this script essentially does is:

  - Compile the smart contracts
  - Deploy them to the ganache GUI network which we added.
  - Copy the addresses on which the contracts are deployed and paste them in the .env file for the react app.
  - Copy the contracts' ABI files to the react app.
  - Starts the React server.

Since the script is really crude and I designed it mainly to work on my machine, if it fails to run on your machine or if it produces incorrecct results, do all the steps mentioned above manually.

## To Do work

### MUST DO
- Refactor the code.
- Create class/sequence diagrams.
- Create report/ppt
- Deploy the contracts on ethereum test nets (ropsten/rinkeby) and test them.
- Improve the UI.

### Addtional stuff if time permits
- Add a login feature.
- Add a server to allow video calls betwwen the owner and rentee.
- Use the server's data to predict people's emotions and hence give them better reccomendations on customers.