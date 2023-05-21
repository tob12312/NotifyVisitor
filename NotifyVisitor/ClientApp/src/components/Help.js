import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'react-toastify/dist/ReactToastify.css';

// Function for returning help text.
const HelpText = () => {

    return (
        <div style={{backgroundColor: 'white', padding: '0.5em'} }>   
            <p>This is an application for notifying visitors by SMS on triggered alarms. Functionality, views and set up described below.</p>
            <h5>User information :</h5>
            <p>Azure AD credentials necessary for login application. Visitors can scan QR codes without credentials, for register, unregister, and changing room.
                Three user roles defined:</p>
            <p>SiteAdmin : full access to all functionality.</p>
            <p>SiteUser : only permitted to read.</p>
            <p>Visitor : only permitted to scan QR codes.</p>
            <h5>Views explained :</h5>
            <p>User navigates to views using the navigation bar. Each view has a menu bar for accessing functionality.</p>
            <p>Home : displayes data about selected Site/ all Sites.</p>
            <p>Site : A Site is defined as a collection of Rooms. User can create/ update/ delete Sites.</p>
            <p>Room : A Room belongs to a Site. User can create/ update/ delete Rooms, and create new Sites. User can select QR codes to screen/ PDF.</p>
            <p>Alarm : An Alarm contains an alarm text that is included in SMS to Visitor. A default empty Notification is created upon create Alarm. 
                User can create/ update/ delete Alarms</p>
            <p>Triggered Alarms : Displayes historical information about triggered alarms and SMS to Visitors.</p>
            <p>Notification: A Notification is a optional text addendum included in SMS to Visitor. Can be specified to Room/ Floor/ Building.
                User can create/ update/ delete Notifications.</p>
            <p>Assign : An Assignment consists of combinations of selected Alarm, Room, and Notification. Use default Notification if the alarm text
                is sufficient, or use a spesified Notification for detailed instructions. User can create and delete Assignments for Rooms or whole Sites.
                User can create and update Notifications used in assignment.</p>
            <p>Visitor : A Visitor is ment to register by scanning QR code, but can also be registered in the application by a SiteAdmin.
                User can create/ update/ delete Visitors.</p>
            <p>Visitor History : Displays historical information about Visitors.</p>
            <h5>Functionality explained :</h5>
            <p>Main functionality is to assign alarms to rooms, so that Visitors can be notified. To make assignments,
                a SiteAdmin must first create the necessary data involved.</p>
            <h5>Setting up :</h5>
            <p>To make the system operational a SiteAdmin must create the necessary data. Create functionality is available in different views to make the job easier
                Main steps described below.</p>
            <p>1 : Create the Site (can also be created in view Room).</p>
            <p>2 : Create the Room.</p>
            <p>3 : Create the Alarm (includes default Notification).</p>
            <p>4 : Create the Assignment, for Room or whole Site.</p>
            <p>5 : Create/ edit Notifications, and set to assignments for spesified information in SMS (in Notification or directly in Assign).</p>
            <h5>Use :</h5>
            <p>Maintain and monitor current and historical Alarm and Visitor data for Site.</p>
            <p>Activate alarms on events. This generates SMS to all Visitors in Rooms assigned to that Alarm. The SMS contains name of Alarm, Site and Room,
                the Alarm text, and the Notification text. SMS (all fields) can be viewed by editing an assignment.</p>
        </div>
    )
}
/**
 * Modal pop-up for Help. User documentation.
 * 
 * 
 * Uses styling elements from Bootstrap and Reactstrap
 * 
 * @param {any} props
 * @returns Modal element, new AssignAlarm
 */
const Help = (props) => {

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    User documentation Notify Visitor
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Container>
                    <HelpText />                
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={props.handleClose}
                    >Close View
                    </button>
            </Modal.Footer>
        </Modal>
    )
}
export default Help