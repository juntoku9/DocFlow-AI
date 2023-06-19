import React from 'react';

class ColorSwitch extends React.Component {

    state = {
        darkMenu: true
    };

    onSideMenuHandler = () => {
        const sideMenu = this.state.darkMenu;
        this.setState({ darkMenu:  !sideMenu});
        this.props.onClick(sideMenu);
    }

    render() {
        return (
            <div className="side-menu-switch" title="Click to change sidebar color">
                <label className="switch">
                    <input 
                        type="checkbox" 
                        className="light" 
                        onClick={this.onSideMenuHandler}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
        );
    }
} 
export default ColorSwitch;