using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
				private readonly DataContext _context;
				public ValuesController(DataContext context)
				{
					_context = context;
				}

				// GET api/values
				[HttpGet]
        public async Task<ActionResult<IEnumerable<Value>>> Get()
        {
						var values = await _context.Values.ToListAsync();
						//Ok() returns 200 response from api
						return Ok(values);

            // return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Value>> Get(int id)
        {
						var value = await _context.Values.FindAsync(id);
            return Ok(value);
        }

        // POST api/values
				//[FromBody] means to look at the body of the post request for values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
