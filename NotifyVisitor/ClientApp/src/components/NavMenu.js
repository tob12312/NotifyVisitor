import React, { Component, useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavLink } from 'reactstrap';
import logo from '../styling/FunkerDetteTroLogo_v4.png';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { UserLogin } from './UserLogin';
import '../styling/NotifyVisitorApp.css';
import { msalAuth } from '../msal/MsalAuthProvider';


class NavMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar = () => {
        this.setState(prevState => ({
            collapsed: !prevState.collapsed
        }));
    };

    render() {
        const { collapsed } = this.state;
        const { auth } = this.props;

        return (
            <header className="nav-menu-bar">
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container dark>
                    <NavbarBrand className="text-light" tag={Link} to="/">
                        <img src={logo} alt="Logo" style={{ width: '40px', height: 'auto' }} />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            <UserLogin
                                {...this.props}
                                msalAuth={this.props.auth}
                            />
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle className="text-light" nav caret>
                                    Navigate
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/site">Site</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/room">Room</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/alarm">Alarm</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/alarm/triggeredAlarms">TriggeredAlarms</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/notification">Notification</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/assign">Assign</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/visitor">Visitor</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/app/visitor/visitorHistory">Visitor History</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink className="text-dark" to="/" href="https://localhost:7175/swagger/index.html">API</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}

export default NavMenu;
