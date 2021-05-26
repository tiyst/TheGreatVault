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
    
    async componentDidMount() {
        await fetch("/bosses/" + this.props.imgPath)
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
        this.setState({
            active: !this.state.active
        })
        this.props.gearCall(!this.state.active ? 1 : -1);
    }

    render() {
        if (!this.state.toRender) {
            return (
                <div className="BossDiv unselectable">
                    <Ring style={{display: "inline"}}/>
                </div>
            )
        }

        let bg = this.state.active ? "cyan" : "grey";
        return <div className="BossDiv unselectable" style={{backgroundColor: bg}} onClick={this.handleOnClick}>
            <img src={this.state.img} alt=""/>
            <div>{this.props.bossName}</div>
        </div>
    }
}

export default Boss;