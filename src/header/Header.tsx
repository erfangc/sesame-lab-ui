import * as React from 'react';
import {connect} from 'react-redux';
import {Container, Menu} from 'semantic-ui-react';
import {history} from '../History';

interface StateProps {

}

function mapStateToProps(): StateProps {
    return {};
}

export const Header = connect(mapStateToProps)(
    class Header extends React.Component<StateProps> {
        render(): React.ReactNode {
            return (
                <Menu fixed={'top'} inverted>
                    <Container>
                        <Menu.Item as={'a'} onClick={() => history.push('/tag')}>Train</Menu.Item>
                        <Menu.Item as={'a'}>Browse Traning Data Set</Menu.Item>
                        <Menu.Item as={'a'}>Create a Model</Menu.Item>
                        <Menu.Item as={'a'}>Test</Menu.Item>
                    </Container>
                </Menu>
            );
        }
    }
);
