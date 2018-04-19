import * as React from 'react';
import {connect} from 'react-redux';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';
import {Header, Icon} from 'semantic-ui-react';
import {CorpusDescriptor} from '../reducers/corpus/corpusReducer';
import {StoreState} from '../reducers';

const COLORS = ['#4F52D2', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]

}

interface OwnProps {
    docCounts: { [corpusID: string]: number }
}

function mapStateToProps({corpus: {corpusDescriptors}}: StoreState): StateProps {
    return {corpusDescriptors};
}

export const TopCorpus = connect(mapStateToProps)(
    class TopCorpus extends React.Component<StateProps & OwnProps> {
        private div: HTMLDivElement | null;

        render(): React.ReactNode {
            const {docCounts, corpusDescriptors} = this.props;
            const pieWidth = this.div != null ? this.div.getBoundingClientRect().width : 535.5;
            const data = Object.keys(docCounts).map(corpusID => {
                const corpusDescriptor = corpusDescriptors.find(({id}) => id === corpusID);
                return {
                    name: !corpusDescriptor ? corpusID : corpusDescriptor.title,
                    value: docCounts[corpusID]
                };
            });
            return (
                <div ref={ref => this.div = ref}>
                    <Header icon>
                        <Icon name={'line chart'} circular/>
                        <Header.Content>Top Corpus</Header.Content>
                    </Header>
                    <PieChart
                        width={pieWidth}
                        height={400}
                    >
                        <Pie
                            data={data}
                            cx={(pieWidth) / 2}
                            cy={200}
                            label
                            fill="#4F52D2"
                            dataKey={'value'}
                        >
                            {
                                data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                            }
                        </Pie>
                        <Tooltip/>
                    </PieChart>

                </div>
            );
        }
    }
);
