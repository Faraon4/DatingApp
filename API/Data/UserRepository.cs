using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
              // we are not using the EagerLoading 
            // So we are not using .Include();
            // So it is much better

            // This is what we want to paginate in our project that's why we use the Take and other methods that help for pagination
           return await _context.Users
                    .Where(x => x.UserName == username)
                    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync();

        }

        public async Task<PagedList<MemberDto>> GetMembersAsynnc(UserParams userParams)
        {
            // we are not using the EagerLoading 
            // So we are not using .Include();
            // So it is much better
            var query = _context.Users.AsQueryable();

                // We delete the next 3 lines of code, because in this way we will not be able to targer the user from AppUser, but we will target the MemberDto
                // So better to add AsQueriable() in the line nr 44;
            /*
                   .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                   .AsNoTracking() // We only want to read the entitites, we do not want to track them
                   .AsQueryable(); // This give us the possibility to do something with our query, for example to return all users except the login one

            */

            // Now in postman we will see that when we are looged in as lise and get all users , we will get all users exept the lisa
            // And as well when we get the gender=female part in postman, when we are logged as lisa and get the people , we will get the females , we'll get all females execpt the lisa(loged one)
                query = query.Where(u => u.UserName != userParams.CurrentUsername);
                query = query.Where(u => u.Gender == userParams.Gender);

                    // We are still sending our query , but before this we are filtering it , and then send 
                    // Filter is upper 2 lines of code
                   return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(), 
                   userParams.PageNumber, userParams.PageSize); // this is what we want to return  , and we need to add this info to the page header as well
                   
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
             .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                         .Include(p => p.Photos)
                         .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0; // if something chenged in db, than it returns something greater than 0
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified; // Let EF to update 
        }
    }
}