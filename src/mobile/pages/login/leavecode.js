import React, { Component } from 'react'
import { Page, ToolbarButton, Toolbar, Icon, Input, ListItem, Radio, List } from 'react-onsenui'
import LeaveReason from '../LeaveReason';
import LeaveList from '../LeaveList';
import RestAPI from '../../../../rest-api';

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
                    // quantity: '',
                    name: ''
                },
                startOnSelect: 1,
                endOnSelect: 2,
                toDate: '',
                fromDate: '',
            },
            // list: []
        }
        this.restAPI = new RestAPI();
    }

    openList() {
        this.props.navigator.pushPage({
            component: LeaveList,
            mainProps: this.props,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    addReason() {
        this.props.navigator.pushPage({
            component: LeaveReason,
            key: Date.now(),
            data: this.props.route.data,
            mainProps: this.props,
            path: `LeaveReason_${0}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    onChange(key, value) {
        const { leave } = this.state;
        // if (key === 'leaveLine.quantity') {
        //     const fields = key.split('.');
        //     let field;
        //     for (let i = 0; i < fields.length; i++) {
        //         field = fields[i];
        //     }
        //     leave.leaveLine[field] = value
        // }
        // else {
        leave[key] = value
        // }
        this.setState({ leave })
    }

    // handleChange(value) {
    //     this.setState({ leave: { startOnSelect: value } });
    // }

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
                    <Input
                        type="text"
                        value={leave.leaveLine && (leave.leaveLine.name || (leave.leaveLine.name = this.props.route.data))}
                        // onChange={(e) => this.onChange('leaveLine.name', e.target.value)}
                        placeholder="Select Reason"
                        float
                        onClick={() => this.addReason()}
                    />
                    <Icon icon="ion-chevron-right" style={{ color: 'lightgray' }} />
                </p>
                {/* <label>Available Quantity</label>
                <p>
                    <Input
                        type="number"
                        value={leave.leaveLine && leave.leaveLine.quantity}
                        onChange={(e) => this.onChange('leaveLine.quantity', e.target.value)}
                    />
                </p> */}
                <label>From Date</label>
                <p>
                    <Input
                        type="date"
                        required
                        value={leave.fromDate}
                        onChange={(e) => this.onChange('fromDate', e.target.value)}
                    />
                </p>
                <label>To Date</label>
                <p>
                    <Input
                        type="date"
                        required
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
            </form>
        )
    }

    onSave(e) {
        e.preventDefault();
        const { leave } = this.state;
        const leavePayload = {
            leaveLine: {
                // quantity: leave.leaveLine.quantity,
                name: leave.leaveLine.name
            },
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            startOnselect: leave.startOnSelect,
            endOnSelect: leave.endOnSelect,
            company: { code: "ABC", name: 'Abc' },
            user: { code: "admin", fullName: 'Admin' }
        };
        this.setState(prevState => {
            const { leave } = prevState
            this.restAPI.add('com.axelor.apps.hr.db.LeaveRequest', leavePayload).then(res => console.log('res', res));
            console.log('All data: ' + JSON.stringify(leave));
            // list.push({ ...leave });
            // return { list }
        });
    }

    renderToolbar() {
        return (
            <Toolbar className="ax-toolbar" noshadow>
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