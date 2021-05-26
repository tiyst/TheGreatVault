import React, { Component } from "react";
import Boss from "./Boss.js"
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import './GearConfigurator.css'
import {withStyles} from "@material-ui/core";

const normalDiff = "Normal"
const heroicDiff = "Heroic"
const mythicDiff = "Mythic"

const pvpMarks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 20,
        label: '1250',
    },
    {
        value: 40,
        label: '2500',
    },
    {
        value: 100,
        label: '6250',
    },
];

const PvpSlider = withStyles({
    root: {
        // color: "#6f8eff",
        color: "cyan",
        height: 3,
        padding: "13px 0",
    },
    track: {
        height: 4,
        borderRadius: 2,
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: "#fff",
        border: "1px solid currentColor",
        marginTop: -9,
        marginLeft: -11,
        boxShadow: "#ebebeb 0 2px 2px",
        "&:focus, &:hover, &$active": {
            boxShadow: "#ccc 0 2px 3px 1px",
        },
        color: "#fff",
    },

})(Slider);

function valuetext(value) {
    return `${value} honor`;
}

function valueLabelFormat(value) {
    return pvpMarks.findIndex((mark) => mark.value === value);
}

class GearConfigurator extends Component {

    bossNames = ["Shriekwing", "Huntsman Altimore", "Hungering Destroyer", "Artificer Xy'mox",
        "Sun King's Salvation", "Lady Inerva Darkvein", "The Council of Blood", "Sludgefist",
        "Stone Legion Generals", "Sire Denathrius"];

    constructor(props) {
        super(props);
        this.state = {
            raidKilled: 0,
            mPlus: [-1,-1,-1],
            pvpRating: 0,
            pvpItems: 0
        }

        this.bossCall = this.bossCall.bind(this);
        this.keyChange = this.keyChange.bind(this);
        this.pvpChange = this.pvpChange.bind(this);
    }

    // Boss class callback
    bossCall(num) {
        this.props.changeNum("raid", num)
        this.setState({
            raidKilled: this.state.raidKilled + num
        })
    }

    // Vault class callback
    keyChange(index, event) {
        let mp = this.state.mPlus
        mp[index] = parseInt(event.target.value)
        console.log(event.target.value)
        this.props.changeNum("mplus", parseInt(event.target.value) === -1 ? -1 : 1)
        this.setState({
            mPlus: mp
        })
    }

    // Vault class callback
    pvpChange(event, newValue) {
        let currentRating = this.state.pvpRating
        newValue = parseInt(newValue)
        if (newValue !== currentRating) {
            this.props.changeNum("pvp", newValue*62.5)
            this.setState({
                pvpRating: newValue
            })
        }
    }

    // Vault class callback
    difficultyChange(diff) {
        this.props.vaultCallback(diff)
    }

    render() {
        let bosses = [];
        for (let i = 0; i < this.bossNames.length; i++) {
            bosses.push(<Boss
                            imgPath={(i + 1) + ".png"}
                            bossName={this.bossNames[i]}
                            gearCall={this.bossCall}
                        />)
        }

        let mp = [];
        mp.push(<option value="-1">None</option>)
        for (let i = 2; i <= 15; i++) {
            mp.push(<option value={i}>{i}</option>)
        }

        return (
            <div id="gear">
                <div>
                    <input type="radio" name="diff" value="normal" id="normal"
                           onChange={() => this.difficultyChange(normalDiff)} />
                    <label htmlFor="normal">Normal</label>
                    <input type="radio" name="diff" value="heroic" id="heroic"
                           onChange={() => this.difficultyChange(heroicDiff)} />
                    <label htmlFor="heroic">Heroic</label>
                    <input type="radio" name="diff" value="mythic" id="mythic"
                           onChange={() => this.difficultyChange(mythicDiff)} defaultChecked />
                    <label htmlFor="mythic">Mythic</label>
                </div>
                <div>Raid: {this.state.raidKilled} M+: {this.state.mPlus[0]} {this.state.mPlus[1]} {this.state.mPlus[2]} PvP: {this.state.pvpItems}</div>
                <div className="FlexRow">
                {bosses}
                </div>
                <div>
                    Key 1:
                    <select value={this.state.mPlus[0]} onChange={(e) => this.keyChange(0, e)}>
                        {mp}
                    </select>
                    Key 2:
                    <select value={this.state.mPlus[1]} onChange={(e) => this.keyChange(1, e)}>
                        {mp}
                    </select>
                    Key 3:
                    <select value={this.state.mPlus[2]} onChange={(e) => this.keyChange(2, e)}>
                        {mp}
                    </select>
                </div>
                <div className={"pvpSlider"}>
                    <Typography id="discrete-slider-restrict" gutterBottom>
                        Honor earned
                    </Typography>
                    <PvpSlider
                        defaultValue={this.state.pvpItems}
                        onChange={this.pvpChange}
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-restrict"
                        step={null}
                        valueLabelDisplay="auto"
                        marks={pvpMarks}
                        color={"secondary"}
                    />
                </div>
            </div>
        )
    }
}

export default GearConfigurator;