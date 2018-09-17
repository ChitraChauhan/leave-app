import LeaveList from './LeaveList'
import AddLeave from './AddLeave'
import EditLeave from './EditLeave'

const ROUTES = [
    { path: 'leaves', component: LeaveList },
    { path: 'add_leave', component: AddLeave },
    { path: 'edit_leave', component: EditLeave },
]

export default ROUTES