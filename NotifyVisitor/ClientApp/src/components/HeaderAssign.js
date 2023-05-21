import HeaderCell from './HeaderCell';

/**
 * Table header for Entity AssignAlarm.
 * Adapts to model data and window size from caller.
 * Renders with or without action columns edit/ delete.
 * 
 * @param {any} props
 * @returns
 */
const HeaderAssign = (props) => {

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
                <th>delete</th>
                <th>edit</th>
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
            </tr>
        </thead>
    )
}
export default HeaderAssign