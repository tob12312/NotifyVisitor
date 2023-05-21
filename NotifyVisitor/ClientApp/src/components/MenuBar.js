import { useState } from "react";
import '../styling/NotifyVisitorApp.css';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import Help from './Help'
import {
    FaCompressArrowsAlt,
    FaExpandArrowsAlt
} from "react-icons/fa";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
} from "reactstrap"; 

/**
 * MenuBar adapts to caller and returns a tool bar/ menu.
 * Used by multiple Entities to trigger actions/ components.
 * 
 * Functionality for generating PDF with library jsPDF.
 * Functionality for dedicated logOut QR code. For active unregistration of Visitors.
 * Functionality for compressing view (reducing number of columns in table).
 * 
 * View is responsive, refreshes on window resize.
 * 
 * @param {any} param0
 * @returns toolBar
 */
const MenuBar = ({ ...props }) => {

    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    // triggers modals - edit/ create
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Function for add / set universal Log Out QR code
    // Uses Room Id as identifier.
    const [logOut, setLogOut] = useState(false);
    const URL = "https://localhost:44434/update-user-location/?id=$";
    const logOutQrCode = ({ "name": "Please scan before exiting", "id": "-1" });
    const addLogOut = () => {
        props.setCheckedName(logOutQrCode.name);
        props.setQrCode(URL + logOutQrCode.id)
        if (!props.listCheckedName.includes(logOutQrCode.name)) {
            props.listCheckedName.unshift(logOutQrCode.name);
            props.listQrCode.unshift(URL + logOutQrCode.id);
        } else {
            props.listCheckedName.splice(props.listCheckedName.indexOf(logOutQrCode.name), 1);
            props.listQrCode.splice(props.listQrCode.indexOf(URL + logOutQrCode.id), 1);
        }
    }

    // Function for generating PDF from selected QR codes.
    const generatePdf = async () => {
        const doc = new jsPDF();

        const roomNames = props.listCheckedName;
        const urls = props.listQrCode;

        const qrCodeSize = 200; 
        const center = doc.internal.pageSize.getWidth() / 2;

        for (let i = 0; i < roomNames.length; i++) {
            
            doc.setFontSize(40);
            doc.text(roomNames[i], center, 40, { align: 'center' });
 
            const canvas = await QRCode.toCanvas(urls[i], { width: qrCodeSize, height: qrCodeSize });
            const imgData = canvas.toDataURL('image/jpeg');
            const qrCodeX = center - qrCodeSize / 2;
            const qrCodeY = 20 + (doc.internal.pageSize.getHeight() - 20) / 2 - qrCodeSize / 2;
            doc.addImage(imgData, 'JPEG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

            if (i !== roomNames.length - 1) {
                doc.addPage();
            }
        }
        doc.save('rooms.pdf');
    };


    return (
        <div>
            <Navbar className="menu-bar" dark expand="md">
                <NavbarBrand className="text-light"/>           
                <Collapse className="justify-content-end" isOpen={!collapsed} navbar>
                    <Nav className="container-fluid" navbar>   
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle 
                                className="text-light"
                                nav caret>
                                Help
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem
                                    className="text-dark"
                                    onClick={handleShow}>
                                    Show Help
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle
                                className="text-light"
                                nav caret>
                                View
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem divider />
                                {!props.overrideBreakpoint ? (
                                    <DropdownItem onClick={() => props.setOverrideBreakpoint(!props.overrideBreakpoint) }>
                                        <FaCompressArrowsAlt />{' '}Compress
                                    </DropdownItem>
                                ) : (
                                        <DropdownItem onClick={() => props.setOverrideBreakpoint(!props.overrideBreakpoint)}>
                                        <FaExpandArrowsAlt />{' '}Expand
                                    </DropdownItem>
                                )}           
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle
                                className="text-light"
                                nav caret>
                                Search{' '}{props.viewType}
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem
                                    className="text-dark"
                                    onClick={() => props.setSearchBarView(!props.searchBarView)}>
                                    Toggle search view
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => props.setSearchBarView(!props.searchBarView)}>
                                    Search mode: {props.searchBarView ? 'enabled' : 'disabled'}
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        {props.viewType !== 'TriggeredAlarms' && props.viewType !== 'Visitor History' &&
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle
                                    className="text-light"
                                    nav caret>
                                    Edit{' '}{props.viewType}
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem
                                        className="text-dark"
                                        onClick={() => props.setEditBarView(!props.editBarView)}>
                                        Toggle edit view
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={() => props.setEditBarView(!props.editBarView)}>
                                        Edit mode: {props.editBarView ? 'enabled' : 'disabled'}
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }
                        {props.viewType !== 'TriggeredAlarms' && props.viewType !== 'Visitor History' &&
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle
                                    className="text-light"
                                    nav caret>
                                    New{' '}{props.viewType}
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem
                                        className="text-dark"
                                        onClick={() => props.setEditCreateBarView(!props.editCreateBarView)}>
                                        Toggle create view
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={() => props.setEditCreateBarView(!props.editCreateBarView)}>
                                        Edit View: {props.editCreateBarView ? 'enabled' : 'disabled'}
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }
                        {props.viewType === 'Room' && 
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle
                                    className="text-light"
                                    nav caret>
                                    QR
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem onClick={() => {
                                        addLogOut();
                                        setLogOut(!logOut);                          
                                    }}>
                                        {logOut ? 'UnCheck log out-Qr' : 'Check log out-Qr'}
                                    </DropdownItem>  
                                    <DropdownItem onClick={() => {props.setQrScreenView(true) }}>
                                        Display single selected Qr 
                                    </DropdownItem>                                       
                                    <DropdownItem onClick={() => { props.setQrListScreenView(true) }}>
                                        Display multiple selected Qr
                                    </DropdownItem>                                   
                                    <DropdownItem onClick={generatePdf}>
                                        Selected to PDF
                                    </DropdownItem>                                 
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }                   
                    </Nav>               
                </Collapse>
                <NavbarBrand className="nav navbar-nav w-70 justify-content-between">                  
                    <div style={{ paddingRight: '5em' }} >{props.viewType}</div>
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} />
            </Navbar>
            <Help show={show} handleShow={handleShow} handleClose={handleClose} />
        </div>
    );
}
export default MenuBar