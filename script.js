document.querySelector('#busca').addEventListener('submit', async (event) => {
    event.preventDefault();

    let input = document.querySelector('#searchInput').value.trim();

    if (input !== '') {
        clearInfo();
        showWarning('Carregando...');

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&units=metric&lang=pt_br&appid=d06cdb298fafc83c520d5ab677fc477e`;

        try {
            let results = await fetch(url);
            if (!results.ok) throw new Error('Erro na requisição');
            let json = await results.json();

            if (json.cod === 200) {
                showInfo({
                    name: json.name,
                    country: json.sys.country,
                    temp: json.main.temp,
                    humidity: json.main.humidity,
                    tempIcon: json.weather[0].icon,
                    windSpeed: json.wind.speed,
                    windAngle: json.wind.deg,
                    description: json.weather[0].description,
                });
            } else {
                clearInfo();
                showWarning('Não encontramos esta localização.');
            }
        } catch (error) {
            clearInfo();
            showWarning('Erro ao buscar dados.');
        }
    } else {
        clearInfo();
        showWarning('Por favor, insira um local válido.');
    }
});

function showInfo(json) {
    showWarning('');

    const roundedTemp = Math.round(json.temp);

    document.querySelector('.titulo').innerHTML = `<i class="fa-solid fa-globe"></i>${json.name}, ${json.country}`;
    document.querySelector('.tempInfo').innerHTML = `${roundedTemp} <sup>ºC</sup>`;
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;
    document.querySelector('.humidity').innerHTML = `<i class="fa-solid fa-water text-white"></i> ${json.humidity}%`;
    document.querySelector('.desc').innerHTML = `${json.description}`;

    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle - 90}deg)`;

    document.querySelector('.resultado').style.display = 'block';
}

function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}
