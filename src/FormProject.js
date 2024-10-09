import React, { useState } from 'react'
import { Button, Form, Container, Header } from 'semantic-ui-react'
import axios from 'axios';
import styled from 'styled-components';
import './App.css';
require('dotenv').config()


const Frame=styled.div`
width: 500px;
padding: 20px;
`

const Thx=styled.div`
margin-top: 4vh;
margin-left: 3vw;
`

const FormProject = () => {
	const current = new Date();
  	const datecreate = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [minimum, setMinimum] = useState('');
	const [maximum, setMaximum] = useState('');
	const [rate, setRate] = useState('');
	const [presale, setPresale] = useState('');
	const [lockTime, setLockTime] = useState('');
	const [sent, setSent] = useState(false); 
	// const sheet= process.env.API_FILE_GOOGLESHEET;
	const sheet = "https://sheet.best/api/sheets/6ea8f8b3-8a1d-43ba-a7dc-d185f6d17322";
	const handleSubmit = (e) => {
		e.preventDefault();

		const object = { name, address, minimum, maximum, rate, presale, lockTime, datecreate };

		axios.post(sheet, object)
		.then((response) => {
			console.log(response);
		});
		setSent(true);
	};
	if (!sent) {
    	return (
	<Frame>
      	<Container fluid className="container">
        <Header as='h2'>Submit Your Project</Header>
        <Form className="form">
          <Form.Field>
            <label>Name</label>
            <input placeholder='Enter project name' onChange={(e) => setName(e.target.value)}/>
          </Form.Field>
		  <Form.Field>
            <label>Token Address</label>
            <input placeholder='Enter token address' onChange={(e) => setAddress(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution (BNB)</label>
            <input placeholder='Enter project minimum contribution' onChange={(e) => setMinimum(e.target.value)}/>
          </Form.Field>
		  <Form.Field>
            <label>Maximum Contribution (BNB)</label>
            <input placeholder='Enter project maximum contribution' onChange={(e) => setMaximum(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Pre-sale rate (amount of tokens user gets for a deposit of 1 bnb)</label>
            <input placeholder='Enter project pre-sale rate' onChange={(e) => setRate(e.target.value)} />
          </Form.Field>
          <Form.Field>
            <label>Presale Cap</label>
            <input placeholder='Enter presale cap' onChange={(e) => setPresale(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Liquidity Lock Time (months)</label>
            <input placeholder='Enter Liquidity Lock Up Time' onChange={(e) => setLockTime(e.target.value)}/>
			 
          </Form.Field>
          
          <Button color="blue" type='submit' onClick={handleSubmit}>Submit</Button>
        </Form>
      </Container>
      </Frame>
    	)
	} else {
		return (
			<Thx>
			<p>Thank you for your submission!</p>
			<p>Your project has been listed.</p>
			<p>Reload the front page to see it.</p>
			</Thx>
		)
	}
}

export default FormProject;
