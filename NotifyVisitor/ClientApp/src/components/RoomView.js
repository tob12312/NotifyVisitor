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
import AddRoom from './AddRoom';
import EditRoom from './EditRoom';

import { QrScreen } from './QrScreen';
import { QrListScreen } from './QrListScreen';

/**
 * Main component returned to AppRoutes. CRUDE functionality for Room.
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
 * Rooms belongs to a Site. User can select or create Site when creating Rooms.
 * User can select QR codes and display on screen or generate PDF.
 * 
 * 
 * @returns Room View.
 */
export const RoomView = () => {

    const maxNameLength = 15;

    const [roomData, setRoomData] = useState([]); // data from server, sort + search

    const [sorting, setSorting] = useState({ column: 'id', order: 'asc' });
    const [searchValue, setSearchValue] = useState("");  // the columns to be displayed (adapt to view):
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [qrScreenView, setQrScreenView] = useState(false);
    const [qrListScreenView, setQrListScreenView] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [printToPdf, setPrintToPdf] = useState(false);
    const [checkedName, setCheckedName] = useState('');
    const [listCheckedName, setListCheckedName] = useState([]);
    const [qrCode, setQrCode] = useState("");
    const [listQrCode, setListQrCode] = useState([]);


    const changeQrCode = (newQrCode) => { setQrCode(newQrCode) };
    const [addLogOutQr, setAddLogOutQr] = useState(false);

    const [viewType, setViewType] = useState('Room');
    const viewPortBreakpoint = window.innerWidth < 850; // variable column count
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);
    //  const [changeColumns, setChangeColumns] = useState(false)

    const columns = viewPortBreakpoint || overrideBreakpoint ?
        ["id", "name"] :
        ["id", "name", "floor", "building", "siteId"];


    const [searchBy, setSearchBy] = useState('id'); // search keys
    const sortTable = (newSorting) => { // variable for server sorting
        setSorting(newSorting);
    }
    const searchTable = (newSearchValue, searchFor) => { // variables for server search, column and value
        setSearchBy(searchFor);
        setSearchValue(newSearchValue);
    }

    // unsorted data from server
    const [siteData, setSiteData] = useState([]);

    // triggers modals - edit/ create
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleCloseCreate = () => {
        setEditCreateBarView(false);
        clear();
    }
    const handleShow = () => setShow(true);

    // Room model data
    const [name, setName] = useState('')
    const [floor, setFloor] = useState('')
    const [building, setBuilding] = useState('')
    const [site, setSite] = useState(0)
    const [user, setUser] = useState('')
    const [editID, setEditId] = useState(0)
    const [editName, setEditName] = useState('')
    const [wasName, setWasName] = useState('')
    const [editFloor, setEditFloor] = useState('')
    const [editBuilding, setEditBuilding] = useState('')
    const [editSite, setEditSite] = useState('')
    const [editSiteName, setEditSiteName] = useState('')

    const [editCreatedDateTime, setEditCreatedDateTime] = useState('')
    const [editUser, setEditUser] = useState('')
    const [siteId, setSiteId] = useState(0)
    const [siteName, setSiteName] = useState('')

    // URL for get all with search and sort
    const urlFetch = `room/?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    // API calls 
    const getData = (urlFetch) => {
        Promise.all([axios.get(urlFetch), axios.get(`site/getAll`)])        
            .then((response) => {
                setRoomData(response[0].data.data)
                setSiteData(response[1].data.data)
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

    /**
     * 
     * Function handleEdit finds correct Room in DB
     * Set Room values
     * @param {any} id
     */
    const handleEdit = (id) => {
        handleShow();
        axios.get(`room/${id}`)
            .then((result) => {
                // data from Room DB tabel:                                                                              
                setEditName(result.data.data.name); 
                setWasName(result.data.data.name); 
                setEditFloor(result.data.data.floor);
                setEditBuilding(result.data.data.building);
                setEditSite(result.data.data.siteId)
                setEditCreatedDateTime(result.data.data.createdDateTime)
                setEditId(id);
                // find Site name from index of Site id:
                const siteIndex = (e) => e.id === result.data.data.siteId; // find index by Site id match
                setEditSiteName(siteData[siteData.findIndex(siteIndex)].name) // get Site name from index
            })
            .catch((error) => {
                console.log(error)
                toast.error('Room not found');
            })
    }

    // Helper function.
    // Name cannot be empty, duplicate, or to many chars
    // Duplicate Room names allowed across Site
    const checkInputName = (inputName, length, namelist, sId) => {
        return inputName !== '' && inputName.length <= length &&
            !namelist.some(e => e.name === inputName && e.siteId === sId);
    }

    // Function for updating room in DB
    const handleUpdate = () => {
        if (wasName !== editName && !checkInputName(editName, maxNameLength, roomData, editSite)) {
            toast.error('Unique Room names per Site required, 1 - 15 characters.');
            return;
        }
        const url = `room/${editID}`;
        const data = {
            "id": editID,
            "name": editName,
            "floor": editFloor,
            "building": editBuilding,
            "siteId": editSite,
            "createdDateTime": editCreatedDateTime,
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData(urlFetch);
                clear();
                toast.success('Room has been updated');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Update failed!');  
            })
    }

    // Function for deleting room from DB
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this room?") == true) {
            axios.delete(`api/room/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Room has been deleted');
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

    // post new Room / Site to DB
    // If new site, create site and room
    // Else create room.
    const handleSave = () => {
        if (siteName != '' && siteData.some(e => e.name === siteName)) {
            handleSaveRoom();
        } else handleSaveSite();            
    }

    // post new Room to API
    const handleSaveRoom = () => {
        const siteIndex = (e) => e.name === siteName; // find index by Site name match
        if (!checkInputName(name, maxNameLength, roomData, siteData[siteData.findIndex(siteIndex)].id)) {
            toast.error('Unique name required, 1 - 15 characters.');
            return;
        }
       
        const urlR = 'room';
        const dataR = {
            "name": name,
            "floor": floor,
            "building": building,
            "siteId": siteData[siteData.findIndex(siteIndex)].id // get Site id from index
        }
        axios.post(urlR, dataR)
            .then((res) => {
                getData(urlFetch);
                clear();
                toast.success('Room has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }

    // post new Site and Room to API
    const handleSaveSite = () => {
        if (!checkInputName(siteName, maxNameLength, siteData)) {
            toast.error('Unique siteName required, 1 - 15 characters.');
            return;
        }
        if (!checkInputName(name, maxNameLength, roomData)) {
            toast.error('Unique roomName required, 1 - 15 characters.');
            return;
        }
        const urlS = 'site';
        const dataS = {
            "name": siteName, // new site created
        }
        axios.post(urlS, dataS)
            .then((res) => {    
                // site saved, now room:
                const urlR = 'room';
                const dataR = {
                    "name": name,
                    "floor": floor,
                    "building": building,
                    "siteId": res.data.data[res.data.data.length - 1].id, // new site id
                }
                axios.post(urlR, dataR)
                    .then((res) => {
                        getData(urlFetch);
                        toast.success('Room has been added');
                    }).catch((error) => {
                        if (error.response.status === 403) {
                            toast.error('You are not authorized for this action. Role SiteAdmin required.')
                        } else toast.error('Save failed!');  
                    })   
                clear();
                toast.success('Site has been added');
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error('You are not authorized for this action. Role SiteAdmin required.')
                } else toast.error('Save failed!');  
            })
    }      
    
    // clear input fields
    const clear = () => {
        setName('');
        setFloor('');
        setBuilding('');
        setSite('');
        setUser('');
        setEditName('');
        setEditFloor('');
        setEditSite('');
        setEditBuilding('');
        setEditCreatedDateTime('');
        setEditUser('');
        setEditId('');
        setSiteName('');
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
    }, [sorting, searchValue, checkAll]) // sort order and search -> new mount

    // returning components and input fields
    return (

        qrScreenView ? (
            <><QrScreen checkAll={checkAll} checkedName={checkedName} qrCode={qrCode} /></>
        ) : (
            qrListScreenView ? (
                listCheckedName.map((name, index) => {
                    return (
                        <QrListScreen key={name} checkAll={checkAll} listCheckedName={name} listQrCode={listQrCode[index]}/>
                    )
                }
            )
        )
        :
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
                setCheckAll={setCheckAll}
                setCheckedName={setCheckedName}
                checkedName={checkedName}
                listCheckedName={listCheckedName}
                qrCode={qrCode}
                setQrCode={setQrCode}
                listQrCode={listQrCode}
                setPrintToPdf={setPrintToPdf}
                setQrScreenView={setQrScreenView}
                setQrListScreenView={setQrListScreenView}
                setAddLogOutQr={setAddLogOutQr}
            />
            {searchBarView && < SearchBar
                searchTable={searchTable}
                columns={columns}
            />}
            <AddRoom
                editCreateBarView={editCreateBarView}
                handleCloseCreate={handleCloseCreate}
                siteName={siteName}
                setSiteName={setSiteName}
                siteData={siteData}
                siteName={siteName}
                site={site}
                setSite={setSite}
                name={name}
                floor={floor}
                building={building}
                setName={setName}
                setFloor={setFloor}
                setBuilding={setBuilding}
                handleSave={handleSave}
            /> 
            <EditRoom
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                editName={editName}
                setEditName={setEditName}
                editFloor={editFloor}
                editBuilding={editBuilding}
                setEditFloor={setEditFloor}
                setEditBuilding={setEditBuilding}
                editSite={editSite}
                setEditSite={setEditSite}
                editSiteName={editSiteName}
                setEditSiteName={setEditSiteName}
                siteData={siteData}
                editCreatedDateTime={editCreatedDateTime}
                editUser={editUser}
                handleEdit={handleEdit}
                handleUpdate={handleUpdate}
                editID={editID}
            />
            {roomData && roomData.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <Header
                            entries={roomData}
                            columns={columns}
                            sorting={sorting}
                            sortTable={sortTable}
                            viewType={viewType}
                            editBarView={editBarView}
                            checkAll={checkAll}
                            setCheckAll={setCheckAll}
                            listCheckedName={listCheckedName}
                            setListCheckedName={setListCheckedName}
                            listQrCode={listQrCode}
                            setListQrCode={setListQrCode}
                        />
                        <Content
                            entries={roomData}
                            columns={columns}
                            viewType={viewType}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            editBarView={editBarView}
                            checkAll={checkAll}
                            setCheckAll={setCheckAll}
                            checkedName={checkedName}
                            setCheckedName={setCheckedName}
                            changeQrCode={changeQrCode}
                            setListCheckedName={setListCheckedName}
                            listCheckedName={listCheckedName}
                            qrCode={qrCode}
                            setQrCode={setQrCode}
                            setListQrCode={setListQrCode}
                            listQrCode={listQrCode}
                            addLogOutQr={addLogOutQr}
                            setAddLogOutQr={setAddLogOutQr}
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
    )
};
