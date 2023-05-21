import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    FaRegBuilding,
    FaRegBell,
    FaWhatsapp,
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
 * Modal pop-up for editing AssignAlarm. 
 * Notification created/ updated.
 * Assignments between Alarms and Rooms are deleted and created.
 * 
 * Set Notification edit values.
 * Calls functions handleUpdate and handleNewNotification.
 * 
 * @param {any} props
 * @returns Modal element, edit AssignAlarm
 */
const EditAssign = (props) => {

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Edit Notification for {props.editRoomName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <center>
                        <label className="text-light">
                            Assigned Alarm
                        </label>
                    </center>
                    <InputGroup >
                        <Input
                            style={{ backgroundColor: 'gainsboro' }}
                            readOnly
                            value={props.editAlarmName}
                            type="text"
                        />
                        <InputGroupText><FaRegBell /></InputGroupText>
                    </InputGroup>
                    <br/>
                    <center>
                        <label className="text-light">
                            Assigned Room
                        </label>
                    </center>
                    <InputGroup >
                        <Input
                            style={{ backgroundColor: 'gainsboro' }}
                            readOnly
                            value={props.editRoomName}
                            type="text"
                        />
                        <InputGroupText><FaRegBuilding /></InputGroupText>
                    </InputGroup>               
                    <br />
                    <center>
                        <label className="text-light">
                            Assigned Notification, select existing or create new :
                        </label>
                    </center>              
                    <UncontrolledDropdown>
                        <DropdownToggle className="dropdown-fullsize">
                            <Form>
                                <InputGroup >
                                    <Input
                                        onChange={(e) => props.setEditNotificationName(e.target.value)}
                                        placeholder="Select Notification"
                                        value={props.editNotificationName}
                                        type="text"
                                    />
                                    <InputGroupText><FaWhatsapp /></InputGroupText>
                                </InputGroup>
                            </Form>
                        </DropdownToggle>
                        <DropdownMenu>
                            {props.notificationData.map((listNotifications, index) => (
                                <DropdownItem
                                    placeholder={props.editNotificationName}
                                    key={index}
                                    onClick={() => {
                                        props.setEditNewNotificationId(listNotifications.id)
                                        props.setEditNotificationName(listNotifications.name)
                                        props.setEditNotificationText(listNotifications.text)
                                    }}>
                                    {listNotifications.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>          
                    <br />
                    <center>
                        <label className="text-light">
                            Notification text, editable attachment :
                        </label>
                    </center>
                    <textarea
                        type="form-control"
                        className="form-control"
                        placeholder="Notification Text"
                        rows="2"
                        value={props.editNotificationText}
                        onChange={(e) => props.setEditNotificationText(e.target.value)}
                    />
                    <br />
                    <center>
                        <label className="text-light">
                            SMS to visitors, all fields :
                        </label>
                    </center>
                    <textarea
                        style={{ backgroundColor: 'gainsboro' }}
                        type="form-control"
                        className="form-control"
                        rows="4"
                        readOnly
                        value=
                        {props.editAlarmTextForRoom + props.editAlarmText + " " + props.editNotificationText}>
                    </textarea>
                    <br />
                </Container>
                <br />
                <Container>
                    <Row style={{ backgroundColor: 'gainsboro' }}>
                        <Col>
                            Created/ updated :
                        </Col>
                        <Col>
                            {props.editCreatedDateTime.substring(0, 19)}
                        </Col>
                    </Row>
                    <Row style={{ backgroundColor: 'gainsboro' }}>
                        <Col>
                            By User :
                        </Col>
                        <Col>
                            "user"
                        </Col>
                    </Row>
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <Button variant="warning" onClick={() => props.handleUpdate()}>
                    Update Notification Text
                </Button>
                <Button variant="success" onClick={() => props.handleNewNotification()}>
                    Create New Notification
                </Button>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel / Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default EditAssign