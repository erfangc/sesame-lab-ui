import * as React from 'react';
import {connect} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import {ColDef, GridApi} from 'ag-grid';
import axios from 'axios';
import {apiRoot} from '../index';

interface StateProps {

}

function mapStateToProps(): StateProps {
    return {};
}

interface State {
    documents: Document[]
}

export const Browse = connect(mapStateToProps)(
    class Browse extends React.Component<StateProps, State> {

        gridApi: GridApi;

        constructor(props: StateProps) {
            super(props);
            this.state = {
                documents: []
            };
        }

        componentDidMount(): void {
            axios
                .get<Document[]>(`${apiRoot}/api/v1/corpus/test/by-creator`)
                .then(({data: documents}) => this.setState(() => ({documents})));
        }

        render(): React.ReactNode {

            const rowData: any = this.state.documents;

            const containerStyle = {
                height: 500
            };

            const columnDefs: ColDef[] = [
                {'field': 'Content', headerName: 'Content'},
                {'field': 'CreatedBy', headerName: 'Created By'},
                {'field': 'CreatedOn', headerName: 'Created On'},
                {'field': 'LastModifiedBy', headerName: 'Last Modified By'},
                {'field': 'LastModified', headerName: 'Last Modified'},
                {'field': 'Corpus', headerName: 'Corpus'}
            ];

            return (
                <div style={containerStyle} className="ag-theme-balham">
                    <AgGridReact
                        enableColResize
                        enableSorting
                        rowData={rowData}
                        columnDefs={columnDefs}
                        onGridReady={this.onGridReady}
                    />
                </div>
            );
        }

        private onGridReady = (event: any) => {
            this.gridApi = event.api;
            this.gridApi.sizeColumnsToFit();
        };
    }
);
