import { useState } from "react";
import '../styling/NotifyVisitorApp.css';
import {
    FaToggleOff,
    FaToggleOn,
} from "react-icons/fa";
import {
    Button,
} from "reactstrap";

/**
 * Component for checking rows. Used to select QR codes.
 *  
 * @param {any} props
 * @returns
 */
const CheckAlarm = (props) => {

    const [checked, setChecked] = useState(false)
    const handleChange = () => {
        setChecked(!checked);
        props.selectRooms(props.entry)
    }

    return (
        <>
            {checked || props.checkAll ? (
                <Button color="success"
                    onClick={
                        !props.checkAll ? handleChange : null}>
                    <FaToggleOn />
                </Button>
            ) : (
                <Button color="secondary"
                    onClick={!props.checkAll ? handleChange : null}>
                    <FaToggleOff />
                </Button>
            )}
        </>
    )
}
export default CheckAlarm