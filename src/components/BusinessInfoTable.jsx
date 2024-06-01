import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const BusinessInfoTable = () => {
  const [info, setInfo] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [currentRecord, setCurrentRecord] = useState({ key: '', value: '' });
  const [editMode, setEditMode] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL);
      const data = Object.entries(response.data).map(([key, value]) => ({ key, value }));
      setInfo(data);
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const key = recordToDelete.key;
    const newInfo = info.filter(record => record.key !== key);
    setInfo(newInfo);
    axios.post(process.env.NEXT_PUBLIC_API_URL, Object.fromEntries(newInfo.map(record => [record.key, record.value])))
      .then(() => {
        showSnackbar('Registro eliminado correctamente', 'success');
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        showSnackbar('Error al eliminar el registro', 'error');
      });
  };

  const handleAdd = () => {
    setCurrentRecord({ key: '', value: '' });
    setEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const existingRecord = info.find(record => record.value === currentRecord.value);

    if (existingRecord && !editMode) {
      showSnackbar('El valor ya existe, no se puede duplicar', 'error');
      return;
    }

    const newInfo = editMode ? info.map(record => (record.key === currentRecord.key ? currentRecord : record)) : [...info, currentRecord];
    setInfo(newInfo);
    axios.post(process.env.NEXT_PUBLIC_API_URL, Object.fromEntries(newInfo.map(record => [record.key, record.value])))
      .then(() => {
        showSnackbar(editMode ? 'Registro actualizado correctamente' : 'Registro agregado correctamente', 'success');
        handleClose();
      })
      .catch((error) => {
        console.error('Error saving record:', error);
        showSnackbar('Error al guardar el registro', 'error');
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className='p-5'>
      <div className='flex items-center gap-2'>
        <TextField label="Buscar" variant="outlined" fullWidth margin="normal" value={search} onChange={handleSearch} />
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd} className='flex h-10 w-56'>
          Agregar Registro
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className='bg-blue-500 '>
              <TableCell className='text-white font-semibold'>Campo</TableCell>
              <TableCell className='text-white font-semibold'>Valor</TableCell>
              <TableCell className='text-white font-semibold'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info
              .filter(record => record.key.includes(search) || record.value.includes(search))
              .map(record => (
                <TableRow key={record.key}>
                  <TableCell>{record.key.replace(/_/g, ' ')}</TableCell>
                  <TableCell>{record.value}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(record)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(record)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Editar Registro' : 'Agregar Registro'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, completa los siguientes campos.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Campo"
            fullWidth
            variant="outlined"
            value={currentRecord.key}
            onChange={(e) => setCurrentRecord({ ...currentRecord, key: e.target.value })}
            disabled={editMode}
          />
          <TextField
            margin="dense"
            label="Valor"
            fullWidth
            variant="outlined"
            value={currentRecord.value}
            onChange={(e) => setCurrentRecord({ ...currentRecord, value: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BusinessInfoTable;
