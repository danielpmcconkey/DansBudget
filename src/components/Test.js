import React, { Component } from 'react';

const cleanSlateArray = [];
const cleanSlateMessage = [];

export default class Test extends Component {

    state = {
        array: [],
        nonArray: ''
    };
    arrayTest = async () => {
        console.log('array link clicked');
        console.log(`array event 1: ${JSON.stringify(this.state.array)}`);
        await this.addErrorToStack('array item 1');
        console.log(`array event 2: ${JSON.stringify(this.state.array)}`);
        await this.addErrorToStack('array item 2');
        console.log(`array event 3: ${JSON.stringify(this.state.array)}`);
        await this.clearArrayState();
        console.log(`array event 4: ${JSON.stringify(this.state.array)}`);
        await this.addErrorToStack('array item 3');
        console.log(`array event 5: ${JSON.stringify(this.state.array)}`);
    }
    nonArrayTest = () => {
        console.log('non array link clicked');
        console.log(`non array log event 1: ${this.state.nonArray}`);
        this.addMessageToStack('message 1');
        console.log(`non array log event 2: ${this.state.nonArray}`);
        this.addMessageToStack('message 2');
        console.log(`non array log event 3: ${this.state.nonArray}`);
        this.clearMessageState();
        console.log(`non array log event 4: ${this.state.nonArray}`);
        this.addMessageToStack('message 3');
        console.log(`non array log event 5: ${this.state.nonArray}`);
    }
    addErrorToStack = async (message) => {
        await this.setState({
            array: this.state.array.concat(message)
        });
    }
    addMessageToStack = (message) => {
        this.setState({
            nonArray: message
        });
    }
    clearArrayState = async () => {
        await this.setState({ array: cleanSlateArray });
    }
    clearMessageState = () => {
        this.setState({ nonArray: cleanSlateMessage });
    }
    render() {
        return (
            <>
                <p><a href="#top" onClick={this.arrayTest}>mess with array state</a></p>
                <p><a href="#top" onClick={this.nonArrayTest}>mess with message</a></p>
            </>
        )
    }
}
