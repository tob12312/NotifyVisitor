import { Fragment, useEffect, useState } from "react";
import '../styling/NotifyVisitorApp.css';

import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MenuBar from './MenuBar';
import SearchBar from './SearchBar';
import HeaderAssign from './HeaderAssign';
import ContentAssign from './ContentAssign';
import AddAssign from './AddAssign'
import EditAssign from './EditAssign'
 
/**
 * Main component returned to AppRoutes. CRUDE functionality for Assigning Alarms.
 * 
 * Uses Axios to communicate with API.
 * Collections from DB stored in Arrays.
 * Model data/ values stored in two sets of variables, for Add and Update (prefix edit).
 * Table element are defined from model data and window size.
 * 
 * Uses dedicated and shared components to render User GUI, passing model data. 
 * 
 * Uses Modal pop-ups and Toast to communicate with User.
 * 
 * View is responsive. Refreshes data on window resize (100ms delay).
 * 
 * AssignedAlarm represents the relationship between Alarm, Room, and Notification.
 * Alarms can be assigned to Rooms so that Visitor to Room gets SMS if Alarm is activated.
 * 
 * A Room can only have one Assignment/ Notification to each Alarm.
 * Each Alarm have a general alarmText, while Notifications are ment to be spesific (optional).
 * Different Rooms can be assigned to same Alarm and have different Notifications.
 * A Notification is a text attachment that is included in the Alarm SMS as an option.
 * Notifications can be aimed at each Site/ Room/ Floor/ Building, and can be edited by User.
 * SMS to Visitor consists of: "Alarm: " + Alarm.Name + Site.Name + Room.Name + Alarm.AlarmText + Notification.Text.
 * Alarms are triggered by updating the Alarm, setting isActive to 1/ true. Update must be saved.
 * 
 * User can create and delete Assignments for all Rooms in Site or for single Room. 
 * A use case can be to Assign an Alarm to all Rooms in Site to save time, using the default
 * Notification (blank). The default Notification can also be edited by user. 
 * Another use case can be to select Alarm and Site, and delete Assignment for all Rooms in Site.
 * 
 * User can create and edit Notifications for all Rooms in Site or for single Room.
 * Notifications can be aimed at each Site/ Room/ Floor/ Building.
 * 
 * Created Notifications are added as new Notifications to DB.
 * A use case can be to first Assign Alarm to whole Site, using default Notification (blank),
 * then set spesific Notifications to spesific Rooms.
 * 
 * Deleting Site Assignment deletes all Notification variations of same Assignment.
 * Deleting/ editing Assignments does not delete the involved entities, only the relation.
 * 
 * 
 * @returns AssignAlarm View.
 */
export const AssignView = () => {

    const maxNameLength = 25;
    const maxNotificationTextLength = 70; // auto text = 20? + alarmText 70 + notification 70

    // Data from DB. Collection of Assignments
    const [legalCombo, setLegalCombo] = useState([]); // joins

    // View variables, triggers components
    const [viewType, setViewType] = useState('Assign');
    const [edit, setEdit] = useState(true); // edit mode toggle
    const [editEntry, setEditEntry] = useState({}); // content entries
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [assignView, setAssignView] = useState(false);

    // columns mapped to keys = variables = DB_attributes = viewType
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);
    const widescreen = window.innerWidth < 850 || overrideBreakpoint;
    const columns = widescreen ? ["siteId", "room", "alarmText"] :
        ["siteId", "site", "room", "alarm", "alarmText", "attachment"];
        
    // Filter / sort
    const [sorting, setSorting] = useState({ column: 'id', order: 'asc' });
    const [searchValue, setSearchValue] = useState("");  // the columns to be displayed (adapt to view):
    const [searchBy, setSearchBy] = useState('id'); // search keys
    const sortTable = (newSorting) => { // variable for server sorting
        setSorting(newSorting);
    }
    const searchTable = (newSearchValue, searchFor) => { // variables for server search, column and value
        setSearchBy(searchFor);
        setSearchValue(newSearchValue);
    }

    // triggers modals - edit/ create
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleCloseCreate = () => {
        setEditCreateBarView(false);
        clear();
    }
    const handleShow = () => setShow(true);

    // Model data Collections Alarm, Room, Notification, Site
    const [alarmData, setAlarmData] = useState([]);
    const [notificationData, setNotificationData] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [siteData, setSiteData] = useState([]);

    // Model data params SAVE Alarm, Room, Notification, Site
    const [roomId, setRoomId] = useState(0);
    const [roomName, setRoomName] = useState('');
    const [alarmId, setAlarmId] = useState(0);
    const [alarmName, setAlarmName] = useState('')
    const [alarmText, setAlarmText] = useState('')
    const [alarmDescription, setAlarmDescription] = useState('')
    const [notificationId, setNotificationId] = useState(0);
    const [notificationName, setNotificationName] = useState('');
    const [siteId, setSiteId] = useState(0);
    const [siteName, setSiteName] = useState('')
    const [notificationText, setNotificationText] = useState('')
    const [alarmTextForRoom, setAlarmTextForRoom] = useState('')

    // Model data params EDIT Alarm, Room, Notification, Site
    const [editRoomId, setEditRoomId] = useState(0);
    const [editRoomName, setEditRoomName] = useState('');
    const [editRoomSiteId, setEditRoomSiteId] = useState('');
    const [editAlarmId, setEditAlarmId] = useState(0);
    const [editAlarmName, setEditAlarmName] = useState('')
    const [editAlarmText, setEditAlarmText] = useState('')
    const [editNotificationId, setEditNotificationId] = useState(0);
    const [editNewNotificationId, setEditNewNotificationId] = useState(0);
    const [editNotificationName, setEditNotificationName] = useState('');
    const [editNotificationText, setEditNotificationText] = useState('')
    const [editAlarmTextForRoom, setEditAlarmTextForRoom] = useState('')
    const [editCreatedDateTime, setEditCreatedDateTime] = useState('')
    const [editUser, setEditUser] = useState('')

    // Helper Function for finding SiteName from SiteId
    const findSiteName = (siteId) => {
        const siteIndex = (e) => e.id === siteId; // find index by Site name match
        return siteData[siteData.findIndex(siteIndex)].name // return Site Name from index 
    }

    // URL for get all with search and sort
    const urlKombo = `assignalarm/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    // GET all Assignments, all Rooms, all Alarms, all Notifications, all Sites
    const getData = () => {
        Promise.all([
            axios.get(urlKombo), // All joins, Alarm + Room + Notification
            axios.get(`room/getAll`), // All rooms 
            axios.get(`alarm/getAll`), // All alarms
            axios.get(`notification/getAll`), // All notifications
            axios.get(`site/getAll`), // All sites
        ])
            .then((response) => {
                setLegalCombo(response[0].data.data) // All assignments
                setRoomData(response[1].data.data) // All Rooms
                setAlarmData(response[2].data.data) // All Alarms
                setNotificationData(response[3].data.data) // All Notifications
                setSiteData(response[4].data.data) // All Sites
            })
            .catch(error => {
                if (error.response) {
                    //response status is an error code
                    console.log(error.response.status);
                }
                else if (error.request) {
                    //response not received though the request was sent
                    console.log(error.request);
                }
                else {
                    //an error occurred when setting up the request
                    console.log(error.message);
                }
            });
    }

    // HandleEdit calls DB, model data transferred to local vars
    const handleEdit = (roomId, alarmId, notificationId) => {
        handleShow();
        Promise.all([         
            axios.get(`room/${roomId}`),
            axios.get(`alarm/${alarmId}`),         
            axios.get(`notification/${notificationId}`),
            axios.get(`assignalarm/${alarmId}/${roomId}/${notificationId}`)
        ])  
            .then((result) => {
                setEditRoomId(result[0].data.data.id); // This ... Room Id
                setEditRoomName(result[0].data.data.name) // Room name
                setEditRoomSiteId(result[0].data.data.siteId) // Rooms siteId
                setEditAlarmId(result[1].data.data.id) // Alarm Id
                setEditAlarmName(result[1].data.data.name) // Alarm Name
                setEditAlarmText(result[1].data.data.alarmText) // Alarm text
                setEditNotificationId(result[2].data.data.id) // Notification Id
                setEditNewNotificationId(result[2].data.data.id) // Notification Id for changing/ editing
                setEditNotificationName(result[2].data.data.name) // Notification Name
                setEditNotificationText(result[2].data.data.text) // Notification text
                setEditCreatedDateTime(result[3].data.data.createdDateTime) // Date Assignment
                // build auto-generated text to SMS :  Alarm : Alarm.Name, Site.Name, Room.Name
                setEditAlarmTextForRoom(
                    `Alarm: ${result[1].data.data.name}, ${findSiteName(result[0].data.data.siteId)}, ${result[0].data.data.name}.\n`)
            })
            .catch((error) => {
                console.log(error)
                toast.error('Something went wrong ' + error);
            })
    }

    // Helper function input from user.
    // Name cannot be empty, duplicate, or to many chars
    const checkInputName = (inputName, length, namelist) => {
        return inputName !== '' && inputName.length <= length && !namelist.some(e => e.name === inputName);
    }

    // Helper function input from user (alarmText/ notification text).
    // Text cannot be empty or to many chars
    const checkInputText = (inputName, length) => {
        return inputName !== '' && inputName.length <= length;
    }

    // UPDATE one assignment by changing Notification
    const handleUpdate = () => {
        if (!checkInputText(editNotificationText, maxNotificationTextLength)) {
            toast.error('Notification text required, 1 - 70 characters.');
            return;
        }
        const url = `assignalarm/${editAlarmId}/${editRoomId}/${editNotificationId}/${editNewNotificationId}`;
        const urlN = `notification/${editNewNotificationId}`
        const dataN = {
            "id": editNewNotificationId,
            "name": editNotificationName,
            "text": editNotificationText,
        }
        Promise.all([ axios.put(url), axios.put(urlN, dataN) ])
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('Notification has been updated');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Update failed!');  
            })
    }

    // DELETE one assigment to room
    const handleDelete = (roomId, alarmId, notificationId) => {
        if (window.confirm("Are you sure to delete this assignment?") == true) {
            axios.delete(`assignalarm/${alarmId}/${roomId}/${notificationId}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Assignement has been deleted');
                        getData();
                    }
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        toast.error('You are not authorized for this action. Role SiteAdmin required.')
                    } else toast.error('Delete failed!');  
                })
        }
    }

    // ADD one assigment to room
    const handleSave = () => {
        const urlA = `assignalarm`;
        const dataA = {
            "alarmId": alarmId,
            "roomId": roomId,
            "notificationId": notificationId
        }
        axios.post(urlA, dataA)
            .then((res) => {
                getData();
                handleClose();
                clear();
                toast.success('Assignment to room has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // Loop call to add assigments to all rooms in site
    const assignAllRoomsInSite = () => {
        let roomList = 0
        let thisSiteIndex = 0
        for (let i = 0; i < siteData.length; i++) {
            if (siteData[i].id === siteId) {
                thisSiteIndex = i
                break;
            }
        }
        for (let j = 0; j < siteData[thisSiteIndex].rooms.length; j++) {
            roomList = JSON.stringify(siteData[thisSiteIndex].rooms[j].id)
            handleSaveAll(roomList)
        }       
        toast.success(`Alarm ${alarmName} assigned to Site ${siteName}`);
    }

    // ADD assigments for all Rooms in Site
    const handleSaveAll = (roomList) => {
        const urlA = `assignalarm`;
        const dataA = {
            "alarmId": alarmId,  
            "roomId": roomList,  
            "notificationId": notificationId         
        }
        axios.post(urlA, dataA)
            .then((res) => {
                getData();
                handleClose();
                clear();               
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // ADD new Notification and UPDATE Assignment
    const handleNewNotification = () => {
        if (!checkInputName(editNotificationName, maxNameLength, notificationData)) {
            toast.error('Unique name required, 1 - 25 characters.');
            return;
        }
        if (!checkInputText(editNotificationText, maxNotificationTextLength)) {
            toast.error('Notification text required, 1 - 70 characters.');
            return;
        }
        const url = `notification`;
        const data = {
            "name": editNotificationName,
            "text": editNotificationText,
        }
        axios.post(url, data)
            .then((res) => {
                // find the new Notification Id and update the relation (AssignedAlarm)
                const newNotificationId = res.data.data[res.data.data.length -1].id;
                const urlAA = `assignalarm/${editAlarmId}/${editRoomId}/${editNotificationId}/${newNotificationId}`;
                axios.put(urlAA)
                    .then((result) => {
                        handleClose();
                        getData();
                        toast.success('Assignment has been updated');
                    }).catch((error) => {
                        if (error.response.status === 403) {
                            toast.error('You are not authorized for this action. Role SiteAdmin required.')
                        } else toast.error('Update Notification failed!');  
                    })
                    handleClose();
                    clear();
                    toast.success('New Notification created');
                }).catch((error) => {
                    if (error.response.status === 403) {
                        toast.error('You are not authorized for this action. Role SiteAdmin required.')
                    } else toast.error('Save Notification failed!');  
                })       
    }

    // DELETE assigments for all rooms in site
    const handleDeleteSite = () => {
        if (window.confirm(`Do you want to delete ${alarmName} for all Rooms in ${siteName}?`) === true) {
            axios.delete(`assignalarm/site/${alarmId}/${siteId}`)
                .then((result) => {
                    if (result.status === 200) {
                        getData();
                        clear();
                        handleCloseCreate();
                        toast.success(`Alarm ${alarmName} for Site ${siteName} deleted!`);
                    }
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        toast.error('You are not authorized for this action. Role SiteAdmin required.')
                    } else toast.error('Delete failed!');  
                })
        }
    }

    // clear values
    const clear = () => {
        setAlarmId('');
        setNotificationId('');
        setAlarmName('')
        setNotificationName('')
        setRoomId('')
        setRoomName('')
        setSiteName('')
        setSiteId('')
        setAlarmText('')
        setAlarmTextForRoom('')
        setEditNotificationName('')
        setEditNotificationText('')
        setAlarmDescription('')
        setAlarmText('')
        setNotificationText('')
        setEditCreatedDateTime('')
    }

    // Rendering. Re-render on sort/ filter / window size (with delay)
    useEffect(() => {
        getData();
        const handleResize = () => {
            // Update data from DB after window resize
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
    }, [sorting, searchValue]) // sort order and search -> new mount

    return (        
        <Fragment>
            <ToastContainer position="bottom-right" />
            <MenuBar
                searchBarView={searchBarView}
                setSearchBarView={setSearchBarView}
                editBarView={editBarView}
                setEditBarView={setEditBarView}
                viewType={viewType}
                setViewType={setViewType}
                editCreateBarView={editCreateBarView}
                setEditCreateBarView={setEditCreateBarView}
                assignView={assignView}
                setAssignView={setAssignView}
                overrideBreakpoint={overrideBreakpoint}
                setOverrideBreakpoint={setOverrideBreakpoint}
            />
            {searchBarView && < SearchBar
                searchTable={searchTable}
                columns={columns}
            />}
            <AddAssign
                editCreateBarView={editCreateBarView}
                handleCloseCreate={handleCloseCreate}
                alarmData={alarmData}
                alarmId={alarmId}
                alarmName={alarmName}
                alarmText={alarmText}
                alarmDescription={alarmDescription}
                setAlarmId={setAlarmId}
                setAlarmName={setAlarmName}
                setAlarmDescription={setAlarmDescription}
                setAlarmText={setAlarmText}
                notificationData={notificationData}
                notificationId={notificationId}
                notificationName={notificationName}
                notificationText={notificationText}
                setNotificationId={setNotificationId}
                setNotificationName={setNotificationName}
                setNotificationText={setNotificationText}
                siteData={siteData}
                siteId={siteId}
                siteName={siteName}
                setSiteId={setSiteId}
                setSiteName={setSiteName}
                roomData={roomData}
                roomId={roomId}
                roomName={roomName}
                setRoomId={setRoomId}
                setRoomName={setRoomName}
                assignAllRoomsInSite={assignAllRoomsInSite}
                handleDeleteSite={handleDeleteSite}
                handleSave={handleSave}
            />
            <EditAssign
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                notificationData={notificationData}
                editAlarmName={editAlarmName}
                editRoomName={editRoomName}
                editNotificationName={editNotificationName}
                setEditNewNotificationId={setEditNewNotificationId}
                setEditNotificationName={setEditNotificationName}
                setEditNotificationText={setEditNotificationText}
                editAlarmTextForRoom={editAlarmTextForRoom }
                editAlarmText={editAlarmText}
                editNotificationText={editNotificationText }
                editCreatedDateTime={editCreatedDateTime}
                editUser={editUser}
                handleNewNotification={handleNewNotification}
                handleEdit={handleEdit}
                handleUpdate={handleUpdate}
            />
            {legalCombo && legalCombo.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <HeaderAssign
                            columns={columns}
                            sorting={sorting}
                            sortTable={sortTable}
                            viewType={viewType}
                            editBarView={editBarView}
                            assignView={assignView}
                            setAssignView={setAssignView}
                            alarmData={alarmData}
                            widescreen={widescreen}                                
                        />
                        <ContentAssign
                            columns={columns}
                            setEdit={setEdit}
                            setEditEntry={setEditEntry}
                            viewType={viewType}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            editBarView={editBarView}
                            assignView={assignView}
                            setAssignView={setAssignView}
                            widescreen={widescreen}
                            legalCombo={legalCombo}
                            siteData={siteData}
                        />
                    </Table>              
                </>
            )
            :
            'Loading...'
            }
        </Fragment >
    )
};
