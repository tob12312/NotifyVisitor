namespace NotifyVisitor.Models
{
    public class Sms
    {
        public string toPhoneNumber { get; set; }
        public string message { get; set; }

        public Sms(string toPhoneNumber, string message)
        {
            this.toPhoneNumber = toPhoneNumber;
            this.message = message;

        }
    }
}
