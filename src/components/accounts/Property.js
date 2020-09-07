import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';

export default class PropertyAdmin extends Component {

  state = {
    isEditMode: false,
    updatedNickName: this.props.nickName,
    updatedHousingValueIncreaseRate: this.props.housingValueIncreaseRate,
    updatedHomeValue: this.props.homeValue
  }

  handlePropertyEdit = event => {
    event.preventDefault();
    this.setState({ isEditMode: true });
  }

  handleEditSave = event => {
    event.preventDefault();
    this.setState({ isEditMode: false });
    this.props.handleUpdateProperty(this.props.propertyId, this.state.updatedNickName,
      this.state.updatedHousingValueIncreaseRate, this.state.updatedHomeValue);
  }

  onNickNameChange = event => {
    this.setState({ "updatedNickName": event.target.value });
  }
  onHomeValueChange = event => this.setState({ "updatedHomeValue": event.target.value });
  onHousingValueIncreaseRateChange = event => this.setState({ "updatedHousingValueIncreaseRate": event.target.value });


  render() {
    return (
      <div color="info" className="tile is-child box notification has-background-success has-text-light">
        {
          this.props.isAdmin &&
          <Fragment>
            <a href="/" onClick={this.handlePropertyEdit} className="account-edit-icon">
              <FontAwesomeIcon icon="edit" />
            </a>
            <button onClick={event => this.props.handleDeleteProperty(this.props.propertyId, event)} className="delete"></button>
          </Fragment>
        }
        {
          this.state.isEditMode
            ? <div>
              <p>Edit nickname</p>
              <input
                className="input is-medium"

                type="text"
                placeholder="Enter name"
                value={this.state.updatedNickName}
                onChange={this.onNickNameChange}
              />
              <p>Edit home value</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter home value"
                value={this.state.updatedHomeValue}
                onChange={this.onHomeValueChange}
              />
              <p>Edit housing value increase rate</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter housing value increase rate"
                value={this.state.updatedHousingValueIncreaseRate}
                onChange={this.onHousingValueIncreaseRateChange}
              />
              <p className="account-id">id: {this.props.propertyId}</p>
              <button type="submit"
                className="button is-info is-small"
                onClick={this.handleEditSave}
              >save</button>
            </div>
            : <div>
              <p className="account-title">{this.props.nickName}</p>
              <p className="account-title">home value: <NumberFormat value={this.props.homeValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
              <p className="account-title">housing value increase rate: {this.props.housingValueIncreaseRate}</p>
              <p className="account-id">account ID: {this.props.propertyId}</p>
            </div>
        }
      </div>
    )
  }
}
