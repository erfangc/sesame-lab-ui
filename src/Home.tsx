import * as React from 'react';
import {connect} from 'react-redux';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import axios from 'axios';
import {apiRoot} from './index';
import {CorpusDescriptor} from './reducers/corpusDescriptors/corpusDescriptorReducer';
import {StoreState} from './reducers';
import {Pie, PieChart, Tooltip} from 'recharts';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
}

interface Dashboard {
    topUsers: { [email: string]: number },
    topCorpus: { [corpusID: string]: number }
}

function mapStateToProps({corpusDescriptors}: StoreState): StateProps {
    return {corpusDescriptors};
}

interface State {
    dashboard: Dashboard
}

export const Home = connect(mapStateToProps)(
    class Home extends React.Component<StateProps, State> {

        private topCorpusDiv: HTMLDivElement | null;

        constructor(props: StateProps, context: any) {
            super(props, context);
            this.state = {
                dashboard: {
                    topCorpus: {},
                    topUsers: {}
                }
            };
        }

        componentDidMount(): void {
            axios
                .get<Dashboard>(`${apiRoot}/api/v1/dashboard`)
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
            return (
                <Grid columns={'equal'} stackable celled>
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
                                width={this.topCorpusDiv != null ? this.topCorpusDiv.getBoundingClientRect().width : 535.5}
                                height={400}
                            >
                                <Pie
                                    data={pieData}
                                    cx={535.5 / 2}
                                    cy={200}
                                    label
                                    fill="#4F52D2"
                                    dataKey={'value'}
                                />
                                <Tooltip/>
                            </PieChart>

                        </div>
                    </Grid.Column>
                </Grid>
            );
        }
    }
);
