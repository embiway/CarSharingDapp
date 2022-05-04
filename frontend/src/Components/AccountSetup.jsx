import React, { Component, useEffect, useState } from 'react';  
import CarAdd from './CarAdd'
import CarDisplay from './CarDisplay';
import { Card , Button , Navbar , Container } from 'react-bootstrap'
import '../styles/carStyle.css'
import logo from './assets/logo.jpg'
import TokenTransaction from './TokenTransactions';
import { ethers } from 'ethers'
import Caroken from '../contractABI/Caroken.json'
import CarShare from '../contractABI/CarShare.json'
import PaymentProcessor from '../contractABI/PaymentProcessor.json'


// Array of Cars from components
export default function AccountSetup() {

    const carokenAddress = process.env.REACT_APP_CAROKEN_ADDRESS;
    const carshareAddress = process.env.REACT_APP_CARSHARE_ADDRESS;
    const paymentProcessorAddress = process.env.REACT_APP_PAYMENTPROCESSOR_ADDRESS;

    let [userAddress , setUserAddress] = useState(null);
    let [isAccountSetup , setAccountSetup] = useState(false);
    let [displayCarAdd , setDisplayCarAdd] = useState(false)
    let [displayCarDisplay , setDisplayCarDIsplay] = useState(false)
    let [displayTokenTransaction , setDisplayTokenTransaction] = useState(false)
    

    let [loading , setLoading] = useState(true);
    let [account , setAccount] = useState(null)
    let [provider , setProvider] = useState(null);
    let [signer , setSigner] = useState(null);
    let [caroken , setCaroken] = useState(null);
    let [carshare , setCarshare] = useState(null);
    let [paymentProcessor , setpaymentProcessor] = useState(null);
    const [errorPresent , setErrorPresent] = useState(false);

    const [balance , setBalance] = useState(null);

    // Initialising with a dummy object
    const [cars , setCars] = useState([
        {
            carNo: "",
            name: "",
            owner: "0",
            currentRentee: "0",
            basePriceToRent: 0,
            mileage: 0,
            isShared: false
        }
    ]);

    const connectWalletHandler = () => {
        console.log("ijbfhbjfbhwbf" , carokenAddress , carshareAddress , paymentProcessorAddress);
        if(window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(res => {
                setAccount(res[0]);
                connectToBlockchain();
            }).catch(err => console.log(err));
        }
        else {
            setErrorPresent(true);
        }
    }
    useEffect(() => console.log("HI"));

    const connectToBlockchain = async () => {
        const currProvider = new ethers.providers.Web3Provider(window.ethereum);
        const currSigner = currProvider.getSigner();

        setProvider(currProvider);
        setSigner(currSigner);

        const tmpCaroken = new ethers.Contract(carokenAddress , Caroken['abi'] , currSigner);
        const tmpCarShare = new ethers.Contract(carshareAddress , CarShare['abi'] , currSigner);
        const tmpaymentProcessor = new ethers.Contract(paymentProcessorAddress , PaymentProcessor['abi'] , currSigner);
        
        setCaroken(tmpCaroken);
        setCarshare(tmpCarShare);
        setpaymentProcessor(tmpaymentProcessor);

        let currAddress = await currSigner.getAddress();
        setUserAddress(currAddress);

        const currCars = [];
        console.log(cars);
        const totalCars = await tmpCarShare.getTotalCars();
        console.log(tmpCarShare , totalCars - 10);
        for (let carIdx = 0 ; carIdx < totalCars ; carIdx++) {
            const newCar = await tmpCarShare.getCarDetailsById(carIdx);

            const newCarDict = {
                carNo: newCar[0],
                name: newCar[2],
                owner: newCar[1],
                currentRentee: newCar[6],
                basePriceToRent: newCar[3] - 0,
                mileage: newCar[4] - 0,
                isShared: newCar[5]
            }
            currCars.push(newCarDict);
        }

        setCars(currCars);
        console.log(typeof(cars) , cars);
        setLoading(false);
    }

    const goToCarAdd = () => {
        setDisplayTokenTransaction(false);
        setDisplayCarDIsplay(false);
        setDisplayCarAdd(true);
    }

    const goToCarDisplay = () => {
        setDisplayTokenTransaction(false);
        setDisplayCarAdd(false);
        setDisplayCarDIsplay(true);
    }
    
    const goToTokenTransaction = () => {
        setDisplayCarDIsplay(false);
        setDisplayCarAdd(false);
        setDisplayTokenTransaction(true);
    }

    const showCarokenBalance = async () => {
        setLoading(true);
        const bal = await caroken.balanceOf(userAddress) - 0;
        console.log(bal);
        setBalance(bal);
        setLoading(false);
    }
    

    useEffect(() => console.log("Re rendered"));
    return (
        errorPresent ? <h4>Error occured</h4> : 
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="#home">
                    <img
                    alt=""
                    src={logo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    />{' '}
                CarShare
                </Navbar.Brand>
                </Container>
            </Navbar>
            <h4 className='acctDesc'>Account: {account}</h4>
            <div id="connect">
                <Button onClick={connectWalletHandler}>Connect Metamask</Button>
                <h6 className='acctDesc'>Caroken Balance : {balance}</h6>
            </div>
            {loading ? "" :
                <div>
                    <div className='button_app'>
                        <Button onClick={goToCarAdd}>Add New Car</Button>
                        <Button onClick={goToCarDisplay}>See all the cars</Button>
                        <Button onClick={goToTokenTransaction}>Add tokens to wallet</Button>
                        <Button onClick={showCarokenBalance}>Show Balance</Button>
                    </div>
                    {displayCarAdd ? <CarAdd cars={cars} carshare={carshare} setCars={setCars} loading={setLoading} setLoading={setLoading}/> : ""}
                    {displayCarDisplay ? <CarDisplay cars={cars} userAddress={userAddress} caroken={caroken} carshare={carshare} setCars={setCars} loading={loading} setLoading={setLoading}/> : ""}
                    {displayTokenTransaction ? <TokenTransaction caroken={caroken} carshare={carshare} loading={loading} paymentProcessor={paymentProcessor} setLoading={setLoading}/> : ""}
                </div>
            }
        </div>
    );
}