import * as React from 'react';
import {connect} from 'react-redux';
import {Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis} from 'recharts';
import {Header} from 'semantic-ui-react';

const colors = ['#1f77b4', '#4f52d2', '#ff7f0e', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

interface StateProps {

}

interface OwnProps {
    docCounts: {[entityName: string]: number}
}

function mapStateToProps(): StateProps {
    return {};
}

const getPath = (x: any, y: any, width: any, height: any) => {
    return `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
          Z`;
};

const TriangleBar = (props: any) => {
    const {fill, x, y, width, height} = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill}/>;
};

export const TopEntities = connect(mapStateToProps)(
    class TopEntities extends React.Component<StateProps & OwnProps> {
        private div: HTMLDivElement | null;
        render(): React.ReactNode {
            const {docCounts} = this.props;
            const data = Object.keys(docCounts).map(name => ({name, docCount: docCounts[name]}));
            const width = this.div != null ? this.div.getBoundingClientRect().width : 535.5 * 2;
            return (
                <div ref={instance => this.div = instance}>
                    <Header>Most Popular Terms</Header>
                    <BarChart
                        width={width}
                        height={300}
                        data={data}
                        margin={{top: 20, right: 30, left: 20, bottom: 5}}
                    >
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Bar dataKey="docCount" fill="#8884d8" shape={<TriangleBar/>}>
                            {
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % 20]}/>
                                ))
                            }
                        </Bar>
                    </BarChart>
                </div>
            );
        }
    }
);
