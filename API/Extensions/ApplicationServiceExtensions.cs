using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    // when we create an extension class, we make it to be static
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //Configuration of the JWT, like how long should be this service until we start it
            // and we have 3 possibilities to do this
            // First of all is using Singelton
            // Second added scoped -> most of all we will use this and it works with http requests
            //Third add transiend -> service is create when it is called and is destroied after it finish its work
                 services.AddScoped<ITokenService, TokenService>();
                 services.AddScoped<IUserRepository, UserRepository>();



            // Here we add the configuration of the DbContext class
            // Such way we will be able to inject in different parts of out code
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            return services;
        }
    }
}