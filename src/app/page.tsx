"use client";

import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import PinGate from "./components/PinGate";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <ChatWindow />
    </main>
  );
}
