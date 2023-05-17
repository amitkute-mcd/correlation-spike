using Correlation.WeatherForecast;
using OpenTelemetry.Metrics;
using OpenTelemetry.ResourceDetectors.Container;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
    options.AddPolicy("DefaultPolicy", x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

Action<ResourceBuilder> appResourceBuilder =
    resource => resource
        .AddTelemetrySdk()
        .AddEnvironmentVariableDetector()
        .AddDetector(new ContainerResourceDetector());

builder.Services.AddOpenTelemetry()
    .ConfigureResource(appResourceBuilder)
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter())
    .WithMetrics(builder => builder
        .AddRuntimeInstrumentation()
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("DefaultPolicy");

app.MapGet("/", (ILogger<Program> logger) =>
{
    string[] summaries =
            { "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching" };

    logger.LogTrace("Start GET WheatherForecast");

    var weathers = Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = Random.Shared.Next(-20, 55),
        Summary = summaries[Random.Shared.Next(summaries.Length)]
    }).ToArray();

    logger.LogInformation("Generated weathers from \"{first:dd/MM/yyyy}\" to \"{last:dd/MM/yyyy}\": {Weathers}", weathers[0].Date, weathers.Last().Date, weathers);
    return weathers;
});

app.Run();
