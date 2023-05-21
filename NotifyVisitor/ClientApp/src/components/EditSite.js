
import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * Modal pop-up for editing Site. 
 * 
 * Set Site edit values.
 * Calls functions handleUpdate.
 * 
 * @param {any} props
 * @returns Modal element, edit Site
 */
const EditSite = (props) => {

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Edit Site : {props.editName}
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
                </Container>
                <br/>
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
export default EditSite