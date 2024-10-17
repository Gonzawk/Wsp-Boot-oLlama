from flask import Flask, request, jsonify
import subprocess
import logging
import re

app = Flask(__name__)

# Configurar logging
logging.basicConfig(level=logging.INFO)

@app.route('/ollama', methods=['POST'])
def get_response():
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    logging.info(f"Received message: {message}")

    try:
        # Ejecuta el comando de Ollama y captura la salida
        result = subprocess.run(['ollama', 'run', 'llama3.2', message], capture_output=True, text=True, encoding='utf-8')

        # Verifica si hubo un error al ejecutar el comando
        if result.returncode != 0:
            logging.error(f"Error desde Ollama: {result.stderr.strip()}")
            return jsonify({'error': result.stderr.strip()}), 500

        # Limpia la respuesta de Ollama
        response_text = result.stdout.strip()
        cleaned_response = clean_response(response_text)

        logging.info(f"Respuesta de Ollama: {cleaned_response}")
        return jsonify({'response': cleaned_response}), 200

    except Exception as e:
        logging.error(f"Excepción: {str(e)}")
        return jsonify({'error': str(e)}), 500

def clean_response(response):
    # Expresión regular para eliminar líneas que contienen mensajes de error
    cleaned = re.sub(r'failed to get console mode for stdout:.*?\n|failed to get console mode for stderr:.*?\n', '', response)
    return cleaned.strip()

if __name__ == '__main__':
    app.run(port=5001)  # Puedes cambiar el puerto si es necesario
