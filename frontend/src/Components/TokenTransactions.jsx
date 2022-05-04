import React from 'react';
import { ethers } from 'ethers'
import '../styles/carStyle.css'

import { Form, Button } from 'react-bootstrap'

export default function TokenTransaction(props) {
    const convertEthtoCRK = async (event) => {
        console.log("ETH to CRK");
        props.setLoading(true);
        event.preventDefault();
        console.log(event.target.CRKS.value);

        await props.paymentProcessor.getCarokens({value: ethers.utils.parseEther("" + event.target.CRKS.value)});
        props.setLoading(false);
        alert("Tokens Transferred");
    }

    return (
        props.loading? <p>Loading</p> :
            // <form onSubmit={convertEthtoCRK}>
            //     <label for='CRKS'>Enter the Amount of CRKS you want to buy</label>
            //     <input type='number' name='CRKS' id='CRKS'/>

            //     <input type='submit'/>
            // </form>
            <div className='form'>
                <Form onSubmit={convertEthtoCRK}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Enter the Amount of CRKS you want to buy</Form.Label>
                        <Form.Control type="number" placeholder="Enter amount" name='CRKS' id='CRKS'/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
    );
}
