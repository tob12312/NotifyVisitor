import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    FaToggleOff,
    FaToggleOn,
} from "react-icons/fa";

/**
 * Modal pop-up for editing Alarms.
 * Set Alarm edit values.
 * Calls function handleUpdate.
 * 
 * @param {any} props
 * @returns Modal element, edit Alarm
 */
const EditAlarm = (props) => {

    return (    
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Alarm : {props.editName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <br/>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        value={props.editName} onChange={(e) => props.setEditName(e.target.value)}
                    />
                    <br/>
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Description"
                        value={props.editDescription} onChange={(e) => props.setEditDescription(e.target.value)}
                    />
                    <br/>
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter AlarmText"
                        value={props.editAlarmText} onChange={(e) => props.setEditAlarmText(e.target.value)}
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
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                {props.editIsActive === 1 ? (
                    <Button style={{width: '12em'}}
                        variant="warning"
                        onClick={() => props.setEditIsActive(0)}>
                        <FaToggleOn />{' '}Deactivate
                    </Button>
                ) : (
                    <Button style={{ width: '12em' }}
                        variant="danger"
                        onClick={() => props.setEditIsActive(1)}>
                        <FaToggleOff />{' '}Activate Alarm ?
                    </Button>
                )}
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
export default EditAlarm