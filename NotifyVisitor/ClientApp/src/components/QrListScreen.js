import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'react-toastify/dist/ReactToastify.css';

import QRCode from 'qrcode.react';

import {
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    CardTitle
} from "reactstrap"; 
import qrScreen from '../styling/qrScreen.jpg';
import { RoomView } from './RoomView';

/**
 * Returns looped Cards with QR Code for each selected Room.
 * Ment for lobby screens displaying multiple assigned Rooms.
 * 
 * @returns QR to multiscreen.
 */
export const QrListScreen = (props) => {

    return ( 
        <div className="qr-card-screen">
            <Card className="card-stats" >
                <CardHeader >
                    <center>
                        <CardTitle
                            tag="h4">{props.listCheckedName}
                        </CardTitle>
                    </center>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="4" xs="5">
                            <div className="icon-big text-center icon-warning">
                                <i className="nc-icon nc-globe text-warning" />
                            </div>
                        </Col>
                        <Col md="8" xs="7">
                            <div className="numbers">
                                        
                                <p />
                            </div>
                        </Col>
                    </Row>                    
                        <br />
                    <center>
                        <QRCode value={props.listQrCode} />                             
                    </center>
                    <br />
                </CardBody>
                <CardFooter>
                    <center>
                        Please scan QR code before visiting room {props.checkedName}
                    </center>
                    <hr />
                </CardFooter>
            </Card>
        </div>

       
    )
};
