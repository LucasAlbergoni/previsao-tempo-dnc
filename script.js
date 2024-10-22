const search = async () => {
  const cep = document.getElementById("cep");
  const street = document.getElementById("street");
  const neighborhood = document.getElementById("neighborhood");
  const state = document.getElementById("state");
  const weatherForecast = document.getElementById("weatherForecast");
  const error = document.getElementById("error");
  const cepValue = cep.value.replace("-", "");

  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  error.innerHTML = "";
  try {
    if (!cepValue || cepValue === 8) {
      throw new Error("CEP inválido.");
    }

    const responseCep = await fetch(
      `https://viacep.com.br/ws/${cepValue}/json/`
    );

    const data = await responseCep.json();

    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }

    street.innerHTML = `
      <span>${data.logradouro}</span>`;

    neighborhood.innerHTML = `<span>${data.bairro}</span>`;

    state.innerHTML = `<span>${data.localidade} - ${data.uf}</span>`;

    if (!latitude && !longitude) {
      throw new Error("Latitude e longitude são obrigatórios.");
    }

    const responseForecast = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=2`
    );

    if (!responseCep.ok) {
      throw new Error(`Erro ao buscar CEP: ${responseCep.status}`);
    }

    if (!responseForecast.ok) {
      throw new Error(
        `Status ${responseForecast.status}: Erro ao buscar previsão do tempo`
      );
    }

    const forecastData = await responseForecast.json();

    const temperature = forecastData.hourly.temperature_2m[0];

    weatherForecast.innerHTML = temperature
      ? `${temperature}°C`
      : "Não encontrado";
  } catch (err) {
    if (err) {
      error.innerHTML = `
    <div class="bg-danger text-center text-white py-2 rounded">${err.message}</div>`;
    }
  }
};
window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("button-submit").addEventListener("click", search);
});
