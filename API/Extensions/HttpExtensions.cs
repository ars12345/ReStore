using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.RequestHelpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse httpResponse, MetaData metaData)
        {
            var options = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            httpResponse.Headers.Append("Pagination", JsonSerializer.Serialize(metaData, options));
            httpResponse.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}