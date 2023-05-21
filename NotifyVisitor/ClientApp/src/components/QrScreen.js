import { Fragment, useState } from "react";
import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import QRCode from 'qrcode.react';
import qrScreen from '../styling/qrScreen.jpg';

/**
 * Returns QR code on screen, for Visitor scanning.
 * Ment for screens displaying one assigned Room.
 * 
 * Uses Modal for displaying QR code.
 * 
 * @returns QR to multiscreen.
 */
export const QrScreen = (props) => {

    const [show, setShow] = useState(true);
 
    return (
        <Fragment >
            <ToastContainer />
            <div className="qrScreen">
                <img src={qrScreen} width="100%" height="100%"/>
            </div>
            <Modal
                show={show}
                   //     onHide={handleClose}  LOGIN
                backdrop="static"
                keyboard={false}
                >
                <Modal.Header style={{ backgroundColor: 'darkslategrey' }}>
                    <Modal.Title>                      
                        <h2
                            className="text-light"
                        >Room : {props.checkedName}
                        </h2>                    
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{ backgroundColor:'#2a2e2c' }}
                    className="text-light"
                    >
                    <Container>
                        <Row >
                            <Col >
                                <h3>Please scan this code
                                </h3>
                            </Col>                    
                        </Row>
                        <br />
                        <Row>
                            <Col>                                      
                            <h4>So you can receive important information on your phone in case of an emergency</h4>                                  
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <h4>Scan the qr-code with your phones camera app, and follow the instructions to register
                                </h4>
                            </Col>
                        </Row>
                    </Container>
                    < br divider="true"/>
                    <Container>
                        <Row >
                            <Col style={{ backgroundColor: 'white' }}>
                                <br />
                                <center>
                            <QRCode value={props.qrCode} />
                                </center>
                                <br />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer
                    style={{ backgroundColor: 'darkslategrey' }}
                    className="d-flex justify-content-evenly"
                    >               
                    <Button variant="secondary"
                        style={{ backgroundColor: '#2a2e2c', width: '10em' }}
                        href="/app/room"
                    >Go back
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};
