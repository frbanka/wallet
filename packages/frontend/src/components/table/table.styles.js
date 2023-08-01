import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';

export const CustomTablePagination = styled(TablePagination)({
  '& .MuiSelect-select': {
    minHeight: 'auto',
  },
  '& .MuiToolbar-root': {
    display: 'inline-flex',
    paddingLeft: '120px',
  },
  '& .MuiSvgIcon-root': {
    width: '20px',
    height: '20px',
  },
});
