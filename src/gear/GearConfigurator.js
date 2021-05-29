import React, {Component} from "react";
import Boss from "./Boss.js"
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import './GearConfigurator.css'
import {
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    withStyles
} from "@material-ui/core";

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

const MythicSelect = withStyles({
    root: {
        borderBottom: '1px solid white',
        minWidth: "50px",
        color: "white"
    },
    select: {
        '&:before': {
            borderColor: "white",
        },
        '&:after': {
            borderColor: "white",
        }
    },
    icon: {
        fill: "white",
    },

})(Select);

const DifficultyRadio = withStyles({
    root: {
        color: "white",
        '&$checked': { // What is this magic
            color: "cyan",
        },
    },
    checked: {}

})(Radio)

const PvpSlider = withStyles({
    root: {
        color: "cyan",
        height: 3,
        maxWidth: "60vw"
    },
    track: {
        height: 4,
        borderRadius: 2,
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: "cyan",
        border: "1px solid currentColor",
        marginTop: -9,
        marginLeft: -11,
        boxShadow: "#fff 0 2px 2px",
        "&:focus, &:hover, &$active": {
            boxShadow: "#ccc 0 2px 3px 1px",
        },
    },
    markLabel: {
        color: "white"
    }

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
            mPlus: [0, 0, 0],
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
        let mp = this.state.mPlus;
        let value = parseInt(event.target.value);
        if (value === 0) { //nulling mythics ahead
            for (let i = 2; i > 0; i--) {
                if (index === i) {
                    break;
                }
                mp[i] = 0;
            }
        }
        mp[index] = value;
        this.props.changeNum("mplus", mp);
        this.setState({
            mPlus: mp
        });
    }

    // Vault class callback
    pvpChange(event, newValue) {
        let currentRating = this.state.pvpRating
        newValue = parseInt(newValue)
        if (newValue !== currentRating) {
            this.props.changeNum("pvp", newValue * 62.5)
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
        mp.push(<MenuItem value="0"><em>None</em></MenuItem>)
        for (let i = 2; i <= 15; i++) {
            mp.push(<MenuItem value={i}>{i}</MenuItem>)
        }

        return (
            <div id="gear">
                <div className="FlexRow">
                    <RadioGroup row defaultValue={"Mythic"}
                                onChange={event => this.difficultyChange(event.target.value)}>
                        <FormControlLabel value={normalDiff} control={<DifficultyRadio/>} label={normalDiff}/>
                        <FormControlLabel value={heroicDiff} control={<DifficultyRadio/>} label={heroicDiff}/>
                        <FormControlLabel value={mythicDiff} control={<DifficultyRadio/>} label={mythicDiff}/>
                    </RadioGroup>
                </div>
                <div className="FlexRow">
                    {bosses}
                </div>
                <div>
                    Key 1:
                    <MythicSelect value={this.state.mPlus[0]} onChange={(e) => this.keyChange(0, e)}>
                        {mp}
                    </MythicSelect>
                    Key 2:
                    <MythicSelect disabled={this.state.mPlus[0] === 0} value={this.state.mPlus[1]} onChange={(e) => this.keyChange(1, e)}>
                        {mp}
                    </MythicSelect>
                    Key 3:
                    <MythicSelect disabled={this.state.mPlus[1] === 0} value={this.state.mPlus[2]} onChange={(e) => this.keyChange(2, e)}>
                        {mp}
                    </MythicSelect>
                </div>
                <div>
                    <Typography id="discrete-slider-restrict" gutterBottom>
                        Honor earned
                    </Typography>
                    <PvpSlider
                        defaultValue={this.state.pvpItems}
                        onChange={this.pvpChange}
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="on"
                        aria-labelledby="discrete-slider-restrict"
                        step={null}
                        marks={pvpMarks}
                    />
                </div>
            </div>
        )
    }
}

export default GearConfigurator;