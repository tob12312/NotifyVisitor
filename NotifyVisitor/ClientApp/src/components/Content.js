
import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import 'react-toastify/dist/ReactToastify.css';

import CheckAlarm from './CheckAlarm';
import {
    FaPencilAlt,
    FaTrashAlt,
    FaRegBellSlash,
    FaRegBell,
} from "react-icons/fa";

const URL = "https://localhost:44434/update-user-location/?id=$";

/**
 * Component for returning Table content. Used for multiple Entities.
 * Adapts to model data and window size from caller.
 * Renders with or without action columns edit/ delete/ select
 * 
 * Calls functions handleEdit and handleDelete
 * 
 * @param {any} props
 * @returns
 */
const Content = (props) => {

    // Function to find Site name
    const findSiteName = (siteId) => {
        const siteIndex = (e) => e.id === siteId; // find index by Site name match
        return props.siteData[props.siteData.findIndex(siteIndex)].name // return Site Name from index 
    }

    // Function for selecting rooms to Qr code views. Adds/ Removes Room name and QR URL.
    const selectRooms = (entry) => {
        props.setCheckedName(entry.name);
        props.setQrCode(URL + entry.id)
        if (!props.listCheckedName.includes(entry.name)) {
            props.listCheckedName.unshift(entry.name);
            props.listQrCode.unshift(URL + entry.id);
        } else {
            props.listCheckedName.splice(props.listCheckedName.indexOf(entry.name), 1);
            props.listQrCode.splice(props.listQrCode.indexOf(URL + entry.id), 1);
        }
    }

    return props.editBarView ? (
        <tbody>
            {props.entries.map(entry => (
                <tr key={entry.id}>
                    {props.columns.map(column => (
                        <td key={column}
                            className="users-table-cell"
                        >{column === 'createdDateTime' || column === 'registeredDateTime' ?
                            entry[column].substring(0, 19) : entry[column]}
                        </td>
                    ))}
                    {props.viewType === 'Alarm' &&
                        <td className="users-table-cell"
                            style={{ fontWeight: 'bold' }}>
                            {entry.isActive === 1 ? (
                                <Button
                                    style={{ backgroundColor: '#de7878' }}>
                                    <FaRegBell />
                                </Button>
                            ) : (
                                <button className="btn btn-secondary">
                                    <FaRegBellSlash />
                                </button>
                            )}
                        </td>
                    }
                    <td className="users-table-cell">
                        <Button className="btn btn-danger"                      
                            onClick={() => props.handleDelete(entry.id)
                            }>
                            <FaTrashAlt />
                        </Button>
                    </td>
                    <td className="users-table-cell">
                        <Button className="btn btn-success"
                            onClick={() => props.handleEdit(entry.id)}>
                            <FaPencilAlt />
                        </Button>
                    </td>
                    {props.viewType === 'Room' && 
                        <td className="users-table-cell">
                            <CheckAlarm
                                selectRooms={selectRooms}
                                entry={entry}                                
                                checkAll={props.checkAll}        
                            />
                        </td>
                    }
                </tr>
            ))}
        </tbody>
    ) : (
        <tbody>
            {props.entries.map(entry => (
                <tr key={entry.id}>
                    {props.columns.map(column => (
                        <td key={column}
                            className="users-table-cell"
                        >{column === 'createdDateTime' || column === 'registeredDateTime' ?
                            entry[column].substring(0, 19) : entry[column]}
                        </td>
                    ))}
                    {props.viewType === 'Alarm' &&
                        <td className="users-table-cell"
                            style={{ fontWeight: 'bold' }}>
                            {entry.isActive === 1 ? (
                                <Button
                                    style={{ backgroundColor: '#de7878' }}>
                                    <FaRegBell />
                                </Button>
                            ) : (
                                <button className="btn btn-secondary">
                                    <FaRegBellSlash />
                                </button>
                            )}
                        </td>
                    }
                    {props.viewType === 'Room' &&
                        <td className="users-table-cell">
                            {findSiteName(entry.siteId)}
                        </td>
                    }
                </tr>
            ))}
        </tbody>
    )
};
export default Content