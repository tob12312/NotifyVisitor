using NotifyVisitor.Data;
using NotifyVisitor.Services.AlarmService;
using NotifyVisitor.Services.NotificationService;
using NotifyVisitor.Services.RoomAlarmService;
using NotifyVisitor.Services.RoomService;
using Microsoft.EntityFrameworkCore;
using NotifyVisitor.Services.VisitorServices;
using NotifyVisitor.Services.SiteServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
/// <summary>
/// initialize the WebApplication object which is out entrypoint to the webapp. 
/// applies all the necessary settings to the WebApplication object  
/// </summary>
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


//initializes the database 
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.AddControllers();
// sets the app to authenticate on the request header with azureAd credentialts 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));


//sets the cors rules API requests 
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", policy =>
{
    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://notifyvisitor.azurewebsites.net/");
}));



// Setting the Scope, interfaces supplies functions for API/DB
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IAlarmService, AlarmService>();
builder.Services.AddScoped<IVisitorService, VisitorService>();
builder.Services.AddScoped<ISiteService, SiteService>();
builder.Services.AddScoped<IAssignAlarmService, AssignAlarmService>();
builder.Services.AddScoped<INotificationService, NotificationService>();


// maps datamodels to dataTransferObjects 
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// adds swagger for testing purposes 
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo()
    {
        Title = "BOP API",
        Version = "v1",
    }
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Varsling API");
});

//various settings to make the webapp use routing, authentication, authorization, mapcontrollers, and the static files
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",

 pattern: "{controller}/{action}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
