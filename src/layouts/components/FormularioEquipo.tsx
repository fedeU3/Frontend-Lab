import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';

interface IFormProps {
  onClose: () => void;
  onAdd: (equipo: string) => void;
}

const FormularioEquipo = ({ onClose, onAdd }: IFormProps) => {
  const [equipo, setEquipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');

  const handleSubmit = () => {
    onAdd(equipo);
    onClose();
  };

  return (
    <Box sx={{ padding: '2rem', borderRadius: '1rem' }}>
      <Card sx={{ padding: '2rem' }}>
        <CardContent>
          <Typography variant='h5' align='center' gutterBottom>
            Agregar Equipo
          </Typography>
          <Box
            component={'form'}
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <TextField
              label='Nombre del Equipo'
              variant='outlined'
              fullWidth
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
            />
            <TextField
              label='Categoría'
              variant='outlined'
              fullWidth
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
            <TextField
              label='Precio por hora'
              variant='outlined'
              fullWidth
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
            <TextField
              label='Marca y modelo'
              variant='outlined'
              fullWidth
              value={marcaModelo}
              onChange={(e) => setMarcaModelo(e.target.value)}
            />
            <Button variant='contained' fullWidth sx={{ fontWeight: 'bold' }} onClick={handleSubmit}>
              Guardar
            </Button>
            <Button
              variant='outlined'
              fullWidth
              sx={{ fontWeight: 'bold' }}
              onClick={onClose}
            >
              Cancelar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormularioEquipo;
