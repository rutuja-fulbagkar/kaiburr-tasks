import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Plot from 'react-plotly.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TableData.css';

export default function TableData() {
    const columns = [
        {
            cell: (row) => <input type="checkbox" checked={row.selected} onChange={() => handleCheckboxChange(row)} />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: false,
            width: '30px',
        },
        {
            name: 'Sr.No',
            selector: (row) => row.id,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Count',
            selector: (row) => row.price,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    const gettabledata = async () => {
        try {
            const req = await fetch('https://fakestoreapi.com/products');
            const res = await req.json();

            // Initially check the first 5 checkboxes
            const initialData = res.map((item, index) => ({
                ...item,
                selected: index < 5,
            }));

            setData(initialData);
            setFilter(initialData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        gettabledata();
    }, []);

    useEffect(() => {
        const result = data.filter((item) => {
            return item.title.toLowerCase().includes(search.toLowerCase());
        });
        setFilter(result);
    }, [search, data]);

    useEffect(() => {
      
        const selectedNumericValues = filter
            .filter((item) => item.selected)
            .map((item) => item.price);

        setSelectedValues(selectedNumericValues);
    }, [filter]);

    const handleCheckboxChange = (row) => {
        const updatedData = data.map((item) => {
            if (item.id === row.id) {
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        setData(updatedData);
    };

    const tableHeaderStyle = {
        headCells: {
            style: {
                backgroundColor: '#baccd1',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '16px',
            }
        }
    }
    return (
        <div className="container mt-4">
            <h4 className="text-center mb-4">Single Page Application with Data Table and Bar Chart Visualization</h4>
            <div className="row">
                <div className="col-md-6">
                    <DataTable
                        columns={columns}
                        customStyles={tableHeaderStyle}
                        data={filter}
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        subHeader
                        subHeaderComponent={
                            <input
                                type='search'
                                className='form-control'
                                placeholder='Search  bar...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        }
                        subHeaderAlign='center'
                        fixedHeader
                        fixedHeaderScrollHeight="340px"

                        style={{
                            width: '100%',
                            tableLayout: 'fixed',
                        }}
                    />
                </div>

                {selectedValues.length > 0 && (
                    <div className="col-md-6">
                        <Plot
                            data={[
                                {
                                    type: 'bar',
                                    x: selectedValues.map((value, index) => `Bar ${index + 1}`),
                                    y: selectedValues,
                                },
                            ]}
                            layout={{
                                width: '100%',
                                height: '100%',
                                title: 'Selected Numeric Values as Bars',
                                responsive: true,
                                autosize: true,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
