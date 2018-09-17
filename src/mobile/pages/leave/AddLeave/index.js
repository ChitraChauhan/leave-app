import React, { Component } from 'react'
import { Page, ToolbarButton, Toolbar, Icon, Input, ListItem, Radio, List } from 'react-onsenui'
import LeaveReason from '../LeaveReason';
import LeaveList from '../LeaveList';
import RestAPI from '../../../../rest-api';
import service from '../../../../service';
import EditLeave from '../EditLeave';
import ons from 'onsenui';

const startOnselect = [
    { value: 1, label: 'Morning' },
    { value: 2, label: 'Afternoon' },
]

class AddLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leave: {
                leaveLine: {
                    quantity: '',
                    LeaveReason: ''
                },
                startOnSelect: 1,
                endOnSelect: 2,
                toDate: '',
                fromDate: '',
                duration: ''
            },
            user: ''
        }
        this.restAPI = new RestAPI();
        this.service = new service();
    }

    componentDidMount() {
        this.getUser();
        this.props.route.record ? this.setRecord() : ''
    }

    getUser() {
        this.service.getData("com.axelor.auth.db.User")
            .then((res) => res.json())
            .then(result =>
                this.setState({
                    user: result.data.filter(x => (x.code === 'admin')),
                })
            );
    }

    openList() {
        ons.notification.confirm({
            message: 'Are you sure you want to continue?'
        }).then(res => {
            if (res === 1) {
                this.props.navigator.pushPage({
                    component: LeaveList,
                    path: `LeaveList_${1}`,
                    navigator: this.props.navigator,
                }, { animation: 'none' });
            }
        })
    }

    openEditLeave(leave) {
        this.props.navigator.pushPage({
            component: EditLeave,
            data: leave,
            path: `EditLeave_${1}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    addReason() {
        this.props.navigator.pushPage({
            component: LeaveReason,
            key: Date.now(),
            data: this.props.route.record ? this.props.route.record.leaveLine.name : this.props.route.data,
            path: `LeaveReason_${0}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    onChange(key, value) {
        const { leave } = this.state;
        if (key === 'leaveLine.quantity') {
            const fields = key.split('.');
            let field;
            for (let i = 0; i < fields.length; i++) {
                field = fields[i];
            }
            leave.leaveLine[field] = value
        }
        else {
            leave[key] = value
        }
        this.setState({ leave })
    }

    setRecord() {
        this.setState({ leave: this.props.route.record })
    }

    onSave(e) {
        e.preventDefault();
        const { leave } = this.state;
        let user = this.state.user.map((x) => { return x.createdBy })
        const leavePayload = {
            leaveLine: {
                quantity: leave.leaveLine.quantity,
                leaveReason: this.props.route.record ? this.props.route.record.leaveLine : this.props.route.leaveReasonObject
            },
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            startOnselect: leave.startOnSelect,
            endOnSelect: leave.endOnSelect,
            duration: leave.duration,
            user: user[0]
        };
        this.setState(prevState => {
            const { leave } = prevState
            if (leave.id) {
                this.restAPI.update('com.axelor.apps.hr.db.LeaveRequest', leave, leave.id)
                    .then(res => res.json())
                    .then(result => {
                        return {
                            leave
                        }
                    });
            }
            else {
                this.restAPI.add('com.axelor.apps.hr.db.LeaveRequest', leavePayload).then(res => console.log('res', res));
                console.log('All data: ' + JSON.stringify(leave));
            }
        });
        this.openEditLeave(leave);
    }

    renderRow(row, label) {
        let checked;
        let onChange;
        if (label === 'startOnSelect') {
            checked = (row.value === this.state.leave.startOnSelect)
            onChange = () => this.onChange('startOnSelect', row.value)
        }
        else {
            checked = (row.value === this.state.leave.endOnSelect)
            onChange = () => this.onChange('endOnSelect', row.value)
        }
        return (
            <ListItem key={row.value} >
                <label className='left'>
                    <Radio
                        inputId={`radio-${row.value}`}
                        checked={checked}
                        onChange={onChange}
                    />
                </label>
                <label htmlFor={`radio-${row.value}`} className='center'>
                    {row.label}
                </label>
            </ListItem>
        )
    }

    renderView() {
        const { leave } = this.state;
        return (
            <form>
                <label>Reason</label>
                <p>
                    {this.props.route.record ?
                        //from EditLeave
                        <Input
                            type="text"
                            value={leave.leaveLine &&
                                leave.leaveLine.LeaveReason || (leave.leaveLine.LeaveReason = this.props.route.record.leaveLine.name)}
                            placeholder="Select Reason"
                            float
                            onClick={() => this.addReason()}
                        /> :
                        //from LeaveReason
                        <Input
                            type="text"
                            value={leave.leaveLine &&
                                leave.leaveLine.LeaveReason || (leave.leaveLine.LeaveReason = this.props.route.data)}
                            placeholder="Select Reason"
                            float
                            onClick={() => this.addReason()} />}

                    <Icon icon="ion-chevron-right" style={{ color: 'lightgray' }} />
                </p>
                <label>Available Quantity</label>
                <p>
                    <Input
                        type="number"
                        value={leave.leaveLine && leave.leaveLine.quantity}
                        onChange={(e) => this.onChange('leaveLine.quantity', e.target.value)}
                    />
                </p>
                <label>From Date</label>
                <p>
                    <Input
                        type="date"
                        value={leave.fromDate}
                        onChange={(e) => this.onChange('fromDate', e.target.value)}
                    />
                </p>
                <label>To Date</label>
                <p>
                    <Input
                        type="date"
                        value={leave.toDate}
                        onChange={(e) => this.onChange('toDate', e.target.value)}
                    />
                </p>
                <label>Start On</label>
                <List
                    dataSource={startOnselect}
                    renderRow={(row) => this.renderRow(row, 'startOnSelect')} />
                <label>End On</label>
                <List
                    dataSource={startOnselect}
                    renderRow={(row) => this.renderRow(row, 'endOnSelect')} />
                <label>Duration</label>
                <p>
                    <Input
                        type="number"
                        value={leave.duration}
                        onChange={(e) => this.onChange('duration', e.target.value)}
                    />
                </p>
            </form>
        )
    }

    renderToolbar() {
        return (
            this.props.route.record ?
                <Toolbar className="ax-toolbar" noshadow>
                    <div className='left'>
                        <ToolbarButton>
                            <Icon icon='fa-chevron-left' onClick={() => this.openList()} />
                        </ToolbarButton>
                    </div>
                    <div className='center'>
                        Edit Leave
                </div>
                    <div className='right'>
                        <ToolbarButton>
                            <Icon icon='fa-times' onClick={() => this.openEditLeave(this.props.route.record)} />
                        </ToolbarButton>
                        <ToolbarButton>
                            <Icon icon='fa-save' onClick={(e) => this.onSave(e)} />
                        </ToolbarButton>
                    </div>
                </Toolbar>
                : <Toolbar className="ax-toolbar" noshadow >
                    <div className='left'>
                        <ToolbarButton>
                            <Icon icon='fa-chevron-left' onClick={() => this.openList()} />
                        </ToolbarButton>
                    </div>
                    <div className='center'>
                        Add Leave
                </div>
                    <div className='right'>
                        <ToolbarButton>
                            <Icon icon='fa-save' onClick={(e) => this.onSave(e)} />
                        </ToolbarButton>
                    </div>
                </Toolbar>
        );
    }

    render() {
        // console.log("From LeaveReason::::::", this.props.route.leaveReasonObject)
        // console.log("From EditLeave", this.props.route.record.leaveLine.name)
        console.log("leave state::::", this.state.leave)
        return (
            <Page
                {...this.props}
                renderToolbar={() => this.renderToolbar()}>
                {this.renderView()}
            </Page>
        )
    }
}

export default AddLeave