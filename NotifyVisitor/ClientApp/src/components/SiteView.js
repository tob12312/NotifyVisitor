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
import AddSite from './AddSite';
import EditSite from './EditSite';

/**
 * Main component returned to AppRoutes. CRUDE functionality for Site.
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
 * @returns Site View.
 */
export const SiteView = () => {

    const maxNameLength = 15;
    // Data from DB
    const [siteData, setSiteData] = useState([]); // data from server, sort + search

    // View variables, triggers action components
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [viewType, setViewType] = useState('Site');
    const viewPortBreakpoint = window.innerWidth < 850; // checking viewPort
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);
    // columns mapped to keys = variables = DB_attributes = viewType
    const columns = viewPortBreakpoint || overrideBreakpoint ?
        ["id", "name"] :
        ["id", "name"];

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

    // Site model data
    const [name, setName] = useState('')
    const [createdDateTime, setCreatedDateTime] = useState('')
    const [user, setUser] = useState('')

    const [editID, setEditId] = useState(0)
    const [editName, setEditName] = useState('')
    const [wasName, setWasName] = useState('')
    const [editCreatedDateTime, setEditCreatedDateTime] = useState('')
    const [editUser, setEditUser] = useState('')

    // get Sites sort and filter
    const urlFetch = `site/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    // get all Site data
    const getData = (urlFetch) => {
        axios.get(urlFetch)
            .then((response) => {
                setSiteData(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Function for get / set Site values
    const handleEdit = (id) => {
        handleShow();
        axios.get(`site/${id}`)
            .then((result) => {
                setEditName(result.data.data.name);
                setWasName(result.data.data.name);
                setEditCreatedDateTime(result.data.data.createdDateTime)
                setEditUser(result.data.data.user)
                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
                toast.error('Site not found.');
            })
    }

    // Helper function input from user.
    // Name cannot be empty, duplicate, or to many chars
    const checkInputName = (inputName, length, namelist) => {
        return inputName !== '' && inputName.length <= length && !namelist.some(e => e.name === inputName);
    }

    // Function for updating Site to DB
    const handleUpdate = () => {
        if (wasName !== editName && !checkInputName(editName, maxNameLength, siteData)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
        const url = `site/${editID}`;
        const data = {
            "id": editID,
            "name": editName,
            "createdDateTime": editCreatedDateTime,
            "user": editUser,
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData(urlFetch);
                clear();
                toast.success('Site has been updated');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Update failed!');  
            })
    }

    // Function for deleting Site from DB
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this site?") === true) {
            axios.delete(`site/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Site has been deleted');
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

    // Function for adding Site to DB
    const handleSave = () => {
        if (!checkInputName(name, maxNameLength, siteData)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
        const url = 'site';
        const data = {
            "name": name,
            "user": user,
        }
        axios.post(url, data)
            .then((result) => {
                getData(urlFetch);
                clear();
                toast.success('Site has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // clear values
    const clear = () => {
        setName('');
        setCreatedDateTime('');
        setUser('');
        setEditName('');
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
            <AddSite
                editCreateBarView={editCreateBarView}
                handleCloseCreate={handleCloseCreate}
                name={name}
                setName={setName}
                handleSave={handleSave}
            />
            <EditSite
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                editName={editName}
                editCreatedDateTime={editCreatedDateTime}
                editUser={editUser}
                setEditName={setEditName}
                handleEdit={handleEdit}
                handleUpdate={handleUpdate}
            />
            {siteData && siteData.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <Header
                            columns={columns}
                            sorting={sorting}
                            sortTable={sortTable}
                            editBarView={editBarView}
                        />
                        <Content
                            entries={siteData}
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
