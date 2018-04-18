import * as React from 'react';
import {CorpusDescriptor} from '../reducers/corpus/corpusReducer';
import {Divider} from 'semantic-ui-react';

interface LegendProps {
    corpusDescriptor: CorpusDescriptor
}

export class Legend extends React.Component<LegendProps> {
    render(): React.ReactNode {
        const {corpusDescriptor: {entityConfigs}} = this.props;
        return (
            <React.Fragment>
                <Divider horizontal> Legend </Divider>
                <div>
                    {
                        Object
                            .keys(entityConfigs)
                            .map(type => (
                                    <div key={type}>
                                                <span
                                                    style={{borderLeft: `10px solid ${entityConfigs[type].color}`}}
                                                >
                                                    &nbsp;
                                                </span>
                                        {entityConfigs[type].displayName}
                                    </div>
                                )
                            )
                    }
                </div>
            </React.Fragment>
        );
    }
}