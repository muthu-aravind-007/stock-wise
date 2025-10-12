import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Mail } from "lucide-react"; // Optional: adds an email icon

export default function Profile() {
  const { user } = useAuth();
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setMetadata(user.user_metadata || {});
    }
  }, [user]);

  const fullName =
    metadata?.full_name ||
    `${metadata?.given_name || ""} ${metadata?.family_name || ""}`.trim() ||
    "User";

  const avatarUrl = metadata?.picture || "/placeholder-avatar.png";
  const email = user?.email || "Not available";
  const role = "Admin"; // can be dynamic later
  const createdAt = user?.created_at
    ? format(new Date(user.created_at), "PPP p")
    : "Unknown";
  const lastSignIn = user?.last_sign_in_at
    ? format(new Date(user.last_sign_in_at), "PPP p")
    : "Unknown";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-lg border border-border text-center">
        <h2 className="text-3xl font-bold mb-8">My Profile</h2>

        <div className="flex flex-col items-center space-y-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Name */}
          <div>
            <h3 className="text-2xl font-semibold">{fullName}</h3>
          </div>

          {/* Email with styling */}
          <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-3 px-4">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-md text-foreground font-medium break-all">{email}</span>
          </div>

          {/* Other info */}
          <div className="mt-4 w-full bg-muted/30 rounded-lg p-4 text-left space-y-2">
            <p>
              <span className="font-semibold text-primary">Role:</span> {role}
            </p>
            <p>
              <span className="font-semibold text-primary">Date Joined:</span>{" "}
              {createdAt}
            </p>
            <p>
              <span className="font-semibold text-primary">Last Login:</span>{" "}
              {lastSignIn}
            </p>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            This data is synced from your Google account.
          </p>
        </div>
      </div>
    </div>
  );
}
