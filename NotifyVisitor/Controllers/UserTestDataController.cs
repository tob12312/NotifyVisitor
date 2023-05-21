using Microsoft.AspNetCore.Mvc;

namespace NotifyVisitor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserTestDataController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private static readonly string[] Names = new[]
{
        "billy", "bob", "harald", "rolf"
    };

        private readonly ILogger<UserTestDataController> _logger;

        public UserTestDataController(ILogger<UserTestDataController> logger)
        {
            _logger = logger;
        }

        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get()
        //{
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = Random.Shared.Next(-20, 55),
        //        Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}

        [HttpGet]
        public IEnumerable<UserTestData> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new UserTestData
            {
                Id = Random.Shared.Next(1, 55),
                Name = Names[Random.Shared.Next(Names.Length)],
                Username = Names[Random.Shared.Next(Names.Length)],
                Email = Names[Random.Shared.Next(Names.Length)]

                //    Date = DateTime.Now.AddDays(index),
                //TemperatureC = Random.Shared.Next(-20, 55),
                //Summary = Summaries[Random.Shared.Next(Summaries.Length)]

            })
            .ToArray();
        }
    }
}
