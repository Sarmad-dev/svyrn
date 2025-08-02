import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/home");

  return <div>Home</div>;
}
