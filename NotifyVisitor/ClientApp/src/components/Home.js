import axios from "axios";
import '../styling/NotifyVisitorApp.css';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import React, { Component, useState, useEffect, Fragment } from 'react';
import Chart from "chart.js/auto";
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardFooter,
    Row,
    Col,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    Form,
    InputGroup,
    Input,
    InputGroupText,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

import {
    FaRegBuilding,
    FaRegBell,
    FaWhatsapp,
    FaUserFriends
} from "react-icons/fa";

/**
 * Main component returned to AppRoutes. CRUDE functionality for Home.
 * 
 * Uses Axios to communicate with backend API.
 * Collections from DB stored in Arrays.
 * Model data/ values stored in variables.
 * 
 * Uses Modal pop-ups and Toast to communicate with User.
 * Uses library react-chartjs-2 for BarChart an LineChart elements.
 * Uses styling elements from Bootstrap and Reactstrap.
 * 
 * Current and historical data from DB displayed - per Site/ All Sites.
 * 
 * @returns Home View (dashboard).
 */
export function Home(props) {

    // Is userinfo sent to backend?
    const [userSent, setUserSent] = useState(false)

    // Collection data
    const [visitors, setVisitors] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Object data
    const [lastNotification, setLastNotification] = useState('');
    const [countNotifications, setCountNotifications] = useState();
    const [alarmName, setAlarmName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [siteLastName, setSiteLastName] = useState('')

    // Site data
    const [siteData, setSiteData] = useState([]);
    const [siteId, setSiteId] = useState(0);
    const [siteName, setSiteName] = useState('');

    // Periods Notifications Count
    const [notiToday, setNotiToday] = useState(0);
    const [notiWeek, setNotiWeek] = useState(0);
    const [notiMonth, setNotiMonth] = useState(0);
    const [notiYear, setNotiYear] = useState(0);

    // Periods Visitor visits Count
    const [visitorToday, setVisitorToday] = useState(0);
    const [visitorWeek, setVisitorWeek] = useState(0);
    const [visitorMonth, setVisitorMonth] = useState(0);
    const [visitorYear, setVisitorYear] = useState(0);

    // Periods Unique Alarms triggered Count
    const [alarmToday, setAlarmToday] = useState(0);
    const [alarmWeek, setAlarmWeek] = useState(0);
    const [alarmMonth, setAlarmMonth] = useState(0);
    const [alarmYear, setAlarmYear] = useState(0);

    // get/ set collections/ values
    const getData = () => {
        Promise.all([       
            axios.get('/visitor/visitorHistory'), // full VisitorHistory
            axios.get('/room/getall'), // all Rooms
            axios.get('/alarm/getLastTriggeredAlarm'), // Data about last triggered alarms
            axios.get(`/alarm/getCountTriggeredAlarmsPeriods`), // Count today, -7 days, -30 days, -365 days
            axios.get(`/visitor/getCountDistinctVisitorHistoryPeriods`), // Count today, -7 days, -30 days, -365 days
            axios.get(`/alarm/getCountDistinctTriggeredAlarmsPeriods`), // Count today, -7 days, -30 days, -365 days 
            axios.get('/site/getall'), // all Sites
        ])
            .then(response => {
                setVisitors(response[0].data.data); // all visitors
                setRooms(response[1].data.data); // all rooms
                setLastNotification(response[2].data.data.createdDateTime.substring(0, 10))            
                setData(response[2].data.data);  // transfer response to setData

                // Notifications per periods
                setNotiToday(response[3].data.data[0])
                setNotiWeek(response[3].data.data[1])
                setNotiMonth(response[3].data.data[2])
                setNotiYear(response[3].data.data[3])

                // Visitors per periods
                setVisitorToday(response[4].data.data[0])
                setVisitorWeek(response[4].data.data[1])
                setVisitorMonth(response[4].data.data[2])
                setVisitorYear(response[4].data.data[3])

                // Alarms (notified) per periods
                setAlarmToday(response[5].data.data[0])
                setAlarmWeek(response[5].data.data[1])
                setAlarmMonth(response[5].data.data[2])
                setAlarmYear(response[5].data.data[3])

                // Setting additional values
                setSiteData(response[6].data.data)
            })
            .catch(error => {
                console.error(error);
            })
    }

    // get/ set collections/ values
    const getDataPerSite = () => {
        // selectAll is false, get Site spesific Data
        Promise.all([
            axios.get(`/visitor/getAllVisitorHistoryPerSite/${siteId}`), // full VisitorHistory PER SITE
            axios.get(`/room/getAllRoomsPerSite/${siteId}`), // all Rooms PER SITE
            axios.get(`/alarm/getLastTriggeredAlarmPerSite/${siteId}`), // Data about last triggered alarms PER SITE
            axios.get(`/alarm/getCountTriggeredAlarmsPeriodsPerSite/${siteId}`), // Count today, -7 days, -30 days, -365 days
            axios.get(`/visitor/getCountDistinctVisitorHistoryPeriodsPerSite/${siteId}`), // Count today, -7 days, -30 days, -365 days
            axios.get(`/alarm/getCountDistinctTriggeredAlarmsPeriodsPerSite/${siteId}`), // Count today, -7 days, -30 days, -365 days 
            axios.get('/site/getall'), // all Sites
        ])
            .then(response => {
                setVisitors(response[0].data.data); // all visitors
                setRooms(response[1].data.data); // all rooms
                if (response[2].data.data !== null) {
                    setLastNotification(response[2].data.data.createdDateTime.substring(0, 10))
                    setData(response[2].data.data);  // transfer response to setData
                }
                else {
                    setLastNotification('-');
                    setAlarmName('-');
                    setRoomName('-');
                    setSiteLastName('-');
                }
                
                // Notifications per periods
                setNotiToday(response[3].data.data[0])
                setNotiWeek(response[3].data.data[1])
                setNotiMonth(response[3].data.data[2])
                setNotiYear(response[3].data.data[3])

                // Visitors per periods
                setVisitorToday(response[4].data.data[0])
                setVisitorWeek(response[4].data.data[1])
                setVisitorMonth(response[4].data.data[2])
                setVisitorYear(response[4].data.data[3])

                // Alarms (notified) per periods
                setAlarmToday(response[5].data.data[0])
                setAlarmWeek(response[5].data.data[1])
                setAlarmMonth(response[5].data.data[2])
                setAlarmYear(response[5].data.data[3])

                setSiteData(response[6].data.data)
            })
            .catch(error => {
                console.error(error);
            })
    }

    // get/ set additional values with response from getData
    const setData = (response) => {
        Promise.all([
            axios.get(`alarm/${response.alarmId}`),
            axios.get(`room/${response.roomId}`),
            axios.get(`site/${response.siteId}`)
        ])
            .then(result => {
                setAlarmName(result[0].data.data.name);
                setRoomName(result[1].data.data.name);
                setSiteLastName(result[2].data.data.name);
            })
            .catch(error => {
                console.error(error);
            });  
    }

    // triggers modals - select site
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Data refresh in useEffect, refresh on window resize
    useEffect(() => {
        setSiteName('');
        setSiteId(0);
        getData();       
        const handleResize = () => {
            // Update data from DB after window resize
            setSiteName('');
            setSiteId(0);
            getData();
        }
        // Waits 100ms after window resize
        // Then update data from DB and recomp/ mount
        // To minimize number of API calls
        let delay;
        window.onresize = function () {
            clearTimeout(delay);
            delay = setTimeout(handleResize, 100);
        };
    }, []);

    //Sets chart y-axis numbers to integer
    const options = {
        scale: {
            ticks: {
                precision: 0
            }
        }
    }

    // Bar Chart. Rooms with Visitors displayed with count.
    const BarChart = () => {
        const labels = [];
        const visitorVolume = [];
        let j = 0;
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].visitors.length > 0) {
                labels[j] = rooms[i].name;
                visitorVolume[j] = rooms[i].visitors.length;
                j++
            }
        }  
        // data BarChart
        const data = {
            labels: labels,
            datasets: [
                {
                    label: "Rooms",
                    backgroundColor: "#7e4a35",
                    borderColor: "#7e4a35",
                    data: visitorVolume,
                },
            ],
        };
        // options BarChart       
        return (
            <div>
                <Bar data={data} options={ options } />
            </div>
        );
    };

    // Function for populating Line chart
    // Returns Count Visitors last 7 days.
    // 14.04.23 : Editet, COUNT DISTINCT telephone
    const visitorPerDay = () => {
        const today = new Date();
        const weekDays = [];
        const visitorsPerDay = [];
        const phoneNumbers = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            let count = 0;
            visitors.forEach(visitor => {
                if (new Date(visitor.registeredDateTime).toDateString() === date.toDateString() &&
                    !phoneNumbers.includes(visitor.telephone)) {  // added check for distinct telephone
                        phoneNumbers.push(visitor.telephone)
                        count++;                      
                }
            });
            visitorsPerDay.push(count);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            weekDays.push(dayName);
        }

        weekDays.reverse();
        visitorsPerDay.reverse();

        return { weekDays, visitorsPerDay };
    };

    // Data LineChart
    const lineData = {
        labels: visitorPerDay().weekDays,
        datasets: [
            {
                label: "Visitors",
                backgroundColor: "#37423b",
                borderColor: "#37423b",
                data: visitorPerDay().visitorsPerDay,
            },
        ],
    };

    // Render LineChart
    const LineChart = () => {
        return (
            <div>
                <Line data={lineData} options={options} />
            </div>
        );
    };

        return (
            <>  
                <Fragment>
                    <div>                      
                        <Button onClick={() => {
                            setSiteName('');
                            setSiteId(0);
                            handleShow();
                        }}
                    >Select{' '}<FaRegBuilding />
                        </Button>
                        <center>
                            <h4>
                                {siteName === '' ? 'Displaying all Sites' : 'Displaying '+siteName }
                            </h4>
                    </center>  
                    <br/>
                    <Row>
                        <Col lg="3" md="6" sm="6">
                            <Card>
                                <CardBody className="color-tableHeader">
                                    <Row>
                                        <Col md="4" xs="5">
                                            <FaUserFriends />
                                        </Col>
                                        <Col md="8" xs="7">
                                            <CardTitle tag="p">
                                                Distinct Visitors
                                            </CardTitle>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <hr />
                                    <Row>
                                        <Col>   
                                            Today :   
                                        </Col>
                                        <Col className="text-right">
                                            {visitorToday}                                 
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 7 days :                                         
                                        </Col>
                                        <Col className="text-right">
                                            {visitorWeek}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 30 days :
                                        </Col>
                                        <Col className="text-right">
                                            {visitorMonth}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 365 days :
                                        </Col>
                                        <Col className="text-right">
                                            {visitorYear}
                                        </Col>
                                    </Row>
                                    <hr />
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col lg="3" md="6" sm="6">
                            <Card>
                                <CardBody className="color-tableHeader">
                                    <Row>
                                        <Col md="4" xs="5">
                                            <FaWhatsapp />
                                        </Col>
                                        <Col md="8" xs="7">
                                            <CardTitle tag="p">
                                                Last Notification
                                            </CardTitle>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Date :
                                        </Col>
                                        <Col className="text-right">
                                            {lastNotification}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Alarm :
                                        </Col>
                                         <Col className="text-right">
                                            {alarmName}
                                        </Col>
                                    </Row> 
                                    <hr />
                                    <Row>
                                        <Col>
                                            Site :
                                        </Col>
                                        <Col className="text-right">
                                            {siteLastName}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Room :
                                        </Col>
                                        <Col className="text-right">
                                            {roomName}
                                        </Col>
                                    </Row>
                                    <hr />
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col lg="3" md="6" sm="6">
                            <Card>
                                <CardBody className="color-tableHeader">
                                    <Row>
                                        <Col md="4" xs="5">
                                            <FaWhatsapp />
                                        </Col>
                                        <Col md="8" xs="7">
                                            <CardTitle tag="p">
                                                SMS sent
                                            </CardTitle>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Today :
                                        </Col>
                                        <Col className="text-right">
                                            {notiToday}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 7 days :
                                        </Col>
                                         <Col className="text-right">
                                            {notiWeek}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 30 days :
                                        </Col>
                                        <Col className="text-right">
                                            {notiMonth}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 365 days :
                                        </Col>
                                        <Col className="text-right">
                                            {notiYear}
                                        </Col>
                                    </Row>
                                    <hr />
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col lg="3" md="6" sm="6">
                            <Card className="card-stats">
                                <CardBody className="color-tableHeader">
                                    <Row>
                                        <Col md="4" xs="5">
                                            <FaRegBell/>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <CardTitle tag="p">
                                                Triggered Alarms
                                            </CardTitle>                                          
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Today :
                                        </Col>
                                        <Col className="text-right">
                                            {alarmToday}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 7 days :
                                        </Col>
                                        <Col className="text-right">
                                            {alarmWeek}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 30 days :
                                        </Col>
                                         <Col className="text-right">
                                            {alarmMonth}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col>
                                            Last 365 days :
                                        </Col>
                                        <Col className="text-right">
                                            {alarmYear}
                                        </Col>
                                    </Row>
                                    <hr />
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                    <p />
                    <Row>
                        <Col md="6">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">Daily visits</CardTitle>
                                    <p>Distinct Visitors last 7 days</p>
                                </CardHeader>
                                <CardBody>
                                    <LineChart
                                    />
                                </CardBody>
                                <CardFooter/>                                                         
                            </Card>
                        </Col>             
                        <Col md="6">
                            <Card>
                                <CardHeader >
                                    <CardTitle tag="h5">Room Statistics</CardTitle>
                                    <p>Rooms currently visited</p>
                                </CardHeader>
                                <CardBody>
                                    <BarChart
                                    />
                                </CardBody>
                                <CardFooter/>                                                         
                            </Card>
                        </Col>
                    </Row>
                    </div>

                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton className="modal-frame">
                            <Modal.Title>
                                Display Sites, all or selected
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="modal-body">
                            <Container>
                                <br />
                                <Col>
                                <center>
                                    <UncontrolledDropdown>
                                        <DropdownToggle className="dropdown-fullsize">
                                            <Form>
                                                <InputGroup >
                                                    <Input
                                                        onChange={(e) => setSiteName(e.target.value)}
                                                        placeholder="Select Site"
                                                        value={siteName}
                                                        type="text"
                                                    />
                                                    <InputGroupText><FaRegBuilding /></InputGroupText>
                                                </InputGroup>
                                            </Form>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {siteData.map((siteList, index) => (
                                                <DropdownItem
                                                    placeholder={siteList.name}
                                                    key={index}
                                                    value={siteList.name}
                                                    onClick={() => {
                                                        setSiteId(siteList.id)
                                                        setSiteName(siteList.name)
                                                    }}>
                                                    {siteList.name}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    </center>
                                </Col>
                                <br/>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center"
                            style={{ backgroundColor: 'gainsboro' }}
                        >                           
                            <Button style={{ width: '10em' }}
                                onClick={() => {
                                    setSiteName('')
                                    setSiteId(0)
                                    getData();
                                    handleClose()
                                }}>
                                Display all Sites
                            </Button>                   
                            <Button style={{ width: '10em' }}
                                onClick={() => {
                                    siteId !== 0 && getDataPerSite()
                                    handleClose()
                                }}>
                                Display Selected
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>
            </>
        );
    }

