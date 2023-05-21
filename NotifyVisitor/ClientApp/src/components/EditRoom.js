import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import QRCode from 'qrcode.react';

import {
    FaRegBuilding,
} from "react-icons/fa";
import {
    InputGroup,
    InputGroupText,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
} from "reactstrap"; 

/**
 * Modal pop-up for editing Room/ Site. 
 * 
 * Set Room edit values. Alter Site.
 * Calls functions handleUpdate.
 * Displays QR code for each Room.
 * 
 * @param {any} props
 * @returns Modal element, edit Room
 */
const EditRoom = (props) => {

    const URL = "https://localhost:44434/update-user-location/?id=$";

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Edit Room : {props.editName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <br />
                    <Row>
                        <Col>
                            <UncontrolledDropdown>
                                <DropdownToggle className="dropdown-fullsize">
                                    <Form>
                                        <InputGroup >
                                            <Input
                                                onChange={(e) => props.setEditSiteName(e.target.value)}
                                                placeholder="Select Site"
                                                value={props.editSiteName}
                                                type="text"
                                            />
                                            <InputGroupText><FaRegBuilding /></InputGroupText>
                                        </InputGroup>
                                    </Form>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {props.siteData.map((siteList, index) => (
                                        <DropdownItem
                                            placeholder={siteList.name}
                                            key={index}
                                            value={siteList.name}
                                            onClick={() => {
                                                props.setEditSite(siteList.id)
                                                props.setEditSiteName(siteList.name)
                                            }}>
                                            {siteList.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Room"
                                value={props.editName} onChange={(e) => props.setEditName(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Floor"
                                value={props.editFloor} onChange={(e) => props.setEditFloor(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="form-control"
                                className="form-control"
                                placeholder="Enter Building"
                                value={props.editBuilding} onChange={(e) => props.setEditBuilding(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <br />
                </Container>
                < br />
                <Container>
                    <Row style={{ backgroundColor: 'gainsboro' }}>
                        <Col>
                            Created/ updated :
                        </Col>
                        <Col>
                            {props.editCreatedDateTime.substring(0,19)}
                        </Col>
                    </Row>
                    <Row style={{ backgroundColor: 'gainsboro' }}>
                        <Col>
                            By User :
                        </Col>
                        <Col>
                            {props.editUser}
                        </Col>
                    </Row>
                    <Row >
                        <Col style={{ backgroundColor: 'white' }}>
                            <br />
                            <center>
                                <QRCode value={URL+props.editID} />
                            </center>
                            <br />
                        </Col>
                    </Row>
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <Button variant="success" onClick={() => props.handleUpdate()}>
                    Save changes
                </Button>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel / Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRoom