import * as React from 'react';
import {connect} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import {ColDef, GridApi} from 'ag-grid';
import {stripNERAnnotations} from '../ner/NERUtils';
import {CorpusChooser} from '../corpus/CorpusChooser';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {StoreState} from '../reducers';
import {actions, DispatchProps} from '../reducers/actions';
import {Document} from '../corpus/Document';
import {Edit} from './Edit';
import {Delete} from './Delete';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
    documents: Document[]
}

function mapStateToProps({corpusDescriptors, corpus: {documents}}: StoreState): StateProps {
    return {corpusDescriptors, documents};
}

export const Browse = connect(mapStateToProps, {...actions})(
    class Browse extends React.Component<StateProps & DispatchProps> {

        gridApi: GridApi;

        constructor(props: StateProps & DispatchProps) {
            super(props);
        }

        componentDidMount(): void {
            const {corpusDescriptors} = this.props;
            this.changeCorpus(corpusDescriptors[0]);
        }

        render(): React.ReactNode {

            const rowData: any = this.props.documents;

            const containerStyle = {
                height: 500
            };

            const columnDefs: ColDef[] = [
                {
                    field: 'content',
                    headerName: 'Doc Content',
                    valueFormatter: (params) => stripNERAnnotations(params.value)
                },
                {
                    field: 'createdByNickname',
                    headerName: 'Created By'
                },
                {
                    field: 'createdOn',
                    headerName: 'Created On',
                    valueFormatter: (params) => {
                        const date = new Date(params.value);
                        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    }
                },
                {
                    field: 'lastModifiedByNickname',
                    headerName: 'Last Modified By'
                },
                {
                    field: 'lastModifiedOn',
                    headerName: 'Last Modified',
                    valueFormatter: (params) => {
                        const date = new Date(params.value);
                        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    }
                },
                {
                    colId: 'edit',
                    cellRendererFramework: Edit
                },
                {
                    colId: 'delete',
                    cellRendererFramework: Delete
                }
            ];

            return (
                <div>
                    <CorpusChooser onChange={this.changeCorpus} standalone/>
                    <br/>
                    <div style={containerStyle} className="ag-theme-balham">
                        <AgGridReact
                            enableColResize
                            enableSorting
                            rowData={rowData}
                            columnDefs={columnDefs}
                            onGridReady={this.onGridReady}
                            getRowNodeId={x => x.id}
                            deltaRowDataMode
                        />
                    </div>
                </div>
            );
        }

        private changeCorpus = (corpusDescriptor: CorpusDescriptor) => {
            const {fetchDocuments} = this.props;
            fetchDocuments({corpusID: corpusDescriptor.id});
        };

        private onGridReady = (event: any) => {
            this.gridApi = event.api;
            this.gridApi.sizeColumnsToFit();
        };
    }
);
