using AutoMapper;
using NotifyVisitor.Dtos.Room;
using NotifyVisitor.Dtos.Alarm;
using NotifyVisitor.Dtos.Visitor;
using NotifyVisitor.Models;
using NotifyVisitor.Dtos.Notification;
using NotifyVisitor.Dtos.AssignAlarm;
using NotifyVisitor.Dtos.Site;
using NotifyVisitor.Dtos.TriggeredAlarm;
using NotifyVisitor.Dtos.VisitorHistory;

namespace NotifyVisitor
{
    /// <summary>
    /// Class for mapping between Models and Dtos
    /// </summary>
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            CreateMap<Room, GetRoomDto>();

            CreateMap<Alarm, GetAlarmDto>();

            CreateMap<Notification, GetNotificationDto>();

            CreateMap<Visitor, GetVisitorDto>();

            CreateMap<Site, GetSiteDto>();

            CreateMap<TriggeredAlarm, GetTriggeredAlarmDto>();

            CreateMap<VisitorHistory, GetVisitorHistoryDto>();

            CreateMap<AddRoomDto, Room>();

            CreateMap<AddAlarmDto, Alarm>();

            CreateMap<AddNotificationDto, Notification>();

            CreateMap<AddVisitorDto, Visitor>();

            CreateMap<AddSiteDto, Site>(); 

            CreateMap<AssignAlarm, GetAssignAlarmDtocs>();

            CreateMap<GetAssignAlarmDtocs, GetAlarmDto>();

            CreateMap<GetAssignAlarmDtocs, GetRoomDto>();

            CreateMap<GetAssignAlarmDtocs, GetNotificationDto>();

            CreateMap<GetAssignAlarmDtocs, GetRoomDto>();

            CreateMap<GetSiteDto, Site>();

            CreateMap<GetTriggeredAlarmDto, TriggeredAlarm>();

            CreateMap<GetVisitorHistoryDto, VisitorHistory>();


            _ = CreateMap<Room, GetRoomDto>()
                 .ForMember(dto => dto.Visitors, r => r.MapFrom(r => r.RoomVisitors
                 .Select(rv => rv.Visitor)));

        }
    }
}
