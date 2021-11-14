using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly UserManager<AppUser> _userManager;
         public TokenService(IConfiguration config, UserManager<AppUser> userManager)
            {
            _userManager = userManager;
                _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            }

            // This is the ability to generate token
        public async Task<string> CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()), //  We will use the .NameId to store the Id
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)   // We will use the UniqueName to store Username
                
            };

            var roles = await _userManager.GetRolesAsync(user); // here is the list of roles that the user belongs to

                // We are doiing like this because it is easier
                // and the JwtRegisterClaimsNames do not have
                // a claim name for role
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role,role)));
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            
            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}