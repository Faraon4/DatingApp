using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                                .Include(r => r.UserRoles)
                                .ThenInclude(r => r.Role)
                                .OrderBy(u => u.UserName)
                                .Select( u =>  new       // we use slect because we want to project them
                                {
                                    u.Id,
                                    UserName = u.UserName,
                                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                                })
                                .ToListAsync();

                                return Ok(users);
        }

        // Method that give ability to admin to change the roles f the users
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string  roles)
        {
            var selectedRoles = roles.Split(",").ToArray(); // we ge this from query string

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find such user");

            var userRoles = await _userManager.GetRolesAsync(user); // gives the role of this particular user

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if(!result.Succeeded) return BadRequest("Failed tp add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to removefrom roles");

            return Ok(await _userManager.GetRolesAsync(user));

        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("admins or moderators can see this");
        }

    }
}