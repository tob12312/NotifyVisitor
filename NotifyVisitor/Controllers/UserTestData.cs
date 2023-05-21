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

        private readonly ILogger<UserTestDataController> _logger;

        public UserTestDataController(ILogger<UserTestDataController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<UserTestData> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new UserTestData
            {
                Id = 1,
                Name="testEttNavn",
                UserName = "testEttBrukernavn",
                Email = "testEnEmail"
            })
            .ToArray();
        }
    }
}
