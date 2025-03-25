export function generateMockWeatherbitData(lat: string, lon: string) {
  // Generate somewhat realistic data based on coordinates
  const isNorthern = Number.parseFloat(lat) > 0
  const season = new Date().getMonth()
  const isWinter = (isNorthern && (season < 2 || season > 9)) || (!isNorthern && season >= 3 && season <= 8)

  // Base temperature on season and latitude
  const baseTemp = isWinter ? 5 : 25
  const latEffect = Math.abs(Number.parseFloat(lat)) / 90 // 0 at equator, 1 at poles
  const temperature = isWinter
    ? baseTemp - latEffect * 20 + (Math.random() * 10 - 5)
    : baseTemp - latEffect * 15 + (Math.random() * 10 - 5)

  // Wind tends to be stronger near coasts and in winter
  const baseWind = isWinter ? 15 : 10
  const windSpeed = baseWind + (Math.random() * 10 - 5)

  // Random wind direction
  const windDirection = Math.floor(Math.random() * 360)

  return {
    data: [
      {
        temp: Math.round(temperature * 10) / 10,
        wind_spd: Math.round(windSpeed * 10) / 10,
        wind_dir: windDirection,
        precip: Math.random() * 0.5,
        rh: 40 + Math.random() * 40,
        pres: 1000 + Math.random() * 30,
        vis: 10 + Math.random() * 10,
        clouds: Math.random() * 100,
        uv: Math.floor(Math.random() * 10),
      },
    ],
    isMock: true,
  }
}

export function generateMockWeatherbitForecast(lat: string, lon: string) {
  const hourly = []
  const now = new Date()

  // Generate 48 hours of forecast data
  for (let i = 0; i < 48; i++) {
    const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000)
    const hourOfDay = forecastTime.getHours()
    const isDay = hourOfDay >= 6 && hourOfDay <= 18

    // Temperature varies by time of day
    const tempVariation = isDay ? 5 : -2
    const baseTemp = 15 + tempVariation
    const temperature = baseTemp + (Math.random() * 6 - 3)

    // Wind varies slightly throughout the day
    const baseWind = 10 + (isDay ? 2 : -1)
    const windSpeed = baseWind + (Math.random() * 6 - 3)

    // Wind direction changes gradually
    const windDirection = (i * 10 + Math.random() * 20) % 360

    // Precipitation is more likely in certain hours
    const precipChance = hourOfDay >= 14 && hourOfDay <= 18 ? 0.3 : 0.1
    const precipitation = Math.random() < precipChance ? Math.random() * 0.8 : 0

    hourly.push({
      timestamp_local: forecastTime.toISOString(),
      temp: Math.round(temperature * 10) / 10,
      wind_spd: Math.round(windSpeed * 10) / 10,
      wind_dir: Math.floor(windDirection),
      precip: precipitation,
      rh: 40 + Math.random() * 40,
      clouds: Math.random() * 100,
    })
  }

  return {
    data: hourly,
    isMock: true,
  }
}

