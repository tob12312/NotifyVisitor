import { Fragment, useEffect, useState } from "react";
import '../styling/NotifyVisitorApp.css';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MenuBar from './MenuBar';
import SearchBar from './SearchBar';
import Header from './Header';
import Content from './Content';
import AddNotification from './AddNotification'
import EditNotification from './EditNotification'

/**
 * Main component returned to AppRoutes. CRUDE functionality for Notification.
 * 
 * Uses Axios to communicate with backend API.
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
 * A Notification is a text attachment that is included in the Alarm SMS as an option.
 * Notifications can be aimed at each Site/ Room/ Floor/ Building, and can be edited by User.
 * SMS to Visitor consists of: "Alarm: " + Alarm.Name + Site.Name + Room.Name + Alarm.AlarmText + Notification.Text.
 * 
 * A default Notification with empty Text is created for each new Alarm (<alarmName>_default).
 * Notifications can also be added and updated from view AssignAlarmView
 * 
 * @returns Notification View.
 */
export const NotificationView = () => {

    const maxNameLength = 25;
    const maxAlarmTextLength = 70; // auto text = 20? + alarmText 70 + notification 70
    // Data from DB
    const [notificationData, setNotificationData] = useState([]); // data from server, sort + search

    // View variables, triggers action 
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [viewType, setViewType] = useState('Notification');
    const viewPortBreakpoint = window.innerWidth < 850; // checking viewPort
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);
    // columns mapped to keys = variables = DB_attributes = viewType
    const columns = viewPortBreakpoint || overrideBreakpoint ?
        ["id", "name"] :
        ["id", "name", "text"];

    // Sort and filter table
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

    // Notification model data
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [createdDateTime, setCreatedDateTime] = useState('')
    const [user, setUser] = useState('')

    const [editID, setEditId] = useState(0)
    const [editName, setEditName] = useState('')
    const [wasName, setWasName] = useState('')
    const [editText, setEditText] = useState(0)
    const [editCreatedDateTime, setEditCreatedDateTime] = useState('')
    const [editUser, setEditUser] = useState('')

    // get notifications sort / filter
    const urlFetch = `notification/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;


    // Function for get all notification data
    const getData = (urlFetch) => {
        axios.get(urlFetch)
            .then((response) => {
                setNotificationData(response.data.data)
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

    // Function for get / set Notification values
    const handleEdit = (id) => {
        handleShow();
        axios.get(`notification/${id}`)
            .then((result) => {
                setEditName(result.data.data.name);
                setWasName(result.data.data.name);
                setEditText(result.data.data.text);   
                setEditCreatedDateTime(result.data.data.createdDateTime)
                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
                toast.error('Notification not found');
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

    // Function for updating Notification to DB
    const handleUpdate = () => {
        if (wasName !== editName && !checkInputName(editName, maxNameLength, notificationData)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
        if (!checkInputText(editText, maxAlarmTextLength)) {
            toast.error('Notification text required, 1 - 70 characters.');
            return;
        }
        const url = `notification/${editID}`;
        const data = {
            "id": editID,
            "name": editName,
            "text": editText,
            "createdDateTime": editCreatedDateTime,
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData(urlFetch);
                clear();
                toast.success('Notification has been updated');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Update failed!');  
            })
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this notification?") == true) {
            axios.delete(`notification/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Notification has been deleted');
                        getData(urlFetch);
                    }
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        toast.error('You are not authorized for this action. Role SiteAdmin required.')
                    } else toast.error('Delete failed!');  
                })
        }
    }

    // Function for adding Notification to DB
    const handleSave = () => {
        if (!checkInputName(name, maxNameLength, notificationData)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
        if (!checkInputText(text, maxAlarmTextLength)) {
            toast.error('Notification text required, 1 - 70 characters.');
            return;
        }
        const url = 'notification';
        const data = {
            "name": name,
            "text": text,
        }
        axios.post(url, data)
            .then((result) => {
                getData(urlFetch);
                clear();
                toast.success('Notification has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // clear values
    const clear = () => {
        setName('');
        setText('');
        setCreatedDateTime('');
        setEditName('');
        setEditText('');
        setEditCreatedDateTime('');
        setEditId('');
    }

    // Rendering. Re-render on sort/ filter / window size (with delay)
    useEffect(() => {
        getData(urlFetch);
        const handleResize = () => {
            // Update data from DB after window resize
            getData(urlFetch);
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
                overrideBreakpoint={overrideBreakpoint}
                setOverrideBreakpoint={setOverrideBreakpoint}
            />
            {searchBarView && < SearchBar
                searchTable={searchTable}
                columns={columns}
            />}
            <AddNotification
                editCreateBarView={editCreateBarView}
                handleCloseCreate={handleCloseCreate}
                name={name}
                setName={setName}
                text={text}
                setText={setText}
                handleSave={handleSave}
            />
            <EditNotification
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                editText={editText}
                editName={editName}
                editCreatedDateTime={editCreatedDateTime}
                editUser={editUser}
                setEditText={setEditText}
                setEditName={setEditName}
                handleEdit={handleEdit}
                handleUpdate={handleUpdate}
            />
            {notificationData && notificationData.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <Header
                            columns={columns}
                            sorting={sorting}
                            sortTable={sortTable}
                            editBarView={editBarView}
                        />
                        <Content
                            entries={notificationData}
                            columns={columns}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            editBarView={editBarView}
                        />
                    </Table>
                </>
            )
            :
            'Loading...'
            }
        </Fragment>
    )
};
