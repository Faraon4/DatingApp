namespace API.DTOs
{
    // This is what will be returned when a user is loging in or register
    public class UserDto
    {
        public string Username { get; set; }
        public string Token { get; set; }
    }
}