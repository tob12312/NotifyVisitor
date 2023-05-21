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
import AddAlarm from './AddAlarm'
import EditAlarm from './EditAlarm';

/**
 * Main component returned to AppRoutes. CRUDE functionality for Alarm.
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
 * Alarms can be assigned to Rooms so that Visitor to Room gets SMS if Alarm is activated.
 * 
 * A Room can only have one Assignment/ Notification to each Alarm.
 * Each Alarm have a general alarmText, while Notifications are ment to be spesific (optional).
 * SMS to Visitor consists of: "Alarm: " + Alarm.Name + Site.Name + Room.Name + Alarm.AlarmText + Notification.Text.
 * Alarms are triggered by updating the Alarm, setting isActive to 1/ true. Update must be saved.
 * 
 * 
 * @returns Alarm View.
 */
export const AlarmView = () => {

    const maxNameLength = 15;
    const maxAlarmTextLength = 70; // auto text = 20? + alarmText 70 + notification 70

    // Data from DB
    const [alarmData, setAlarmData] = useState([]); // data from server, sort + search

    // View variables, triggers components
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [viewType, setViewType] = useState('Alarm');
    const viewPortBreakpoint = window.innerWidth < 850; // checking viewPort
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);

    // columns mapped to keys = variables = DB_attributes = viewType
    const columns = viewPortBreakpoint || overrideBreakpoint ?
        ["id", "name"] :
        ["id", , "name", "description", "alarmText"];

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

    // Alarm model data
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isActive, setIsActive] = useState(0)
    const [createdDateTime, setCreatedDateTime] = useState('')
    const [user, setUser] = useState('')
    const [alarmText, setAlarmText] = useState('')

    const [editID, setEditId] = useState(0)
    const [editName, setEditName] = useState('')
    const [wasName, setWasName] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editAlarmText, setEditAlarmText] = useState('')
    const [editIsActive, setEditIsActive] = useState(0)
    const [editCreatedDateTime, setEditCreatedDateTime] = useState('')
    const [editUser, setEditUser] = useState('')

    // get with sort and filter
    const urlFetch = `alarm/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    // Function for get all Alarms from DB
    const getData = (urlFetch) => {
        axios.get(urlFetch)
            .then((response) => {
                setAlarmData(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Function for get/ set Alarm model data
    const handleEdit = (id) => {
        handleShow();
        axios.get(`alarm/${id}`)
            .then((result) => {
                setEditName(result.data.data.name);
                setWasName(result.data.data.name);
                setEditDescription(result.data.data.description);
                setEditAlarmText(result.data.data.alarmText);
                setEditIsActive(result.data.data.isActive);
                setEditCreatedDateTime(result.data.data.createdDateTime)
                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
                //   toast.error(error);
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

    // Function for updating Alarm to DB
    const handleUpdate = () => {
        if (wasName !== editName && !checkInputName(editName, maxNameLength, alarmData)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
        if (!checkInputText(editAlarmText, maxAlarmTextLength)) {
            toast.error('AlarmText required, 1 - 70 characters.');
            return;
        }
        const url = `alarm/${editID}`;
        const data = {
            "id": editID,
            "name": editName,
            "description": editDescription,
            "alarmText": editAlarmText,
            "isactive": editIsActive,
            "createdDateTime": editCreatedDateTime,
            "user": editUser,
        }
        // call to server, update Alarm
        axios.put(url, data)
            .then((result) => {     
                handleClose();
                getData(urlFetch);
                clear();
                toast.success('Alarm has been updated');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Update failed!');               
            })
    }

    // Function for deleting Alarm from DB
    // ! Default notification not deleted
    const handleDelete = (editID) => {
        if (window.confirm("Are you sure to delete this alarm?") === true) {
            axios.delete(`alarm/${editID}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Alarm has been deleted');
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

    // Function for adding Alarm and default notification to DB
    const handleSave = () => {
        if (!checkInputName(name, maxNameLength, alarmData)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
        if (!checkInputText(alarmText, maxAlarmTextLength)) {
            toast.error('AlarmText required, 1 - 70 characters.');
            return;
        }
        const urlA = 'alarm';
        const dataA = {
            "name": name,
            "description": description,
            "alarmText": alarmText,
        }
        const urlN = 'notification'; // adding a default notification per alarm.
        const dataN = {
            "name": name + "_default", // default notification name.
            "text": "", // default text is empty string.
        }
        Promise.all([axios.post(urlA, dataA), axios.post(urlN, dataN)])     
            .then((result) => {
                getData(urlFetch);
                clear();
                toast.success('Alarm and default notification has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // clear values
    const clear = () => {
        setName('');
        setDescription('');
        setIsActive('');
        setCreatedDateTime('');
        setUser('');
        setAlarmText('');
        setEditName('');
        setEditDescription('');
        setEditAlarmText('');
        setEditIsActive('');
        setEditCreatedDateTime('');
        setUser('');
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
            <AddAlarm
                editCreateBarView={editCreateBarView}
                handleCloseCreate={handleCloseCreate}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                alarmText={alarmText}
                setAlarmText={setAlarmText}
                handleSave={handleSave}
            />
            <EditAlarm
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                editAlarmText={editAlarmText}
                editName={editName}
                editIsActive={editIsActive}
                editDescription={editDescription}
                editCreatedDateTime={editCreatedDateTime}
                editUser={editUser}
                setEditAlarmText={setEditAlarmText}
                setEditDescription={setEditDescription}
                setEditIsActive={setEditIsActive}
                setEditName={setEditName}
                handleEdit={handleEdit}
                handleUpdate={handleUpdate}
            />
            {alarmData && alarmData.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <Header
                            columns={columns}
                            sorting={sorting}
                            sortTable={sortTable}
                            editBarView={editBarView}
                            viewType={viewType}
                        />
                        <Content
                            entries={alarmData}
                            columns={columns}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            editBarView={editBarView}   
                            viewType={viewType}
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
