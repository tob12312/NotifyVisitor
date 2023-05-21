import {
    FaCaretDown,
    FaCaretUp,
} from "react-icons/fa";

/**
 * Table cell definition for sort and filter
 * Set sort order and search/ filter column
 * 
 * @param {any} props
 * @returns
 */
const HeaderCell = ({ column, sorting, sortTable }) => {
    const isDescSorting = sorting.column === column && sorting.order === "desc";
    const isAscSorting = sorting.column === column && sorting.order === "asc";
    const futureSortingOrder = isDescSorting ? 'asc' : 'desc';
    return (
        <th key={column} className="users-table-cell"
            onClick={() => sortTable({ column, order: futureSortingOrder })}>
            {column}
            {isDescSorting && <span><FaCaretDown /></span>}
            {isAscSorting && <span><FaCaretUp /></span>}
        </th>
    )
}
export default HeaderCell