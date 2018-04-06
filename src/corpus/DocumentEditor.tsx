import * as React from 'react';
import {Button, Input} from 'semantic-ui-react';

interface Props {
    value: string
    onSubmit: (newValue: string) => void
    onCancel: () => void
}

interface State {
    value: string
}

export class DocumentEditor extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    render(): React.ReactNode {
        const {onSubmit, onCancel} = this.props;
        const {value} = this.state;
        return (
            <React.Fragment>
                <p>
                    <span style={{color: 'orange'}}>WARNING: </span>
                    Changing the content of the sentence erases existing tags
                </p>
                <Input
                    value={value}
                    onChange={({currentTarget: {value}}) => this.setState(() => ({value}))}
                    size={'large'} fluid
                />
                <br/>
                <Button.Group>
                    <Button
                        basic
                        color={'green'}
                        onClick={() => onSubmit(value)}
                    >
                        Confirm
                    </Button>
                    <Button
                        basic color={'red'}
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </Button>
                </Button.Group>
            </React.Fragment>
        );
    }
}