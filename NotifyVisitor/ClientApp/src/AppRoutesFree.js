
import { Home } from "./components/Home";
import { RoomView } from "./components/RoomView";
import { NotificationView } from "./components/NotificationView";
import { AlarmView } from "./components/AlarmView";
import { TriggeredAlarmView } from "./components/TriggeredAlarmView";
import { VisitorView } from "./components/VisitorView";
import { SiteView } from "./components/SiteView";
import { QrScreen } from "./components/QrScreen";
import { AssignView } from "./components/AssignView";
import { UserRegisteredVisitor } from "./components/UserRegisteredVisitor"
import { UpdateUserLocation } from "./components/UpdateUserLocation"
import { VisitorHistoryView } from "./components/VisitorHistoryView";

/**
 * Internal routes AdminApp
 */
const AppRoutesFree = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/update-user-location/:newRoomId',
        element: <UpdateUserLocation />
    },
    {
        path: '/user-registered-visitor/:newRoomId',
        element: <UserRegisteredVisitor />
    },
];

export default AppRoutesFree;
