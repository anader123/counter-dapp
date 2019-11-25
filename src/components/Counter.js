import React, { Component } from 'react';
import Web3 from 'web3';
import CounterArtifact from '../abis/Counter.json';

export default class Counter extends Component {
    constructor() {
        super();

        this.state = {
            count: null,
            web3: null,
            userAccount: null,
            contractAddress: "0x4BcE862eab7A0D9b2E9384E0cB8d6D920050AFBC",
            counterContract: null,
            increasing: false
        };
    };

    async componentDidMount() {
        await this.storeWeb3();
        await this.getAccount();
        await this.storeCounterContract();
        this.contractSubscribe();
    }

    storeWeb3 = () => {
        let { web3 } = this.state;
        if (!web3) {
            web3 = new Web3(Web3.givenProvider);
        }
        this.setState({web3});
    };

    getAccount = async () => {
        const accounts = await window.ethereum.enable();
        this.setState({userAccount: accounts[0]});
    };

    storeCounterContract = async () => {
        const { contractAddress, web3, userAccount } = this.state;
        const abi = CounterArtifact.abi;
        const counterContract = new web3.eth.Contract(abi, contractAddress, {from: userAccount});
        const initialValue = await counterContract.methods.value().call();
        this.setState({counterContract, count: initialValue});
    };

    contractSubscribe = async () => {
        const { counterContract} = this.state;
        counterContract.events.Increased()
            .on('data', event => {
                const count = event.returnValues.newValue;
                this.setState({ count });
                console.log(event);
            });
    };

    increaseCounter = () => {
        const { counterContract } = this.state;
        this.setState({ increase: true });
        return counterContract.methods.increase().send()
            .on('receipt', async () => {
                this.setState({ increasing: false });
            })
            .on('error', error => {
                this.setState({ error, increasing: false });
            })
    };

    render() {
        const { count, userAccount, increasing, error } = this.state;
        if(!count) return "Loading";
        return (
            <div>
                <p>Your Address: {userAccount}</p>
                <p>Counter Vale: {count}</p>
                <button disabled={increasing} onClick={this.increaseCounter}>Increase</button>
                <br/>
                <div>{increasing && "Awaiting Transaction"}</div>
                <br/>
                <div>{ error && error.message}</div>
            </div>
        )
    };
};
