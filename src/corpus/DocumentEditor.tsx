import * as React from 'react';
import {Button, Input} from 'semantic-ui-react';

interface Props {
    value: string
    onSubmit: (newValue: string) => void
    onCancel: () => void
}

interface State {
    value: string
    error?: string
}

export class DocumentEditor extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    render(): React.ReactNode {
        const {onCancel} = this.props;
        const {value, error} = this.state;
        return (
            <React.Fragment>
                {
                    !error
                        ?
                        <p>
                            <span style={{color: 'orange'}}>WARNING: </span>
                            Changing the content of the sentence erases existing tags
                        </p>
                        :
                        <p>{error}</p>
                }
                <Input
                    value={value}
                    error={!!error}
                    onChange={({currentTarget: {value}}) => this.setState(() => ({value, error: undefined}))}
                    size={'large'}
                    fluid
                />
                <br/>
                <Button.Group>
                    <Button
                        basic
                        color={'green'}
                        onClick={() => this.onSubmit(value)}
                    >f
                        Confirm
                    </Button>
                    <Button
                        basic
                        color={'red'}
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </Button>
                </Button.Group>
            </React.Fragment>
        );
    }

    private onSubmit = (value: string) => {
        const {onSubmit} = this.props;
        if (!value) {
            this.setState(() => ({error: 'Your Input Cannot be Blank'}));
        } else {
            onSubmit(value);
        }
    };

}