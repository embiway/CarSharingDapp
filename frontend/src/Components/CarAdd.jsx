import React, { Component, useState } from 'react';

export default function CarAdd(props) {

    const [loading , setLoading] = useState(false);

    const addCar = async (event) => {
        setLoading(true);
        event.preventDefault();
        console.log("ADDING CARRRRRRRRRRRR");
        const here = await props.carshare.addCar(event.target.carNo.value , event.target.name.value, event.target.year_of_manufacture.value , event.target.mileage.value , event.target.base_price.value);
        
        props.carshare.on("CarAdded" , async (adder , id) => {
            console.log(here , "LOOK HERE : " , id);
            
            const currCars = props.cars;
            const newCar = await props.carshare.getCarDetailsById(id);

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
            props.setCars(currCars);
            console.log(typeof(props.cars) , props.cars);
            setLoading(false);

            alert("Car Added");
        });

        console.log("Ended");
    }

    return (
        loading? <p>Loading</p> : 
        <form onSubmit={addCar}>
            <label for='carNo'>CarNo : </label>
            <input id='carNo' type='text'/>

            <label for='name'>name : </label>
            <input id='name' type='text'/>

            <label for='year_of_manufacture'>year_of_manufacture : </label>
            <input id='year_of_manufacture' type='text'/>

            <label for='mileage'>mileage : </label>
            <input id='mileage' type='number'/>

            <label for='base_price'>basePrice : </label>
            <input id='base_price' type='number'/>

            <button type='submit'>Add Car</button>
        </form>
    );
}