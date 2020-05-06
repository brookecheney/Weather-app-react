import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./sass/app.scss";
import TopSection from "./components/top/index";
import BottomSection from "./components/bottom/index";
import axios from "axios";


const WEATHER_KEY = "3e717cad1dd547139eb32553202504";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: "London",
      numForcastDays: 5,
      isLoading: true
    };
  }

  updateWeather() {
    const { cityName, numForcastDays } = this.state;
    const URL = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${cityName}&days=${numForcastDays}`;
    axios
      .get(URL)
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          isLoading: false,
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
        avgtemp_c:data.current.temp_c,
        avgtemp_f:data.current.temp_f,
          day: data.current.day,
          text: data.current.condition.text,
          iconURL: data.current.condition.icon,
          forecastdays: data.forecast.forecastday
        });
      })
      .catch(err => {
        if (err) console.error("Cannot fetch Weather Data from API, ", err);
      });
  }

  componentDidMount() {
    const { eventEmitter } = this.props;

    this.updateWeather();

    eventEmitter.on("updateWeather", data => {
      this.setState({ cityName: data }, () => this.updateWeather());
    });
  }

  render() {
    const {
      isLoading,
      cityName,
      temp_c,
      temp_f,
      avgtemp_f,
      avgtemp_c,
      day,
      text,
      iconURL,
      forecastdays
    } = this.state;

    return (
      <div className="app-container">
        <div className="main-container">
          {isLoading && <h3>Loading Weather...</h3>}
          {!isLoading && (
            <div className="top-section">
              <TopSection
                location={cityName}
                temp_c={temp_c}
                temp_f={temp_f}
                avgtemp_f={avgtemp_f}
                avgtemp_c={avgtemp_c}
                day={day}
                text={text}
                iconURL={iconURL}
                eventEmitter={this.props.eventEmitter}
              />
            </div>
          )}
          <div className="bottom-section">
            <BottomSection forecastdays={forecastdays} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
