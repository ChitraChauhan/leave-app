import React, { Component } from 'react'
import { Icon, Page, Toolbar, ToolbarButton, BottomToolbar } from 'react-onsenui'
import LeaveList from '../leave/LeaveList';
import AddLeave from '../leave/AddLeave';
import Logo from './logo.png';

class Home extends Component {
    openLeaveList() {
        this.props.navigator.pushPage({
            component: LeaveList,
            path: `LeaveList_${0}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    openLeave() {
        this.props.navigator.pushPage({
            component: AddLeave,
            path: `AddLeave_${1}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    renderToolbar() {
        return (
            <Toolbar className="ax-toolbar" noshadow>
                <div className='left'>
                    <ToolbarButton>
                        <Icon icon='fa-th-large' onClick={() => this.openMenu()} />
                    </ToolbarButton>
                </div>
                <div className='center'>
                    Axelor
                </div>
            </Toolbar>
        );
    }

    renderBottomToolbar() {
        return (
            <BottomToolbar>
                <div className='left'>
                    <ToolbarButton>
                        <Icon icon='fa-plane' onClick={() => this.openLeaveList()} />
                    </ToolbarButton>
                    <br></br>
                    Leave
                </div>
                <div className='right'>
                    <ToolbarButton>
                        <Icon icon='fa-plus' onClick={() => this.openLeave()} />
                    </ToolbarButton>
                </div>
                {/* <div className='right'>
                    <ToolbarButton>
                        <Icon icon='fa-cog' onClick={() => this.openConfig()} />
                    </ToolbarButton>
                </div> */}
            </BottomToolbar>
        )
    }

    render() {
        return (
            <Page renderToolbar={() => this.renderToolbar()}
                renderBottomToolbar={() => this.renderBottomToolbar()}>
                <div className="home-content">
                    <h1 style={{ textAlign: 'center', marginTop: 50, marginBottom: -10 }}>
                        Welcome
                </h1>
                    <div className="home-img">
                        <img style={{ marginTop: '10%' }} src={Logo} alt="Axelor Logo" />
                    </div>
                </div>
            </Page>
        )
    }
}

export default Home