import React, { Component } from 'react'
import { Page, Toolbar, Icon, ToolbarButton } from 'react-onsenui'
import LeaveList from '../LeaveList'
import AddLeave from '../AddLeave';
import RestAPI from '../../../../rest-api';
import ons from 'onsenui';

class EditLeave extends Component {
    constructor(props) {
        super(props);
        this.restAPI = new RestAPI()
    }

    openList() {
        //this.props.navigator.popPage();
        this.props.navigator.pushPage({
            component: LeaveList,
            path: `LeaveList_${4}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    onDelete() {
        ons.notification.confirm({
            message: 'Are you sure you want to delete?'
        }).then(res => {
            if (res === 1) {
                if (this.props.route.removeRecord) {
                    this.props.route.removeRecord(this.props.route.data.id);
                }
                this.restAPI.delete('com.axelor.apps.hr.db.LeaveRequest', this.props.route.data.id).then(res => res.json())
                this.props.navigator.popPage();
            }
        })
    }

    // removeEvent(record) {
    //     ons.notification.confirm(translate('Alert.confirmDelete'), { title: translate('Alert.confirm') }).then(res => {
    //         if (res === 1) {
    //             remove(record).then(res => {
    //                 if (this.props.route.removeRecord) {
    //                     this.props.route.removeRecord(record);
    //                 }
    //                 this.props.navigator.popPage();
    //             });
    //         }
    //     });
    // }

    onEdit() {
        this.props.navigator.pushPage({
            component: AddLeave,
            record: this.props.route.data,
            path: `AddLeave_${2}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });

    }

    renderView(data) {
        if (data) {
            let startOnSelect, endOnSelect;
            if ((data.startOnSelect) === 1) {
                startOnSelect = 'Morning'
            }
            else {
                startOnSelect = 'Afternoon'
            }
            if ((data.endOnSelect) === 1) {
                endOnSelect = 'Morning'
            }
            else {
                endOnSelect = 'Afternoon'
            }
            return (
                <div className='center'>
                    <h4>{data.leaveLine.name || data.leaveLine.LeaveReason}</h4>
                    <h4>{data.fromDate} To {data.toDate}</h4>
                    <h4>{startOnSelect} To {endOnSelect}</h4>
                    <h4>{data.duration} Days</h4>
                </div>
            )
        }
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
                    Edit Leave
                </div>
                <div className='right'>
                    <ToolbarButton>
                        <Icon icon='fa-trash' onClick={(e) => this.onDelete(e)} />
                    </ToolbarButton>
                    <ToolbarButton>
                        <Icon icon='fa-edit' onClick={(e) => this.onEdit(e)} />
                    </ToolbarButton>
                </div>
            </Toolbar >
        )
    }

    render() {
        console.log("data::::::::;", this.props.route.data)
        return (
            <Page
                {...this.props}
                renderToolbar={() => this.renderToolbar()}>
                <section style={{ textAlign: 'center', padding: '10px' }}>
                    {this.renderView(this.props.route.data)}
                </section>
            </Page>
        )
    }
}

export default EditLeave