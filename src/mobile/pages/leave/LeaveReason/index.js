import React, { Component } from 'react'
import { Page, Icon, ToolbarButton, Toolbar, SearchInput, List, ListItem, Radio } from 'react-onsenui'
import service from '../../../../service';

class LeaveReason extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedLeave: this.props.route.data
        }
        this.service = new service()
    }

    componentDidMount() {
        this.service.getData("com.axelor.apps.hr.db.LeaveLine")
            .then((res) => res.json())
            .then(result =>
                this.setState({
                    data: result.data,
                })
            );
    }

    openLeave() {
        this.props.navigator.popPage();
    }

    addLeave(row, leaveReason) {
        this.props.navigator.replacePage({ name: 'add_leave', leaveReasonObject: row, data: leaveReason })
    }

    handleChange(leaveReason) {
        this.setState({ selectedLeave: leaveReason });
    }

    renderToolbar() {
        return (
            <Toolbar className="ax-toolbar" noshadow>
                <div className='left'>
                    <ToolbarButton>
                        <Icon icon='fa-chevron-left' onClick={() => this.openLeave()} />
                    </ToolbarButton>
                </div>
                <div className='center'>
                    Leave Reason
                </div>
            </Toolbar>
        );
    }

    renderRadioRow(row, index) {
        if (row.leaveReason) {
            let leaveReason = row.leaveReason.leaveReason
            return (
                <ListItem key={row.id || row.row_id || index} tappable onClick={() => this.addLeave(row.leaveReason, leaveReason)}>
                    <label className='left'>
                        <Radio
                            inputId={`radio-${row.id}`}
                            checked={leaveReason === this.state.selectedLeave}
                            onChange={this.handleChange.bind(this, leaveReason)}
                        />
                    </label>
                    <label htmlFor={`radio-${row.id}`} className='center'>
                        {leaveReason}
                    </label>
                </ListItem>
            )
        }
    }

    render() {
        const { data } = this.state;
        // let leaveReason = []
        // leaveReason = data.map((record, index) => { return record.leaveLine })
        // console.log(":::", leaveReason)
        return (
            <Page
                {...this.props}
                renderToolbar={() => this.renderToolbar()}>
                <section style={{ textAlign: 'center', padding: '10px' }} >
                    <SearchInput
                        placeholder='Search' />
                </section>
                <List
                    dataSource={data}
                    renderRow={(row, index) => this.renderRadioRow(row, index)}
                />
            </Page >

        )
    }
}
export default LeaveReason