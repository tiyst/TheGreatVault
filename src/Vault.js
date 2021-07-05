import React, {Component} from 'react';
import Item from './Item'

import {Ring} from 'react-awesome-spinners'
import GearConfigurator from "./gear/GearConfigurator";
import {Button, withStyles} from "@material-ui/core";

const itemTypeRaid = "raid"
const itemTypeMplus = "mplus"
const itemTypePvp = "pvp"

const raidSteps = [3, 6, 9]
const pvpSteps = [1250, 2500, 6250]

const raidIlvls = {
    "Normal": 226,
    "Heroic": 239,
    "Mythic": 252
}

const mPlusIlvls = {
    0: -1,
    1: -1,
    2: 226,
    3: 226,
    4: 226,
    5: 229,
    6: 229,
    7: 233,
    8: 236,
    9: 236,
    10: 239,
    11: 242,
    12: 246,
    13: 246,
    14: 249,
    15: 252,
}

const pvpIlvls = {
    0: 220,
    1:226,
    2:233,
    3:240,
    4:246
}

const RandomButton = withStyles({
    root: {
        background: "cyan",
        color: "black",
        '&hover': {
            background: 'white',
        },
        margin: "10px"
    }
})(Button);

class Vault extends Component {

    constructor(props) {
        super(props);

        let refs = []
        for (let i = 0; i < 9; i++) {
            refs.push(React.createRef())
        }

        this.state = {
            readyToRender: false,
            itemRefs: refs,
            raid: [],
            mplus: [],
            pvp: [],
            chosenRaid: [],
            chosenMplus: [],
            chosenPvp: [],
            raidDifficulty: "Mythic",
            raidNum: 0,
            mythicKeys: [0,0,0],
            pvpNum: 0,
            pvpRankIndex: 4
        }

        this.changeNum = this.changeNum.bind(this);
        this.gearCallback = this.gearCallback.bind(this);
        this.randomizeItems = this.randomizeItems.bind(this);
        this.pvpRankCallback = this.pvpRankCallback.bind(this);
    }

    async componentDidMount() {
        let data = await parseItemData();

        let r = []
        let m = []
        let p = []
        let refs = this.state.itemRefs;
        for (let i = 0; i < 3; i++) {
            r.push(<Item ref={refs[i]} type={itemTypeRaid} order={i}/>)
            m.push(<Item ref={refs[3 + i]} type={itemTypeMplus} order={i}/>)
            p.push(<Item ref={refs[6 + i]} type={itemTypePvp} order={i}/>)
        }

        this.setState({
            readyToRender: true,
            raid: data[itemTypeRaid],
            mplus: data[itemTypeMplus],
            pvp: data[itemTypePvp],
            chosenRaid: r,
            chosenMplus: m,
            chosenPvp: p
        })

    }

    randomizeItems() {
        console.log("Generating vault")
        let itemID = -1;
        let ilvl = 226;
        for (let i = 0; i < 3; i++) {
            // Raid items
            itemID = (this.state.itemRefs[i].current.state.activated) ? this.randomKey(this.state.raid) : -1;
            ilvl = raidIlvls[this.state.raidDifficulty];
            this.state.itemRefs[i].current.changeData(itemID, this.state.raid[itemID], ilvl)

            // Mythic+ Items
            itemID = (this.state.itemRefs[3 + i].current.state.activated) ? this.randomKey(this.state.mplus) : -1;
            ilvl = mPlusIlvls[this.state.mythicKeys[i]];
            this.state.itemRefs[3 + i].current.changeData(itemID, this.state.mplus[itemID], ilvl)

            //PvP items
            itemID = (this.state.itemRefs[6 + i].current.state.activated) ? this.randomKey(this.state.pvp) : -1;
            // ilvl = 252;
            ilvl = pvpIlvls[this.state.pvpRankIndex];
            this.state.itemRefs[6 + i].current.changeData(itemID, this.state.pvp[itemID], ilvl)
        }
    }

    gearCallback(diff) {
        this.setState({
            raidDifficulty: diff
        })
    }

    pvpRankCallback(pvpIndex) {
        if (pvpIndex < 0 || 5 < pvpIndex) {
            console.error("Wrong pvp rank index.");
            throw new Error("Wrong pvp rank index.")
        }
        this.setState({
            pvpRankIndex: pvpIndex
        })
    }

    changeNum(type, num) {
        let newKeys; //FIXME I don't like this that much
        if (type === itemTypeMplus) {
            newKeys = num;
        }
        for (let i = 0; i < 3; i++) {
            if (type === itemTypeRaid) {
                this.state.itemRefs[i].current.setActive(this.state.raidNum + num >= raidSteps[i]);
            }
            if (type === itemTypeMplus) {
                this.state.itemRefs[3 + i].current.setActive(newKeys[i] !== 0);
            }
            if (type === itemTypePvp) {
                this.state.itemRefs[6 + i].current.setActive(num >= pvpSteps[i]);
            }
        }

        switch (type) {
            case itemTypeRaid:
                this.setState({
                    raidNum: this.state.raidNum + num
                })
                break;
            case itemTypeMplus:
                this.setState({
                    mythicKeys: newKeys
                })
                break;
            case itemTypePvp:
                this.setState({
                    pvpNum: num
                })
                break;
            default:
                throw new Error("The fuck is going on?")
        }
    }

    randomKey(obj) {
        const keys = Object.keys(obj);
        return keys[keys.length * Math.random() << 0];
    };

    render() {
        if (!this.state.readyToRender) {
            return (
                <div>
                    <Ring/>
                </div>
            )
        }
        let keys = this.state.mythicKeys;
        return (
            <div>
                <h5><i>The Great Vault <br/>Get disappointed any time, not just on reset days</i></h5>
                <h5>
                    <div>
                        Bosses killed: <i>({this.state.raidDifficulty}) {this.state.raidNum}</i>
                    </div>
                    <div>
                        M+: 1st key: <i>{keys[0]}</i> 4th key: <i>{keys[1]}</i> 10th key: <i>{keys[2]}</i>
                    </div>
                    <div>
                        Honor Earned: <i>{this.state.pvpNum}</i>
                    </div>
                </h5>
                <RandomButton variant="contained" size="large" onClick={this.randomizeItems}>
                    Randomize Items
                </RandomButton>
                <div className="FlexRow">
                    {/*<h6>Raids: </h6>*/}
                    {this.state.chosenRaid}
                </div>
                <div className="FlexRow">
                    {/*<h6>Mythic dungeons: </h6>*/}
                    {this.state.chosenMplus}
                </div>
                <div className="FlexRow">
                    {/*<h6>PvP: </h6>*/}
                    {this.state.chosenPvp}
                </div>

                <GearConfigurator
                    vaultCallback={this.gearCallback}
                    changeNum={this.changeNum}
                    changePvpRank={this.pvpRankCallback}
                />
            </div>
        );
    }
}

async function parseItemData() {
    let raid = [];
    let mplus = [];
    let pvp = [];

    await fetchItemData()
        .then(function (data) {
                raid = data['raid']
                mplus = data['mplus']
                pvp = data['pvp']
            }
        )

    return {'raid': raid, 'mplus': mplus, 'pvp': pvp};
}


async function fetchItemData() {
    try {
        let res = await fetch("all-items.json",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export default Vault;