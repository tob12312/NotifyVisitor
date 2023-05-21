import React, { Component } from 'react';
import {
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

export class UserLogin extends Component {
    localOnSignOut() {
        if (this.props.onSignOut) {
            this.props.onSignOut();
        }
    }

    localOnSignIn() {
        if (!this.props.auth.isAuthenticated) {
            this.props.onSignIn();
        }
    }

    render() {
        if (this.props.msalAuth.isAuthenticated) {
            return (
                <UncontrolledDropdown>
                    <DropdownToggle nav caret>
                        {this.props.msalAuth.user.userName}
                    </DropdownToggle>
                    <DropdownMenu end>
                        <h5 className="dropdown-item-text mb-0">{this.props.msalAuth.user.userName}</h5>
                        <p className="dropdown-item-text text-muted mb-0">{this.props.msalAuth.user.userName}</p>
                        <DropdownItem divider />
                        <DropdownItem onClick={this.localOnSignOut.bind(this)}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            );
        }
        else {
            return (
                <NavItem>
                    <NavLink className="text-dark" onClick={this.localOnSignIn.bind(this)} href='#'>Sign in</NavLink>
                </NavItem>
            );
        }
    }
}