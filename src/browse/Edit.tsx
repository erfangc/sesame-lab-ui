import * as React from 'react';
import {connect} from 'react-redux';
import {actions, DispatchProps} from '../reducers/actions';
import {Document} from '../document/Document';
import {ICellRendererParams} from 'ag-grid';
import {history} from '../History';

export const Edit = connect(null, {...actions})(
    class Edit extends React.Component<DispatchProps & ICellRendererParams> {
        render(): React.ReactNode {
            const {setActiveDocument} = this.props;
            const document: Document = this.props.data;
            return (
                <a
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                        setActiveDocument(document);
                        history.push('/tag');
                    }}
                >
                    Edit
                </a>
            );
        }
    }
);
