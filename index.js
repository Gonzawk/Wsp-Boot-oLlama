require('dotenv').config();
const express = require('express');
const axios = require('axios');
const sql = require('mssql');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, PHONE_NUMBER_ID } = process.env;

// Configuración de la base de datos
const dbConfig = {
    user: 'Gonzalo',
    password: 'Gonzalo1234',
    server: 'DESKTOP-NTGPWK7',
    database: 'ConsultasDB',
    options: {
        trustServerCertificate: true,
        encrypt: false,
    },
};

// Conexión a la base de datos
async function conectarDB() {
    try {
        await sql.connect(dbConfig);
        console.log('Conectado a la base de datos');
    } catch (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
}

// Manejar mensajes con Ollama
const getOllamaResponse = async (message) => {
    console.log(`Llamando a Ollama con el mensaje: ${message}`);
    try {
        const response = await axios.post('http://127.0.0.1:5001/ollama', {
            message: message
        });
        console.log(`Ollama respondió con éxito: ${response.data.response}`);
        return response.data.response;
    } catch (error) {
        console.error('Error al comunicarse con Ollama:', error);
        throw error;
    }
};

// Limpiar respuesta
const cleanResponse = (response) => {
    return response.replace(/[^a-zA-Z0-9¿?¡!.,:;ñáéíóúÁÉÍÓÚüÜ ]/g, '').trim();
};

// Almacenar IDs de mensajes respondidos
const respondedMessages = new Set();

// Endpoint para manejar mensajes entrantes
app.post('/webhook', async (req, res) => {
    console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));

    if (!req.body.entry || !req.body.entry[0].changes) {
        console.log('No entry or changes found in the request body.');
        return res.sendStatus(400);
    }

    const changes = req.body.entry[0].changes;

    // Manejar mensajes
    for (const change of changes) {
        const messages = change.value.messages;
        if (messages && messages.length > 0) {
            const message = messages[0];
            if (message.type === 'text') {
                console.log(`Mensaje recibido de ${message.from}: ${message.text.body}`);

                // Actualiza el último número de remitente
                const lastSenderNumber = message.from.replace(/^549/, '54');

                // Verificar si el mensaje ya ha sido respondido
                if (respondedMessages.has(message.id)) {
                    console.log('Este mensaje ya ha sido respondido.');
                    continue; // Salir si ya se respondió
                }

                // Obtener la respuesta de Ollama
                try {
                    const responseMessage = await getOllamaResponse(message.text.body);
                    const cleanedResponse = cleanResponse(responseMessage);
                    console.log(`Respuesta generada por Ollama: ${cleanedResponse}`);

                    // Enviar la respuesta
                    await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: lastSenderNumber, // Asegúrate de que solo queden los dígitos
                        type: "text",
                        text: {
                            preview_url: false,
                            body: cleanedResponse
                        }
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${GRAPH_API_TOKEN}`
                        }
                    });
                    console.log('Mensaje enviado con éxito.');

                    // Marcar el mensaje como respondido
                    respondedMessages.add(message.id);
                } catch (error) {
                    console.error('Error obteniendo respuesta de Ollama o enviando el mensaje:', error);
                }
            }
        }
    }

    // Responder con 200 siempre que recibas un mensaje válido.
    res.sendStatus(200);
});

// Endpoint para verificar el webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
        console.log('Webhook verificado correctamente!');
    } else {
        res.sendStatus(403);
    }
});

// Configura Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de WhatsApp',
            version: '1.0.0',
            description: 'Documentación de la API para WhatsApp Business',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, async () => {
    await conectarDB();
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
});

/**
 * @swagger
 * /webhook:
 *   get:
 *     summary: Verifica el webhook
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         description: El modo de verificación.
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         description: El token de verificación.
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         description: El desafío a enviar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verificación exitosa.
 *       403:
 *         description: Error de verificación.
 */
