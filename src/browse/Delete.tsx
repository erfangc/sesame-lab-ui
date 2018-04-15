import * as React from 'react';
import {connect} from 'react-redux';
import {actions, DispatchProps} from '../reducers/actions';
import {Document} from '../corpus/Document';
import {ICellRendererParams} from 'ag-grid';

export const Delete = connect(null, {...actions})(
    class Delete extends React.Component<DispatchProps & ICellRendererParams> {
        render(): React.ReactNode {
            const {deleteDocument} = this.props;
            const {corpus, id}: Document = this.props.data;
            return (
                <a
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                        if (id) {
                            deleteDocument({corpusID: corpus, id})
                        }
                    }}
                >
                    Delete
                </a>
            );
        }
    }
);
