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

/**
 * Main component returned to AppRoutes. CRUDE functionality for VisitorHistory.
 * VisitorHistory is a Entity containing hitorical rows for Visitors.
 * All Visitors are saved to VisitorHistory when added to DB,
 * and when Visitor scan new QR code (changes Room). Cookie telephoneNumber and Room Id
 * uses as identifiers.
 * 
 * Only for displaying data stored in DB (get with sort/ search/ filter).
 * 
 * Uses Axios to communicate with backend API.
 * Collections from DB stored in Arrays.
 * Table element are defined from model data and window size.
 * 
 * Uses shared components to render User GUI, passing model data. 
 * 
 * View is responsive. Refreshes data on window resize (100ms delay).
 * 
 * 
 * @returns VisitorHistory View.
 */
export const VisitorHistoryView = () => {

    // Data from DB
    const [visitorData, setVisitorData] = useState([]); // data from server, sort + search

    // View variables, triggers components
    const [searchBarView, setSearchBarView] = useState(false);
    const [editBarView, setEditBarView] = useState(false);
    const [editCreateBarView, setEditCreateBarView] = useState(false);
    const [viewType, setViewType] = useState('Visitor History');
    const viewPortBreakpoint = window.innerWidth < 850; // checking viewPort
    const [overrideBreakpoint, setOverrideBreakpoint] = useState(false);

    // columns mapped to keys = variables = DB_attributes = viewType
    const columns = viewPortBreakpoint || overrideBreakpoint ?
        ["id", "registeredDateTime", "visitorId"] :
        ["id", "registeredDateTime", "visitorId", "rvId", "telephone"];

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

    // get with sort and filter
    const urlFetch = `visitor/visitorHistory?sortColumn=${sorting
        .column}&sortOrder=${sorting.order}&searchString=${searchValue}&searchColumn=${searchBy}`;

    // Function for get all Alarms from DB
    const getData = (urlFetch) => {
        axios.get(urlFetch)
            .then((response) => {
                setVisitorData(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
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
