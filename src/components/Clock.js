import React, { Component } from 'react';
import './clock.css';

class Clock extends Component{
    constructor(props){
        super(props);
        this.state ={
            isCounting: false,
            timer: "25:00",
            breaks: 5,
            session: 25,
            endSession: false
        }
        this.startStop = this.startStop.bind(this);
        this.increaseDecrease = this.increaseDecrease.bind(this);
        this.resetAll = this.resetAll.bind(this);
    }
    componentDidUpdate(){
        // disable click event on increase/decrease elements while clock is runing 
        for(let i=0; i<4; i++){
            this.state.isCounting ? 
                document.getElementsByClassName("btn")[i].style.pointerEvents = 'none': 
                document.getElementsByClassName("btn")[i].style.pointerEvents = 'auto';

        }    
    }

    resetAll(){
        const x = document.getElementById("beep");
        x.pause();
        x.currentTime = 0;
        this.setState({ breaks: 5, session: 25, isCounting: false, timer: "25:00", endSession: false })
    }

    increaseDecrease(info){
        const type = info[0];
        const value = info[1];
        // Prevents values > 60 and < 1
        if((this.state[type] === 1 && value === "dec") || (this.state[type] === 60 && value === "inc")){
            return;
        }
        // Updates session, break and timer 
        if(value === "dec"){ 
            if(type === "session"){
                const timer = this.state.session <= 10 ? "0"+(this.state.session-1)+":00" : (this.state.session-1)+":00";
                this.setState({ session: this.state.session-1, timer });
            } else{
                this.setState({ breaks: this.state.breaks-1 });
            }
        } else{
            if(type === "session"){
                const timer = this.state.session < 9 ? "0"+(this.state.session+1)+":00" : (this.state.session+1)+":00";
                this.setState({ session: this.state.session+1, timer });
            } else{
                this.setState({ breaks: this.state.breaks+1 });
            }
        }
    }

    async startStop(){
        //first toggle isCounting
        await this.setState({ isCounting: !this.state.isCounting });
        const x = document.getElementById("beep");
        const clock = setInterval(() => {
            let minutes = parseInt(this.state.timer.split(":")[0]);
            let seconds = parseInt(this.state.timer.split(":")[1]);
            //stops clock if user clicks on #start_stop
            if(!this.state.isCounting){
                clearInterval(clock);
                return;
            }
            //toggle between session and break countdown
            if(minutes === 0 && seconds === 0){
                x.play();
                this.setState({ endSession: !this.state.endSession });
                if(this.state.endSession){
                    const timer = this.state.breaks < 10 ? "0"+(this.state.breaks)+":00" : (this.state.breaks)+":00"
                    this.setState({ timer })
                } else{
                    const timer = this.state.session < 10 ? "0"+(this.state.session)+":00" : (this.state.session)+":00"
                    this.setState({ timer })
                }
            // countdown...
            } else if(seconds === 0){
                let newTime = minutes-1 < 10 ? "0"+(minutes-1) : minutes-1;
                newTime += ":59";  
                this.setState({ timer: newTime });
            } else{
                let newTime = minutes < 10 ? "0"+minutes : minutes;
                newTime += ":";
                newTime += seconds-1 < 10 ? "0"+(seconds-1): seconds-1;
                this.setState({ timer: newTime });
            }
        }, 1000);
    }

    render(){
        return(
            <div className="wrapper">
                <div id="title">Pomodoro Clock</div>
                <div id="settings">
                    <div id="break">
                        <div id="break-label">Break Length</div>
                        <div className="options">
                            <div id="break-decrement" className="btn" onClick={() => this.increaseDecrease(["breaks", "dec"])}>
                                <i className="fa fa-arrow-down fa-2x"/>
                            </div>
                            <div id="break-length">{this.state.breaks}</div>
                            <div id="break-increment" className="btn" onClick={() => this.increaseDecrease(["breaks", "inc"])}>
                                <i className="fa fa-arrow-up fa-2x"/>
                            </div>
                        </div>
                    </div>
                    <div id="session">
                        <div id="session-label">Session Length</div>
                        <div className="options">
                            <div id="session-decrement" className="btn" onClick={() => this.increaseDecrease(["session", "dec"])}>
                                <i className="fa fa-arrow-down fa-2x"/>
                            </div>
                            <div id="session-length">{this.state.session}</div>
                            <div id="session-increment" className="btn" onClick={() => this.increaseDecrease(["session", "inc"])}>
                                <i className="fa fa-arrow-up fa-2x"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="display">
                    <div id="time-wrapper">
                        <div id="timer-label">{this.state.endSession ? "Break" : "Session"}</div>
                        <div id="time-left">{this.state.timer}</div>
                    </div>
                    <div id="control-wrapper">
                        <div id="start_stop" onClick={this.startStop}>{this.state.isCounting ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}</div>
                        <div id="reset" onClick={this.resetAll}><i className="fas fa-redo-alt"></i></div>
                    </div>
                </div>
                <audio id="beep" src="http://soundbible.com/mp3/Rooster%20Crow-SoundBible.com-1802551702.mp3"></audio>
            </div>
        )
    }
}

export default Clock;