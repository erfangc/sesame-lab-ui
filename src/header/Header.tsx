import * as React from 'react';
import {connect} from 'react-redux';
import {Dropdown, Container, Icon, Menu} from 'semantic-ui-react';
import {history} from '../History';
import {actions, DispatchProps} from '../reducers/actions';

interface StateProps {

}

function mapStateToProps(): StateProps {
    return {};
}

export const Header = connect(mapStateToProps, {...actions})(
    class Header extends React.Component<StateProps & DispatchProps> {
        render(): React.ReactNode {
            const {logout} = this.props;
            return (
                <Menu fixed={'top'} inverted>
                    <Menu.Item as={'a'} onClick={() => history.push('/')}>
                        <Icon name={'signal'} color={'teal'}/>
                        Sesame Lab
                    </Menu.Item>
                    <Dropdown item simple text={'Corpus'}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} onClick={() => history.push('/tag')}>Tag Sentence</Dropdown.Item>
                            <Dropdown.Item as={'a'} onClick={() => history.push('/browse')}>Browse</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown item simple text={'Model'}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} onClick={() => history.push('/train')}>Train a Model</Dropdown.Item>
                            <Dropdown.Item as={'a'} onClick={() => history.push('/models')}>View Models</Dropdown.Item>
                            <Dropdown.Item as={'a'} onClick={() => history.push('/run')}>Run Model</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Menu position={'right'}>
                        <Menu.Item as={'a'} onClick={() => logout()}>Logout</Menu.Item>
                    </Menu.Menu>

                </Menu>
            );
        }
    }
);
