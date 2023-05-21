import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';

/**
 * Modal pop-up for adding new Notification.
 * 
 * Set Notification values for Add to DB.
 * Calls function handleSave.
 * 
 * Uses styling elements from Bootstrap
 * 
 * @param {any} props
 * @returns Modal element, new Notification.
 */
const AddNotification = (props) => {

    return (
        <Modal
            show={props.editCreateBarView}
            onHide={props.handleCloseCreate}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Create new Notification
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <br />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name. Should reference Alarm."
                        value={props.name} onChange={(e) => props.setName(e.target.value)}
                    />
                    <br/>
                    <textarea
                        type="form-control"
                        className="form-control"
                        placeholder="Enter Notification text. 
                            For targeted SMS text attachments. "
                        value={props.text} onChange={(e) => props.setText(e.target.value)}
                    />
                    <br />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <Button variant="success" onClick={() => props.handleSave()}>
                    Save Notification
                </Button>
                <Button variant="secondary" onClick={props.handleCloseCreate}>
                    Close View
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddNotification