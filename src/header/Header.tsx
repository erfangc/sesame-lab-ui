import * as React from 'react';
import {connect} from 'react-redux';
import {Container, Menu} from 'semantic-ui-react';

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
                        <Menu.Item as={'a'}>My Profile</Menu.Item>
                        <Menu.Item as={'a'}>Workspace</Menu.Item>
                        <Menu.Item as={'a'}>Browse</Menu.Item>
                    </Container>
                </Menu>
            );
        }
    }
);
