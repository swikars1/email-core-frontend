import { TMail } from "../utils/store";

export function MailListing({ mails }: { mails: TMail[] }) {
  // const emailsByFolder = useMemo(() => {
  //   return emails.reduce((acc: { [key: string]: Email[] }, email) => {
  //     if (!acc[email.folder]) {
  //       acc[email.folder] = [];
  //     }
  //     acc[email.folder].push(email);
  //     return acc;
  //   }, {});
  // }, [emails]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Inbox</h2>
        <div className="space-y-4">
          {mails.map((email) => (
            <div
              key={email.id}
              className={`flex items-center gap-4 p-4 border rounded-lg ${
                email.isRead
                  ? "bg-background hover:bg-accent"
                  : "bg-muted hover:bg-accent"
              }`}
            >
              <div className="flex-1">
                <h3 className="text-sm font-medium">{email.subject}</h3>
                <div className="text-xs text-muted-foreground">
                  {email.sender.name} ({email.sender.email})
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {email.isRead ? "Read" : "Unread"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
