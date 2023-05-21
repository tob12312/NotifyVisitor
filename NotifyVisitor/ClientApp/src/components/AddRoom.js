import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
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
    Form,
} from "reactstrap"; 

/**
 * Modal pop-up for adding new Room/ Site.
 * 
 * A Room belongs to a Site. 
 * Site can be selected or created.
 * Set Room and Site values for Add to DB.
 * Calls function handleSave.
 * 
 * Uses styling elements from Bootstrap and Reactstrap
 * 
 * @param {any} props
 * @returns Modal element, new Room/ Site
 */
const AddRoom = (props) => {

    return (

        <Modal
            show={props.editCreateBarView}
            onHide={props.handleCloseCreate}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="modal-frame">
                <Modal.Title>
                    Create new Room / Site
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
                                        onChange={(e) => props.setSiteName(e.target.value)}
                                        placeholder="Select Site / Enter new site name"
                                        value={props.siteName}
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
                                        props.setSite(siteList.id)
                                        props.setSiteName(siteList.name)
                                    }}>
                                    {siteList.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <br/>
                    <br/>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter RoomName"
                        value={props.name} onChange={(e) => props.setName(e.target.value)}
                    />
                    <br/>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Floor"
                        value={props.floor} onChange={(e) => props.setFloor(e.target.value)}
                    />
                    <br/>
                    <input
                        type="form-control"
                        className="form-control"
                        placeholder="Enter Building"
                        value={props.building} onChange={(e) => props.setBuilding(e.target.value)}
                    />
                    <br/>
                    <br/>
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center"
                style={{ backgroundColor: 'gainsboro' }}>
                <Button variant="success" onClick={() => {
                    props.handleSave()
                }}>
                    Save Room
                </Button>
                <Button variant="secondary" onClick={props.handleCloseCreate}>
                    Close View
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddRoom