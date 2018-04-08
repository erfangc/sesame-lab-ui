import * as React from 'react';
import {connect} from 'react-redux';
import {Header, Icon} from 'semantic-ui-react';
import {history} from './History';

interface StateProps {

}

function mapStateToProps(): StateProps {
    return {};
}

export const Home = connect(mapStateToProps)(
    class Home extends React.Component<StateProps> {
        render(): React.ReactNode {
            return (
                <Header textAlign={'center'} icon>
                    <Icon name={'users'} circular/>
                    <Header.Content>
                        Welcome! Click <a onClick={() => history.push('/tag')}>Here</a> to Get Started!
                    </Header.Content>
                </Header>
            );
        }
    }
);
