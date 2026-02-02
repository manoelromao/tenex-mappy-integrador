import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const {
  PORT,
  MAPPY_BASE_URL,
  MAPPY_TOKEN
} = process.env;

// Webhook TENEX → MAPPY
app.post('/webhook/tenex/clientes', async (req, res) => {
  try {
    const tenex = req.body;

    // MAPEAMENTO SIMPLES
    const paciente = {
      name: tenex.nome,
      cpf: tenex.cpf,
      email: tenex.email,
      phone: tenex.telefone
    };

    await axios.post(
      `${MAPPY_BASE_URL}/patients`,
      paciente,
      {
        headers: {
          Authorization: `Bearer ${MAPPY_TOKEN}`
        }
      }
    );

    console.log('Paciente criado:', paciente.cpf);
    res.status(200).send('OK');
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );
    res.status(500).send('ERRO');
  }
});

app.listen(PORT, () => {
  console.log(`Integrador rodando na porta ${PORT}`);
});
