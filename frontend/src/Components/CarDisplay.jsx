import React, { Component, useEffect, useState } from 'react';  
import CarAdd from './CarAdd'
import { Card , Button } from 'react-bootstrap'
import TokenTransaction from './TokenTransactions';
import { ethers } from 'ethers'
import Caroken from '../contractABI/Caroken.json'
import CarShare from '../contractABI/CarShare.json'
import PaymentProcessor from '../contractABI/PaymentProcessor.json'


// Array of Cars from components
export default function CarDisplay() {

    const carokenAddress = process.env.REACT_APP_CAROKEN_ADDRESS;
    const carshareAddress = process.env.REACT_APP_CARSHARE_ADDRESS;
    const paymentProcessorAddress = process.env.REACT_APP_PAYMENTPROCESSOR_ADDRESS;

    let [userAddress , setUserAddress] = useState(null);

    let [loading , setLoading] = useState(true);
    let [account , setAccount] = useState(null)
    let [provider , setProvider] = useState(null);
    let [signer , setSigner] = useState(null);
    let [caroken , setCaroken] = useState(null);
    let [carshare , setCarshare] = useState(null);
    let [paymentProcessor , setpaymentProcessor] = useState(null);
    const [errorPresent , setErrorPresent] = useState(false);

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

    const returnCar = async (carNo) => {
        setLoading(true);
        await carshare.returnCar(carNo);
        
        carshare.on("CarReturned" , async (owner , rentee , id) => {
            const currCars = [];
            console.log(cars);
            const totalCars = await carshare.getTotalCars();

            for (let carIdx = 0 ; carIdx < totalCars ; carIdx++) {
                const newCar = await carshare.getCarDetailsById(carIdx);

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
        });
    }

    const approveTokens = async (carNo) => {
        setLoading(true);
        const res = await caroken.approveCarokens(cars[carNo].owner , 2 * cars[carNo].basePriceToRent);
        const res1 = await caroken.approveCarokens(carshareAddress , 2 * cars[carNo].basePriceToRent);

        console.log(res , "Approval Done");
        setLoading(false);
    }

    const shareCar = async (carNo) => {
        setLoading(true);
        // const res = await caroken.allowance(userAddress , cars[carNo].owner);
        // console.log(res - 0);
        // const res1 = await caroken.balanceOf(userAddress);
        // console.log(res1 - 0);
        await carshare.shareCar(carNo);
        
        carshare.on("CarShared" , async (owner , rentee , id) => {
            console.log("DONE SHARE");
            const currCars = [];
            console.log(cars);
            const totalCars = await carshare.getTotalCars();

            for (let carIdx = 0 ; carIdx < totalCars ; carIdx++) {
                const newCar = await carshare.getCarDetailsById(carIdx);

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
        });
    }

    const getCars = () => {
        console.log(typeof(cars))
        return cars.map((car , idx) => (
            <div key={car.carNo}>
                {console.log(car.owner , userAddress)};
                <p>carNo : {car.carNo}</p>
                <p>name : {car.name}</p>
                <p>owner : {car.owner}</p>
                <p>Base Price To Rent : {car.basePriceToRent}</p>
                <p>mileage : {car.mileage}</p>
                <p>isShared : {car.isShared}</p>
                {car.isShared ? (car.owner === userAddress ? <button disabled>You are the owner</button> : (car.currentRentee === userAddress ? <button onClick={() => returnCar(idx)}>Return Car</button> : <button disabled>Car already rented</button>)) : (car.owner === userAddress ? <button disabled>You are the owner</button> : <button onClick={() => shareCar(idx)}>Rent</button>)}
                <button onClick={() => approveTokens(idx)}>approve Tokens</button>
            </div>
        ))
    }

    const getDetails = async (carNo) => {
        let allowance = await caroken.balanceOf(userAddress);
        allowance = allowance - 0;
        console.log(allowance , "1");
        
        allowance = await caroken.allowance(userAddress , cars[0].owner)
        allowance = allowance - 0;
        console.log(allowance, "2");
    }

    useEffect(() => console.log("Re rendered"));
    return (
        errorPresent ? <h4>Error occured</h4> : 
        <div>
            <button onClick={getDetails}>Get Details</button>
            <p>Account: {account}</p>
            <Button onClick={connectWalletHandler}>Connect Metamask</Button>
            {loading ? <p>Loading</p> :
                <div>
                    <CarAdd cars={cars} carshare={carshare} setCars={setCars} setLoading={setLoading}/>
                    <ul>
                    {getCars()}
                </ul>
                <TokenTransaction caroken={caroken} carshare={carshare} paymentProcessor={paymentProcessor} setLoading={setLoading}/>
                </div>
            }
        </div>
    );
}