import { Fragment, useEffect, useState } from "react";
import '../styling/NotifyVisitorApp.css';
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "../axiosInit";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody
} from "reactstrap";

/**
 * 
 * Shows a screen for visitor letting them know they've updated their location
 * Saves phoneNumber as cookie, so visitor dont have to register again on location change
 * @returns UpdateUserLocation
 */

export const UpdateUserLocation = () => {

    const [sorting, setSorting] = useState({ column: 'id', order: 'asc' });
    const [searchValue, setSearchValue] = useState("");  // the columns to be displayed (adapt to view):

    // unsorted data from server
    const [data, setData] = useState([]);
    const phoneRegex = /^[0-9]{8}$/;

    const localstorageNumber = localStorage.getItem("phoneNumber")

    if (!phoneRegex.test(Cookies.get('phoneNumber')) && localstorageNumber) {
        const expires = new Date();
        expires.setTime(expires.getTime() + 12 * 60 * 60 * 1000);
        Cookies.set('phoneNumber', localstorageNumber, { expires }, { sameSite: 'strict' });
    }


    const phoneNumber = Cookies.get('phoneNumber');
    const { newRoomId } = useParams("newRoomId");

    setTimeout(() => {
        localStorage.removeItem("phoneNumber");
    }, 1000);

    // API calls 
    const getData = () => {
        axios.get(`visitor/telephone/${phoneNumber}/${newRoomId}`)
            .then((response) => {
                setData(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    useEffect(() => {
        getData();
        const handleResize = () => {
            // Update the state or perform any other actions when the
            // browser is resized
            getData();
        }
        // Attach the event listener to the window object
        window.addEventListener('resize', handleResize);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [sorting, searchValue, newRoomId]) // sort order and search -> new mount

    return (
        <Container className="pt-5">
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            {newRoomId == -1 ?
                                <div>
                                    {Cookies.remove("phoneNumber")}
                                    <h1>Thank you for your visit!</h1>
                                    <p>You will no longer receive notifications to: {phoneNumber}.
                                        If you have logged out by accident. Scan one of the other qr-codes to register again</p>
                                    <p>Your phonenumber is now removed from our databases</p>

                                </div>
                                :
                                <div>
                                    <h1>You are now registered in room: {newRoomId}</h1>
                                    <p>Use your phones camera to scan the qr-codes outside the rooms you enter, so we can keep track of you in case of
                                        an emergency.</p>
                                    <p>The phone number you are registered with is {phoneNumber}. Do not clear your cookies while you're at the premises.
                                        If you do, you will have to register again the next time you enter a room.</p>
                                    <p>You can now close your web browser and continue on with your visit. Just remember to scan the codes when you move</p>
                                    <p>We will now update the database with the corresponding information</p>

                                </div>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};