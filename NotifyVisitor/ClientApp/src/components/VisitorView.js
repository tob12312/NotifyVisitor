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
import AddVisitor from './AddVisitor';
import EditVisitor from './EditVisitor';

/**
 * Main component returned to AppRoutes. CRUDE functionality for Visitor.
 * 
 * Visitors can also scan QR code to register.
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
 * @returns Visitor View.
 */
export const VisitorView = () => {
    // Data from DB
    const [visitorData, setVisitorData] = useState([]); // data from server, sort + search

    // View variables
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [viewType, setViewType] = useState('Visitor');
    const viewPortBreakpoint = window.innerWidth < 850; // checking viewPort
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);
    // columns mapped to keys = variables = DB_attributes = viewType
    const columns = viewPortBreakpoint || overrideBreakpoint ?
        ["id", "rvId", "telephone"] :
        ["id", "rvId", "telephone", "registeredDateTime"];

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

    // triggers modals, edit and create
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseCreate = () => {
        setEditCreateBarView(false);
        clear();
    }

    // Visitor model data
    const [telephone, setTelephone] = useState('')
    const [registeredDateTime, setRegisteredDateTime] = useState('')
    const [user, setUser] = useState('')

    const [editID, setEditId] = useState(0)
    const [editTelephone, setEditTelephone] = useState('')
    const [editRegisteredDateTime, setEditRegisteredDateTime] = useState('')
    const [editUser, setEditUser] = useState('')

    // Room model data
    const [roomData, setRoomData] = useState([]);
    const [roomId, setRoomId] = useState(0);
    const [roomName, setRoomName] = useState('');

    const [editRoomId, setEditRoomId] = useState(0);
    const [editRoomName, setEditRoomName] = useState('');

    // get Visitors and Rooms sort and filter
    const urlFetch = `visitor/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    const urlRoom = `room/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    // Function for get all Visitor and Room data
    const getData = (urlFetch) => {
        Promise.all([
            axios.get(urlFetch), 
            axios.get(urlRoom), 
        ])
            .then((response) => {
                setVisitorData(response[0].data.data)    // All Visitors
                setRoomData(response[1].data.data) // All Rooms
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Function for get / set Visitor values
    const handleEdit = (id, rvid) => {
        handleShow();          
        axios.get(`visitor/${id}`)       
            .then((result) => {
                setEditRoomId(result.data.data.rvId);
                setEditTelephone(result.data.data.telephone);
                setEditRegisteredDateTime(result.data.data.registeredDateTime)
                setRoomId(result.data.data.rvId); // This ... Room Id
                setEditId(id);
                // find Room name from index of Room id (rvId):
                const roomIndex = (e) => e.id === result.data.data.rvId; // find index by Room id match
                setEditRoomName(roomData[roomData.findIndex(roomIndex)].name) // get Room name from index
            })
            .catch((error) => {
                console.log(error)
                toast.error('Visitor not found');
            })
    }

    // Function for updating Visitor to DB
    const handleUpdate = () => {
        const url = `visitor/${editID}`;
        const data = {
            "id": editID,
            "rvId": editRoomId,
            "telephone": editTelephone,
       //     "registeredDateTime": editRegisteredDateTime,
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData(urlFetch);
                clear();
                toast.success('Visitor has been updated');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Update failed!');  
            })
    }

    // Function for deleting Visitor from DB
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this visitor?") == true) {
            axios.delete(`visitor/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Visitor has been deleted');
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

    // Function for adding Visitor to DB
    const handleSave = () => {
        const url = 'visitor';
        const data = {
            "rvid": roomId,
            "telephone": telephone,
        }
        axios.post(url, data)
            .then((result) => {
                getData(urlFetch);
                clear();
                toast.success('Visitor has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // clear values
    const clear = () => {
        setEditRoomName('');
        setEditRoomId('')
        setTelephone('');
        setRegisteredDateTime('');
        setRoomName('');
        setEditRoomName('');
        setEditTelephone('');
        setEditRegisteredDateTime('');
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
            <ToastContainer position="bottom-right"/>
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
            <AddVisitor
                editCreateBarView={editCreateBarView}
                handleCloseCreate={handleCloseCreate}
                setRoomId={setRoomId}
                roomName={roomName}
                setRoomName={setRoomName}
                roomData={roomData}
                telephone={telephone}
                setTelephone={setTelephone}
                handleSave={handleSave}
            />
            <EditVisitor
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                roomData={roomData}
                editRoomName={editRoomName}
                editID={editID}
                editTelephone={editTelephone}
                setEditTelephone={setEditTelephone}
                setEditRoomId={setEditRoomId}
                setEditRoomName={setEditRoomName}
                editRegisteredDateTime={editRegisteredDateTime}
                editUser={editUser}
                handleEdit={handleEdit}
                handleUpdate={handleUpdate}
            />
            {visitorData && visitorData.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <Header
                            columns={columns}
                            sorting={sorting}
                            sortTable={sortTable}
                            editBarView={editBarView}
                        />
                        <Content
                            entries={visitorData}
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
