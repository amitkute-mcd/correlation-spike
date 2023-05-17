using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Correlation.ServiceA.Controllers
{
    [ApiController]
    [Route("/")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ServicesOptions _servicesOptions;

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IOptions<ServicesOptions> servicesOptions)
        {
            _logger = logger;
            _servicesOptions = servicesOptions.Value;
        }

        [HttpGet(Name = "GetWeatherForecastBase")]
        public async Task<ActionResult<WeatherForecast[]>> Get()
        {
            _logger.LogTrace("Start method {Method}", nameof(Get));
            try
            {
                using HttpClient client = new();

                Request.Headers.ToList()
                    .ForEach(x => client.DefaultRequestHeaders.Add(x.Key.ToString(), x.Value.ToString()));

                _logger.LogTrace("Start of request for address {Address}", _servicesOptions.ServiceBaseURL);
                var response = await client.GetAsync(_servicesOptions.ServiceBaseURL);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<WeatherForecast[]>(json);

                    _logger.LogInformation("Request was successful with data {@Data}", data!);
                    return Ok(data);
                }

                _logger.LogWarning("Request wasn't successful with status {StatusCode}", response.StatusCode);
                return BadRequest(response.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error has occurred");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("B", Name = "GetWeatherForecastB")]
        public async Task<ActionResult<WeatherForecast[]>> GetB()
        {
            _logger.LogTrace("Start method {Method}", nameof(Get));
            try
            {
                using HttpClient client = new();

                Request.Headers.ToList()
                    .ForEach(x => client.DefaultRequestHeaders.Add(x.Key.ToString(), x.Value.ToString()));

                var response = await client.GetAsync(_servicesOptions.ServiceURL);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<WeatherForecast[]>(json);

                    _logger.LogInformation("Request was successful with data {@Data}", data!);
                    return Ok(data);
                }

                _logger.LogWarning("Request wasn't successful with status {StatusCode}", response.StatusCode);
                return BadRequest(response.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error has occurred");
                return StatusCode(500, ex.Message);
            }
        }
    }
}