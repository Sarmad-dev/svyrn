/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from "@/lib/actions/token.action";
import { useEffect, useState } from "react";

export const useSession = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSessionData = async () => {
      const sessionData = await getSession();

      console.log("sessionData", sessionData);

      if (sessionData) {
        setSession(sessionData);
      }
    };

    getSessionData();
  }, []);

  return { data: { session } };
};
