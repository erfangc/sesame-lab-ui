import * as React from 'react';
import {connect} from 'react-redux';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {StoreState} from '../reducers';
import {Dropdown, DropdownItemProps, Form} from 'semantic-ui-react';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
}

interface OwnProps {
    corpusID?: string
    disabled?: boolean
    standalone?: boolean
    onChange: (corpusDescriptor: CorpusDescriptor) => void
}

function mapStateToProps({corpusDescriptors}: StoreState): StateProps {
    return {corpusDescriptors};
}

export const CorpusChooser = connect(mapStateToProps)(
    class CorpusChooser extends React.Component<StateProps & OwnProps> {
        render(): React.ReactNode {
            const {corpusDescriptors, disabled, corpusID, standalone} = this.props;
            const options: DropdownItemProps[] = corpusDescriptors.map(({id, title}) => ({
                key: id,
                value: id,
                text: title
            }));
            const value = !!corpusID ? corpusID : corpusDescriptors[0].id;
            const formField = (
                <Form.Field width={4}>
                    <label>Corpus</label>
                    <Dropdown
                        selection
                        disabled={disabled}
                        options={options}
                        value={value}
                        onChange={(e, data) => this.changeCorpus(data.value as string)}
                    />
                </Form.Field>
            );
            return standalone ? (<Form>{formField}</Form>) : (formField);
        }

        private changeCorpus = (value: string) => {
            const {corpusDescriptors, onChange} = this.props;
            const corpusDescriptor = corpusDescriptors.find(({id}) => value === id);
            if (!corpusDescriptor) {
                return;
            } else {
                onChange(corpusDescriptor);
            }
        };
    }
);
