import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    Form
} from "reactstrap";

/**
 * Modal pop-up for editing Visitor. 
 * 
 * Set Visitor edit values.
 * Calls functions handleUpdate.
 * 
 * @param {any} props
 * @returns Modal element, edit Visitor
 */
const EditVisitor = (props) => {

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Edit Visitor : {props.editID}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <br/>
                    <UncontrolledDropdown>
                        <DropdownToggle className="dropdown-fullsize">
                            <Form>
                                <InputGroup >
                                    <Input
                                        onChange={(e) => props.setEditRoomName(e.target.value)}
                                        placeholder="Select Room"
                                        value={props.editRoomName}
                                        type="text"
                                    />
                                    <InputGroupText><FaRegBuilding /></InputGroupText>
                                </InputGroup>
                            </Form>
                        </DropdownToggle>
                        <DropdownMenu>
                            {props.roomData.map((listRooms, index) => (
                                <DropdownItem
                                    placeholder="Select Alarm"
                                    key={index}
                                    value={props.editRoomName}
                                    onClick={() => {
                                        props.setEditRoomId(listRooms.id)
                                        props.setEditRoomName(listRooms.name)
                                    }}>
                                    {listRooms.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <br/>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Telephone"
                        value={props.editTelephone} onChange={(e) => props.setEditTelephone(e.target.value)}
                    />
                    <br/>
                </Container>
                <br/>
                <Container>
                    <Row style={{ backgroundColor: 'gainsboro' }}>
                        <Col>
                            Created/ updated :
                        </Col>
                        <Col>
                            {props.editRegisteredDateTime.substring(0, 19)}
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
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={() => props.handleUpdate()}>
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default EditVisitor