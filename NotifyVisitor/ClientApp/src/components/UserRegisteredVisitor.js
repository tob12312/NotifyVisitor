import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Input,
    Form,
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Label,
    FormGroup,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import axios from "../axiosInit";

/**
 * 
 * View for visitor after scanning qr. 
 * Made for visitor to register themselves as visitor
 * After phone number accepted and consent to data agreement user can register.
 * On register, user will receive text message with link to UpdateUserLocation
 * 
 * @returns UserRegisteredVisitor
 */

export const UserRegisteredVisitor = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const { newRoomId } = useParams("newRoomId");
    const phoneRegex = /^[0-9]{8}$/;

    const handlePhoneNumberChange = (e) => {
        const inputPhoneNumber = e.target.value;
        setPhoneNumber(inputPhoneNumber);
        if (phoneRegex.test(inputPhoneNumber)) {
            setValidPhoneNumber(true);
        } else {
            setValidPhoneNumber(false);
        }
    };

    const mess = `Press this link to register your visit: https://www.localhost.no/44434/update-user-location/?id=${newRoomId}`

    const handleSavePhoneNumber = async () => {
        const phoneNumberData = {
            toPhoneNumber: phoneNumber,
            message: mess,
        };

        try {
            //axios call commented out for testing. Avoid sending uneccessary sms'
            await axios.post('alarm/VisitorConfirmSms', phoneNumberData);
            console.log('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
        }
        localStorage.setItem("phoneNumber", phoneNumber);
    };

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            handleSavePhoneNumber();
        }
    }

    function isRegistered() {
        if (phoneRegex.test(Cookies.get('phoneNumber'))) {
            navigate(`/update-user-location/${newRoomId}`);
        } else {
            console.log("Phonenumber not saved. Register");
        }
    }

    const toggle = () => setModal(!modal);

    const handleCheckboxChange = (e) => {
        setAgreementAccepted(e.target.checked);
    };

    useEffect(() => {
        isRegistered();
    });

    return (
        <Container className="pt-5">
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleSavePhoneNumber}>
                                <FormGroup className="pb-2 mr-sm-2 mb-sm-0">
                                    <Label for="PhoneNumber" className="mr-sm-2">
                                        <h3>Register your phone number</h3>
                                    </Label>
                                    <Input
                                        type="phoneNumber"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        placeholder="+47 12345678"
                                        onChange={handlePhoneNumberChange}
                                    />
                                </FormGroup>
                                <FormGroup className="pb-2 mr-sm-2 mb-sm-0">
                                    <Input
                                        type="checkbox"
                                        name="dataStorageAgreementCheckbox"
                                        id="examplePassword"
                                        placeholder=""
                                        onChange={handleCheckboxChange}
                                    />
                                    <Label for="examplePassword" className="mr-sm-2">
                                        I have read and accepted the data storage agreement
                                    </Label>
                                </FormGroup>
                            </Form>
                            <p>Please enter a valid Norwegian phone number and accept the
                                <button
                                    style={{
                                        color: 'blue',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }}
                                    onClick={toggle}
                                >
                                    data storage agreement
                                </button>
                            </p>
                            {validPhoneNumber && agreementAccepted ? (
                                <button className="btn btn-secondary" onClick={handleSavePhoneNumber} onKeyDown={handleKeyDown}>
                                    Register
                                </button>
                            ) : (
                                <div />
                            )}

                            <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}>Data storage agreement</ModalHeader>
                                <ModalBody className="modal-body text-light">
                                    <h4>Introduction</h4>
                                    <p>This Agreement outlines the terms and conditions under which the Company
                                    collects, processes, and stores your personal data
                                    through the application Varslingstjeneste ("the App").
                                    This Agreement is in compliance with the General Data Protection Regulation (GDPR).</p>

                                    <h4>Personal Data</h4>
                                    <p>For the purposes of this Agreement,
                                    'personal data' refers to any information relating to an
                                    identified or identifiable person. In this case,
                                    it refers to your mobile phone number.</p>

                                    <h4>Purpose of Data Collection</h4>
                                    <p>The Company collects your phone number to provide you with emergency updates.
                                    The collection of this data is necessary for the performance of the service
                                    provided by the App.</p>

                                    <h4>Data Processing and Storage</h4>
                                    <p>Your phone number will be stored in a secure Microsoft SQL database,
                                    which is maintained and managed with best industry practices for data security.
                                    The phone number will also be temporarily be stored as a cookie in your phones web browser.</p>

                                    <h4>Data Retention</h4>
                                    <p>The Company will only retain your phone number for a period of 12 hours
                                    from the time of your last update of your location within the App. After this period,
                                    your phone number will be automatically deleted from our database and cookies.</p>

                                    <h4>Data Subject Rights</h4>
                                    <p>As a data subject, you have the right to access, correct, delete, or restrict processing
                                    of your personal data. You also have the right to withdraw your consent at any time,
                                    without affecting the lawfulness of processing based on consent before its withdrawal.
                                    By signing out through scanning the "sign out qr code", your data will no longer be stored with us.
                                    </p>

                                    <h4>Consent</h4>
                                    <p>By using the App, you agree to the terms and conditions outlined in this Agreement.
                                    If you do not agree with these terms, you must cease use of the app.</p>

                                    <h4>Changes to this Agreement</h4>
                                    <p>The Company reserves the right to modify this Agreement at any time. Any changes will be posted on the App,
                                    and your continued use of the App following any changes indicates your acceptance of these changes.</p>

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={toggle}>Close</Button>
                                </ModalFooter>
                            </Modal>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
export default UserRegisteredVisitor;