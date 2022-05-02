import React from 'react';
import { ethers } from 'ethers'

export default function TokenTransaction(props) {
    const convertEthtoCRK = async (event) => {
        console.log("ETH to CRK");
        props.setLoading(true);
        event.preventDefault();
        console.log(event.target.CRKS.value);

        await props.paymentProcessor.getCarokens({value: ethers.utils.parseEther("1.0")});
        props.setLoading(false);
        alert("Tokens Transferred");
    }

    return (
        props.loading? <p>Loading</p> :
            <form onSubmit={convertEthtoCRK}>
                <label for='CRKS'>Enter the Amount of CRKS you want to buy</label>
                <input type='number' name='CRKS' id='CRKS'/>

                <input type='submit'/>
            </form>
    );
}