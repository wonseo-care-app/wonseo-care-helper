import { WonseoApp } from "@/components/WonseoApp";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export default function Home() {
  return (
    <>
      <WonseoApp />
      <ServiceWorkerRegister />
    </>
  );
}
