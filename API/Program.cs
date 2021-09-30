using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
           var host =  CreateHostBuilder(args).Build(); // build instrad the run, and we need to add run back anyway, to run the app
           using var scope = host.Services.CreateScope(); // We create a scope for the service that we will create
           var services = scope.ServiceProvider;
           try
           {
               var context = services.GetRequiredService<DataContext>();
               await context.Database.MigrateAsync(); // MigrateAsync---> We update the database , or create the database
                                                      // If we delete the db, all we need to do is to restart our app
                await Seed.SeedUsers(context);
           }
           catch(Exception ex)
           {
               var logger = services.GetRequiredService<ILogger<Program>>();
               logger.LogError(ex, "An error occured during migration");
           }

          await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
