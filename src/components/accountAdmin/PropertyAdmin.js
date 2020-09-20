import React, { Component, Fragment } from 'react';
import Property from './Property';
import axios from "axios";
const multiSort = require('../sharedFunctions/multiSort');
const config = require('../../config.json');


export default class PropertyAdmin extends Component {

  token = "";

  state = {
    isUserAuthenticated: false,
    newProperty: {
      "propertyid": "",
      "homeValue": "",
      "householdId": "",
      "nickName": "",
      "housingValueIncreaseRate": ""
    },
    properties: [],
    householdId: 'authVal',
  }

  resetNewProperty = async () => {
    this.setState({
      newProperty: {
        "propertyid": "",
        "homeValue": "",
        "householdId": "",
        "nickName": "",
        "housingValueIncreaseRate": ""
      }
    });
  }

  handleAddProperty = async (propertyId, event) => {
    event.preventDefault();
    try {
      const params = {
        "propertyId": 'newVal',
        "homeValue": Number(this.state.newProperty.homeValue),
        "householdId": "headerVal",
        "nickName": this.state.newProperty.nickName,
        "housingValueIncreaseRate": Number(this.state.newProperty.housingValueIncreaseRate),
      };
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      };
      const res = await axios.post(`${config.api.invokeUrlProperty}/properties/newVal`, params, { headers: headers });
      this.state.newProperty = res.data;
      this.setState({
        properties: multiSort.multiSort([...this.state.properties, this.state.newProperty], "homeValue", false)
      });
      await this.resetNewProperty();
      this.props.onChangeMessage("Property added", "success");
    } catch (err) {
      this.props.onChangeMessage(`Unable to add property: ${err}`, "danger");
    }
  }

  handleUpdateProperty = async (propertyId, nickName, homeValue, housingValueIncreaseRate) => {

    try {
      const params = {
        "propertyId": "pathVal",
        "homeValue": Number(homeValue),
        "householdId": "headerVal",
        "nickName": nickName,
        "housingValueIncreaseRate": Number(housingValueIncreaseRate)
      };
      // console.log(params);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      };
      await axios.patch(`${config.api.invokeUrlProperty}/properties/${propertyId}`, params, { headers: headers });
      const propertyToUpdate = [...this.state.properties].find(property => property.propertyId === propertyId);
      const updatedProperties = [...this.state.properties].filter(property => property.propertyId !== propertyId);
      propertyToUpdate.nickName = nickName;
      propertyToUpdate.homeValue = homeValue;
      propertyToUpdate.housingValueIncreaseRate = housingValueIncreaseRate;
      updatedProperties.push(propertyToUpdate);
      this.setState({
        properties: multiSort.multiSort(updatedProperties, "homeValue", false)
      });
      this.props.onChangeMessage("Property updated", "success");
    } catch (err) {
      this.props.onChangeMessage(`Unable to update property: ${err}`, "danger");
    }
  }

  handleDeleteProperty = async (propertyId, event) => {
    event.preventDefault();

    if (window.confirm("Please confirm that you want to delete this item.")) {
      // add call to AWS API Gateway delete property endpoint here
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        };
        await axios.delete(`${config.api.invokeUrlProperty}/properties/${propertyId}`, { headers: headers });
        const updatedProperties = [...this.state.properties].filter(property => property.propertyId !== propertyId);
        this.setState({
          properties: multiSort.multiSort(updatedProperties, "homeValue", false)
        });
        this.props.onChangeMessage("Property deleted", "success");
      } catch (err) {
        this.props.onChangeMessage(`Unable to delete property: ${err}`, "danger");
      }
    }
  }
  fetchProperties = async () => {
    try {
      var url = `${config.api.invokeUrlProperty}/properties`
      //var idToken = `Bearer ${this.token}`;
      // console.log(idToken);

      const requestConfig = {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        data: null
      };

      const res = await axios.get(url, requestConfig);
      // console.log(`logging state: ${JSON.stringify(this.state)}`);
      this.setState({
        properties: multiSort.multiSort(res.data, "homeValue", false)
      });

    } catch (err) {
      this.props.onChangeMessage(`Unable to pull properties from the database: ${err}`, "danger");
    }
  }

  onNickNameChange = event => this.setState({ newProperty: { ...this.state.newProperty, "nickName": event.target.value } });
  onHomeValueChange = event => this.setState({ newProperty: { ...this.state.newProperty, "homeValue": event.target.value } });
  onHousingValueIncreaseRateChange = event => this.setState({ newProperty: { ...this.state.newProperty, "housingValueIncreaseRate": event.target.value } });
  componentDidMount = () => {
    if (this.props.auth.user !== null) {
      this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
      this.setState(
        { isUserAuthenticated: true }
      );
      this.fetchProperties();
    }
  }

  render() {
    return (
      <Fragment>
        {this.state.isUserAuthenticated ?

          <section className="section">
            <div className="container">
              <h1 className="title is-1">Manage Properties</h1>

              <div className="columns">
                <div className="column is-one-third has-background-grey-lighter">
                  <form onSubmit={event => this.handleAddProperty(this.state.newProperty.propertyId, event)}>
                    <p className="subtitle is-5">Add a new property using the form below:</p>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter name</p>
                        <input
                          className="input is-medium"
                          type="text"
                          value={this.state.newProperty.nickName}
                          onChange={this.onNickNameChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter current home value</p>
                        <input
                          className="input is-medium"
                          type="text"
                          value={this.state.newProperty.homeValue}
                          onChange={this.onHomeValueChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter housing value increase rate</p>
                        <input
                          className="input is-medium"
                          type="text"
                          value={this.state.newProperty.housingValueIncreaseRate}
                          onChange={this.onHousingValueIncreaseRateChange}
                        />
                      </div>
                    </div>

                    <div className="field has-addons">
                      <div className="control">
                        <button type="submit" className="button is-primary is-medium">
                          Add property
                      </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="column is-two-thirds">
                  <div className="tile is-ancestor">
                    <div className="tile is-12 is-parent  is-vertical">
                      {
                        this.state.properties.map((property, index) =>
                          <Property
                            isAdmin={true}
                            handleUpdateProperty={this.handleUpdateProperty}
                            handleDeleteProperty={this.handleDeleteProperty}
                            nickName={property.nickName}
                            homeValue={property.homeValue}
                            housingValueIncreaseRate={property.housingValueIncreaseRate}
                            propertyId={property.propertyId}
                            key={property.propertyId}
                          />)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          : <div><p>You must log in to view this content</p></div>
        }
      </Fragment>
    )
  }
}
