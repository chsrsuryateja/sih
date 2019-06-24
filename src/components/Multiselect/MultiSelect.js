import React, { Component } from "react";
import PropTypes from "prop-types";
import "./styles.css";

export class Multiselect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      dropDownValue: []
    };
    this.checkBox = this.checkBox.bind(this);
  }
  componentWillMount() {
    this.setState({
      dropDownValue: this.props.options
    });
  }
  removeChip(value) {
    this.checkBox(value, false);
  }
  checkBox(value, condition) {
    let checkedValue = this.state.checked;
    if (condition) {
      checkedValue.push(value);
    } else {
      let index = checkedValue.indexOf(value);
      checkedValue.splice(index, 1);
    }
    this.setState(
      {
        checked: checkedValue
      },
      () => {
        this.props.onSelectOptions(this.state.checked);
      }
    );
  }
  searchFun(e) {
    if (e.target.value.length !== 0) {
      let enteredValue = e.target.value.toLowerCase();
      let presentValue = this.props.options.filter(function(data) {
        return data.name.indexOf(enteredValue) > -1;
      });
      this.setState({ dropDownValue: presentValue });
    } else {
      this.setState({ dropDownValue: this.props.options });
    }
  }

  chipVal = (data) => {
    switch(data) {
      case "5": return("CSE");
      case "12": return("IT");
      case "4": return("ECE");
      case "3": return("MECH");
      case "1": return("CIVIL");
      case "2": return("EEE");
      default: return("Unknown");
    }
  }
  returnChip() {
    const chip = this.state.checked
      ? this.state.checked.map((data, index) => (
          <div className="chip-body-tnp" key={index}>
            <p className="chip-text-tnp">{
             this.chipVal(data)
            }</p>
            <button
              className="chip-close-tnp"
              onClick={e => this.removeChip(data)}
            >
              &times;
            </button>
          </div>
        ))
      : [];
    return chip;
  }
  returnList() {
    const list = this.state.dropDownValue
      ? this.state.dropDownValue.map((data, index) => (
          <label className="container-tnp" key={index}>
            {data.name}
            <input
              type="checkbox"
              value={data.value}
              onChange={e => this.checkBox(e.target.value, e.target.checked)}
              checked={this.state.checked.includes(data.value) ? true : false}
            />
            <span className="checkmark-tnp" />
          </label>
        ))
      : null;
    return list;
  }
  render() {
    return (
      <div className="multiSelect-tnp">
        <div className="chip-tnp">{this.returnChip()}</div>
        <input
          type="text"
          name="Search"
          placeholder="Select Branch"
          className="input-box-tnp"
          onChange={e => this.searchFun(e)}
        />
        <div className="search-result-tnp">
          <div className="list-result-tnp">{this.returnList()}</div>
        </div>
      </div>
    );
  }
}

Multiselect.defaultProps = {
  options: []
};

/** define proptypes including fields which is required */
Multiselect.prototypes = {
  options: PropTypes.array.isRequired,
  onSelectOptions: PropTypes.func
};

export default Multiselect;
