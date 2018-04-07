import * as React from 'react';
import {Button, Grid, Header, Message, Segment} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {history} from './History';
import {auth0Handler} from './reducers/auth/auth0/Auth0Handler';
import {StoreState} from './reducers';

interface StateProps {
    isAuthenticated: boolean
}

function mapStateToProps({auth: {isAuthenticated}}: StoreState): StateProps {
    return {isAuthenticated};
}

export const Login = connect(mapStateToProps)(
    class Login extends React.Component<StateProps> {

        componentDidMount(): void {
            const {isAuthenticated} = this.props;
            if (isAuthenticated) {
                history.push('/');
            }
        }

        render(): React.ReactNode {
            /*
              Heads up! The styles below are necessary for the correct render of this example.
              You can do same with CSS, the main idea is that all the elements up to the `Grid`
              below must have a height of 100%.
            */
            return (
                <div className="login-form">
                    <style>
                        {`
                        body > div,
                        body > div > div,
                        body > div > div > div.login-form {
                        height: 100%;
                        }
                    `}
                    </style>
                    <Grid
                        textAlign="center"
                        style={{height: '100%'}}
                        verticalAlign="middle"
                    >
                        <Grid.Column style={{maxWidth: 450}}>
                            <Header as="h2" textAlign="center">
                                Log into your account
                            </Header>
                            <Segment>
                                <Button primary fluid size="large" onClick={() => auth0Handler.login()}>Login</Button>
                                <Message>
                                    New to us? <a href="#">Sign Up</a>
                                </Message>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </div>
            );
        }
    }
);
