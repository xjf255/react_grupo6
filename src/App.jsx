import React, { useState, useEffect } from 'react';
import './App.css';
import { FaTruck, FaBox, FaRoute, FaShippingFast } from 'react-icons/fa';

export const TruckIcon = () => <FaTruck />;
export const PackageIcon = () => <FaBox />;
export const RouteIcon = () => <FaRoute />;
export const DeliveryIcon = () => <FaShippingFast />;

function App() {
  const [section, setSection] = useState('transportistas');
  const [transportistas, setTransportistas] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [envios, setEnvios] = useState([]);
  
  const [selectedPaquete, setSelectedPaquete] = useState('');
  const [selectedRuta, setSelectedRuta] = useState('');
  const [resumenEnvio, setResumenEnvio] = useState(null);

  // Formularios para crear o editar
  const [transportistaForm, setTransportistaForm] = useState({ nombre: '', vehiculo: '', placa: '', telefono: '' });
  const [paqueteForm, setPaqueteForm] = useState({ idContenido: '', peso: '' });
  const [rutaForm, setRutaForm] = useState({ origen: '', destino: '', distancia: '' });

  // Editar estado
  const [editingTransportista, setEditingTransportista] = useState(null);
  const [editingPaquete, setEditingPaquete] = useState(null);
  const [editingRuta, setEditingRuta] = useState(null);

  useEffect(() => {
    fetchTransportistas();
    fetchPaquetes();
    fetchRutas();
    fetchEnvios();
  }, []);

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTransportistas = () => fetchData('http://20.121.130.161/grupo6/api/transportistas', setTransportistas);
  const fetchPaquetes = () => fetchData('http://20.121.130.161/grupo6/api/paquetes', setPaquetes);
  const fetchRutas = () => fetchData('http://20.121.130.161/grupo6/api/rutas', setRutas);
  const fetchEnvios = () => fetchData('http://20.121.130.161/grupo6/api/envios', setEnvios);

  // Manejo de formularios
  const handleChange = (e, form, setter) => {
    const { name, value } = e.target;
    setter({ ...form, [name]: value });
  };

  // Crear o actualizar transportista
  const handleSubmitTransportista = async (e) => {
    e.preventDefault();
    const url = editingTransportista
      ? `http://20.121.130.161/grupo6/api/transportistas/${editingTransportista.idtransportista}`
      : 'http://20.121.130.161/grupo6/api/transportistas';

    try {
      const response = await fetch(url, {
        method: editingTransportista ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transportistaForm),
      });

      if (!response.ok) throw new Error('Error al guardar el transportista');
      setTransportistaForm({ nombre: '', vehiculo: '', placa: '', telefono: '' });
      setEditingTransportista(null);
      fetchTransportistas();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Crear o actualizar paquete
  const handleSubmitPaquete = async (e) => {
    e.preventDefault();
    const url = editingPaquete
      ? `http://20.121.130.161/grupo6/api/paquetes/${editingPaquete.idpaquete}`
      : 'http://20.121.130.161/grupo6/api/paquetes';

    try {
      const response = await fetch(url, {
        method: editingPaquete ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paqueteForm),
      });

      if (!response.ok) throw new Error('Error al guardar el paquete');
      setPaqueteForm({ idContenido: '', peso: '' });
      setEditingPaquete(null);
      fetchPaquetes();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Crear o actualizar ruta
  const handleSubmitRuta = async (e) => {
    e.preventDefault();
    const url = editingRuta
      ? `http://20.121.130.161/grupo6/api/rutas/${editingRuta.idruta}`
      : 'http://20.121.130.161/grupo6/api/rutas';

    try {
      const response = await fetch(url, {
        method: editingRuta ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rutaForm),
      });

      if (!response.ok) throw new Error('Error al guardar la ruta');
      setRutaForm({ origen: '', destino: '', distancia: '' });
      setEditingRuta(null);
      fetchRutas();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Eliminar un elemento
  const handleDelete = async (url, fetchFunc) => {
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el elemento');
      fetchFunc();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Editar transportista, paquete o ruta
  const handleEditTransportista = (transportista) => {
    setTransportistaForm(transportista);
    setEditingTransportista(transportista);
  };
  const handleEditPaquete = (paquete) => {
    setPaqueteForm(paquete);
    setEditingPaquete(paquete);
  };
  const handleEditRuta = (ruta) => {
    setRutaForm(ruta);
    setEditingRuta(ruta);
  };

  // Cálculo de Costo de Envío
  const calcularCostoEnvio = () => {
    if (!selectedPaquete || !selectedRuta) {
      alert('Por favor, selecciona un paquete y una ruta.');
      return;
    }

    const paquete = paquetes.find(p => p.idpaquete === parseInt(selectedPaquete));
    const ruta = rutas.find(r => r.idruta === parseInt(selectedRuta));

    if (!paquete || !ruta) {
      alert('Datos inválidos. Verifica tus selecciones.');
      return;
    }

    const peso = paquete.peso;
    const distancia = ruta.distancia;

    // Cálculo del costo según peso y distancia
    let costoPeso = peso > 10 ? (peso - 10) * 2.5 : peso;
    let costoDistancia = distancia < 15 ? 25 : 45;

    const totalCosto = costoPeso + costoDistancia;

    // Selección de transportista aleatorio
    const transportistaRandom = transportistas[Math.floor(Math.random() * transportistas.length)];

    // Actualización del resumen del envío con toda la información
    setResumenEnvio({
      costo: totalCosto,
      paquete,
      ruta,
      transportista: transportistaRandom,
    });
  };

  return (
    <div className="app-container">
      <h1>Gestión de Envíos</h1>
      <div className="nav-buttons">
        <button className={section === 'transportistas' ? 'active' : ''} onClick={() => setSection('transportistas')}>
          <TruckIcon /> Transportistas
        </button>
        <button className={section === 'paquetes' ? 'active' : ''} onClick={() => setSection('paquetes')}>
          <PackageIcon /> Paquetes
        </button>
        <button className={section === 'rutas' ? 'active' : ''} onClick={() => setSection('rutas')}>
          <RouteIcon /> Rutas
        </button>
        <button className={section === 'calculo' ? 'active' : ''} onClick={() => setSection('calculo')}>
          Calcular Costo
        </button>
      </div>

      <div className="content">
        {/* Sección de Transportistas */}
        {section === 'transportistas' && (
          <div>
            <h2>Transportistas</h2>
            <ul>
              {transportistas.map(t => (
                <li key={t.idtransportista}>
                  {t.nombre} - {t.vehiculo} 
                  <button onClick={() => handleEditTransportista(t)}>Editar</button>
                  <button onClick={() => handleDelete(`http://20.121.130.161/grupo6/api/transportistas/${t.idtransportista}`, fetchTransportistas)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmitTransportista}>
              <input
                type="text"
                name="nombre"
                value={transportistaForm.nombre}
                onChange={(e) => handleChange(e, transportistaForm, setTransportistaForm)}
                placeholder="Nombre"
                required
              />
              <input
                type="text"
                name="vehiculo"
                value={transportistaForm.vehiculo}
                onChange={(e) => handleChange(e, transportistaForm, setTransportistaForm)}
                placeholder="Vehículo"
                required
              />
              <input
                type="text"
                name="placa"
                value={transportistaForm.placa}
                onChange={(e) => handleChange(e, transportistaForm, setTransportistaForm)}
                placeholder="Placa"
                required
              />
              <input
                type="text"
                name="telefono"
                value={transportistaForm.telefono}
                onChange={(e) => handleChange(e, transportistaForm, setTransportistaForm)}
                placeholder="Teléfono"
                required
              />
              <button type="submit">{editingTransportista ? 'Actualizar' : 'Agregar'} Transportista</button>
            </form>
          </div>
        )}

        {/* Sección de Paquetes */}
        {section === 'paquetes' && (
          <div>
            <h2>Paquetes</h2>
            <ul>
              {paquetes.map(p => (
                <li key={p.idpaquete}>
                  {p.idContenido} - {p.peso}kg
                  <button onClick={() => handleEditPaquete(p)}>Editar</button>
                  <button onClick={() => handleDelete(`http://20.121.130.161/grupo6/api/paquetes/${p.idpaquete}`, fetchPaquetes)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmitPaquete}>
              <input
                type="text"
                name="idContenido"
                value={paqueteForm.idContenido}
                onChange={(e) => handleChange(e, paqueteForm, setPaqueteForm)}
                placeholder="Contenido"
                required
              />
              <input
                type="number"
                name="peso"
                value={paqueteForm.peso}
                onChange={(e) => handleChange(e, paqueteForm, setPaqueteForm)}
                placeholder="Peso (kg)"
                required
              />
              <button type="submit">{editingPaquete ? 'Actualizar' : 'Agregar'} Paquete</button>
            </form>
          </div>
        )}

        {/* Sección de Rutas */}
        {section === 'rutas' && (
          <div>
            <h2>Rutas</h2>
            <ul>
              {rutas.map(r => (
                <li key={r.idruta}>
                  {r.origen} a {r.destino} - {r.distancia} km
                  <button onClick={() => handleEditRuta(r)}>Editar</button>
                  <button onClick={() => handleDelete(`http://20.121.130.161/grupo6/api/rutas/${r.idruta}`, fetchRutas)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmitRuta}>
              <input
                type="text"
                name="origen"
                value={rutaForm.origen}
                onChange={(e) => handleChange(e, rutaForm, setRutaForm)}
                placeholder="Origen"
                required
              />
              <input
                type="text"
                name="destino"
                value={rutaForm.destino}
                onChange={(e) => handleChange(e, rutaForm, setRutaForm)}
                placeholder="Destino"
                required
              />
              <input
                type="number"
                name="distancia"
                value={rutaForm.distancia}
                onChange={(e) => handleChange(e, rutaForm, setRutaForm)}
                placeholder="Distancia (km)"
                required
              />
              <button type="submit">{editingRuta ? 'Actualizar' : 'Agregar'} Ruta</button>
            </form>
          </div>
        )}

        {/* Sección de Cálculo de Costo */}
        {section === 'calculo' && (
          <div>
            <h2>Cálculo de Costo de Envío</h2>
            <select value={selectedPaquete} onChange={(e) => setSelectedPaquete(e.target.value)} required>
              <option value="">Seleccionar Paquete</option>
              {paquetes.map((p) => (
                <option key={p.idpaquete} value={p.idpaquete}>
                  {p.idContenido} - {p.peso}kg
                </option>
              ))}
            </select>
            <select value={selectedRuta} onChange={(e) => setSelectedRuta(e.target.value)} required>
              <option value="">Seleccionar Ruta</option>
              {rutas.map((r) => (
                <option key={r.idruta} value={r.idruta}>
                  {r.origen} a {r.destino} - {r.distancia} km
                </option>
              ))}
            </select>
            <button onClick={calcularCostoEnvio}>Calcular Costo</button>

            {resumenEnvio && (
              <div>
                <h3>Resumen del Envío:</h3>
                <p><strong>Paquete:</strong> {resumenEnvio.paquete.idContenido} - {resumenEnvio.paquete.peso} kg</p>
                <p><strong>Ruta:</strong> {resumenEnvio.ruta.origen} a {resumenEnvio.ruta.destino} - {resumenEnvio.ruta.distancia} km</p>
                <p><strong>Transportista:</strong> {resumenEnvio.transportista.nombre} - {resumenEnvio.transportista.vehiculo}</p>
                <p><strong>Costo Total de Envío:</strong> {resumenEnvio.costo} quetzales</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
