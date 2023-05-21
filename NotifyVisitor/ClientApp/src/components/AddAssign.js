import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'react-toastify/dist/ReactToastify.css';

import {
    FaRegBuilding,
    FaRegBell,
    FaWhatsapp,
    FaTrashAlt,
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
 * Modal pop-up for adding new AssignAlarm.
 * 
 * Set AssignAlarm values (Alarm + Room + Notification).
 * Set and Assign Site (all Rooms in Site are assigned).
 * Delete Assigned Site (all Assignments for selected Alarm to all Rooms in selected 
 * Site are deleted, including all Notification variations).
 * Calls function handleSave.
 * 
 * Uses styling elements from Bootstrap and Reactstrap
 * 
 * @param {any} props
 * @returns Modal element, new AssignAlarm
 */
const AddAssign = (props) => {

    return (
        <Modal
            show={props.editCreateBarView}
            onHide={props.handleCloseCreate}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Create new assignment for Room / Site
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <Row>
                        <Col>
                            <center>
                                <label className="text-light">
                                    Select Alarm to assign: {props.alarmId}
                                </label>
                            </center>
                            <UncontrolledDropdown>
                                <DropdownToggle className="dropdown-fullsize">
                                    <Form>
                                        <InputGroup>
                                            <Input
                                                onChange={(e) => props.setAlarmName(e.target.value)}
                                                placeholder="Select Alarm"
                                                value={props.alarmName}
                                                type="text"
                                            />
                                            <InputGroupText><FaRegBell /></InputGroupText>
                                        </InputGroup>
                                    </Form>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {props.alarmData.map((listAlarms, index) => (
                                        <DropdownItem
                                            placeholder="Select Alarm"
                                            key={index}
                                            value={props.alarmName}
                                            onClick={() => {
                                                props.setAlarmId(listAlarms.id)
                                                props.setAlarmName(listAlarms.name)
                                                props.setAlarmText(listAlarms.alarmText)
                                                props.setAlarmDescription(listAlarms.description)
                                            }}>
                                            {listAlarms.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <center>
                                <label className="text-light">
                                    Alarm Description:
                                </label>
                            </center>
                            <textarea
                                style={{ width: '100%' }}
                                placeholder="Alarm Description"
                                value={props.alarmDescription}
                                readOnly
                            />
                        </Col>
                    </Row>
                    <br />
                    <Col>
                        <center>
                            <label className="text-light">
                                General AlarmText all assigned rooms:
                            </label>
                        </center>
                        <textarea
                            style={{ width: '100%' }}
                            placeholder="General Alarm Text"
                            value={props.alarmText}
                            readOnly
                        />
                    </Col>
                    <br />
                    <Row>
                        <Col>
                            <center>
                                <label className="text-light">
                                    Select Notification (attachment): {props.notificationId}
                                </label>
                            </center>
                            <UncontrolledDropdown>
                                <DropdownToggle className="dropdown-fullsize">
                                    <Form>
                                        <InputGroup >
                                            <Input
                                                onChange={(e) => props.setNotificationName(e.target.value)}
                                                placeholder="Select Notification"
                                                value={props.notificationName}
                                                type="text"
                                            />
                                            <InputGroupText><FaWhatsapp /></InputGroupText>
                                        </InputGroup>
                                    </Form>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {props.notificationData.map((listNotifications, index) => (
                                        <DropdownItem
                                            placeholder={props.notificationName}
                                            key={index}
                                            value={props.notificationName}
                                            onClick={() => {
                                                props.setNotificationId(listNotifications.id)
                                                props.setNotificationName(listNotifications.name)
                                                props.setNotificationText(listNotifications.text)
                                            }}>
                                            {listNotifications.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <center>
                                <label className="text-light">
                                    Attached notification, text to room:
                                </label>
                            </center>
                            <textarea
                                style={{ width: '100%' }}
                                placeholder="Attached Notification Text"
                                value={props.notificationText}
                                readOnly
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <center>
                                <label className="text-light">
                                    Select Site: {props.siteId}
                                </label>
                            </center>
                            <UncontrolledDropdown>
                                <DropdownToggle>
                                    <Form>
                                        <InputGroup >
                                            <Input
                                                onChange={(e) => props.setSiteName(e.target.value)}
                                                placeholder="Select Site"
                                                value={props.siteName}
                                                type="text"
                                            />
                                            <InputGroupText><FaRegBuilding /></InputGroupText>
                                        </InputGroup>
                                    </Form>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {props.siteData.map((listSites, index) => (
                                        <DropdownItem
                                            placeholder="Select Site"
                                            key={index}
                                            value={props.siteName}
                                            onClick={() => {
                                                props.setSiteId(listSites.id)
                                                props.setSiteName(listSites.name)
                                            }}>
                                            {listSites.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                        <Col>
                            <center>
                                <label className="text-light">
                                    Select Room: {props.roomId}
                                </label>
                            </center>
                            <UncontrolledDropdown>
                                <DropdownToggle>
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
                        </Col>
                    </Row>
                    <br />
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <Row>
                    <Col>
                        <button
                            style={{ width: "10em", height: "5em" }}
                            className="btn btn-success"
                            onClick={() =>
                                props.roomId > 0 && props.alarmId > 0
                                && props.notificationId > 0 && props.handleSave()
                            }><FaRegBuilding />{' '}Assign Room: {props.roomName}
                        </button>
                    </Col>
                    <Col>
                        <button
                            style={{ width: "10em", height: "5em" }}
                            className="btn btn-warning"
                            onClick={() =>
                                props.siteId > 0 && props.alarmId > 0
                                && props.notificationId > 0 && props.assignAllRoomsInSite()
                            }><FaRegBuilding />{' '}Assign Site: {props.siteName}
                        </button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <button
                            className="btn btn-danger"
                            style={{ width: '10em', height: "5em" }}
                            onClick={() =>
                                props.siteId > 0 && props.alarmId > 0 && props.handleDeleteSite()
                            }
                        ><FaTrashAlt />{' '}Delete Site: {props.siteName}
                        </button>
                    </Col>
                    <Col>
                        <button
                            style={{ width: '10em', height: "5em" }}
                            className="btn btn-secondary"
                            onClick={props.handleCloseCreate}
                        >Close View
                        </button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}
export default AddAssign