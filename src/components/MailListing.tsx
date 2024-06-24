import { uniqBy } from "lodash";
import { TMail, TMailFolder } from "../utils/store";

export function MailListing({
  mails,
  mailFolders,
}: {
  mails: Record<string, TMail[]>;
  mailFolders: TMailFolder[];
}) {
  const MAIN_INBOX_NAME = "Inbox";

  const folderNameById = (id: string) =>
    mailFolders.find((a) => a.id === id)?.displayName;

  const inboxIndex = Object.keys(mails).findIndex(
    (el) => folderNameById(el) === MAIN_INBOX_NAME
  );

  const renderFn = (folderId: string) => {
    return (
      <div className="mt-4" key={folderId}>
        {mails[folderId]?.length > 0 ? (
          <h2 className="text-lg font-semibold mb-4">
            {folderNameById(folderId)}
          </h2>
        ) : null}
        <div className="space-y-4">
          {uniqBy(mails[folderId], "id").map((email: TMail) => (
            <div
              key={email.id}
              className={`flex items-center gap-4 p-4 border rounded-lg ${
                email.isRead ? "bg-[white]" : "bg-[#f5f5f5]"
              }`}
            >
              <div className="flex-1">
                <h3 className="text-sm font-medium">{email.subject}</h3>
                <div className="text-xs text-muted-foreground">
                  {email.from.emailAddress.name} (
                  {email.from.emailAddress.address})
                </div>
              </div>
              <div className="text-xs">
                {email.flag.flagStatus === "flagged" ? "🚩" : ""}
              </div>
              <div className="text-xs text-muted-foreground">
                {email.isRead ? "Read" : "Unread"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        {Object.keys(mails).map((folderId, index) =>
          index === inboxIndex ? renderFn(folderId) : null
        )}
        {Object.keys(mails).map((folderId, index) =>
          index !== inboxIndex ? renderFn(folderId) : null
        )}
      </div>
    </div>
  );
}
