using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            // Add pagination to our response header
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            // Make the custom header available
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); //Spelling must be the same
        }
    }
}