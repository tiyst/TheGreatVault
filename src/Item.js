import {Component} from "react";
import {Ring} from "react-awesome-spinners";

const itemDesc = {
    "raid":"Defeat %s Castle Nathria raid bosses",
    "mplus":"Complete %s Mythic Keystone Dungeon",
    "pvp":"Earn %s Honor from Rated PvP"
}

const steps = {
    "raid": [3,6,9],
    "mplus": [1,4,10],
    "pvp": [1250, 2500, 6250]
}

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}
class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toRender: false,
            activated: false, //Item is active and should generate new item on next randomize
            generated: false, //Item has already been generated
            chosen: false,
            itemID: this.props.ID,
            itemName: this.props.name,
            ilvl: 1
        }

        this.handleOnClick = this.handleOnClick.bind(this);
        this.setActive = this.setActive.bind(this);
        this.itemDisable = this.itemDisable.bind(this);
        this.itemEnable = this.itemEnable.bind(this);
        this.flipActive = this.flipActive.bind(this);
    }

    async componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://wow.zamimg.com/widgets/power.js";
        script.async = true;
        script.onload = () => this.scriptLoaded();
        document.body.appendChild(script);

        this.setState({
            toRender: true
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //Disgusting hack to refresh links with just generated data
        console.log(window.$WowheadPower.refreshLinks())
    }

    changeData(id, name, ilvl) {
        let isGenerated = id !== -1;
        this.setState({
            itemID: id,
            itemName: name,
            generated: isGenerated,
            ilvl: ilvl
        });
        this.scriptLoaded();
    }

    scriptLoaded() {
        window.$WowheadPower.refreshLinks();
    }

    handleOnClick() {
        console.log("item clicked on: " + this.props.ID)
    }

    setActive(active) {
        this.setState({
            activated: active
        })
    }

    flipActive() {
        this.setActive(!this.state.activated)
    }

    itemDisable() {
        this.setActive(false)
    }

    itemEnable() {
        this.setActive(true)
    }

    render() {
        if (!this.state.toRender) {
            return (
                <div className="Item">
                    <Ring/>
                </div>
            )
        }

        let clr = this.state.activated ? "cyan" : "grey";
        let content = this.state.generated ?
            <a href={"https://www.wowhead.com/item=" + this.state.itemID}
               data-wowhead={"item=" + this.state.itemID + "&ilvl=" + this.state.ilvl}
               target="_blank" rel="noreferrer">
                {this.state.name} - ilvl: {this.state.ilvl}
            </a> :
            <h5>{parse(itemDesc[this.props.type], steps[this.props.type][this.props.order])}</h5>

        return (
            <div className="Item" style={{borderColor: clr}} onClick={this.handleOnClick}>
                {content}
                <img src={this.state.activated ? "active.gif" : "vaultLocked.png"} alt="Vault item"/>
            </div>
        )


    }
}

export default Item;