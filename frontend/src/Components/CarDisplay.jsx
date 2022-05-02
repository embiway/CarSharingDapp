import React, { Component, useEffect, useState } from 'react';  


// Array of Cars from components
export default function CarDisplay(props) {

    const carokenAddress = process.env.REACT_APP_CAROKEN_ADDRESS;
    const carshareAddress = process.env.REACT_APP_CARSHARE_ADDRESS;
    const paymentProcessorAddress = process.env.REACT_APP_PAYMENTPROCESSOR_ADDRESS;


    const returnCar = async (carNo) => {
        props.setLoading(true);
        await props.carshare.returnCar(carNo);
        
        props.carshare.on("CarReturned" , async (owner , rentee , id) => {
            const currCars = [];
            console.log(props.cars);
            const totalCars = await props.carshare.getTotalCars();

            for (let carIdx = 0 ; carIdx < totalCars ; carIdx++) {
                const newCar = await props.carshare.getCarDetailsById(carIdx);

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

            props.setCars(currCars);
            console.log(typeof(cars) , props.cars);
            props.setLoading(false);
        });
    }

    const approveTokens = async (carNo) => {
        props.shareCaretLoading(true);
        const res = await props.caroken.approveCarokens(props.cars[carNo].owner , 2 * props.cars[carNo].basePriceToRent);
        const res1 = await props.caroken.approveCarokens(carshareAddress , 2 * props.cars[carNo].basePriceToRent);

        console.log(res , "Approval Done");
        props.setLoading(false);
    }

    const shareCar = async (carNo) => {
        props.setLoading(true);
        await props.carshare.shareCar(carNo);
        
        props.carshare.on("CarShared" , async (owner , rentee , id) => {
            console.log("DONE SHARE");
            const currCars = [];
            console.log(props.cars);
            const totalCars = await props.carshare.getTotalCars();

            for (let carIdx = 0 ; carIdx < totalCars ; carIdx++) {
                const newCar = await props.carshare.getCarDetailsById(carIdx);

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

            props.setCars(currCars);
            console.log(typeof(cars) , props.cars);
            props.setLoading(false);
        });
    }

    const getCars = () => {
        console.log(typeof(cars))
        return props.cars.map((car , idx) => (
            <div key={car.carNo}>
                {console.log(car.owner , props.userAddress)}
                <p>carNo : {car.carNo}</p>
                <p>name : {car.name}</p>
                <p>owner : {car.owner}</p>
                <p>Base Price To Rent : {car.basePriceToRent}</p>
                <p>mileage : {car.mileage}</p>
                <p>isShared : {car.isShared}</p>
                {car.isShared ? (car.owner === props.userAddress ? <button disabled>You are the owner</button> : (car.currentRentee === props.userAddress ? <button onClick={() => returnCar(idx)}>Return Car</button> : <button disabled>Car already rented</button>)) : (car.owner === props.userAddress ? <button disabled>You are the owner</button> : <button onClick={() => shareCar(idx)}>Rent</button>)}
                <button onClick={() => approveTokens(idx)}>approve Tokens</button>
            </div>
        ))
    }

    useEffect(() => console.log("Re rendered"));
    return (
        <div>
            {props.loading ? <p>Loading</p> :
                <div>
                    <ul>
                        {getCars()}
                    </ul>
                </div>
            }
        </div>
    );
}