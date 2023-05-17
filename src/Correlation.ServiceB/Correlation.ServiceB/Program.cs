using Correlation.ServiceA;
using OpenTelemetry.Metrics;
using OpenTelemetry.ResourceDetectors.Container;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ServicesOptions>(builder.Configuration.GetSection(nameof(ServicesOptions)));

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
app.MapControllers();

app.Run();
