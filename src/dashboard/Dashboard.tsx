import * as React from 'react';
import {connect} from 'react-redux';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import axios from 'axios';
import {apiRoot} from '../index';
import {TopEntities} from './TopEntities';
import {TopCorpus} from './TopCorpus';

interface StateProps {
}

interface DashboardObject {
    topUsers: { [email: string]: number },
    topCorpus: { [corpusID: string]: number },
    topEntityValue: { [entity: string]: number }
}

function mapStateToProps(): StateProps {
    return {};
}

interface State {
    dashboard: DashboardObject
}

export const Dashboard = connect(mapStateToProps)(
    class Dashboard extends React.Component<StateProps, State> {
        constructor(props: StateProps, context: any) {
            super(props, context);
            this.state = {
                dashboard: {
                    topCorpus: {},
                    topUsers: {},
                    topEntityValue: {}
                }
            };
        }

        componentDidMount(): void {
            axios
                .get<DashboardObject>(`${apiRoot}/api/v1/dashboard`)
                .then(({data}) => this.setState({dashboard: data}));
        }

        render(): React.ReactNode {
            const {dashboard: {topUsers, topCorpus, topEntityValue}} = this.state;
            return (
                <Grid columns={'equal'} stackable>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <TopEntities docCounts={topEntityValue}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header icon>
                                <Icon name={'users'} circular/>
                                <Header.Content>Top Trainers</Header.Content>
                            </Header>
                            <Table basic={'very'}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell/>
                                        <Table.HeaderCell/>
                                        <Table.HeaderCell># Documents Trained</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        Object
                                            .keys(topUsers)
                                            .map((topUser, idx) => (
                                                    <Table.Row key={topUser}>
                                                        <Table.Cell>
                                                            {idx === 0 ? <Icon name={'favorite'} color={'yellow'}/> :
                                                                <Icon/>}
                                                        </Table.Cell>
                                                        <Table.Cell>{topUser}</Table.Cell>
                                                        <Table.Cell>{topUsers[topUser]}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            )
                                    }

                                </Table.Body>
                            </Table>
                        </Grid.Column>
                        <Grid.Column><TopCorpus docCounts={topCorpus}/></Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
    }
);
