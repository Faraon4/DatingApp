using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
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

        public async Task<IEnumerable<MemberDto>> GetMembersAsynnc()
        {
            // we are not using the EagerLoading 
            // So we are not using .Include();
            // So it is much better
            return await _context.Users
                   .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                   .ToListAsync();
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