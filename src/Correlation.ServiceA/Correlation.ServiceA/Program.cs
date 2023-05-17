using Correlation.ServiceA;
using OpenTelemetry.Trace;
using System.Diagnostics;
using System.Reflection;
using OpenTelemetry;
using OpenTelemetry.Context.Propagation;
using OpenTelemetry.Instrumentation.AspNetCore;
using OpenTelemetry.Resources;
using System.Reflection.PortableExecutable;
using Microsoft.Extensions.Options;
using System.Xml.Linq;
using OpenTelemetry.ResourceDetectors.Container;
using OpenTelemetry.Metrics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
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

string[] allowedMethods = { "GET", "POST", "PUT", "DELETE", "PATCH" };
builder.Services.AddOpenTelemetry()
    .ConfigureResource(appResourceBuilder)
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation(options => options.Filter = (httpContext) =>
        {
            return allowedMethods.Contains(httpContext.Request.Method); // filter only allowed methods
        })
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
app.UseRouting();
app.MapControllers();
app.Run();