import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Modal pop-up for adding new Alarms and default Notification.
 * Set Alarm values.
 * Calls function handleSave.
 * New default Notification also added to DB on new Alarm.
 * 
 * @param {any} props
 * @returns Modal element, new Alarm
 */
const AddAlarm = (props) => {

    return (
        <Modal
            show={props.editCreateBarView}
            onHide={props.handleCloseCreate}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Create new Alarm
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <br />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        value={props.name} onChange={(e) => props.setName(e.target.value)}
                    />
                    <br />
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Description"
                        value={props.description} onChange={(e) => props.setDescription(e.target.value)}
                    />
                    <br />
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter Alarm Text"
                        value={props.alarmText} onChange={(e) => props.setAlarmText(e.target.value)}
                    />
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center" style={{backgroundColor: 'gainsboro'}}>
                <Button variant="success" onClick={() => props.handleSave()}>
                    Save Alarm
                </Button>
                <Button variant="secondary" onClick={props.handleCloseCreate}>
                    Close View
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddAlarm