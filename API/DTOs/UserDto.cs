namespace API.DTOs
{
    // This is what will be returned when a user is loging in or register
    public class UserDto
    {
        public string Username { get; set; }
        public string Token { get; set; }
        public string PhotoUrl {get;set; } 
        public string KnownAs { get; set; }
        public string Gender {get;set;} // We need this value to have, instead of creating api call all the time to get the gender of the user
    }
}