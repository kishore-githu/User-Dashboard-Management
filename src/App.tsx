import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TableSortLabel } from '@mui/material';


type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
};


type FormData = {
  name: string;
  email: string;
  role: string;
};

const App = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);  
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<keyof UserProfile>('name');

  
  const onSubmit = (data: FormData) => {
    if (editUser) {
      
      setUsers(users.map(user => user.id === editUser.id ? { ...user, ...data } : user));
      setEditUser(null); // Reset edit state
    } else {
      
      const newUser: UserProfile = {
        id: Date.now(),
        ...data
      };
      setUsers([...users, newUser]);
    }
    setOpen(false); 
    reset(); 
  };

  
  const handleOpen = (user?: UserProfile) => {
    if (user) {
      setEditUser(user); 
      reset(user); 
    } else {
      setEditUser(null); 
      reset({ name: '', email: '', role: '' }); 
    }
    setOpen(true); 
  };

  
  const handleClose = () => {
    setOpen(false); 
    reset(); 
    setEditUser(null);
  };

  
  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10)); 
    setPage(0); 
  };

  
  const handleSort = (property: keyof UserProfile) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add User</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'email'}
                  direction={sortBy === 'email' ? sortOrder : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'role'}
                  direction={sortBy === 'role' ? sortOrder : 'asc'}
                  onClick={() => handleSort('role')}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(user.id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage} 
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Name is required" }}
              render={({ field }) => <TextField {...field} label="Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email" } }}
              render={({ field }) => <TextField {...field} label="Email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />}
            />
            <Controller
              name="role"
              control={control}
              defaultValue=""
              rules={{ required: "Role is required" }}
              render={({ field }) => <TextField {...field} label="Role" fullWidth margin="normal" error={!!errors.role} helperText={errors.role?.message} />}
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button type="submit" color="primary">{editUser ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
