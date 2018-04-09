import * as React from 'react';
import {connect} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import {ColDef, GridApi} from 'ag-grid';
import {stripNERAnnotations} from '../ner/NERUtils';
import {CorpusChooser} from '../corpus/CorpusChooser';
import {CorpusDescriptor} from '../reducers/corpusDescriptors/corpusDescriptorReducer';
import {apiRoot} from '../index';
import axios from 'axios';
import {StoreState} from '../reducers';
import {actions, DispatchProps} from '../reducers/actions';
import {Document} from '../corpus/Document';
import {Edit} from './Edit';

interface StateProps {
    corpusDescriptors: CorpusDescriptor[]
}

function mapStateToProps({corpusDescriptors}: StoreState): StateProps {
    return {corpusDescriptors};
}

interface State {
    documents: Document[]
}

export const Browse = connect(mapStateToProps, {...actions})(
    class Browse extends React.Component<StateProps & DispatchProps, State> {

        gridApi: GridApi;

        constructor(props: StateProps & DispatchProps) {
            super(props);
            this.state = {
                documents: []
            };
        }

        componentDidMount(): void {
            const {corpusDescriptors} = this.props;
            this.changeCorpus(corpusDescriptors[0]);
        }

        render(): React.ReactNode {

            const rowData: any = this.state.documents;

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
                        />
                    </div>
                </div>
            );
        }

        private changeCorpus = (corpusDescriptor: CorpusDescriptor) => {
            axios
                .get<Document[]>(`${apiRoot}/api/v1/corpus/${corpusDescriptor.id}/by-creator`)
                .then(({data: documents}) => this.setState(() => ({documents})));
        };

        private onGridReady = (event: any) => {
            this.gridApi = event.api;
            this.gridApi.sizeColumnsToFit();
        };
    }
);
