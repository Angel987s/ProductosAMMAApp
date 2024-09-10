import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/productosAMMA'; // Ajusta esto según tu configuración

interface Producto {
  _id: string;
  nombreAMMA: string;
  descripcionAMMA: string;
  precio: number;
}

const App: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombreAMMA, setNombreAMMA] = useState('');
  const [descripcionAMMA, setDescripcionAMMA] = useState('');
  const [precio, setPrecio] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get<Producto[]>(API_URL);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { nombreAMMA, descripcionAMMA, precio: Number(precio) });
      } else {
        await axios.post(API_URL, { nombreAMMA, descripcionAMMA, precio: Number(precio) });
      }
      fetchProductos();
      clearForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  const handleEdit = (producto: Producto) => {
    setNombreAMMA(producto.nombreAMMA);
    setDescripcionAMMA(producto.descripcionAMMA);
    setPrecio(producto.precio.toString());
    setEditingId(producto._id);
  };

  const clearForm = () => {
    setNombreAMMA('');
    setDescripcionAMMA('');
    setPrecio('');
    setEditingId(null);
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.nombreAMMA}</Text>
      <Text>{item.descripcionAMMA}</Text>
      <Text>Precio: ${item.precio}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.button}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Productos AMMA</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombreAMMA}
        onChangeText={setNombreAMMA}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcionAMMA}
        onChangeText={setDescripcionAMMA}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Button 
        title={editingId ? "Actualizar Producto" : "Agregar Producto"} 
        onPress={handleSubmit} 
      />
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default App;