using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")] // For accessing this page, the users in internet will need to enter this route
    public class BaseApiController : ControllerBase
    {
        
    }
}