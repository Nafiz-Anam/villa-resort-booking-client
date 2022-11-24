import React, { Component } from "react";
import { connect } from "react-redux";
import { searchData } from "../redux/action/villa-action";

class GuestComponet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      kidsCount: 0,
      petsCount: 0,
      parentsCount: 0,
      guestsInputBorderFocused: false,
      redirectToSearchIdx: false,
      guestsInputContent: "",
      guestString: "",
      guest: 0,
    };
    this.inputNode = React.createRef();
    this.dropdownNode = React.createRef();
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.increaseCount = this.increaseCount.bind(this);
    this.decreaseCount = this.decreaseCount.bind(this);
    //  this.handleSearchUpdate = this.handleSearchUpdate.bind(this);
    //this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.makeSingleGuestsInputString = this.makeSingleGuestsInputString.bind(
      this
    );
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillMount() {
    this.setState({
      kidsCount: this.props.searchdata.kidsCount,
      petsCount: this.props.searchdata.petsCount,
      parentsCount: this.props.searchdata.parentsCount,
    });
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
    //    this.props.clearTreehouseState();
  }
  componentDidMount() {
    this.setState({
      kidsCount: this.props.searchdata.kidsCount,
      petsCount: this.props.searchdata.petsCount,
      parentsCount: this.props.searchdata.parentsCount,
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Do something if any updates
    if (
      JSON.stringify(this.props.searchdata) !==
      JSON.stringify(prevProps.searchdata)
    ) {
      this.setState({
        kidsCount: this.props.searchdata.kidsCount,
        petsCount: this.props.searchdata.petsCount,
        parentsCount: this.props.searchdata.parentsCount,
      });
    }
  }
  handleOnChange(e) {
    this.setState({ guestString: e.target.value });
    alert(this.state.guestString);
  }
  toggleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  openDropdown() {
    this.setState({ dropdownOpen: true });
  }

  closeDropdown() {
    this.setState({ dropdownOpen: false });
  }

  toggleGuestsInputBorderColor() {
    this.setState({
      guestsInputBorderFocused: !this.state.guestsInputBorderFocused,
    });
  }

  increaseCount(type) {
    // e.stopPropagation();
    let newVal = this.state[type] + 1;

    this.setState({ [type]: newVal }, () => {
      this.setState(
        {
          guest: this.state.petsCount + this.state.kidsCount,
          guestString: this.state.guestString,
        },
        () => {
          this.props.search({
            guest: this.state.petsCount + this.state.kidsCount,
            guestString: this.state.guestString,
            kidsCount: this.state.kidsCount,
            petsCount: this.state.petsCount,
            parentsCount: this.state.parentsCount,
          });
        }
      );
    });

    //
  }

  decreaseCount(type) {
    // e.stopPropagation();
    let newVal = this.state[type] - 1;
    if (this.state[type] > 0) {
      this.setState({ [type]: newVal }, () => {
        this.setState(
          {
            guest: this.state.petsCount + this.state.kidsCount,
            guestString: this.state.guestString,
          },
          () => {
            this.props.search({
              guest: this.state.petsCount + this.state.kidsCount,
              guestString: this.state.guestString,
              kidsCount: this.state.kidsCount,
              petsCount: this.state.petsCount,
              parentsCount: this.state.parentsCount,
            });
          }
        );
      });
    }
  }

  makeSingleGuestsInputString(type, stateName) {
    let num = this.state[stateName];
    if (num === 0) return null;

    if (num === 1) {
      return num;
    } else {
      return num;
    }
  }
  gusetInput = () => {
    let adult = this.makeSingleGuestsInputString("Adults", "kidsCount");
    let child = this.makeSingleGuestsInputString("Child", "petsCount");
    let infant = this.makeSingleGuestsInputString("Infant", "parentsCount");
    let guest_total = adult + child;
    let guestsInputContent = [
      this.makeSingleGuestsInputString("Adults", "kidsCount"),
      this.makeSingleGuestsInputString("Child", "petsCount"),
    ]
      .filter((type) => type)
      .join(", ");

    return this.state.guest;
  };

  handleClick(e) {
    if (
      this.dropdownNode.current &&
      this.dropdownNode.current.contains(e.target)
    ) {
      this.openDropdown();
      return;
    } else if (
      this.inputNode.current &&
      this.inputNode.current.contains(e.target)
    ) {
      this.toggleDropdown();
    } else {
      this.closeDropdown();
    }
  }

  getAllGuest = () => {
    return this.state.guest;
  };
  render() {
    let kidsMinusSignColorClass =
      this.state.kidsCount === 0
        ? "search-box-minus-circle"
        : "search-box-plus-circle";
    let petsMinusSignColorClass =
      this.state.petsCount === 0
        ? "search-box-minus-circle"
        : "search-box-plus-circle";
    let parentsMinusSignColorClass =
      this.state.parentsCount === 0
        ? "search-box-minus-circle"
        : "search-box-plus-circle";

    // Create Guests input string
    let string = "";
    if (this.state.guest > 0) {
      string += `${this.state.guest} ${this.state.guest==1 ? 'Guest' : 'Guests' }`;
    }
    if (this.state.parentsCount > 0) {
      string += `, ${this.state.parentsCount} Infants`;
    }
    let guestInputText = string;
    this.state.guestString = string;

    let guestsInputContent = [
      this.makeSingleGuestsInputString("Adults", "kidsCount"),
      this.makeSingleGuestsInputString("Child", "petsCount"),
      this.makeSingleGuestsInputString("Infant", "parentsCount"),
    ]
      .filter((type) => type)
      .join(", ");

    // Conditional for the Guests input chevron
    let chevronDirection;
    if (this.state.dropdownOpen) {
      chevronDirection = "fa fa-chevron-up";
    } else {
      chevronDirection = "fa fa-chevron-down";
    }

    // Conditional for guests input container border color class
    let guestsInputBorderColorClass = this.state.guestsInputBorderFocused
      ? "guests-input-outline-blue"
      : "";
    const dropdownMenu = (
      <div
        className="search-box-dropdown-container guest-search-input"
        style={{ zIndex: "999", top: "130%" }}
      >
        <ul>
          <li>
            <div className="search-box-dropdown-label">
              <div className="guest-component-name">Adults</div>
            </div>
            <div className="search-box-counter-container">
              <div
                className={`${kidsMinusSignColorClass}`}
                onClick={() => this.decreaseCount("kidsCount")}
              >
                –
              </div>
              <div className="search-box-dropdown-counter-num">
                {this.state.kidsCount}+
              </div>
              <div
                className="search-box-plus-circle"
                onClick={() => {
                  this.increaseCount("kidsCount");
                }}
              >
                +
              </div>
            </div>
          </li>
          <li>
            <div className="search-box-dropdown-label">
              <div className="guest-component-name">Children</div>
              <div>Ages 2-12</div>
            </div>
            <div className="search-box-counter-container">
              <div
                className={`${petsMinusSignColorClass}`}
                onClick={() => this.decreaseCount("petsCount")}
              >
                –
              </div>
              <div className="search-box-dropdown-counter-num">
                {this.state.petsCount}+
              </div>
              <div
                className="search-box-plus-circle"
                onClick={() => this.increaseCount("petsCount")}
              >
                +
              </div>
            </div>
          </li>
          <li>
            <div className="search-box-dropdown-label">
              <div className="guest-component-name">Infants</div>
              <div>Under 2</div>
            </div>
            <div className="search-box-counter-container">
              <div
                className={`${parentsMinusSignColorClass}`}
                onClick={() => this.decreaseCount("parentsCount")}
              >
                –
              </div>
              <div className="search-box-dropdown-counter-num">
                {this.state.parentsCount}+
              </div>
              <div
                className="search-box-plus-circle"
                onClick={() => this.increaseCount("parentsCount")}
              >
                +
              </div>
            </div>
          </li>
        </ul>
      </div>
    );

    let dropdownComponent = this.state.dropdownOpen ? dropdownMenu : <></>;

    return (
      <div>
        <div
          id={guestsInputBorderColorClass}
          className={`search-box-input guests-input-container`}
          ref={this.inputNode}
          onFocus={() => this.toggleGuestsInputBorderColor()}
          onBlur={() => this.toggleGuestsInputBorderColor()}
          tabIndex="0"
        >
          <input
            className="guests-input"
            type="text"
            placeholder="Add Guests"
            readOnly
            value={this.props.searchdata.guestString}
            onFocus={() => this.toggleGuestsInputBorderColor()}
            onBlur={() => {
              this.toggleGuestsInputBorderColor();
            }}
            onChange={this.handleOnChange.bind(this)}
            onInput={this.handleOnChange.bind(this)}
          />
          <i className={chevronDirection} style={{ marginRight: "-10px" }}></i>
        </div>
        <div ref={this.dropdownNode}>{dropdownComponent}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  searchdata: state.searchdata,
});
const mapDispatchToprops = (dispatch) => {
  return {
    search: (data) => dispatch(searchData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToprops)(GuestComponet);
