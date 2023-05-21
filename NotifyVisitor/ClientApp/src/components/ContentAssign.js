import '../styling/NotifyVisitorApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import 'react-toastify/dist/ReactToastify.css';

import {
    FaPencilAlt,
    FaTrashAlt,
} from "react-icons/fa";

/**
 * Component for returning Table content. Used for Entity Assign.
 * Adapts to model data and window size from caller.
 * Renders with or without action columns edit/ delete.
 * 
 * Calls functions handleEdit and handleDelete
 * 
 * @param {any} props
 * @returns
 */
const ContentAssign = (props) => {

    const findSiteName = (siteId) => {
        const siteIndex = (e) => e.id === siteId; // find index by Site name match
        return props.siteData[props.siteData.findIndex(siteIndex)].name // return Site Name from index 
    }
    
    return props.editBarView ? (
        <tbody>
            {props.legalCombo.map(entry => (
                <tr key={entry.roomId + 'a' + entry.alarmId + 'n' + entry.notificationId}>
                    <td>{entry.room.siteId}</td>
                    {!props.widescreen &&
                        <>
                            <td>
                                {findSiteName(entry.room.siteId)}
                            </td>
                        </>
                    }
                    <td>{entry.room.name}</td>
                    {!props.widescreen &&
                        <>
                            <td className="users-table-cell" >
                                {entry.alarm.name}
                            </td>    
                        </>
                    }
                    <td>{entry.alarm.alarmText}</td>
                    {!props.widescreen &&
                        <>              
                            <td className="users-table-cell">
                                {entry.notification.text}
                            </td>
                        </>
                    }
                    <td className="users-table-cell">
                        <Button className="btn btn-danger"  
                            onClick={() =>
                                props.handleDelete(entry.roomId, entry.alarmId, entry.notificationId)}>
                            <FaTrashAlt />
                        </Button>
                    </td>
                    <td className="users-table-cell">
                        <Button className="btn btn-success"
                            onClick={() =>
                                props.handleEdit(entry.roomId, entry.alarmId, entry.notificationId)}>
                            <FaPencilAlt />
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
    ) : (
        <tbody >
            {props.legalCombo.map(entry => (
                <tr key={entry.roomId + 'a' + entry.alarmId + 'n' + entry.notificationId}>
                    <td>{entry.room.siteId}</td>
                    {!props.widescreen &&
                        <>
                            <td>
                                {findSiteName(entry.room.siteId)}
                            </td>
                        </>
                    }
                    <td>{entry.room.name}</td>
                    {!props.widescreen &&
                        <>
                            <td className="users-table-cell" >
                                {entry.alarm.name}
                            </td>             
                        </>
                    }
                    <td >{entry.alarm.alarmText}</td>
                    {!props.widescreen &&
                        <>
                            <td className="users-table-cell">
                                {entry.notification.text}
                            </td>
                        </>
                    }
                </tr>
                ))
            }
        </tbody >
    )
};
export default ContentAssign