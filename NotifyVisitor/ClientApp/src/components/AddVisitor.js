import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';

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
} from "reactstrap"; // ferdige stylede elementer fra reactstrap er fundamentet for design

/**
 * Modal pop-up for adding new Visitor.
 * 
 * Set Visitor values for Add to DB.
 * Calls function handleSave.
 * 
 * Uses styling elements from Bootstrap and Reactstrap.
 * 
 * @param {any} props
 * @returns Modal element, new Visitor
 */
const AddVisitor = (props) => {

    return (
        <Modal
            show={props.editCreateBarView}
            onHide={props.handleCloseCreate}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Create new Visitor
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <br />
                    <UncontrolledDropdown>
                        <DropdownToggle className="dropdown-fullsize">
                            <Form>
                                <InputGroup >
                                    <Input
                                        onChange={(e) => props.setRoomName(e.target.value)}
                                        placeholder="Select Room"
                                        value={props.roomName}
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
                                    value={props.roomName}
                                    onClick={() => {
                                        props.setRoomId(listRooms.id)
                                        props.setRoomName(listRooms.name)
                                    }}>
                                    {listRooms.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <br />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Telephone"
                        value={props.telephone} onChange={(e) => props.setTelephone(e.target.value)}
                    />
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <button
                    style={{ width: "10em" }}
                    className="btn btn-success"
                    onClick={() => props.handleSave()}
                >Save
                </button>
                <button
                    style={{ width: "10em" }}
                    className="btn btn-secondary"
                    onClick={props.handleCloseCreate}
                >Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddVisitor