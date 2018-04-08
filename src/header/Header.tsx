import * as React from 'react';
import {connect} from 'react-redux';
import {Container, Icon, Menu} from 'semantic-ui-react';
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
                    <Menu.Item as={'a'} onClick={() => history.push('/')}>
                        <Icon name={'signal'} color={'teal'}/>
                        Sesame Lab
                    </Menu.Item>
                    <Container>
                        <Menu.Item as={'a'} onClick={() => history.push('/tag')}>Tag Sentence</Menu.Item>
                        <Menu.Item as={'a'} onClick={() => history.push('/browse')}>Browse</Menu.Item>
                    </Container>
                </Menu>
            );
        }
    }
);
