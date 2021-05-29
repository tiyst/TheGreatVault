import React, {Component} from 'react';
import Item from './Item'

import {Ring} from 'react-awesome-spinners'
import GearConfigurator from "./gear/GearConfigurator";

const itemTypeRaid = "raid"
const itemTypeMplus = "mplus"
const itemTypePvp = "pvp"

const raidSteps = [3, 6, 9]
const mplusSteps = [1, 2, 3]
const pvpSteps = [1250, 2500, 6250]

const mPlusIlvls = {
    0: -1,
    1: -1,
    2: 200,
    3: 203,
    4: 207,
    5: 210,
    6: 210,
    7: 213,
    8: 216,
    9: 216,
    10: 220,
    11: 220,
    12: 223,
    13: 223,
    14: 226,
    15: 226,
}

// const pvpSteps = [1400, 1600, 1800, 2100, 2400]

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
            pvpNum: 0
        }

        this.changeNum = this.changeNum.bind(this);
        this.gearCallback = this.gearCallback.bind(this);
        this.randomizeItems = this.randomizeItems.bind(this);
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
        for (let i = 0; i < 3; i++) {
            // Raid items
            itemID = (this.state.itemRefs[i].current.state.activated) ? this.randomKey(this.state.raid) : -1;
            this.state.itemRefs[i].current.changeData(itemID, this.state.raid[itemID])

            // Mythic+ Items
            itemID = (this.state.itemRefs[3 + i].current.state.activated) ? this.randomKey(this.state.mplus) : -1;
            this.state.itemRefs[3 + i].current.changeData(itemID, this.state.mplus[itemID])

            //PvP items
            itemID = (this.state.itemRefs[6 + i].current.state.activated) ? this.randomKey(this.state.mplus) : -1;
            this.state.itemRefs[6 + i].current.changeData(itemID, this.state.pvp[itemID])
        }
    }

    gearCallback(diff) {
        this.setState({
            raidDifficulty: diff
        })
    }

    changeNum(type, num) {
        let newKeys; //FIXME I don't like this that much
        for (let i = 0; i < 3; i++) {
            if (type === itemTypeRaid) {
                this.state.itemRefs[i].current.setActive(this.state.raidNum + num >= raidSteps[i]);
            }
            if (type === itemTypeMplus) {
                let index = num.split("-")[0];
                let value = num.split("-")[1];
                newKeys = this.state.mythicKeys;
                newKeys[index] = value;
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
                    Bosses killed: ({this.state.raidDifficulty}) {this.state.raidNum}
                    M+: {keys[0]} {keys[1]} {keys[2]}
                    PvP: {this.state.pvpNum}
                </h5>
                <button onClick={this.randomizeItems} style={{}}>Randomize</button>
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

                <GearConfigurator vaultCallback={this.gearCallback} changeNum={this.changeNum}/>
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