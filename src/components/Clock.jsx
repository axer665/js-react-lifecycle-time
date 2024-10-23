/* eslint-disable react/prop-types */
import React from 'react';

function displayCanvas(canvas, state){
  const ctx = canvas.getContext('2d');
  ctx.strokeRect(0,10,canvas.width, canvas.height);

  //Расчет координат центра и радиуса часов
  const radiusClock = canvas.width/2 - 10;
  const xCenterClock = canvas.width/2;
  const yCenterClock = canvas.height/2;

  //Очистка экрана.
  ctx.fillStyle = "#3593d5";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  //Рисуем контур часов
  ctx.strokeStyle =  "#000000";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(xCenterClock, yCenterClock, radiusClock, 0, 2*Math.PI, true);
  ctx.moveTo(xCenterClock, yCenterClock);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  //Рисуем рисочки часов
  const radiusNum = radiusClock - 10; //Радиус расположения рисочек
  let radiusPoint;
  for(let tm = 0; tm < 60; tm++){
    ctx.beginPath();
    if(tm % 5 == 0){radiusPoint = 5;}else{radiusPoint = 2;} //для выделения часовых рисочек
    const xPointM = xCenterClock + radiusNum * Math.cos(-6 * tm * (Math.PI / 180) + Math.PI / 2);
    const yPointM = yCenterClock - radiusNum * Math.sin(-6 * tm * (Math.PI / 180) + Math.PI / 2);
    ctx.arc(xPointM, yPointM, radiusPoint, 0, 2*Math.PI, true);
    ctx.stroke();
    ctx.closePath();
  }

  //Оцифровка циферблата часов
  for(let th = 1; th <= 12; th++){
    ctx.beginPath();
    ctx.font = 'bold 25px sans-serif';
    const xText = xCenterClock + (radiusNum - 30) * Math.cos(-30 * th * (Math.PI / 180) + Math.PI / 2);
    const yText = yCenterClock - (radiusNum - 30) * Math.sin(-30 * th * (Math.PI / 180) + Math.PI / 2);
    if(th <= 9){
      ctx.strokeText(th, xText - 5 , yText + 10);
    }else{
      ctx.strokeText(th, xText - 15 , yText + 10);
    }
    ctx.stroke();
    ctx.closePath();
  }


  //Рисуем стрелки
  const lengthSeconds = radiusNum - 10;
  const lengthMinutes = radiusNum - 15;
  const lengthHour = lengthMinutes / 1.5;
  //const d = new Date();                //Получаем экземпляр даты
  const t_sec = state.sec + 6; //6*d.getSeconds();                           //Определяем угол для секунд
  const t_min = state.min; //6*(d.getMinutes() + (1/60)*d.getSeconds()); //Определяем угол для минут
  const t_hour = state.hr; //30*(d.getHours() + (1/60)*d.getMinutes()); //Определяем угол для часов

  //Рисуем секунды
  ctx.beginPath();
  ctx.strokeStyle =  "#FF0000";
  ctx.moveTo(xCenterClock, yCenterClock);
  ctx.lineTo(xCenterClock + lengthSeconds*Math.cos(Math.PI/2 - t_sec*(Math.PI/180)),
      yCenterClock - lengthSeconds*Math.sin(Math.PI/2 - t_sec*(Math.PI/180)));
  ctx.stroke();
  ctx.closePath();

  //Рисуем минуты
  ctx.beginPath();
  ctx.strokeStyle =  "#000000";
  ctx.lineWidth = 3;
  ctx.moveTo(xCenterClock, yCenterClock);
  ctx.lineTo(xCenterClock + lengthMinutes*Math.cos(Math.PI/2 - t_min*(Math.PI/180)),
      yCenterClock - lengthMinutes*Math.sin(Math.PI/2 - t_min*(Math.PI/180)));
  ctx.stroke();
  ctx.closePath();

  //Рисуем часы
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.moveTo(xCenterClock, yCenterClock);
  ctx.lineTo(xCenterClock + lengthHour*Math.cos(Math.PI/2 - t_hour*(Math.PI/180)),
      yCenterClock - lengthHour*Math.sin(Math.PI/2 - t_hour*(Math.PI/180)));
  ctx.stroke();
  ctx.closePath();

  //Рисуем центр часов
  ctx.beginPath();
  ctx.strokeStyle =  "#000000";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.arc(xCenterClock, yCenterClock, 5, 0, 2*Math.PI, true);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}


class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = this.getInitialState(props.userTimezone);
  }

  getUserDate(userTimezone) {
    const parsedUserTimezone = +Number.parseFloat(userTimezone);
    const hoursUserTimezone = Math.trunc(parsedUserTimezone);
    const minutesUserTimezone = (parsedUserTimezone % 1).toFixed(2) * 100;
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    const hoursTimezoneOffset = Math.floor(timezoneOffset / 60);
    const minutesTimezoneOffset = timezoneOffset % 60;

    date.setHours(date.getHours() + hoursTimezoneOffset);
    date.setMinutes(date.getMinutes() + minutesTimezoneOffset);
    date.setHours(date.getHours() + hoursUserTimezone);
    date.setMinutes(date.getMinutes() + minutesUserTimezone);

    return date;
  }

  getInitialState(userTimezone) {
    const userDate = this.getUserDate(userTimezone);

    const hr = userDate.getHours();
    const min = userDate.getMinutes();
    const sec = userDate.getSeconds();

    const hrPosition = (hr * 360) / 12 + (min * (360 / 60)) / 12;
    const minPosition = (min * 360) / 60 + (sec * (360 / 60)) / 60;
    const secPosition = (sec * 360) / 60;

    return {
      dateTime: userDate,
      hr: hrPosition,
      min: minPosition,
      sec: secPosition,
    };
  }

  tick() {
    const userDate = this.state.dateTime;
    userDate.setSeconds(userDate.getSeconds()+1);

    this.setState({
      dateTime: userDate,
      hr: this.state.hr + 3 / 360,
      min: this.state.min + 6 / 60,
      sec: this.state.sec + 6,
    });
    displayCanvas(this.canvas.current, this.state);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
        <div className="clock-block__container">
          <h3 className="clock-name">{this.props.name}</h3>

          <div className="clock-block__horyzontal">
            <div className="clock-block clock-block__analog-canvas">
              <canvas ref={this.canvas} width="300" height="300"></canvas>
            </div>

            <div className="clock-block clock-block__analog-svg" id={this.props.id}>
              <svg
                  className="clock"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 600 600"
              >
                <g className="clock-face">
                  <circle
                      className="clock-face__circle"
                      cx="300"
                      cy="300"
                      r="300"
                  />
                  <path
                      className="clock-face__hour-marks"
                      d="M300.5 94V61M506 300.5h32M300.5 506v33M94 300.5H60M411.3 107.8l7.9-13.8M493 190.2l13-7.4M492.1 411.4l16.5 9.5M411 492.3l8.9 15.3M189 492.3l-9.2 15.9M107.7 411L93 419.5M107.5 189.3l-17.1-9.9M188.1 108.2l-9-15.6"
                  />
                  <circle
                      className="Clock-face__mid-circle"
                      stroke="#3593d5"
                      fill="#3593d5"
                      cx="300"
                      cy="300"
                      r="30"
                  />
                </g>
                <g
                    className="clock-hour"
                    style={{transform: `rotate(${this.state.hr}deg)`}}
                >
                  <path className="clock-hour__hour-arm" d="M300.5 298V142"/>
                  <circle className="clock-sizing-box" cx="300" cy="300" r="300"/>
                </g>
                <g
                    className="clock-minute"
                    style={{transform: `rotate(${this.state.min}deg)`}}
                >
                  <path className="clock-minute__minute-arm" d="M300.5 298V67"/>
                  <circle className="clock-sizing-box" cx="300" cy="300" r="300"/>
                </g>
                <g
                    className="clock-second"
                    style={{transform: `rotate(${this.state.sec}deg)`}}
                >
                  <path className="clock-second__second-arm" d="M300.5 350V55"/>
                  <circle className="clock-sizing-box" cx="300" cy="300" r="300"/>
                </g>
              </svg>
            </div>
          </div>

          <div className="clock-block clock-block__digital">
            <input type="text"
                   value={this.state.dateTime.getHours() < 10 ? '0' + this.state.dateTime.getHours() : this.state.dateTime.getHours()}
                   readOnly={true}/>:
            <input type="text"
                   value={this.state.dateTime.getMinutes() < 10 ? '0' + this.state.dateTime.getMinutes() : this.state.dateTime.getMinutes()}
                   readOnly={true}/>:
            <input type="text"
                   value={this.state.dateTime.getSeconds() < 10 ? '0' + this.state.dateTime.getSeconds() : this.state.dateTime.getSeconds()}
                   readOnly={true}/>
          </div>

          <a
              href="#0"
              className="clock__delete"
              onClick={() => this.props.onDeleteClick(this.props.id)}
          >
            &#10005;
          </a>
        </div>
    );
  }
}

export default Clock;
