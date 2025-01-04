import React, { useMemo, useState } from 'react';
import { toAbsoluteUrl } from '@/utils'; 
import { Person, QueryApiResponse } from "./person-models";
import {
  DataGrid,
  DataGridColumnHeader,
  TDataGridRequestParams,
  KeenIcon,
  useDataGrid,
  DataGridRowSelectAll,
  DataGridRowSelect
} from '@/components';
import { ColumnDef, Column, RowSelectionState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { CommonRating } from '@/partials/common';
import axios from 'axios';
import { formatIsoDate } from '@/utils/Date'; 

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const EnforceSwitch = ({ enforce }: { enforce: boolean }) => {
  return (
    <label className="switch switch-sm">
      <input type="checkbox" checked={enforce} value="1" readOnly />
    </label>
  );
};

type PersonsQueryApiResponse = QueryApiResponse<Person>;

const Persons = () => {
  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    const [inputValue, setInputValue] = useState((column.getFilterValue() as string) ?? '');

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        column.setFilterValue(inputValue); // Apply the filter only on Enter
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value); // Update local state
    };

    return (
      <Input
        placeholder="Filter..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Trigger filter on Enter key
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      }, 
      {
        accessorFn: (row: Person) => row.first_name,
        id: 'first_name',
        header: ({ column }) => <DataGridColumnHeader title="Enforce 2FA" column={column} />,
        enableSorting: true,
        cell: (info: any) => <EnforceSwitch enforce={info.row.original.role} />,
        meta: {
          headerClassName: 'min-w-[137px]',
          cellClassName: 'text-gray-800 font-medium'
        }
      },
      {
        accessorFn: (row: Person) => row.last_name,
        id: 'last_name',
        header: ({ column }) => <DataGridColumnHeader title="Enforce 2FA" column={column} />,
        enableSorting: true,
        cell: (info: any) => <EnforceSwitch enforce={info.row.original.role} />,
        meta: {
          headerClassName: 'min-w-[137px]',
          cellClassName: 'text-gray-800 font-medium'
        }
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Invoices" column={column} />,
        enableSorting: true,
        cell: () => <button className="btn btn-link">Download</button>,
        meta: {
          headerClassName: 'w-28',
          cellClassName: 'text-gray-800 font-medium'
        }
      }
    ],
    []
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async (params: TDataGridRequestParams) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.set('page', String(params.pageIndex + 1)); // Page is 1-indexed on server
      queryParams.set('items_per_page', String(params.pageSize));

      if (params.sorting?.[0]?.id) {
        queryParams.set('sort', params.sorting[0].id);
        queryParams.set('order', params.sorting[0].desc ? 'desc' : 'asc');
      }

      if (searchQuery.trim().length > 0) {
        queryParams.set('query', searchQuery);
      }

      // Column filters
      if (params.columnFilters) {
        params.columnFilters.forEach(({ id, value }) => {
          if (value !== undefined && value !== null) {
            queryParams.set(`filter[${id}]`, String(value)); // Properly serialize filter values
          }
        });
      }

      const apiUrl = "http://localhost:5000/persons/"
      const response = await axios.get<PersonsQueryApiResponse>(
        //`${import.meta.env.VITE_APP_API_URL}/users/query?${queryParams.toString()}`
        `${apiUrl}?${queryParams.toString()}`
      );

      return {
        data: response.data.data, // Server response data
        totalCount: response.data.pagination.total // Total count for pagination
      };
    } catch (error) {
      console.log(error);
      toast(`Connection Error`, {
        description: `An error occurred while fetching data. Please try again later`,
        action: {
          label: 'Ok',
          onClick: () => console.log('Ok')
        }
      });

      return {
        data: [],
        totalCount: 0
      };
    }
  };

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    const [searchInput, setSearchInput] = useState('');

    return (
      <div className="card-header flex-wrap gap-2 border-b-0 px-5">
        <h3 className="card-title font-medium text-sm">howing 10 of 49,053 users</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                type="text"
                placeholder="Search users"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Select defaultValue="active">
              <SelectTrigger className="w-28" size="sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="w-32">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="latest">
              <SelectTrigger className="w-28" size="sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="w-32">
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="older">Older</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>

            <button className="btn btn-sm btn-outline btn-primary">
              <KeenIcon icon="setting-4" /> Filters
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <DataGrid
      columns={columns}
      serverSide={true}
      onFetchData={fetchUsers}
      rowSelection={true}
      getRowId={(row: any) => row.id}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5 }}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
  // return (
  //   <DataGrid
  //     columns={columns}
  //     data={data}
  //     rowSelection={true}
  //     onRowSelectionChange={handleRowSelection}
  //     pagination={{ size: 5 }}
  //     sorting={[{ id: 'user', desc: false }]}
  //     toolbar={<Toolbar />}
  //     layout={{ card: true }}
  //   />
  // );
};

export { Persons };
