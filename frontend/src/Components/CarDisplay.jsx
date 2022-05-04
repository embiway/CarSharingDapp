import React, { Component, useEffect, useState } from 'react'; 
import { Card, Button } from 'react-bootstrap'; 


// Array of Cars from components
export default function CarDisplay(props) {

    const carokenAddress = process.env.REACT_APP_CAROKEN_ADDRESS;
    const carshareAddress = process.env.REACT_APP_CARSHARE_ADDRESS;
    const paymentProcessorAddress = process.env.REACT_APP_PAYMENTPROCESSOR_ADDRESS;

    const [loading , setLoading] = useState(false);


    const returnCar = async (carNo) => {
        setLoading(true);
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
            setLoading(false);
        });
    }

    const approveTokens = async (carNo) => {
        setLoading(true);
        const res = await props.caroken.approveCarokens(props.cars[carNo].owner , 2 * props.cars[carNo].basePriceToRent);
        const res1 = await props.caroken.approveCarokens(carshareAddress , 2 * props.cars[carNo].basePriceToRent);

        console.log(res , "Approval Done");
        setLoading(false);
    }

    const shareCar = async (carNo) => {
        setLoading(true);
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
            setLoading(false);
        });
    }

    const getCars = () => {
        console.log(typeof(cars))
        return <div className='carDisp'>
            {props.cars.map((car , idx) => (
            // <div key={car.carNo}>
            //     {console.log(car.owner , props.userAddress)}
            //     <p>carNo : {car.carNo}</p>
            //     <p>name : {car.name}</p>
            //     <p>owner : {car.owner}</p>
            //     <p>Base Price To Rent : {car.basePriceToRent}</p>
            //     <p>mileage : {car.mileage}</p>
            //     <p>isShared : {car.isShared}</p>
            //     {car.isShared ? (car.owner === props.userAddress ? <button disabled>You are the owner</button> : (car.currentRentee === props.userAddress ? <button onClick={() => returnCar(idx)}>Return Car</button> : <button disabled>Car already rented</button>)) : (car.owner === props.userAddress ? <button disabled>You are the owner</button> : <button onClick={() => shareCar(idx)}>Rent</button>)}
            //     <button onClick={() => approveTokens(idx)}>approve Tokens</button>
            // </div>
            <span>
                <Card style={{ width: '18rem' }} key={car.carNo}>
                    <Card.Body>
                        <h3><Card.Title>{car.name}</Card.Title></h3>
                        <Card.Text>
                            <p><b>carNo</b> : {car.carNo}</p>
                            <p><b>name</b> : {car.name}</p>
                            <p><b>owner</b> : {car.owner}</p>
                            <p><b>Base Price To Rent</b> : {car.basePriceToRent}</p>
                            <p><b>mileage</b> : {car.mileage}</p>
                        </Card.Text>
                        {car.isShared ? (car.owner === props.userAddress ?<Button variant="primary" disabled>You are the owner</Button> : (car.currentRentee === props.userAddress ? <Button variant="primary" onClick={() => returnCar(idx)}>Return Car</Button> : <Button variant="primary" disabled>Car already rented</Button>)) : (car.owner === props.userAddress ? <Button variant="primary" disabled>You are the owner</Button> : <Button variant="primary" onClick={() => shareCar(idx)}>Rent</Button>)}
                        <Button variant="primary" onClick={() => approveTokens(idx)}>Approve Tokens</Button>
                    </Card.Body>
                </Card>
            </span>
            ))}
        </div>
    }

    useEffect(() => console.log("Re rendered"));
    return (
        <div>
            {loading ? <p>Loading</p> :
                <div>
                    <ul>
                        {getCars()}
                    </ul>
                </div>
            }
        </div>
    );
}