import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DoneIcon from '@mui/icons-material/Done';
import { visuallyHidden } from '@mui/utils';
import { useContext } from 'react';
import { AppContext } from '../../../utils/AppContextProvider';
import Loading from '../../../utils/Loading';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export default function Tasks() {
    const DEFAULT_ORDER = 'asc';
    const DEFAULT_ORDER_BY = 'type';
    const DEFAULT_ROWS_PER_PAGE = 5;

    const [order, setOrder] = useState(DEFAULT_ORDER);
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [visibleRows, setVisibleRows] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
    const [paddingHeight, setPaddingHeight] = useState(0);
    const { deleteTask, claimTask, completeTask, loggedInUser } = useContext(AppContext)
    const [isClicked, setIsClicked] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function getTeamsTasks() {
            const teamTasks = [];
            const { data } = await axios.get(`${API_BASE_URL}/api/team/${loggedInUser.team}/patient_list`);

            for (const patient of data) {
                const { data } = await axios.get(`${API_BASE_URL}/api/task/incompletetasks/${patient._id}`);
                for (const db_task of data) {

                    let clinician;
                    if (db_task.clinician) { clinician = db_task.clinician.fname + " " + db_task.clinician.lname } else {
                        clinician = ""
                    }

                    const task = {
                        _id: db_task._id,
                        name: db_task.name,
                        type: db_task.type,
                        patient: db_task.patient.fname + " " + db_task.patient.lname,
                        clinician: clinician,
                        priority: db_task.priority,
                        time: db_task.created_at
                    }
                    teamTasks.push(task)
                }

            }
            setTasks(teamTasks);
        }
        getTeamsTasks();
    }, [isClicked]);

    //Table headers,toolbars etc.
    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Tasks',
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'Type',
        },
        {
            id: 'patient',
            numeric: false,
            disablePadding: false,
            label: 'Patient',
        },
        {
            id: 'clinician',
            numeric: false,
            disablePadding: false,
            label: 'Clinician',
        },
        {
            id: 'priority',
            numeric: true,
            disablePadding: false,
            label: 'Priority',
        },
        {
            id: 'time',
            numeric: true,
            disablePadding: false,
            label: 'Time',
        },
    ];

    function EnhancedTableHead(props) {
        const { order, orderBy, numSelected, rowCount, onRequestSort } =
            props;
        const createSortHandler = (newOrderBy) => (event) => {
            onRequestSort(event, newOrderBy);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox" />
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.id == 'name' ? 'left' : 'right'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
    EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    function EnhancedTableToolbar(props) {
        const { numSelected, tasksSelected } = props;

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Patient Tasks
                    </Typography>
                )}

                {numSelected > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Tooltip title="Claim">
                            <IconButton onClick={() => {
                                claimTask(tasksSelected)
                                setSelected([])
                                setIsClicked(bool => !bool)
                            }}>
                                <DoneOutlineIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Done">
                            <IconButton onClick={() => {
                                completeTask(tasksSelected)
                                setSelected([])
                                setIsClicked(bool => !bool)
                            }}>
                                <DoneIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={() => {
                                deleteTask(tasksSelected)
                                setSelected([])
                                setIsClicked(bool => !bool)
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ) : (
                    <Box></Box>
                )
                }
            </Toolbar >
        );
    }
    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
    };

    //Table cells
    useEffect(() => {
        let comparatorOrder;
        let comparatorOrderBy;
        if (visibleRows != null) {
            comparatorOrder = order;
            comparatorOrderBy = orderBy;
        } else {
            comparatorOrder = DEFAULT_ORDER;
            comparatorOrderBy = DEFAULT_ORDER_BY;
        }

        let rowsOnMount = stableSort(
            tasks,
            getComparator(comparatorOrder, comparatorOrderBy),
        );

        if (visibleRows != null) {
            rowsOnMount = rowsOnMount.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );
        } else {
            rowsOnMount = rowsOnMount.slice(
                0 * DEFAULT_ROWS_PER_PAGE,
                0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
            );
        }

        setVisibleRows(rowsOnMount);
    }, [tasks]);

    const handleRequestSort = useCallback(
        (event, newOrderBy) => {
            const isAsc = orderBy === newOrderBy && order === 'asc';
            const toggledOrder = isAsc ? 'desc' : 'asc';
            setOrder(toggledOrder);
            setOrderBy(newOrderBy);

            const sortedRows = stableSort(tasks, getComparator(toggledOrder, newOrderBy));
            const updatedRows = sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);
        },
        [order, orderBy, page, rowsPerPage, tasks],
    );

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = useCallback(
        (event, newPage) => {
            setPage(newPage);

            const sortedRows = stableSort(tasks, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(
                newPage * rowsPerPage,
                newPage * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);

            // Avoid a layout jump when reaching the last page with empty rows.
            const numEmptyRows =
                newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - tasks.length) : 0;

            const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
            setPaddingHeight(newPaddingHeight);
        },
        [order, orderBy, dense, rowsPerPage, tasks],
    );
    const handleChangeRowsPerPage = useCallback(
        (event) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);

            setPage(0);

            const sortedRows = stableSort(tasks, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(
                0 * updatedRowsPerPage,
                0 * updatedRowsPerPage + updatedRowsPerPage,
            );

            setVisibleRows(updatedRows);
            setPaddingHeight(0);
        },
        [order, orderBy, tasks],
    );

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;

    function formatDate(dateString) {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() / 60;
        const nzOffset = 12;
        const hours = (date.getHours() + offset + nzOffset).toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        return `${day}-${month} ${hours}:${minutes}`;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} tasksSelected={selected} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={tasks.length}
                        />
                        <TableBody>
                            {visibleRows
                                ? visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row._id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row._id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row._id}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.type}</TableCell>
                                            <TableCell align="right">{row.patient}</TableCell>
                                            <TableCell align="right">{row.clinician}</TableCell>
                                            <TableCell align="right">{row.priority}</TableCell>
                                            <TableCell align="right">{formatDate(row.time)}</TableCell>
                                        </TableRow>
                                    );
                                })
                                : null}
                            {paddingHeight > 0 && (
                                <TableRow
                                    style={{
                                        height: paddingHeight,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tasks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );


}