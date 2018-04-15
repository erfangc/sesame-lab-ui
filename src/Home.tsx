import * as React from 'react';
import {connect} from 'react-redux';
import {Grid, Header, Icon, Item} from 'semantic-ui-react';
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
                            <Header.Content>Top Users</Header.Content>
                        </Header>
                        <Item.Group>
                            {
                                Object
                                    .keys(topUsers)
                                    .map((topUser, idx) => (
                                            <Item key={topUser}>
                                                <Item.Content verticalAlign={'middle'}>
                                                    {idx === 0 ? <Icon name={'favorite'} color={'yellow'}/> : <Icon/>}
                                                    <Item.Header>{topUser} ({topUsers[topUser]})</Item.Header>
                                                </Item.Content>
                                            </Item>
                                        )
                                    )
                            }
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column>
                        <Header icon>
                            <Icon name={'line chart'} circular/>
                            <Header.Content>Top Corpus</Header.Content>
                        </Header>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={pieData}
                                cx={200}
                                cy={200}
                                label
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey={'value'}
                            />
                            <Tooltip/>
                        </PieChart>
                    </Grid.Column>
                </Grid>
            );
        }
    }
);
