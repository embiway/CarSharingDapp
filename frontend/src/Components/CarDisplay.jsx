import React, { Component, useEffect, useState } from 'react';
import Car from './Car'
import CarAdd from './CarAdd'
import TokenTransaction from './TokenTransactions';
import { ethers } from 'ethers'
import Caroken from '../contractABI/Caroken.json'
import CarShare from '../contractABI/CarShare.json'
import PaymentProcessor from '../contractABI/PaymentProcessor.json'


// Array of Cars from components
export default function CarDisplay() {

    const carokenAddress = '0x358dd6C36e6d2A2fCb26FE97120484f18938706F';
    const carshareAddress = '0x24C5b19EeE17fb5C3ce3Db3caD299a3199c32952';
    const paymentProcessorAddress = '0x27D7a1CB0A1F2e31Af117ee95a8e30c9348e4E0B';

    let [loading , setLoading] = useState(true);
    let [account , setAccount] = useState(null)
    let [provider , setProvider] = useState(null);
    let [signer , setSigner] = useState(null);
    let [caroken , setCaroken] = useState(null);
    let [carshare , setCarshare] = useState(null);
    let [paymentProcessor , setpaymentProcessor] = useState(null);

    // Initialising with a dummy object
    const [cars , setCars] = useState([
        {
            carNo: "",
            name: "",
            owner: "0",
            currentRentee: "0",
            yearOfManufacture: "",
            mileage: 0,
            isShared: false
        }
    ]);

    const [errorPresent , setErrorPresent] = useState(false);

    const connectWalletHandler = () => {
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
                yearOfManufacture: newCar[3],
                mileage: newCar[4] - 0,
                isShared: newCar[5]
            }
            currCars.push(newCarDict);
        }

        setCars(currCars);
        console.log(typeof(cars) , cars);
        setLoading(false);
    }

    const returnCar = () => {
        
    }

    const shareCar = () => {

    }

    const getCars = () => {
        console.log(typeof(cars));
        let currAddress = 0;
        signer.getAddress()
        .then(addr => {
            currAddress = addr;
        })
        .catch(err => console.log(err));
        console.log(currAddress);
        return cars.map((car) => (
            <div key={car.carNo}>
                <p>carNo : {car.carNo}</p>
                <p>name : {car.name}</p>
                <p>owner : {car.owner}</p>
                <p>year of Manufacture : {car.yearOfManufacture}</p>
                <p>mileage : {car.mileage}</p>
                <p>isShared : {car.isShared}</p>
                {car.isShared ? (car.owner === currAddress ? <button disabled>You are the owner</button> : (car.currentRentee === currAddress ? <button onClick={returnCar}>Return Car</button> : <button disabled>Car already rented</button>)) : <button onClick={shareCar}>Rent</button>}
            </div>
        ));
    }

    useEffect(() => console.log("Re rendered"));
    return (
        errorPresent ? <h4>Error occured</h4> : 
        <div>
            <p>Account: {account}</p>
            <button onClick={connectWalletHandler}>Connect Metamask</button>
            {loading ? <p>Loading</p> :
                <div>
                    <CarAdd cars={cars} carshare={carshare} setCars={setCars} setLoading={setLoading}/>
                    <ul>
                    {getCars()}
                </ul>
                <TokenTransaction/>
                <Car/>
                </div>
            }
        </div>
    );
}