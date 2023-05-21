import '../styling/NotifyVisitorApp.css';
import HeaderCell from './HeaderCell';
import Row from 'react-bootstrap/Row';
import {
    FaCheck
} from "react-icons/fa";

/**
 * Table header for multiple Entities.
 * Adapts to model data and window size from caller.
 * Renders with or without action columns edit/ delete/ select
 * 
 * @param {any} props
 * @returns
 */
const Header = (props) => {

    // Function for checking/ unchecking all QR codes
    const handleCheckAll = () => {
        if (props.checkAll) {
            props.setCheckAll(false);
            props.setListCheckedName([]);
            props.setListQrCode([]);
            window.location.reload(false)
        }
        else {
            props.setCheckAll(true);
            for (let i = 0; i < props.entries.length; i++) {
                if (!props.listCheckedName.includes(props.entries[i].name)) {
                    props.listCheckedName.unshift(props.entries[i].name);
                    props.listQrCode.unshift(URL + props.entries[i].id);
                }
            }
        }
    }

    return props.editBarView ? (

        <thead className="users-table-cell">
            <tr>
                {props.columns.map((column) => (
                    <HeaderCell
                        key={column}
                        column={column}
                        sorting={props.sorting}
                        sortTable={props.sortTable}
                    />
                ))}

                {props.viewType === 'Alarm' &&
                    <td className="users-table-cell"
                        style={{ fontWeight: 'bold' }}
                        >status
                    </td>}
                <td className="users-table-cell"
                    style={{ fontWeight: 'bold' }}
                >delete
                </td>
                <td className="users-table-cell"
                    style={{ fontWeight: 'bold' }}
                >edit
                </td>
                {props.viewType === 'Room' && 
                    <td className="users-table-cell"
                        style={{ fontWeight: 'bold' }}
                        onClick={() => handleCheckAll()}
                    >{props.checkAll && <Row><FaCheck /></Row>}select
                    </td>
                }
            </tr>
        </thead>
    ) : (
        <thead className="users-table-cell">
            <tr>
                {props.columns.map((column) => (
                    <HeaderCell
                        key={column}
                        column={column}
                        sorting={props.sorting}
                        sortTable={props.sortTable}
                    />
                ))}
                {props.viewType === 'Alarm' &&
                    <td className="users-table-cell"
                        style={{ fontWeight: 'bold' }}
                    >status
                    </td>}
                {props.viewType === 'Room' &&
                    <td className="users-table-cell"
                        style={{ fontWeight: 'bold' }}
                    >site
                    </td>
                }
            </tr>
        </thead>
    )
}
export default Header