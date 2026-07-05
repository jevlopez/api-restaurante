const fetch = global.fetch || require('node-fetch');
const app = require('./app');
const http = require('http');

const PORT = 4000;

const server = http.createServer(app);

const startServer = () => new Promise((resolve) => server.listen(PORT, resolve));
const stopServer = () => new Promise((resolve) => server.close(resolve));

const email = `test${Date.now()}@example.com`;
const mesaNumero = Math.floor(Date.now() / 1000);

(async () => {
  try {
    await startServer();
    console.log('Servidor de prueba iniciado en', PORT);

    const registerResponse = await fetch(`http://localhost:${PORT}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Test', correo: email, password: 'Secret123!' }),
    });
    const registerBody = await registerResponse.json();
    console.log('REGISTER', registerResponse.status, registerBody);

    const loginResponse = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password: 'Secret123!' }),
    });
    const loginBody = await loginResponse.json();
    console.log('LOGIN', loginResponse.status, loginBody);

    if (loginResponse.status !== 200) {
      throw new Error('Login falló');
    }

    const token = loginBody.token;
    const createMesaResponse = await fetch(`http://localhost:${PORT}/api/mesas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ numero: mesaNumero, capacidad: 4, disponible: true }),
    });
    const createMesaBody = await createMesaResponse.json();
    console.log('CREATE MESA', createMesaResponse.status, createMesaBody);
    const mesaId = createMesaBody.id;

    const getMesasResponse = await fetch(`http://localhost:${PORT}/api/mesas`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const getMesasBody = await getMesasResponse.json();
    console.log('GET MESAS', getMesasResponse.status, Array.isArray(getMesasBody) ? getMesasBody.length : getMesasBody);

    const getMesaResponse = await fetch(`http://localhost:${PORT}/api/mesas/${mesaId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const getMesaBody = await getMesaResponse.json();
    console.log('GET MESA', getMesaResponse.status, getMesaBody);

    const updateMesaResponse = await fetch(`http://localhost:${PORT}/api/mesas/${mesaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ capacidad: 6, disponible: false }),
    });
    const updateMesaBody = await updateMesaResponse.json();
    console.log('UPDATE MESA', updateMesaResponse.status, updateMesaBody);

    const reservacionResponse = await fetch(`http://localhost:${PORT}/api/reservaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mesa_id: mesaId, fecha: new Date().toISOString().split('T')[0], hora: '20:00', personas: 4 }),
    });
    const reservacionBody = await reservacionResponse.json();
    console.log('RESERVACION', reservacionResponse.status, reservacionBody);

    const cleanupReservacionResponse = await fetch(`http://localhost:${PORT}/api/reservaciones/${reservacionBody.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const cleanupReservacionBody = await cleanupReservacionResponse.json();
    console.log('CLEANUP RESERVACION', cleanupReservacionResponse.status, cleanupReservacionBody);

    const cleanupMesaResponse = await fetch(`http://localhost:${PORT}/api/mesas/${mesaId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const cleanupMesaBody = await cleanupMesaResponse.json();
    console.log('CLEANUP MESA', cleanupMesaResponse.status, cleanupMesaBody);

    if (registerResponse.status !== 201 || loginResponse.status !== 200 || getMesasResponse.status !== 200 || getMesaResponse.status !== 200 || updateMesaResponse.status !== 200 || cleanupReservacionResponse.status !== 200 || cleanupMesaResponse.status !== 200) {
      process.exit(1);
    }
  } catch (error) {
    console.error('ERROR:', error.message || error);
    process.exit(1);
  } finally {
    await stopServer();
    console.log('Servidor de prueba detenido');
  }
})();
