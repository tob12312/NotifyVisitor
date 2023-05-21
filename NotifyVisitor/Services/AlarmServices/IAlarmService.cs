using NotifyVisitor.Dtos.Alarm;
using NotifyVisitor.Dtos.TriggeredAlarm;
using NotifyVisitor.Models;

namespace NotifyVisitor.Services.AlarmService
{
    public interface IAlarmService
    {
        // Get all Alarms.
        Task<ServiceResponse<List<GetAlarmDto>>> GetAllAlarms();

        // Get all Alarms, sort and filter.
        Task<ServiceResponse<List<GetAlarmDto>>> Index
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get Alarm by Id.
        Task<ServiceResponse<GetAlarmDto>> GetAlarmById(int Id);

        // Add new Alarm to DB.
        Task<ServiceResponse<List<GetAlarmDto>>> AddAlarm(AddAlarmDto newAlarm);

        // Update Alarm to DB.
        Task<ServiceResponse<GetAlarmDto>> UpdateAlarm(UpdateAlarmDto updatedAlarm);

        // Delete Alarm from DB.
        Task<ServiceResponse<List<GetAlarmDto>>> DeleteAlarm(int id);

        // Trigger (activate) Alarm.
        Task<ServiceResponse<List<Sms>>> TriggerAlarm(int alarmId);

        // Post SMS to Visitors
        Task<ServiceResponse<Sms>> PostSms (Sms sms);

        // Get all Triggered Alarms (History), sort and filter.
        Task<ServiceResponse<List<GetTriggeredAlarmDto>>> TriggeredAlarms
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get count triggered Alarms on set intervals/ periods.
        Task<ServiceResponse<List<int>>> GetCountTriggeredAlarmsPeriods();

        // Get count triggered Alarms on set intervals/ periods - per Site.
        Task<ServiceResponse<List<int>>> GetCountTriggeredAlarmsPeriodsPerSite(int siteId);

        // Get count Distinct triggered Alarms on set intervals/ periods.
        Task<ServiceResponse<List<int>>> GetCountDistinctTriggeredAlarmsPeriods();

        // Get count Distinct triggered Alarms on set intervals/ periods - per Site.
        Task<ServiceResponse<List<int>>> GetCountDistinctTriggeredAlarmsPeriodsPerSite(int siteId);

        // Get count notified Visitors - all Sites all Periods.
        Task<ServiceResponse<int>> GetCountNotifiedVisitors();

        // Get count Distinct Alarms - all Sites all Periods.
        Task<ServiceResponse<int>> GetCountDistinctTriggeredAlarms();

        // Get the last Triggered Alarm/ notification.
        Task<ServiceResponse<GetTriggeredAlarmDto>> GetLastTriggeredAlarm();

        // Get the last Triggered Alarm/ notification - per Site.
        Task<ServiceResponse<GetTriggeredAlarmDto>> GetLastTriggeredAlarmPerSite(int siteId);

        // Get all Triggered Alarms per Site.
        Task<ServiceResponse<List<GetTriggeredAlarmDto>>> GetAllTriggeredAlarmsPerSite(int siteId);

        // Get all Triggered Alarms from - to Date.
        Task<ServiceResponse<List<GetTriggeredAlarmDto>>> GetAllTriggeredAlarmsInPeriod(DateTime from, DateTime to);

        // Get all Triggered Alarms from - to Date - per Site.
        Task<ServiceResponse<List<GetTriggeredAlarmDto>>> GetAllTriggeredAlarmsInPeriodPerSite(DateTime from, DateTime to, int siteId);

        // Get count notified Visitors from - to Date.
        Task<ServiceResponse<int>> GetCountNotifiedVisitorsPerPeriod(DateTime from, DateTime to);

        // Get count Distinct Triggered Alarms from - to Date.
        Task<ServiceResponse<int>> GetCountDistinctTriggeredAlarmsPerPeriod(DateTime from, DateTime to);
    }
}
