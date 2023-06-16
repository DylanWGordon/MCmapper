const API_URL = 'https://mcmap-webservice.onrender.com';

async function getProp() {
    const response = await fetch(`${API_URL}/properties`)
    const data = response.json();
}