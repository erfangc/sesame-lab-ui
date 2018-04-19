import * as React from 'react';
import {connect} from 'react-redux';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import axios from 'axios';
import {apiRoot} from '../index';
import {CorpusDescriptor} from '../reducers/corpus/corpusReducer';
import {StoreState} from '../reducers/index';
import {Pie, PieChart, Tooltip} from 'recharts';
import {TopEntities} from './TopEntities';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
}

interface DashboardObject {
    topUsers: { [email: string]: number },
    topCorpus: { [corpusID: string]: number },
    topEntityValue: { [entity: string]: number }
}

function mapStateToProps({corpus: {corpusDescriptors}}: StoreState): StateProps {
    return {corpusDescriptors};
}

interface State {
    dashboard: DashboardObject
}

export const Dashboard = connect(mapStateToProps)(
    class Dashboard extends React.Component<StateProps, State> {

        private topCorpusDiv: HTMLDivElement | null;

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
            const {dashboard: {topUsers, topCorpus}} = this.state;
            const {corpusDescriptors} = this.props;
            const pieData = Object.keys(topCorpus).map(corpusID => {
                const corpusDescriptor = corpusDescriptors.find(({id}) => id === corpusID);
                return {
                    name: !corpusDescriptor ? corpusID : corpusDescriptor.title,
                    value: topCorpus[corpusID]
                };
            });
            let pieWidth = this.topCorpusDiv != null ? this.topCorpusDiv.getBoundingClientRect().width : 535.5;
            return (
                <Grid columns={'equal'} stackable>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <TopEntities docCounts={this.state.dashboard.topEntityValue}/>
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
                                                            {idx === 0 ? <Icon name={'favorite'} color={'yellow'}/> : <Icon/>}
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
                        <Grid.Column>
                            <div ref={ref => this.topCorpusDiv = ref}>
                                <Header icon>
                                    <Icon name={'line chart'} circular/>
                                    <Header.Content>Top Corpus</Header.Content>
                                </Header>
                                <PieChart
                                    width={pieWidth}
                                    height={400}
                                >
                                    <Pie
                                        data={pieData}
                                        cx={(pieWidth) / 2}
                                        cy={200}
                                        label
                                        fill="#4F52D2"
                                        dataKey={'value'}
                                    />
                                    <Tooltip/>
                                </PieChart>

                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
    }
);
