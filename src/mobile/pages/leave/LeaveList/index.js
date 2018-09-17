import React, { Component } from 'react'
import { Icon, ToolbarButton, Page, Toolbar, SearchInput, List, ListItem } from 'react-onsenui';
import moment from 'moment';
import classNames from 'classnames';
import AddLeave from '../AddLeave';
import EditLeave from '../EditLeave';
import service from '../../../../service';
import debounce from 'lodash.debounce';

const Tabbar = ({ tabs, value, onChange }) => {
    if (tabs.filter(t => t.value === value).length === 0 && tabs && tabs.length) {
        value = tabs[0].value;
    }
    return (
        <div className="tabbar tabbar--top tabbar--material">
            {
                tabs.map((tab, i) => (
                    <React.Fragment key={i}>
                        <label className="tabbar__item tabbar--material__item" onClick={() => onChange(tab.value)}>
                            <button className={classNames("tabbar__button", { 'highlight-list-tab-button': tab.value === value })}>
                                {tab.text}
                            </button>
                        </label>
                    </React.Fragment>
                ))
            }
        </div>
    )
}

class LeaveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filter: 0,
            offset: 0,
            total: 0,
            limit: 10,
            searchInput: '',
        }
        this.service = new service()
        this.debounce = debounce(() => this.fetchData(), 1000)
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        const { offset, limit, filter, searchInput } = this.state;
        let value = 0;
        if (searchInput === 'draft') {
            value = 1
        }
        else if (searchInput === 'waiting') {
            value = 2
        }
        else if (searchInput === 'validated') {
            value = 3
        }
        else value = 4
        let data = {}

        if (filter === 0) {
            if (searchInput) {
                data = {
                    criteria: [
                        {
                            operator: "or",
                            criteria: [{ fieldName: "statusSelect", value: value, operator: "=" }]
                        }
                    ],
                    operator: "and",
                    _domain: null,
                    _domainContext: {},
                }
            }
            else {
                data = {}
            }
        }
        else if (searchInput) {
            data = {
                criteria: [
                    {
                        operator: "or",
                        criteria: [{ fieldName: "statusSelect", value: value, operator: "=" }]
                    },
                    {
                        operator: "and",
                        criteria: [{ fieldName: "statusSelect", value: filter, operator: "=" }]
                    }
                ],
                operator: "and",
                _domain: null,
                _domainContext: {},
            }
        }
        else {
            data = {
                criteria: [
                    {
                        operator: "and",
                        criteria: [{ fieldName: "statusSelect", value: filter, operator: "=" }]
                    }
                ],
                operator: "and",
                _domain: null,
                _domainContext: {},
            }
        }
        let fields = [
            "id",
            "leaveLine",
            "fromDate",
            "statusSelect",
            "endOnSelect",
            "toDate",
            "company",
            "startOnSelect",
            "user",
            "duration",
            "leaveLine.quantity"
        ]
        this.service.getData("com.axelor.apps.hr.db.LeaveRequest", { data, fields, offset, limit })
            .then((res) => res.json())
            .then(result =>
                this.setState({
                    data: result.data,
                    total: result.total,
                })
            );
    }

    addLeave() {
        this.props.navigator.pushPage({
            component: AddLeave,
            path: `AddLeave_${0}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    onListItemClick(row, index) {
        this.props.navigator.pushPage({
            component: EditLeave,
            // onUpdate: (row) => {
            //     const target = data.findIndex(d => d.id === row.id);
            //     data[target] = { ...row };
            //     console.log(target, row);
            //     this.setState({ data: [...data] });
            // },
            removeRecord: (row) => {
                const { data } = this.state;
                const targetIndex = data.findIndex(e => e.id === row.id);
                data.splice(targetIndex, 1);
                this.setState({ data });
            },
            data: row,
            path: `EditLeave_${0}`,
            navigator: this.props.navigator,
        }, { animation: 'none' });
    }

    renderRow(row, index) {
        let statusSelect;
        if (row.statusSelect === 1) {
            statusSelect = 'Draft'
        }
        else if (row.statusSelect === 2) {
            statusSelect = 'Waiting'
        }
        else if (row.statusSelect === 3) {
            statusSelect = 'Validated'
        }
        else
            statusSelect = 'Refused'
        return (
            <ListItem
                key={row.row_id || row.id || index}
                onClick={() => this.onListItemClick(row, index)}
            >
                <div textalign='left'>
                    <h2> {row.leaveLine && row.leaveLine.name} </h2>
                    <h4>{moment(row.fromDate).format('DD MMM YYYY')} to {moment(row.toDate).format('DD MMM YYYY')}</h4>
                    <h4> {statusSelect} </h4>
                </div>
            </ListItem>
        )
    }

    renderList() {
        const { data } = this.state;
        return (
            <List
                style={{ marginTop: 45, backgroundImage: 'none' }}
                dataSource={data}
                renderRow={(row, index) => this.renderRow(row, index)}
            />
        );
    }

    getListTabsData() {
        return [
            { text: "All", value: 0 },
            { text: "validated", value: 3 },
            { text: "Refused", value: 4 },
        ];
    }

    onTabChange(newIndex) {
        const { filter } = this.state;
        if (filter !== newIndex) {
            this.setState({ filter: newIndex }, () => this.fetchData());
        }
        // this.setState({ filter }, () => this.fetchData())
    }

    renderListSearch({ placeholder = 'Search by name' } = {}) {
        const { searchInput } = this.state;
        const onKeywordChange = (e) => {
            this.setState({ searchInput: e.target.value }, () => { this.debounce() }
            );
        }
        return (
            <div key="0" className="ax-searchbar">
                <SearchInput
                    placeholder={placeholder}
                    value={searchInput}
                    onChange={onKeywordChange}
                />
            </div>
        );
    }

    renderToolbar() {
        return (
            <Toolbar>
                <div className='left'>
                    <ToolbarButton>
                        <Icon icon='fa-th-large' />
                    </ToolbarButton>
                </div>
                <div className='center'>
                    Leave List
                </div>
                <div className='right'>
                    <ToolbarButton>
                        <Icon icon='md-plus' onClick={() => this.addLeave()} />
                    </ToolbarButton>
                </div>
            </Toolbar>
        )
    }

    onLoadMore() {
        const { offset, limit, total } = this.state;
        const newOffset = offset + limit;
        const hasMore = newOffset < total;
        if (hasMore) {
            this.setState({ offset: newOffset }, () => this.fetchData());
        }
    }

    render() {
        // console.log("data in list::::::", this.state.data)
        return (
            <Page
                // onInfiniteScroll={(done) => this.onLoadMore(done)}
                renderToolbar={() => this.renderToolbar()}
                {...this.props}
            >
                <section style={{ textAlign: 'center', padding: '10px' }} >
                    {this.renderListSearch()}
                </section>
                <Tabbar
                    value={this.state.filter}
                    tabs={this.getListTabsData()}
                    onChange={(e) => this.onTabChange(e)}
                />
                <section>
                    {this.renderList()}
                </section>
            </Page>
        )
    }
}

export default LeaveList