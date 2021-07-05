import { Component } from "react"
import {Ring} from "react-awesome-spinners";

class Boss extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toRender: false,
            active: false,
            img: null
        }

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    setActive(isActive) {
        this.setState({
            active: isActive
        })
    }

    async componentDidMount() {
        await fetch("/pvpRanks/" + this.props.imgPath)
            .then((response) => {
                return response.blob();
            })
            .then(body => {
                this.setState({
                    toRender: true,
                    img: URL.createObjectURL(body)
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleOnClick() {
        this.props.rankCallback(this.props.rankIndex);
    }

    render() {
        if (!this.state.toRender) {
            return (
                <div className="BossDiv unselectable">
                    <Ring style={{display: "inline"}}/>
                </div>
            )
        }

        let clr = this.props.active ? "cyan" : "lightgrey";
        return <div className="BossDiv unselectable" style={{borderColor: clr}} onClick={this.handleOnClick}>
            <img src={this.state.img} alt=""/>
            <div>{this.props.rankName}</div>
        </div>
    }
}

export default Boss;