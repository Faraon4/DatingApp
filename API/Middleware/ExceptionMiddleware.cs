using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using API.Errors;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
                                    IHostEnvironment env) // Request Delegate is what is going next
        {
            _logger = logger;
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // First of all, we get a context and pass it to the next middleware
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message); //We log the error and get the message of the error
                context.Response.ContentType = "application/json"; // Write this error
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment() 
                ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())  // if we are in dev mode , we return this
                : new ApiException(context.Response.StatusCode, "Internal Server Error"); // else if we are in production mode, we return a simple message


                // To return response in json cammelcase
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};


                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);

            }       
        }
    }
}