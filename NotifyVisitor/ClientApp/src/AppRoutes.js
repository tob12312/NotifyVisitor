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

const AppRoutes = [
    {
        path: '/',
        element: <Home />,
        exact: true,
        public: false
    },
    {
        path: 'app/room',
        element: <RoomView />,
        exact: true,
        public: false
    },
    {
        path: 'app/assign',
        element: <AssignView />,
        exact: true,
        public: false
    },
    {
        path: 'app/notification',
        element: <NotificationView />,
        exact: true,
        public: false
    },
    {
        path: 'app/alarm',
        element: <AlarmView />,
        exact: true,
        public: false
    },
    {
        path: 'app/alarm/triggeredAlarms',
        element: <TriggeredAlarmView />,
        exact: true,
        public: false
    },
    {
        path: 'app/visitor',
        element: <VisitorView />,
        exact: true,
        public: false
    },
    {
        path: 'app/visitor/visitorHistory',
        element: <VisitorHistoryView />,
        exact: true,
        public: false
    },
    {
        path: 'app/site',
        element: <SiteView />,
        exact: true,
        public: false
    },
    {
        path: '/qrscreen',
        element: <QrScreen />,
        exact: true,
        public: false
    },
    {
        path: '/update-user-location/:newRoomId',
        element: <UpdateUserLocation />,
        exact: true,
        public: true
    },
    {
        path: '/user-registered-visitor/:newRoomId',
        element: <UserRegisteredVisitor />,
        exact: true,
        public: true
    }
];

export default AppRoutes;